# Software Requirements Specification (Mẫu tham chiếu)
**Loan Process System** — Web-Based Online Loan Management Platform

*Bản Markdown được trích từ `SRS_LoanProcessSystem_Final.docx` trong cùng thư mục `docs/`. Đây là **mẫu cấu trúc SRS** (dự án Loan Process — ví dụ); SRS áp dụng cho **game Mario** trong repo này là `SRS_MarioWebGame.md`.*

| Field | Value |
| :--- | :--- |
| Document Version | 1.0 |
| Standard | IEEE 830-1998 |
| Date | April 2026 |
| Status | Draft |
| Project Category | Financial Technology / E-Commerce |

This document is a Technical Annex to the Service Agreement between the parties named in Appendix B.

## Revision History

| Version | Date | Author | Description |
| :--- | :--- | :--- | :--- |
| 1.0 | April 2026 | [Developer Name] | Initial draft submitted to client for review and approval |

## Table of Contents

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes the functional and non-functional requirements for the Loan Process System — a web application to be developed for the Client as defined in Appendix B. This document serves as a Technical Annex to the Service Agreement between the Developer and the Client. Once signed by both parties, it defines the agreed scope of work. Any features or behaviors not described in this document are considered out of scope and subject to a separate Change Request.

### 1.2 Project Scope
The Loan Process System is a basic web application with the following core features:
Users can register and log in to the system.
Users can browse available loan products.
Users can submit a loan application by filling out an online form.
Out of scope for this version: payment processing, automated loan approval, mobile app, and document upload.

### 1.3 Definitions
Term
Meaning
SRS
Software Requirements Specification — a document describing what a system should do
User / Borrower
A person who logs in and uses the system to apply for a loan
FR
Functional Requirement — a specific feature the system must have
NFR
Non-Functional Requirement — a quality attribute like speed, security, or usability
OTP
One-Time Password — a short code sent by SMS used as a second login step
MFA
Multi-Factor Authentication — verifying identity using more than one method (e.g., password + OTP)
HTTPS
Hypertext Transfer Protocol Secure — ensures data between browser and server is encrypted
Change Request
A formal written request to change the agreed scope after this document is signed
Technical Annex
A document attached to a contract that defines the technical scope and requirements

### 1.4 References
IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications
OWASP Top 10: Basic web application security guidelines

### 1.5 Overview
This document is organized as follows:
Section 2 — Overall description of the system: what it does, who uses it, and its main constraints.
Section 3 — Functional requirements: 3 use cases described with standardized tables.
Section 4 — Non-functional requirements: performance, security, usability.
Section 5 — External interface requirements: UI wireframe placeholders, software and communication interfaces.
Section 6 — Use case summary table.
Section 7 — Project scope, constraints, and limitations.
Appendix A — Glossary of terms used in this document.
Appendix B — Legal agreement: contract reference, change control, acceptance criteria, and signature block.

## 2. Overall Description

### 2.1 Product Perspective
The Loan Process System is a standalone web application. It does not replace any existing system. It connects to two external services:
An Email Service — to send verification emails and notifications.
An SMS Gateway — to send one-time passwords (OTP) for login.

### 2.2 Product Functions
The three main functions of the system are:
ID
Function
Description
FR-001
User Login
Users can log in to the system securely using email, password, and OTP.
FR-002
Submit Loan Application
Users fill out and submit a loan application form.
FR-003
Browse Loan Products
Users can view and compare available loan products.

### 2.3 Users of the System

#### 2.3.1 Borrower
A borrower is any person who uses the website to look for a loan and submit an application. They are assumed to have basic internet skills.
Attribute
Detail
Technical level
Basic — can use a web browser and fill in online forms
Main actions
Log in, browse loan products, submit application
Access level
Standard — can only see their own data
Login method
Email + password + OTP (one-time code via SMS)

#### 2.3.2 Administrator
An administrator manages the website content (e.g., adding loan products) and can view submitted applications.
Attribute
Detail
Technical level
Intermediate — familiar with basic admin tools
Main actions
Add/edit loan products, view all submitted applications
Access level
Full access to all content and user data
Login method
Email + password + OTP (enforced)

### 2.4 Operating Environment
Web browsers: Chrome, Firefox, Edge (latest version).
Devices: desktop and laptop computers; mobile phones are supported via responsive design.
Internet: requires a stable internet connection.
Server: any standard cloud hosting (e.g., Heroku, Vercel, or a VPS).

