ZenTask

ZenTask is a task management and productivity application built with React. The application allows users to create, manage, prioritize, and track tasks through a structured dashboard and productivity-focused interface.

Live Demo

Live Application:
https://kmadhu998.github.io/ZenTask/

Features
User login interface with input validation
Personalized dashboard
Create new tasks
Edit existing tasks
Delete tasks
Mark tasks as completed or incomplete
Task priority management
Due date tracking
Dashboard statistics
Zen Score calculation based on task completion
Due Today task tracking
Next Best Task recommendation
Focus Intelligence page
Task data persistence using LocalStorage
Responsive user interface
Client-side routing using React Router
Technology Stack
React
JavaScript
Vite
React Router DOM
React Context API
LocalStorage
CSS
Lucide React
Application Pages
Login

The login page provides client-side validation for user credentials and stores user information locally for a personalized application experience.

Dashboard

The dashboard provides an overview of task productivity, including:

Zen Score
Total Tasks
Completed Tasks
Tasks Due Today
Next Best Task recommendation
My Tasks

Users can manage their tasks by:

Creating tasks
Editing tasks
Deleting tasks
Updating task completion status
Setting priorities
Setting due dates
Managing task duration and energy levels
Focus Intelligence

The Focus Intelligence page provides productivity insights and recommendations based on the user's task data.

Data Storage

ZenTask currently uses LocalStorage for client-side data persistence.

Task information remains available after refreshing the application in the same browser.

The application does not currently use a backend or database.

Project Structure
ZenTask/
│
├── public/
│
├── src/
│   ├── context/
│   │   └── TaskContext.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── FocusIntelligence/
│   │   ├── Login/
│   │   └── MyTasks/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   └── localStorage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
Installation

Clone the repository:

git clone https://github.com/kmadhu998/ZenTask.git

Navigate to the project directory:

cd ZenTask

Install dependencies:

npm install

Start the development server:

npm run dev

The application will be available on the local development URL provided by Vite.

Production Build

To create a production build:

npm run build
Deployment

The application is deployed using GitHub Pages.

Live URL:

https://kmadhu998.github.io/ZenTask/

Future Improvements
Backend integration
Secure user authentication
JWT-based authentication
Database integration
Cloud-based task synchronization
User accounts
Real-time notifications
Task categories and tags
Advanced productivity analytics
AI-powered task recommendations
Author

Madhu

GitHub: https://github.com/kmadhu998

LinkedIn: https://www.linkedin.com/in/madhuk-k/
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
