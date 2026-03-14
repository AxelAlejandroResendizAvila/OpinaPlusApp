# OpinaPlus 🗳️

**OpinaPlus** is a mobile and web platform designed to centralize the management of petitions and suggestions within an academic community.

The application allows users to submit requests and track their status, while administrators can monitor, moderate, and manage them through a dashboard.

The system also integrates a **Machine Learning module** that analyzes sentiment in user submissions and provides predictive insights to support administrative decision-making.

---

# 🎯 Problem

In many academic institutions, petitions and suggestions are handled through **disorganized manual processes**, making it difficult to track requests, measure trends, and provide timely responses.

OpinaPlus solves this problem by providing a **centralized digital platform** where requests can be submitted, managed, and analyzed efficiently.

---

# 🚀 Features

## User Features

* User registration and login
* Role-based access control using institutional email domains
* Submit petitions and suggestions
* Track request status
* Receive notifications about updates

## Administrator Features

* Administrative dashboard
* View all requests
* Change request status:

  * Open
  * In progress
  * Resolved
  * Closed
* Moderate and follow up on requests
* View statistics and insights

---

# 🤖 Machine Learning Module

OpinaPlus integrates a **Python-based Machine Learning service** that provides additional insights for administrators.

Features include:

* **Sentiment analysis** on petitions (positive, neutral, negative)
* **Prediction of request volume**
* Analytical insights displayed in the admin dashboard

The ML service is implemented using **FastAPI** and communicates with the application via REST APIs.

---

# 🛠 Technologies Used

### Frontend

* React Native
* Expo
* React Navigation
* Context API

### Backend / APIs

* FastAPI
* REST API communication

### Database

* SQLite (expo-sqlite)

### Machine Learning

* Python
* Sentiment analysis models
* Predictive analytics

---

# 🏗 Architecture

The project follows a **layered architecture** to separate responsibilities and improve maintainability.

```id="arch1"
Screens/       → UI components and navigation
Controllers/   → Business logic and request handling
Models/        → Data models
Context/       → Global state management (authentication)
Database/      → SQLite database access
```

---

# 🔗 Frontend–ML Integration

The mobile application communicates with the Machine Learning service through **REST APIs**.

Key characteristics:

* API requests using `fetch`
* Error handling when ML service is unavailable
* Fallback mechanisms to maintain application functionality

---

# 📊 Additional Features

* Filters for request status
* Operational statistics
* Loading states and UI feedback
* Cross-platform UX for mobile and web

---

# ⚙️ Installation

Clone the repository:

```bash id="install1"
git clone https://github.com/YOUR_USERNAME/OpinaPlus.git
```

Install dependencies:

```bash id="install2"
npm install
```

Start the Expo development server:

```bash id="install3"
npx expo start
```

Run the application using **Expo Go** or an emulator.

---

# 🧪 Machine Learning Service

The ML module runs separately as a **FastAPI service**.

Example startup:

```bash id="ml1"
uvicorn main:app --reload
```

The mobile application communicates with the ML service through REST endpoints.

---

# 🚀 Future Improvements

* Cloud database integration
* Real-time notifications
* Improved analytics dashboard
* Enhanced machine learning models
* Role management expansion

---

# 👨‍💻 Project Context

This project was developed as part of an academic initiative to explore:

* Mobile application development
* Machine learning integration
* API-based architectures
* Data analysis for decision support