### 2.5 Constraints
The system handles loan applications only — it does not process real financial transactions or payments.
All pages must use HTTPS to keep user data safe.
The system must be delivered within the timeline agreed in the Service Agreement (see Appendix B).

### 2.6 Assumptions and Dependencies

#### 2.6.1 Assumptions
Users have access to a smartphone to receive OTP messages.
Loan products are added manually by the administrator — no automatic feed.
All users provide real and accurate personal information when registering.

#### 2.6.2 Dependencies
Email service provider (e.g., SendGrid or SMTP) for sending verification and notification emails.
SMS gateway (e.g., Twilio) for sending OTP codes to users.

### 2.7 User Needs
User Need
Why it matters
How the system handles it
Easy login
Users need to access their account quickly and safely.
Email + password login with a one-time SMS code for extra security.
See loan options clearly
Users need to understand what loans are available before applying.
A product listing page with key details: interest rate, amount, and term.
Simple application form
Users should be able to apply without confusion.
A short, step-by-step form with clear labels and error messages.

## 3. Specific Functional Requirements
This section describes each feature of the system using a use case table. Each table has the same structure so it is easy to read and compare.

### 3.1 FR-001 — User Login
Use Case Name
User Login
Use Case ID
FR-001
XRef
Section 2.2 — Product Functions
Section 2.3.1 — Borrower
Section 4.2 — Security Requirements
Actor
Borrower / Administrator
Trigger
The user opens the login page and submits their email and password.
Precondition
The user must have a registered and verified account.
Basic Path

## 1. The user goes to the login page.

## 2. The user types their email address and password.

## 3. The system checks if the email and password are correct.

## 4. The system sends a one-time code (OTP) to the user&apos;s phone via SMS.

## 5. The user types the OTP code.

## 6. The system confirms the code and takes the user to their home page (dashboard).
Alternative Paths
If the password is wrong, the system shows an error message: &quot;Incorrect email or password.&quot; After 5 failed attempts, the account is locked for 15 minutes.
Postcondition
The user is logged in and can see their dashboard.
Exception Paths
The user can close the browser at any time. The OTP code expires after 5 minutes if not used.
Other
The login session ends automatically after 30 minutes of no activity. The user will need to log in again.

### 3.2 FR-002 — Submit Loan Application
Use Case Name
Submit Loan Application
Use Case ID
FR-002
XRef
Section 2.2 — Product Functions
Section 3.3, FR-003 — Browse Loan Products (entry point)
Section 2.7 — User Needs
Actor
Borrower
Trigger
The user clicks the &quot;Apply Now&quot; button on a loan product page.
Precondition
The user must be logged in. The selected loan product must be available.
Basic Path

## 1. The system shows the application form.
2.  The user fills in their personal details: full name, date of birth, address, and phone number.
3.  The user fills in their financial details: monthly income and employment status.

## 4. The user selects the loan amount and repayment term.

## 5. The user clicks &quot;Submit&quot;.

## 6. The system checks that all fields are filled in correctly.
7.  The system saves the application and shows a confirmation message with an application reference number.
8.  The system sends a confirmation email to the user.
Alternative Paths
If any required field is empty or incorrect, the system highlights the problem and shows a short error message next to that field. The form is not submitted until all errors are fixed.
Postcondition
The application is saved in the system with the status &quot;Submitted&quot;. The user receives a reference number to track their application later.
Exception Paths
The user can close the browser at any time. The form data is not saved if the user leaves before submitting.
Other
Each user can only have one active application per loan product at the same time.

### 3.3 FR-003 — Browse Loan Products
Use Case Name
Browse Loan Products
Use Case ID
FR-003
XRef
Section 2.2 — Product Functions
Section 2.7 — User Needs (see loan options clearly)
Actor
Borrower (logged in or guest)
Trigger
The user clicks &quot;Loan Products&quot; in the navigation menu.
Precondition
At least one loan product must have been added by the administrator.
Basic Path

## 1. The system shows a list of all available loan products.
2.  Each product card shows: product name, interest rate, minimum and maximum loan amount, and repayment term.

## 3. The user can filter the list by loan type or repayment term.

