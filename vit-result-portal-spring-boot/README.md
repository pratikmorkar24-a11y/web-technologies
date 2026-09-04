# VIT Result Portal

A responsive semester result management system built using:

- Java 17
- Spring Boot 4.1.1
- Maven
- Spring Web
- Spring Data JPA / Hibernate
- MySQL
- HTML, CSS and JavaScript
- Lombok

## Features

1. Add student
2. Add marks for up to four subjects
3. MSE entered out of 100 and weighted to 30%
4. ESE entered out of 100 and weighted to 70%
5. Automatic subject total calculation
6. View marks by PRN
7. View semester result using PRN + mother's name
8. Frontend and backend validation
9. Responsive interface
10. MySQL SQL setup file with sample data

## Project structure

```text
vit-result-portal/
├── pom.xml
├── README.md
├── database/
│   └── vit_result_portal.sql
└── src/
    └── main/
        ├── java/com/vit_result_portal/vit/
        │   ├── controller/
        │   ├── dto/
        │   ├── exception/
        │   ├── model/
        │   ├── repository/
        │   ├── service/
        │   └── VitApplication.java
        └── resources/
            ├── application.properties
            └── static/
                ├── index.html
                ├── add-student.html
                ├── add-marks.html
                ├── view-marks.html
                ├── result.html
                ├── css/
                ├── js/
                └── images/
```

## How to run

### 1. Install prerequisites

Install:

- JDK 17
- MySQL 8+
- Maven 3.9+ (or use Maven Wrapper if you add one)
- VS Code with Extension Pack for Java and Spring Boot Extension Pack

Verify:

```bash
java -version
mvn -version
mysql --version
```

### 2. Create the database

Open MySQL Workbench and run:

```text
database/vit_result_portal.sql
```

This creates the database, tables and sample student/marks.

### 3. Configure MySQL password

Open:

```text
src/main/resources/application.properties
```

Change:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

to your actual MySQL credentials.

### 4. Run the project

From the project root:

```bash
mvn spring-boot:run
```

Or package it:

```bash
mvn clean package
java -jar target/vit-0.0.1-SNAPSHOT.jar
```

### 5. Open the website

Open:

```text
http://localhost:8080
```

## Sample result login

The SQL file creates:

```text
PRN: 1234567890
Mother's name: Sunita Patil
```

Use these on the Check Result page.

## Mark calculation

For every subject:

```text
MSE contribution = MSE × 30 / 100
ESE contribution = ESE × 70 / 100

Subject Total = MSE contribution + ESE contribution
```

Example:

```text
MSE = 80
ESE = 90

MSE contribution = 80 × 0.30 = 24
ESE contribution = 90 × 0.70 = 63

Subject Total = 87 / 100
```

For four subjects:

```text
Semester Percentage = Total of four subject totals / 4
```

## Grade scale used

| Marks | Grade |
|---|---|
| 90-100 | A+ |
| 80-89.99 | A |
| 70-79.99 | B+ |
| 60-69.99 | B |
| 50-59.99 | C |
| 40-49.99 | D |
| Below 40 | F |

A subject with 40 or more is considered PASS.

## API endpoints

### Students

```text
POST /api/students
GET  /api/students
GET  /api/students/{prn}
```

### Marks

```text
POST /api/marks
GET  /api/marks
GET  /api/marks/student/{prn}
```

### Result

```text
GET /api/result?prn=1234567890&motherName=Sunita%20Patil
```

## Important note about the logo

The project includes a local `vit-logo.png` so the application works without an internet connection. Replace that file with your official VIT Pune logo asset if your faculty requires the exact institutional logo artwork.

The website itself is based on the VIT Pune identity and the official VIT Pune website confirms the institution as Vishwakarma Institute of Technology, Pune.
