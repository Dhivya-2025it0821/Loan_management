<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';

function response(bool $success, mixed $data = null, string $message = '', int $status = 200): never
{
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return $_POST;
    }

    $payload = json_decode($raw, true);
    return is_array($payload) ? $payload : [];
}

function required(array $payload, string $key): mixed
{
    if (!array_key_exists($key, $payload) || trim((string) $payload[$key]) === '') {
        response(false, null, "Missing required field: {$key}", 422);
    }

    return $payload[$key];
}

function money(float|int|string $value): string
{
    return '₹ ' . number_format((float) $value, 0, '.', ',');
}

function initials(string $name): string
{
    $words = preg_split('/\s+/', trim($name)) ?: [];
    $result = '';
    foreach (array_slice($words, 0, 2) as $word) {
        $result .= strtoupper(substr($word, 0, 1));
    }
    return $result;
}

function tone(int $id): string
{
    return ['rose', 'blue', 'purple', 'green', 'yellow', 'lavender', 'orange'][$id % 7];
}

function emi(float $principal, float $annualRate, int $months): float
{
    $monthlyRate = $annualRate / 12 / 100;
    if ($monthlyRate <= 0) {
        return $principal / max(1, $months);
    }
    return $principal * $monthlyRate * (pow(1 + $monthlyRate, $months) / (pow(1 + $monthlyRate, $months) - 1));
}

function formatDate(?string $date): string
{
    if (!$date) {
        return '';
    }
    return date('M d, Y', strtotime($date));
}

function bootstrap(PDO $pdo): array
{
    $customerRows = $pdo->query(
        "SELECT c.CustomerID, c.Name, c.DateOfBirth, c.Phone, c.Email, c.Address,
                DATE_FORMAT(c.CreatedAt, '%b %d, %Y') AS JoinedDate,
                COUNT(DISTINCT l.LoanID) AS LoanCount,
                COALESCE(SUM(DISTINCT l.PrincipalAmount), 0) AS BorrowedAmount
         FROM customer c
         LEFT JOIN loan l ON l.CustomerID = c.CustomerID
         GROUP BY c.CustomerID
         ORDER BY c.CustomerID DESC"
    )->fetchAll();

    $customers = array_map(static function (array $row): array {
        return [
            'id' => 'CU-' . $row['CustomerID'],
            'name' => $row['Name'],
            'initials' => initials($row['Name']),
            'email' => $row['Email'] ?? '',
            'phone' => $row['Phone'] ?? '',
            'city' => $row['Address'] ?? '',
            'joined' => $row['JoinedDate'],
            'loans' => (int) $row['LoanCount'],
            'borrowed' => money($row['BorrowedAmount']),
            'status' => 'Verified',
            'tone' => tone((int) $row['CustomerID']),
        ];
    }, $customerRows);

    $applicationRows = $pdo->query(
        "SELECT la.ApplicationID, la.ApplicationDate, la.Status, la.RequestedAmount,
                la.TenureMonths, la.Purpose, c.Name AS CustomerName,
                lt.LoanTypeName
         FROM loan_application la
         INNER JOIN customer c ON c.CustomerID = la.CustomerID
         INNER JOIN loan_type lt ON lt.LoanTypeID = la.LoanTypeID
         ORDER BY la.ApplicationID DESC"
    )->fetchAll();

    $applications = array_map(static function (array $row): array {
        return [
            'id' => 'APP-' . $row['ApplicationID'],
            'name' => $row['CustomerName'],
            'initials' => initials($row['CustomerName']),
            'type' => $row['LoanTypeName'],
            'amount' => money($row['RequestedAmount']),
            'numericAmount' => (float) $row['RequestedAmount'],
            'tenure' => $row['TenureMonths'] . ' months',
            'date' => formatDate($row['ApplicationDate']),
            'status' => $row['Status'],
            'purpose' => $row['Purpose'] ?? '',
            'tone' => tone((int) $row['ApplicationID']),
        ];
    }, $applicationRows);

    $loanRows = $pdo->query(
        "SELECT l.LoanID, l.PrincipalAmount, l.EMIAmount, l.TenureMonths,
                l.StartDate, l.Status, c.Name AS CustomerName,
                lt.LoanTypeName, lt.InterestRate,
                COUNT(ep.PaymentID) AS PaidEmis
         FROM loan l
         INNER JOIN customer c ON c.CustomerID = l.CustomerID
         INNER JOIN loan_type lt ON lt.LoanTypeID = l.LoanTypeID
         LEFT JOIN emi_payment ep ON ep.LoanID = l.LoanID AND ep.Status = 'Paid'
         GROUP BY l.LoanID
         ORDER BY l.LoanID DESC"
    )->fetchAll();

    $loans = array_map(static function (array $row): array {
        $progress = min(100, (int) round(((int) $row['PaidEmis'] / max(1, (int) $row['TenureMonths'])) * 100));
        $nextDue = date('M d, Y', strtotime('+' . max(1, (int) $row['PaidEmis'] + 1) . ' months', strtotime($row['StartDate'])));
        return [
            'id' => 'LN-' . $row['LoanID'],
            'name' => $row['CustomerName'],
            'initials' => initials($row['CustomerName']),
            'type' => $row['LoanTypeName'],
            'principal' => money($row['PrincipalAmount']),
            'emi' => money($row['EMIAmount']),
            'due' => $nextDue,
            'progress' => $progress,
            'status' => $row['Status'],
            'tone' => tone((int) $row['LoanID']),
        ];
    }, $loanRows);

    $paymentRows = $pdo->query(
        "SELECT ep.PaymentID, ep.PaymentDate, ep.AmountPaid, ep.Status,
                ep.LoanID, pm.ModeName, c.Name AS CustomerName
         FROM emi_payment ep
         INNER JOIN loan l ON l.LoanID = ep.LoanID
         INNER JOIN customer c ON c.CustomerID = l.CustomerID
         INNER JOIN payment_mode pm ON pm.PaymentModeID = ep.PaymentModeID
         ORDER BY ep.PaymentID DESC"
    )->fetchAll();

    $payments = array_map(static function (array $row): array {
        return [
            'id' => 'PAY-' . $row['PaymentID'],
            'name' => $row['CustomerName'],
            'initials' => initials($row['CustomerName']),
            'loan' => 'LN-' . $row['LoanID'],
            'date' => formatDate($row['PaymentDate']),
            'amount' => money($row['AmountPaid']),
            'mode' => $row['ModeName'],
            'status' => $row['Status'],
            'tone' => tone((int) $row['PaymentID']),
        ];
    }, $paymentRows);

    return [
        'customers' => $customers,
        'applications' => $applications,
        'loans' => $loans,
        'payments' => $payments,
        'loanTypes' => $pdo->query('SELECT LoanTypeID, LoanTypeName, InterestRate FROM loan_type ORDER BY LoanTypeID')->fetchAll(),
        'paymentModes' => $pdo->query('SELECT PaymentModeID, ModeName FROM payment_mode ORDER BY PaymentModeID')->fetchAll(),
    ];
}