## 4. The user clicks on a product to see its full details.
5.  On the product detail page, the user can click &quot;Apply Now&quot; to go to the application form (FR-002).
Alternative Paths
If no products match the selected filter, the system shows the message: &quot;No products found. Please try a different filter.&quot;
Postcondition
The user can see all available loan products and choose one to apply for.
Exception Paths
The user can leave the page at any time without any data being saved.
Other
This page is accessible to guests (not logged in), but the &quot;Apply Now&quot; button requires the user to log in first.

### 3.4 Use Case Diagram
The diagram below shows how the three use cases relate to the two actors (Borrower and Administrator) and to each other.
{ Hình 3.4 — Use Case Diagram: Loan Process System (FR-001, FR-002, FR-003) }
Key relationships:
FR-002 Submit Loan Application requires the user to be logged in — so it depends on FR-001.
FR-003 Browse Loan Products is the natural entry point before FR-002.
Both Borrower and Administrator can log in (FR-001), but only the Borrower submits applications.

### 3.5 Activity Diagrams

#### 3.5.1 Login Flow
This diagram shows what happens from the moment the user enters their email to when they are successfully logged in, including the OTP step and the failed login path.
{ Hình 3.5.1 — Activity Diagram: User Login (FR-001) }

#### 3.5.2 Loan Application Flow
This diagram shows the full flow: user browses products (FR-003), selects one, fills the form, and submits the application (FR-002). It includes the path for validation errors.
{ Hình 3.5.2 — Activity Diagram: Browse Products &amp; Submit Application (FR-002, FR-003) }

## 4. Non-Functional Requirements

### 4.1 Performance
All pages should load within 3 seconds on a normal internet connection.
The system should be available at least 95% of the time (i.e., not more than ~18 hours of downtime per month).
The system should be able to handle at least 50 users at the same time without slowing down.

### 4.2 Security
All pages must use HTTPS so that data sent between the browser and the server is encrypted.
Passwords must be stored as hashed values — never as plain text.
Login requires a one-time SMS code (OTP) in addition to a password.
Login sessions expire automatically after 30 minutes of inactivity.
After 5 failed login attempts, the account is locked for 15 minutes.

### 4.3 Usability
The application form (FR-002) must be completable in no more than 5 steps.
Error messages must clearly tell the user what went wrong and how to fix it.
The website must work on both desktop and mobile screens (responsive design).
The interface should be in English.

### 4.4 Maintainability
The source code should be organized into clear folders (e.g., separate folders for pages, components, and database logic).
Code should be commented where necessary so other team members can understand it.

## 5. External Interface Requirements

### 5.1 User Interface
The system is a web application accessible through a browser. There is no mobile app. The interface must be simple, clean, and easy to use for first-time visitors. Below are wireframe placeholders for each main screen.

#### 5.1.1 Login Page
Contains: email field, password field, a &quot;Forgot Password?&quot; link, and a Login button. After submitting credentials, a second screen asks for the OTP code.
{ Hình 5.1.1 — Wireframe: Login Page &amp; OTP Screen (FR-001) }

#### 5.1.2 Loan Products Page
Contains: a list of loan product cards, a filter bar at the top (filter by type or term), and an Apply button on each card.
{ Hình 5.1.2 — Wireframe: Loan Products Listing Page (FR-003) }

#### 5.1.3 Loan Application Form
Contains: a progress bar at the top showing the current step (e.g., Step 1 of 4), input fields for personal information (Step 1) and financial information (Step 2), loan selection (Step 3), and a Review &amp; Submit screen (Step 4). Inline error messages appear next to fields that fail validation.
{ Hình 5.1.3 — Wireframe: Loan Application Form (FR-002) }

#### 5.1.4 Borrower Dashboard
Contains: a welcome message, a summary of submitted applications (reference number, loan product, date, status), and a link to browse more loan products.
{ Hình 5.1.4 — Wireframe: Borrower Dashboard }

### 5.2 Software Interfaces
External Service
Purpose
How it connects
Email Service (e.g., SendGrid)
Send account verification and application confirmation emails
REST API
SMS Gateway (e.g., Twilio)
Send OTP codes to the user&apos;s phone number during login
REST API

### 5.3 Hardware Interfaces
No special hardware is required. The system works on any device with a modern web browser and internet access. Users need a mobile phone to receive the SMS OTP.

### 5.4 Communication Interfaces
HTTPS — all communication between the browser and the server must be encrypted.
REST API — used to connect to the email service and SMS gateway.

