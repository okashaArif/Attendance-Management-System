import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

export default function StudentAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const name = sessionStorage.getItem('name');
  const department = sessionStorage.getItem('department');
  const registrationNo = sessionStorage.getItem('registrationNo');
  const userType = sessionStorage.getItem('userType');
  console.log(userId,name,department,registrationNo,userType)

  const handleTakeAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/runStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          name,
          department,
          registrationNo,
          userType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send data to FastAPI');
      }

      navigate('/studentHomepage');
    } catch (error) {
      console.error('Error sending data to FastAPI:', error);
    } finally {
      setIsLoading(false);
    }
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