function createCustomer(PDO $pdo, array $payload): void
{
    $name = trim((string) required($payload, 'name'));
    $email = trim((string) ($payload['email'] ?? '')) ?: null;
    $phone = trim((string) ($payload['phone'] ?? '')) ?: null;
    $dob = trim((string) ($payload['dateOfBirth'] ?? '')) ?: null;
    $address = trim((string) ($payload['address'] ?? $payload['city'] ?? '')) ?: null;

    $statement = $pdo->prepare(
        'INSERT INTO customer (Name, DateOfBirth, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)'
    );
    $statement->execute([$name, $dob, $phone, $email, $address]);
}

function findOrCreateCustomer(PDO $pdo, string $name): int
{
    $find = $pdo->prepare('SELECT CustomerID FROM customer WHERE Name = ? LIMIT 1');
    $find->execute([$name]);
    $existing = $find->fetchColumn();
    if ($existing !== false) {
        return (int) $existing;
    }

    $create = $pdo->prepare('INSERT INTO customer (Name, Address) VALUES (?, ?)');
    $create->execute([$name, 'To be verified']);
    return (int) $pdo->lastInsertId();
}

function createApplication(PDO $pdo, array $payload): void
{
    $name = trim((string) required($payload, 'applicantName'));
    $type = trim((string) required($payload, 'type'));
    $amount = (float) required($payload, 'amount');
    $tenure = (int) required($payload, 'tenureMonths');
    $purpose = trim((string) ($payload['purpose'] ?? '')) ?: null;

    $typeQuery = $pdo->prepare('SELECT LoanTypeID FROM loan_type WHERE LoanTypeName = ? LIMIT 1');
    $typeQuery->execute([$type]);
    $loanTypeId = $typeQuery->fetchColumn();
    if ($loanTypeId === false) {
        response(false, null, 'Unknown loan type.', 422);
    }

    $customerId = findOrCreateCustomer($pdo, $name);
    $statement = $pdo->prepare(
        'INSERT INTO loan_application (CustomerID, LoanTypeID, AdminID, ApplicationDate, Purpose, RequestedAmount, TenureMonths) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)'
    );
    $statement->execute([$customerId, $loanTypeId, 1, $purpose, $amount, $tenure]);
}

