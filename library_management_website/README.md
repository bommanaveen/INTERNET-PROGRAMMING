# Libra — Library Management Website

## Files
- `index.html` — website structure
- `style.css` — responsive visual design
- `script.js` — front-end interactions and demo data

## Run
Open `index.html` in a browser. For best results in VS Code, use the Live Server extension.

## Demo accounts
- Student: `student@college.edu` / `student123`
- Librarian admin: `admin@college.edu` / `admin123`
Use the profile dropdown's arrow to sign out or switch account.

## Included features
- Student registration and login; role selection in the demo login modal
- Searchable book catalog, category filter and book details
- Student borrowing history, issue/due dates and fine summary
- Year/semester-filtered study materials and demo download
- Profile editing and contact form
- Librarian inventory add/edit/delete, issue books and mark returns
- Material management, responsive layout and browser `localStorage` persistence

## Important
This is a front-end demonstration. Data is stored in the current browser using `localStorage`, not a shared database. Login is not secure and does not provide real authentication. The sample downloads are placeholder text files unless a real material URL is supplied. For a production college library, connect this UI to a backend (for example Django/Node), database, secure password hashing, server-side role permissions, and actual uploaded files.
