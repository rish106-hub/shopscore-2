# 🛒 ShopScore

A modern Product Reviews and Ratings system built with React

ShopScore is a comprehensive product review platform designed to help users make informed purchasing decisions by aggregating authentic reviews and scores. Built using HTML, CSS, JavaScript, React, and MongoDB with GenAI assistance, this application serves as a capstone project for Web Application Programming at Newton School of Technology.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Learnings](#key-learnings)
- [Contributing](#contributing)
- [Contact](#contact)

## Features
- **Review Management**: Add and view comprehensive product reviews
- **Star Rating System**: Rate products from 1 to 5 stars
- **Real-time Analytics**: Dynamic average rating updates
- **Advanced Filtering**: Search and filter products by rating
- **Clean UI/UX**: Modern, responsive interface
- **User Authentication**: Secure login and registration system
- **Shopping Cart**: Add products to cart and manage purchases
- **Responsive Design**: Works smoothly on desktop and mobile

## Tech Stack

| Layer                | Technologies                                   |
|----------------------|--------------------------------------------------|
| Frontend             | HTML5, CSS3, JavaScript (ES6+), React 18        |
| Backend / Database   | Node.js, Express, MongoDB                       |
| UI Components        | Custom components with modern CSS               |
| State Management     | React Context API                               |
| Authentication       | Firebase Authentication                         |
| Deployment           | Vercel                                          |
| Development Tools    | Vite, ESLint, PostCSS                           |

## Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (16.0+)
- npm or yarn
- Git
- MongoDB Atlas or local MongoDB setup

### Installation
1) Clone the repository
```bash
git clone https://github.com/rish106-hub/ShopScore_Capstone_Sem_2.git
cd ShopScore_Capstone_Sem_2
```

2) Install dependencies
- Frontend
```bash
cd frontend
npm install
```
- Backend
```bash
cd ../backend
npm install
```

### Environment Variables
Create a `.env` file in the `backend` directory for your MongoDB connection string and other server settings:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
```

If your frontend requires environment variables (e.g., API base URL), create a `.env` in `frontend`:
```
VITE_API_BASE_URL=http://localhost:3000
```

### Running the Application
1) Start the backend API
```bash
cd backend
npm run dev
```

2) Start the frontend app
```bash
cd ../frontend
npm run dev
```

3) Open the app
- Visit http://localhost:5173

4) Build for production (frontend)
```bash
npm run build
```

## Project Structure
```
ShopScore/
├── backend/                    # Node.js + Express API (MongoDB)
│   ├── src/
│   └── .env
├── frontend/                   # React (Vite) app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/
│   │   │   ├── Cart.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Login.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── api/                # API + MongoDB integration
│   │   ├── styles/
│   │   └── utils/
│   └── public/
└── README.md
```

## Key Learnings
- **Full-stack Architecture**
- **Database Integration using MongoDB**
- **State Management with Context API**
- **Reusable Components in React**
- **Authentication Workflows**
- **Deployment Best Practices**
- **Modern Tooling with Vite and PostCSS**

## 🤝 Contributing
1) Fork the repo
2) Create a branch
```bash
git checkout -b feature/amazing-feature
```
3) Commit your changes
4) Push your branch
5) Open a Pull Request

## Contact
**Rishav Dewan**
- Email: rishavdewan10@gmail.com
- GitHub: [@rish106-hub](https://github.com/rish106-hub)

—

Found a bug or want a new feature? Submit an issue or reach out by email.

—

Built with ❤️ as part of the Web Application Programming capstone project at Newton School of Technology
