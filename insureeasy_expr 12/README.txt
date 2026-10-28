INSUREEASY - ONLINE INSURANCE MANAGEMENT SYSTEM
Internet Programming Lab Experiment

FILES
- index.html: page structure
- style.css: responsive styling
- script.js: policy cards, demo authentication, dashboards and local interactions

HOW TO RUN
1. Extract this ZIP.
2. Open index.html in Chrome, Edge, Firefox, or another modern browser.
3. Use Login or Create account to explore the role-based demos.
4. Admin demo login: admin@insureeasy.demo
   Password: admin123
5. Register an Agent account, then log in as Admin to approve the agent.
6. Sign in as the approved Agent to create customer records and simulate premium SMS reminders.
7. Register a Policyholder/User account and apply for a sample policy.

MODULES
ADMIN: Login demo, approve agent access, view agent directory.
AGENT: Register/login, create and manage customers, save policy/due-date details, simulate SMS alerts.
USER/POLICYHOLDER: Register/login, browse and compare sample health, auto and home policies, view policy details, submit sample applications, view own applications.

LIMITATIONS / SAFETY
- Frontend-only lab prototype. Data is stored in browser localStorage, not a shared database.
- Demo passwords are stored locally in plain text. Never use real passwords.
- SMS alerts are simulated; real SMS requires a backend and SMS gateway.
- No real insurance policy is issued; no real premium payment or claim is processed.
- Sample prices and coverage are illustrative only.
- Production use requires secure backend/database, password hashing, authorization, validation, HTTPS, audit logs, payment/SMS integrations and insurer integrations.