## 6. Use Case Summary
ID
Use Case Name
Actor
Short Description
FR-001
User Login
Borrower / Administrator
User logs in with email, password, and OTP code.
FR-002
Submit Loan Application
Borrower
User fills in and submits a loan application form.
FR-003
Browse Loan Products
Borrower (guest or logged in)
User views and filters available loan products.

## 7. Project Scope, Constraints &amp; Limitations

### 7.1 What is included
User login with email, password, and OTP (one-time SMS code).
A page listing loan products with basic filtering.
A loan application form with validation and confirmation email.
A simple borrower dashboard showing submitted applications.
An admin account that can add/edit loan products and view applications.

### 7.2 What is NOT included (Out of Scope)
Payment processing — no real money is transferred.
Automated loan approval — the system only stores applications, it does not approve them.
Document upload — users do not need to attach files in this version.
Native mobile apps — web browser only.
Multilingual support — English only.

### 7.3 Constraints
The project must be completed within the timeline defined in the Service Agreement.
The system must not process or store real financial transaction data.
The system must use HTTPS and follow basic OWASP security guidelines (see Section 4.2).

### 7.4 Limitations
The system stores loan applications but does not approve them — approval must be handled manually outside the system.
The loan calculator is not included in this version. Any interest estimates shown on the product listing page are for indicative purposes only and are not legally binding.
The system has not been load-tested for large numbers of concurrent users beyond those specified in Section 4.1.

## Appendix A: Glossary
Term
Meaning
SRS
Software Requirements Specification — this document.
IEEE 830
A standard guideline for writing SRS documents, published in 1998.
Borrower
A user who logs in to the platform and submits loan applications.
Administrator
A system user who manages loan products and views submitted applications.
FR
Functional Requirement — a specific feature the system must do.
NFR
Non-Functional Requirement — a quality the system must have (e.g., speed, security).
OTP
One-Time Password — a short numeric code sent by SMS, used as a second step during login.
MFA
Multi-Factor Authentication — verifying identity using more than one method (e.g., password + OTP).
HTTPS
Hypertext Transfer Protocol Secure — ensures data sent between the browser and server is encrypted.
Dashboard
The home page a user sees after logging in, showing a summary of their submitted applications.
Use Case
A description of how a user interacts with the system to achieve a specific goal.
Change Request
A formal written request to add, remove, or modify a feature after the SRS has been signed.
Technical Annex
A supporting document attached to a contract that defines technical details and scope.

## Appendix B: Document Approval &amp; Legal Agreement
B.1 Contract Reference
This SRS document is a Technical Annex to the following Service Agreement:
Field
Detail
Service Agreement Reference No.
______________________________
Agreement Date
______________________________
Developer (Service Provider)
______________________________
Client (Service Recipient)
______________________________
Project Name
SRS Document Version
1.0
SRS Issue Date
April 2026
B.2 Scope Confirmation
By signing this document, both parties confirm that:
The features and requirements described in Sections 1 through 7 of this SRS represent the complete and agreed scope of work for this project.
Any feature, behavior, or screen not explicitly described in this document is considered out of scope.
The Client has read and understood the contents of this document, including the Out of Scope items listed in Section 7.2.
B.3 Change Control
Any change to the scope defined in this SRS — including adding, removing, or modifying features — must follow this process:
Step 1: The requesting party submits a written Change Request describing the proposed change.
Step 2: The Developer provides a written impact assessment (estimated time and cost).
Step 3: Both parties sign a Change Request Addendum before any work on the change begins.
Changes that have not been agreed upon in writing are not binding on either party.
B.4 Acceptance Criteria
The project will be considered complete and ready for handover when:
All functional requirements in Section 3 (FR-001, FR-002, FR-003) have been implemented and are working as described.
All non-functional requirements in Section 4 have been met to a reasonable degree.
The Client has performed a review and signed the Acceptance section (B.5) below.
B.5 Approval Signatures
By signing below, both parties agree that this SRS document is accurate, complete, and forms part of the binding agreement between them.
Developer (Service Provider)
Client (Service Recipient)
Full Name
Title / Role
Lead Developer
Company / Individual
Signature
________________________
________________________
Date
Governing law: This document and the associated Service Agreement are governed by the laws of the Socialist Republic of Vietnam. Any disputes arising from this document shall be resolved in accordance with Vietnamese law.