function updateApplication(PDO $pdo, array $payload): void
{
    $applicationId = (int) required($payload, 'applicationId');
    $status = ucfirst(strtolower((string) required($payload, 'status')));
    if (!in_array($status, ['Approved', 'Rejected'], true)) {
        response(false, null, 'Application status must be Approved or Rejected.', 422);
    }

    $pdo->beginTransaction();
    try {
        $update = $pdo->prepare('UPDATE loan_application SET Status = ?, AdminID = 1 WHERE ApplicationID = ?');
        $update->execute([$status, $applicationId]);

        if ($status === 'Approved') {
            $application = $pdo->prepare(
                'SELECT CustomerID, LoanTypeID, RequestedAmount, TenureMonths FROM loan_application WHERE ApplicationID = ?'
            );
            $application->execute([$applicationId]);
            $row = $application->fetch();
            if (!$row) {
                throw new RuntimeException('Application not found.');
            }

            $existing = $pdo->prepare('SELECT LoanID FROM loan WHERE ApplicationID = ?');
            $existing->execute([$applicationId]);
            if (!$existing->fetchColumn()) {
                $rateQuery = $pdo->prepare('SELECT InterestRate FROM loan_type WHERE LoanTypeID = ?');
                $rateQuery->execute([$row['LoanTypeID']]);
                $rate = (float) $rateQuery->fetchColumn();
                $principal = (float) $row['RequestedAmount'];
                $months = (int) $row['TenureMonths'];
                $insertLoan = $pdo->prepare(
                    'INSERT INTO loan (ApplicationID, CustomerID, LoanTypeID, PrincipalAmount, InterestRate, TenureMonths, StartDate, EMIAmount) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)'
                );
                $insertLoan->execute([$applicationId, $row['CustomerID'], $row['LoanTypeID'], $principal, $rate, $months, emi($principal, $rate, $months)]);
            }
        }

        $pdo->commit();
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }
}

function createPayment(PDO $pdo, array $payload): void
{
    $loanRef = trim((string) required($payload, 'loanRef'));
    if (!preg_match('/LN-(\d+)/', $loanRef, $matches)) {
        response(false, null, 'Invalid loan reference.', 422);
    }

    $loanId = (int) $matches[1];
    $mode = trim((string) required($payload, 'mode'));
    $date = trim((string) required($payload, 'date'));
    $amount = (float) required($payload, 'amount');

    $modeQuery = $pdo->prepare('SELECT PaymentModeID FROM payment_mode WHERE ModeName = ? LIMIT 1');
    $modeQuery->execute([$mode]);
    $modeId = $modeQuery->fetchColumn();
    if ($modeId === false) {
        response(false, null, 'Unknown payment mode.', 422);
    }

    $loanQuery = $pdo->prepare(
        'SELECT PrincipalAmount, COALESCE((SELECT MAX(EMINumber) FROM emi_payment WHERE LoanID = l.LoanID), 0) AS LastEMI, COALESCE((SELECT RemainingBalance FROM emi_payment WHERE LoanID = l.LoanID ORDER BY EMINumber DESC LIMIT 1), PrincipalAmount) AS Balance FROM loan l WHERE LoanID = ?'
    );
    $loanQuery->execute([$loanId]);
    $loan = $loanQuery->fetch();
    if (!$loan) {
        response(false, null, 'Loan not found.', 404);
    }

    $remaining = max(0, (float) $loan['Balance'] - $amount);
    $statement = $pdo->prepare(
        'INSERT INTO emi_payment (LoanID, PaymentModeID, PaymentDate, EMINumber, AmountPaid, RemainingBalance, Status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $statement->execute([$loanId, $modeId, $date, ((int) $loan['LastEMI']) + 1, $amount, $remaining, $remaining <= 0 ? 'Paid' : 'Paid']);

    if ($remaining <= 0) {
        $pdo->prepare("UPDATE loan SET Status = 'Completed' WHERE LoanID = ?")->execute([$loanId]);
    }
}

$action = $_GET['action'] ?? 'bootstrap';

try {
    $pdo = db();

    switch ($action) {
        case 'bootstrap':
            response(true, bootstrap($pdo));
        case 'create_customer':
            createCustomer($pdo, input());
            response(true, null, 'Customer created.');
        case 'create_application':
            createApplication($pdo, input());
            response(true, null, 'Application created.');
        case 'update_application':
            updateApplication($pdo, input());
            response(true, null, 'Application updated.');
        case 'create_payment':
            createPayment($pdo, input());
            response(true, null, 'Payment recorded.');
        default:
            response(false, null, 'Unknown API action.', 404);
    }
} catch (PDOException $exception) {
    response(false, null, 'Database connection failed. Import database/loan_management.sql and check api/config.php.', 503);
} catch (Throwable $exception) {
    response(false, null, $exception->getMessage(), 500);
}
