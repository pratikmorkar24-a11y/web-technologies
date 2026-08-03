# Electricity Bill Calculator

A Java Enterprise web application developed using **Servlets** and **JSP** to calculate electricity bills based on slab-wise tariff rates. The application features a responsive user interface built with **Bootstrap** and basic client-side validation using **jQuery**.

---

## Features

- Calculate electricity bills based on slab rates.
- Responsive UI using Bootstrap.
- Client-side validation using jQuery.
- Server-side processing using Java Servlets.
- Displays customer details along with the calculated bill.

---

## Tech Stack

| Technology | Version |
|------------|---------|
| Java Development Kit (JDK) | 17+ |
| Eclipse IDE for Enterprise Java and Web Developers | 2025-06 (or your version) |
| Apache Tomcat | 9.0 |
| Java Servlet API | javax.servlet |
| JSP | 2.x |
| Bootstrap | 5.3.3 |
| jQuery | 3.7.1 |

---

## Project Structure

```
Electricity/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── bill/
│       │           └── BillServlet.java
│       │
│       └── webapp/
│           ├── index.jsp
│           ├── result.jsp
│           ├── META-INF/
│           └── WEB-INF/
│
├── .gitignore
└── README.md
```

---

## Electricity Tariff

| Units | Rate |
|-------:|-----:|
| First 50 Units | ₹3.50 / unit |
| Next 100 Units | ₹4.00 / unit |
| Next 100 Units | ₹5.20 / unit |
| Above 250 Units | ₹6.50 / unit |

---

## How to Run

### Prerequisites

- JDK 17 or above
- Eclipse IDE for Enterprise Java and Web Developers
- Apache Tomcat 9.0

### Steps

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Import the project into Eclipse.

```
File → Import → Existing Projects into Workspace
```

3. Configure Apache Tomcat 9.0 in Eclipse.

4. Add the project to the Tomcat server.

5. Run the project:

```
Run As → Run on Server
```

6. Open in your browser:

```
http://localhost:8080/Electricity/index.jsp
```

---

## How to Use

1. Enter the **Consumer Name**.
2. Enter the **Consumer Number**.
3. Enter the **Units Consumed**.
4. Click **Calculate Bill**.
5. The application displays the total electricity bill based on the specified slab rates.

---

## 📸 Output

### Home Page

> Add screenshot here

```
screenshots/home.png
```

### Result Page

> Add screenshot here

```
screenshots/result.png
```

---

## Bill Calculation Logic

```
If Units ≤ 50
    Bill = Units × 3.50

Else If Units ≤ 150
    Bill = (50 × 3.50)
         + ((Units − 50) × 4.00)

Else If Units ≤ 250
    Bill = (50 × 3.50)
         + (100 × 4.00)
         + ((Units − 150) × 5.20)

Else
    Bill = (50 × 3.50)
         + (100 × 4.00)
         + (100 × 5.20)
         + ((Units − 250) × 6.50)
```

---

## What This Project Does

This application calculates electricity bills according to predefined slab rates. It accepts customer information and the number of electricity units consumed, computes the bill on the server using a Java Servlet, and displays the result through a JSP page.

---

## Author

**Pratik Morkar**