# Django WebSocket Chat Application

This project is a real-time chat application built with Django, Django Channels, WebSocket, and JavaScript. It allows users to join chat rooms, exchange messages in real-time, and displays a list of online users.

---

## Features
- Real-time messaging using WebSocket.
- Separate styling for sender and receiver messages.
- Dynamic user list that updates when users join or leave the room.

---

## Prerequisites
Make sure you have the following installed:
1. Python 3.8+.
2. Django 4.x or later.
3. Django Channels.
4. Redis (for channel layers).
5. Node.js and npm (if using frontend tools).

---

## Installation Steps

### 1. Clone the Repository
```
git clone https://github.com/dev-vikash2v7/django_chat_app.git
cd django_chat_app
```

### 2. Install Required Dependencies
```
pip install -r requirements.txt 
```

### 3. Run Migrations:
```
python manage.py makemigrations
python manage.py migrate
```

### 4.Start the Django Development Server
```
python manage.py runserver
```

### 5. Access the Application
Open your browser and visit: http://127.0.0.1:8000.
