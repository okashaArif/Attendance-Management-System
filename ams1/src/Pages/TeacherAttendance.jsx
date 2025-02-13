import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";

export default function TeacherAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();
  const name = sessionStorage.getItem('name');
  const department = sessionStorage.getItem('department');
  const registrationNo = sessionStorage.getItem('registrationNo');
  const userType = sessionStorage.getItem('userType');
  console.log(userId,name,department,registrationNo,userType)

  const handleTakeAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/runTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          
          "userId": userId,
          "name": name,
          "department": department,
          "registrationNo": registrationNo,
          "userType": userType
        })
      });
      if (!response.ok) {
        throw new Error('Failed to send data to FastAPI');
      }
    } catch (error) {
      console.error('Error sending data to FastAPI:', error);
      return null;
    }
    navigate('/teacherHomepage');
  };

  return (
    <>
    <iframe src="http://192.168.100.31:8080"
      title="Attendance iframe"
      style={{ height: '80vh', width: '100%', border: 'none' }}
    >
      
    </iframe>
    <div className='container my-10 d-flex justify-content-center'>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={handleTakeAttendance}>
          Take Attendance
        </button>
        {isLoading && <div className="text-center mt-3"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
      </div>
    </>
  );
}
