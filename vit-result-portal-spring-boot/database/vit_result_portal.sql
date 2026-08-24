-- VIT Result Portal
-- MySQL 8+
-- Run this file in MySQL Workbench before starting the Spring Boot application.

CREATE DATABASE IF NOT EXISTS vit_result_portal;
USE vit_result_portal;

CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prn VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    mother_name VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    semester VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS subject_marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    mse_marks DOUBLE NOT NULL,
    ese_marks DOUBLE NOT NULL,
    mse_weighted DOUBLE NOT NULL,
    ese_weighted DOUBLE NOT NULL,
    total_marks DOUBLE NOT NULL,
    CONSTRAINT fk_marks_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_student_subject UNIQUE (student_id, subject_name),
    CONSTRAINT chk_mse CHECK (mse_marks >= 0 AND mse_marks <= 100),
    CONSTRAINT chk_ese CHECK (ese_marks >= 0 AND ese_marks <= 100)
);

-- Sample student
INSERT INTO students (prn, name, mother_name, branch, semester)
VALUES ('1234567890', 'Aarav Patil', 'Sunita Patil', 'Computer Engineering', 'Semester 5')
ON DUPLICATE KEY UPDATE prn = prn;

SET @student_id = (SELECT id FROM students WHERE prn = '1234567890');

-- Four sample subjects
INSERT INTO subject_marks
(student_id, subject_name, mse_marks, ese_marks, mse_weighted, ese_weighted, total_marks)
VALUES
(@student_id, 'Data Structures', 85, 90, 25.50, 63.00, 88.50),
(@student_id, 'Operating Systems', 78, 82, 23.40, 57.40, 80.80),
(@student_id, 'Computer Networks', 92, 88, 27.60, 61.60, 89.20),
(@student_id, 'Web Technologies', 80, 76, 24.00, 53.20, 77.20)
ON DUPLICATE KEY UPDATE subject_name = subject_name;

-- Expected sample result:
-- Total = 335.70 / 400
-- Percentage = 83.925%
-- Overall grade = A
-- Mother's name for result lookup = Sunita Patil
