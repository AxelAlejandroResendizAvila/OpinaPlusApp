# OpinaPlus 🗳️

OpinaPlus is a **mobile and web platform for managing petitions and suggestions within an academic community**.

The application allows users to submit requests and track their progress, while administrators can review, moderate, and update their status through an administrative dashboard.

The platform integrates a **Machine Learning module** that performs sentiment analysis and predicts the volume of future requests to support data-driven decision making.

---

# 🎯 Problem

In many academic institutions, petitions and suggestions are handled through informal or manual processes, which makes it difficult to:

* track request progress
* identify trends in community feedback
* manage requests efficiently

OpinaPlus provides a **centralized digital system** where requests can be submitted, tracked, and analyzed.

---

# 🚀 Features

## User Features

* User registration and login
* Role-based access control
* Create petitions and suggestions
* View request status
* Receive notifications

## Administrator Features

* Administrative dashboard
* View all petitions
* Update request status:

  * Open
  * In progress
  * Resolved
  * Closed
* Filter requests by status
* View operational statistics

---

# 🤖 Machine Learning Module

The system integrates a **Python Machine Learning service** located in the `backend-ml` module.

Capabilities include:

* **Sentiment analysis**

  * Classifies petitions as positive, neutral, or negative
* **Request volume prediction**

  * Estimates future demand trends
* Provides analytical insights for administrators

The ML service is exposed via a **FastAPI REST API** and consumed by the frontend.

---

# 🛠 Technologies

## Frontend

* React Native
* Expo
* React Navigation
* Context API

## Backend / Machine Learning

* Python
* FastAPI

## Database

* SQLite (expo-sqlite)

## Data Processing

* Python preprocessing pipeline
* Sentiment analysis model
* Volume prediction model

---

# 🏗 Project Structure

```id="struct1"
OpinaPlusApp
│
├── screens/          UI screens (login, admin dashboard, petitions)
├── controllers/      Business logic
├── models/           Data models
├── context/          Global state management
├── database/         SQLite database logic
│
├── backend-ml/
│   ├── models/
│   │   ├── sentiment_model.py
│   │   └── volume_predictor.py
│   ├── utils/
│   │   ├── preprocessing.py
│   │   └── database.py
│   └── app_simple.py
```

---

# 🔗 Frontend–ML Integration

The mobile application communicates with the Machine Learning backend through **REST API requests**.

Key aspects:

* API requests handled with `fetch`
* Error handling if ML service is unavailable
* Fallback behavior to keep the app functional

---

# ⚙️ Installation

Clone the repository:

```bash id="clone1"
git clone https://github.com/YOUR_USERNAME/OpinaPlus.git
```

Install frontend dependencies:

```bash id="install_front"
npm install
```

Start the Expo development server:

```bash id="run_front"
npx expo start
```

Run the app using **Expo Go** or an emulator.

---

# 🧪 Running the Machine Learning Service

Navigate to the ML backend:

```bash id="ml1"
cd backend-ml
```

Install dependencies:

```bash id="ml2"
pip install -r requirements.txt
```

Start the API server:

```bash id="ml3"
uvicorn app_simple:app --reload
```

---

# 📊 Possible Improvements

* Cloud database integration
* Push notifications
* Improved analytics dashboard
* Model retraining pipeline
* Advanced moderation tools
