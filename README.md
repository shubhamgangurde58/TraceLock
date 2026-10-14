# TraceLock

**Secure File Distribution & Insider Leak Detection System**

TraceLock is a full-stack project designed to help organizations manage confidential file access, maintain accountability for downloads, and investigate potential insider information leaks. The platform is being developed with separate administrator and employee experiences.

## Project Overview

Organizations need a way to share sensitive documents with authorized employees while retaining visibility into who accessed or downloaded them. TraceLock aims to provide controlled file distribution, traceable downloads, and tools to support leak investigations.

> **Development status:** Work in progress. The repository contains `frontend/` and `backend/` directories. Some security, tracking, and backend features described below are planned and should not be treated as production-ready.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React.js, JavaScript, HTML, CSS |
| Routing | React Router |
| Backend (planned/in progress) | Java, Spring Boot |
| Database (planned) | MySQL |
| Authentication (planned) | JWT and role-based access control |

## Main Modules

### Administrator Dashboard

- Overview of file distribution activity
- Employee and file management *(planned)*
- Download history and audit records *(planned)*
- Leak investigation alerts and risk indicators *(planned)*

### Employee Dashboard

- Employee access dashboard
- Available files *(backend integration planned)*
- Download history *(backend integration planned)*
- Profile section

## Planned Security Features

- **Role-based access:** Separate administrator and employee permissions.
- **Authenticated sessions:** JWT-based authentication for protected API access.
- **Traceable file downloads:** Associate distributed copies with employee identities.
- **Leak investigation:** Use embedded identity information and audit records to investigate leaked files.
- **Activity logging:** Record file access and download events.
- **Risk scoring and alerts:** Flag suspicious behavior for administrator review.

These are project goals; actual protection depends on completed implementation, secure key handling, testing, and deployment configuration.

## Project Structure

```text
TraceLock/
├── frontend/          # React frontend
├── backend/           # Backend development
├── .vscode/           # Editor settings
├── package.json       # Root-level dependency metadata
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Java JDK (for the Spring Boot backend)
- MySQL (when database integration is configured)

### Clone the Repository

```bash
git clone https://github.com/shubhamgangurde58/TraceLock.git
cd TraceLock
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend command above assumes the frontend uses a Create React App-style `start` script. Check `frontend/package.json` for the actual available scripts; use `npm run dev` instead if the project is configured with Vite.

### Backend

Backend setup depends on the Spring Boot project configuration in `backend/`. Once configured, use the Maven or Gradle command appropriate to that project, and supply the required database connection settings through local environment configuration.

**Do not commit database passwords, JWT secrets, or encryption keys.**

## Intended Workflow

1. An administrator manages access to confidential files.
2. An authorized employee signs in and views available files.
3. When a file is downloaded, TraceLock associates the event with the employee.
4. Audit data is stored for subsequent review.
5. If a leaked copy is discovered, its embedded identifying data can assist an investigation.
6. Administrators review evidence and potential alerts.

## Roadmap

- [ ] Complete backend APIs and database integration
- [ ] Implement secure login and JWT authentication
- [ ] Enforce administrator/employee authorization
- [ ] Implement file upload and controlled downloads
- [ ] Add employee-linked file identification
- [ ] Store download and activity logs
- [ ] Build leak detection and administrator alerts
- [ ] Add risk scoring and end-to-end tests
- [ ] Prepare production deployment and security review

## Author

**Shubham Santosh Gangurde**  
GitHub: [shubhamgangurde58](https://github.com/shubhamgangurde58)

## Repository

[TraceLock on GitHub](https://github.com/shubhamgangurde58/TraceLock)
