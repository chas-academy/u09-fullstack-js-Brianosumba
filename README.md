🏋️ Fitness Tracker App - Complete Guide
Welcome to the Fitness Tracker App! This application helps users track their workouts, view progress, and receive exercise recommendations. Admins have advanced controls to manage users, recommend workouts, track completed exercises, and oversee user engagement.

This guide provides a step-by-step walkthrough on how to set up, use, and test the application using Insomnia/Postman.

Overview of Features
👤 User Features:
✔ Register & log in to create an account
✔ Track workout progress over time
✔ Complete exercises and log them
✔ View recommended workouts from admins

🛠️ Admin Features:
✔ Manage registered users (view, activate/deactivate, delete)
✔ Recommend, edit & delete exercises
✔ Monitor users' completed workouts
✔ Track the number of registered users

🔧 Setting Up the App
1️. Clone the Repository

git clonehttps://github.com/chas-academy/u09-fullstack-js-Brianosumba.git
open the terminal and cd frontend and backend

2️. Install Dependencies
npm install

3️. Configure Environment Variables (.env file)
Create a .env file in the project root and add:
Frontend: VITE_API_URL=https://u09-fullstack-js-brianosumba.onrender.com/api
VITE_SOCKET_URL=https://u09-fullstack-js-brianosumba.onrender.com
VITE_RAPIDAPI_KEY=7b71dc7158msh59420258f02af5ap165da9jsn1f3df9ce3de5

Backend:MONGODB_URI=mongodb+srv://brian09:brian09@cluster09.hvg9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster09
PORT=3000
FRONTEND_URL=https://fitnesstracker-app.netlify.app
RAPIDAPI_KEY= 7b71dc7158msh59420258f02af5ap165da9jsn1f3df9ce3de5
JWT_SECRET=d730265f5d4ea794b7857fda5a3beb4d69dd26f5

4️. Start the Server
npm start

📡 API Guide: Using the Fitness Tracker App
This section explains how to test the API using Insomnia/Postman.

1.  User Authentication (Register, Login, Reset Password)
    Register a New User

Method: POST
Endpoint: /api/auth/register
Body (User Registration Example):

{
"username": "john_doe",
"email": "john@example.com",
"password": "securepassword"
}

Body (Admin Registration - Requires secretCode)

{
"username": "admin_user",
"email": "admin@example.com",
"password": "securepassword",
"secretCode": "your_admin_secret"
}
Response:
✅ 201 Created (User or Admin registered successfully)
Login (Get Access Token)

Method: POST
Endpoint: /api/auth/login
Body:

{
"email": "john@example.com",
"password": "securepassword"
}
Response:

{
"token": "your_jwt_token",
"user": { "id": "123", "username": "john_doe", "isAdmin": false }
}

📌 Reset Password

Method: POST
Endpoint: /api/auth/reset-password
Body:
{
"username": "john_doe",
"newPassword": "newsecurepassword"
}

2. Workouts & Progress Tracking
   📌 Complete an Exercise

Method: POST
Endpoint: /api/exercise/complete
Body:
{
"userId": "123456",
"exerciseId": "98765"
}
📌 Get Completed Workouts
Method: GET
Endpoint: /api/exercise/completed
Headers: Authorization: Bearer your_jwt_token
Response: List of completed workouts.

📌 Delete a Completed Workout (Admin Only)
Method: DELETE
Endpoint: /api/exercise/completed/:workoutId
Headers: Authorization: Bearer your_admin_jwt_token

📌 Get User Progress
Method: GET
Endpoint: /api/progress/:userId
Response:
{
"userId": "123456",
"progress": 75
}

3.  Admin Controls & User Management
    📌 View All Users

Method: GET
Endpoint: /api/users/
Headers: Authorization: Bearer your_admin_jwt_token

📌 Get a User by ID
Method: GET
Endpoint: /api/users/:id
Headers: Authorization: Bearer your_admin_jwt_token

📌 Delete a User
Method: DELETE
Endpoint: /api/users/:id
Headers: Authorization: Bearer your_admin_jwt_token

4.  Exercise Recommendations (Admin Only)
    📌 Recommend an Exercise

Method: POST
Endpoint: /api/recommendations/
Headers: Authorization: Bearer your_admin_jwt_token
{
"userId": "123456",
"exercise": "Push-ups"
}

📌 Edit a Recommendation

Method: PATCH
Endpoint: /api/recommendations/:recommendationId
Headers: Authorization: Bearer your_admin_jwt_token

📌 Delete a Recommendation

Method: DELETE
Endpoint: /api/recommendations/:recommendationId
Headers: Authorization: Bearer your_admin_jwt_token

📝 Summary & Best Practices
Authentication Required: Most routes require a JWT token in the Authorization header.
Admin Routes: Admin actions require a verified admin account.
Use Insomnia/Postman: Make sure to include "Bearer your_token" in the Authorization header.

How the App Works:
A new user registers, logs in, and gets a JWT token.
The user can complete exercises, track progress, and view recommendations.
An admin can manage users, recommend workouts, and monitor progress.
All interactions are done through API endpoints, secured with JWT authentication.

🤝 Contributing
Want to improve this project? Fork it, contribute, and submit a pull request! 🚀

🔥 Final Thoughts
This Fitness Tracker App is a powerful tool for monitoring workouts, tracking progress, and managing users effectively. Whether you're a regular user looking to improve your fitness or an admin managing a fitness platform, this app has all the features you need!
