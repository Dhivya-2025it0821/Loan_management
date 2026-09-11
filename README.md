# Northstar Lending - Loan Management System

Loan management mini project with an HTML/CSS/vanilla JavaScript frontend, a PHP API, and a MySQL database matching the supplied ER diagram.

## Run

For the database-connected version, copy this project folder into `C:\xampp\htdocs\loan-management` and start Apache and MySQL from XAMPP. Then import `database/loan_management.sql` in phpMyAdmin and open:

`http://localhost/loan-management/`

For a UI-only preview, open `index.html` directly in a browser, or serve this folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Database setup

1. Start Apache and MySQL in XAMPP.
2. Open `http://localhost/phpmyadmin`.
3. Import `database/loan_management.sql`.
4. Confirm the defaults in `api/config.php`: host `127.0.0.1`, database `loan_management`, user `root`, blank password. If your MySQL root account has a password, set `DB_PASS` to that password.
5. Open the app through Apache, not by double-clicking the HTML file.

The top-right status changes from `Demo data` to `MySQL connected` when the PHP API is reachable. If MySQL is unavailable, the frontend continues to show demo data so the interface remains usable.

## Included

- Responsive admin dashboard with portfolio metrics and charts
- Customer directory with search and add-customer modal
- Loan application queue with application form and EMI preview
- Active loan and EMI payment tables
- Payment recording modal and CSV exports
- Reports and settings views
- PHP API actions for dashboard loading, customer creation, application creation/approval/rejection, and EMI payment recording
- Foreign-key relationships across all seven ER entities
- Demo fallback data persisted in browser `localStorage`

The seeded demo admin password is `admin123`; authentication screens are not part of this frontend scope yet.

## Vercel deployment

Vercel deploys the frontend only. The PHP/MySQL backend is excluded from the Vercel upload via `.vercelignore`; the deployed site uses its demo-data fallback until the API is hosted on a PHP-capable server and `API_BASE` in `script.js` is pointed to that public API URL.
