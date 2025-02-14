Face Recognition Attendance System

📌 Overview

This project is a face recognition-based attendance system that automatically marks student attendance based on facial detection. It utilizes:

Python for face recognition and attendance marking

React for the frontend

Firebase as the backend for storing attendance records

Since a physical camera is unavailable, the IP Webcam app is used to stream the camera feed locally.

🔥 Features

✅ Face Recognition-Based Attendance – Detects student faces and marks attendance automatically.✅ IP Webcam Integration – Uses a mobile phone as a webcam for real-time face detection.✅ Automated Periodic Check – The camera activates every 20 minutes to check how many students are present.✅ Attentiveness Tracking – Attendance is influenced by student presence and attentiveness over time.

🛠️ Tech Stack

Frontend: React

Backend: Firebase

Face Recognition: Python (OpenCV, dlib)

Camera Stream: IP Webcam app

🚀 How It Works

1️⃣ The system captures real-time video from the IP Webcam.2️⃣ Python processes the feed and recognizes student faces.3️⃣ Attendance is automatically marked based on recognized faces.4️⃣ Every 20 minutes, the system checks how many students are present to ensure attentiveness.5️⃣ Data is stored and updated in Firebase.


Use the IP Webcam app to stream video locally.

📌 Future Enhancements

🔹 Improve accuracy with deep learning models.

🔹 Add real-time notifications for low attendance.

🔹 Enhance the UI for better user experience.
