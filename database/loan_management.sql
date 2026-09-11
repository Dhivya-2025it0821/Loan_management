CREATE DATABASE IF NOT EXISTS loan_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loan_management;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS emi_payment;
DROP TABLE IF EXISTS loan;
DROP TABLE IF EXISTS loan_application;
DROP TABLE IF EXISTS payment_mode;
DROP TABLE IF EXISTS loan_type;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS admin;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admin (
  AdminID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Username VARCHAR(50) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  Role VARCHAR(30) NOT NULL DEFAULT 'Admin',
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE customer (
  CustomerID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  DateOfBirth DATE NULL,
  Phone VARCHAR(15) NULL,
  Email VARCHAR(100) NULL UNIQUE,
  Address TEXT NULL,
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE loan_type (
  LoanTypeID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LoanTypeName VARCHAR(100) NOT NULL UNIQUE,
  Description TEXT NULL,
  InterestRate DECIMAL(5,2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE payment_mode (
  PaymentModeID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ModeName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE loan_application (
  ApplicationID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  CustomerID INT UNSIGNED NOT NULL,
  LoanTypeID INT UNSIGNED NOT NULL,
  AdminID INT UNSIGNED NULL,
  ApplicationDate DATE NOT NULL,
  Purpose TEXT NULL,
  Status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  RequestedAmount DECIMAL(12,2) NOT NULL,
  TenureMonths INT UNSIGNED NOT NULL,
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_application_customer FOREIGN KEY (CustomerID) REFERENCES customer(CustomerID),
  CONSTRAINT fk_application_loan_type FOREIGN KEY (LoanTypeID) REFERENCES loan_type(LoanTypeID),
  CONSTRAINT fk_application_admin FOREIGN KEY (AdminID) REFERENCES admin(AdminID) ON DELETE SET NULL,
  INDEX idx_application_status (Status),
  INDEX idx_application_date (ApplicationDate)
) ENGINE=InnoDB;

CREATE TABLE loan (
  LoanID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ApplicationID INT UNSIGNED NOT NULL UNIQUE,
  CustomerID INT UNSIGNED NOT NULL,
  LoanTypeID INT UNSIGNED NOT NULL,
  PrincipalAmount DECIMAL(12,2) NOT NULL,
  InterestRate DECIMAL(5,2) NOT NULL,
  TenureMonths INT UNSIGNED NOT NULL,
  StartDate DATE NOT NULL,
  EMIAmount DECIMAL(12,2) NOT NULL,
  Status ENUM('Active', 'Completed', 'Defaulted') NOT NULL DEFAULT 'Active',
  CONSTRAINT fk_loan_application FOREIGN KEY (ApplicationID) REFERENCES loan_application(ApplicationID),
  CONSTRAINT fk_loan_customer FOREIGN KEY (CustomerID) REFERENCES customer(CustomerID),
  CONSTRAINT fk_loan_type FOREIGN KEY (LoanTypeID) REFERENCES loan_type(LoanTypeID),
  INDEX idx_loan_status (Status)
) ENGINE=InnoDB;

CREATE TABLE emi_payment (
  PaymentID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  LoanID INT UNSIGNED NOT NULL,
  PaymentModeID INT UNSIGNED NOT NULL,
  PaymentDate DATE NOT NULL,
  EMINumber INT UNSIGNED NOT NULL,
  AmountPaid DECIMAL(12,2) NOT NULL,
  RemainingBalance DECIMAL(12,2) NOT NULL,
  Status ENUM('Paid', 'Pending', 'Overdue') NOT NULL DEFAULT 'Paid',
  CONSTRAINT fk_payment_loan FOREIGN KEY (LoanID) REFERENCES loan(LoanID),
  CONSTRAINT fk_payment_mode FOREIGN KEY (PaymentModeID) REFERENCES payment_mode(PaymentModeID),
  CONSTRAINT uq_loan_emi UNIQUE (LoanID, EMINumber),
  INDEX idx_payment_date (PaymentDate)
) ENGINE=InnoDB;

INSERT INTO admin (AdminID, Name, Username, Password, Role) VALUES
  (1, 'Arjun Kumar', 'admin', '$2y$10$16m00aHslVDxeHlcabyXMObqcNrap2Kmr8dUnhxNZSr.yjkh0ytZu', 'Admin');

INSERT INTO loan_type (LoanTypeID, LoanTypeName, Description, InterestRate) VALUES
  (1, 'Personal loan', 'Flexible personal finance for planned expenses.', 10.50),
  (2, 'Education loan', 'Funding for tuition and education-related costs.', 7.50),
  (3, 'Home loan', 'Long-term finance for home purchase or construction.', 8.25),
  (4, 'Vehicle loan', 'Finance for a new or pre-owned vehicle.', 9.00);

INSERT INTO payment_mode (PaymentModeID, ModeName) VALUES
  (1, 'Cash'),
  (2, 'UPI'),
  (3, 'Bank Transfer'),
  (4, 'Debit Card'),
  (5, 'Credit Card');

INSERT INTO customer (CustomerID, Name, DateOfBirth, Phone, Email, Address, CreatedAt) VALUES
  (1048, 'Priya Sharma', '1997-05-21', '+91 98765 42108', 'priya.sharma@email.com', 'Mumbai', '2026-08-28 09:42:00'),
  (1047, 'Rahul Verma', '1995-10-12', '+91 98205 19876', 'rahul.verma@email.com', 'Pune', '2026-08-26 16:18:00'),
  (1046, 'Meera Iyer', '1989-02-04', '+91 99876 54321', 'meera.iyer@email.com', 'Bengaluru', '2026-08-22 11:05:00'),
  (1045, 'Aditya Nair', '2001-08-19', '+91 99001 22448', 'aditya.nair@email.com', 'Kochi', '2026-08-18 14:20:00'),
  (1044, 'Sneha Kapoor', '1994-11-08', '+91 98100 44556', 'sneha.kapoor@email.com', 'Delhi', '2026-08-15 10:15:00'),
  (1043, 'Vikram Singh', '1992-03-17', '+91 98990 33221', 'vikram.singh@email.com', 'Jaipur', '2026-08-11 12:10:00');

INSERT INTO loan_application (ApplicationID, CustomerID, LoanTypeID, AdminID, ApplicationDate, Purpose, Status, RequestedAmount, TenureMonths) VALUES
  (2084, 1048, 1, 1, '2026-09-01', 'Home renovation', 'Approved', 500000.00, 24),
  (2083, 1047, 4, 1, '2026-08-31', 'Purchase of a family car', 'Approved', 720000.00, 36),
  (2082, 1046, 3, 1, '2026-08-29', 'Home purchase', 'Approved', 2500000.00, 60),
  (2081, 1045, 2, NULL, '2026-08-28', 'Tuition and accommodation', 'Pending', 480000.00, 24),
  (2080, 1044, 1, 1, '2026-08-27', 'Planned family expense', 'Approved', 350000.00, 12),
  (2079, 1043, 4, NULL, '2026-08-25', 'Vehicle upgrade', 'Pending', 840000.00, 36),
  (2078, 1048, 1, 1, '2026-08-24', 'Personal expense', 'Rejected', 200000.00, 12),
  (2077, 1047, 3, NULL, '2026-08-22', 'Home extension', 'Pending', 1800000.00, 60);

INSERT INTO loan (LoanID, ApplicationID, CustomerID, LoanTypeID, PrincipalAmount, InterestRate, TenureMonths, StartDate, EMIAmount, Status) VALUES
  (2048, 2084, 1048, 1, 500000.00, 10.50, 24, '2026-04-05', 23075.00, 'Active'),
  (2047, 2083, 1047, 4, 720000.00, 9.00, 36, '2026-06-07', 22800.00, 'Active'),
  (2046, 2082, 1046, 3, 2500000.00, 8.25, 60, '2026-07-10', 52053.00, 'Active'),
  (2045, 2080, 1044, 1, 350000.00, 10.50, 12, '2025-12-12', 30875.00, 'Active');

INSERT INTO emi_payment (PaymentID, LoanID, PaymentModeID, PaymentDate, EMINumber, AmountPaid, RemainingBalance, Status) VALUES
  (9921, 2048, 2, '2026-09-01', 12, 23075.00, 260000.00, 'Paid'),
  (9920, 2047, 3, '2026-08-31', 11, 22800.00, 500000.00, 'Paid'),
  (9919, 2046, 2, '2026-08-30', 9, 52053.00, 2050000.00, 'Paid'),
  (9918, 2045, 4, '2026-08-29', 9, 30875.00, 95000.00, 'Paid'),
  (9917, 2048, 2, '2026-08-01', 11, 23075.00, 283075.00, 'Paid');

ALTER TABLE admin AUTO_INCREMENT = 2;
ALTER TABLE customer AUTO_INCREMENT = 1049;
ALTER TABLE loan_type AUTO_INCREMENT = 5;
ALTER TABLE payment_mode AUTO_INCREMENT = 6;
ALTER TABLE loan_application AUTO_INCREMENT = 2085;
ALTER TABLE loan AUTO_INCREMENT = 2049;
ALTER TABLE emi_payment AUTO_INCREMENT = 9922;
