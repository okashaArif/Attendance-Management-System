import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {  Button, Table, ProgressBar, Modal } from "react-bootstrap";
import { collection, getDocs, doc, setDoc, getDoc} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { writeBatch } from 'firebase/firestore';

export default function MarkAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalCounts, setTotalCounts] = useState([]);
  const [attendanceData, setAttendanceData] = useState({
    total: 0,
    students: [],
  });
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();
  const name = sessionStorage.getItem('name');
  const department = sessionStorage.getItem('department');
  const registrationNo = sessionStorage.getItem('registrationNo');
  const userType = sessionStorage.getItem('userType');
  console.log(userId,name,department,registrationNo,userType)

  useEffect(() => {
    let count = 0;
    const intervalId = setInterval(async () => {
      if (count >= 4) {
        clearInterval(intervalId);
        return;
      }

      count++;
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/check_student');
        const newAttendanceData = response.data;

        // Store total and student counts in an object
        const runData = {
          total: newAttendanceData.total,
          students: newAttendanceData.students,
          run: count, // Add run number for identification (optional)
        };

        // Update totalCounts with the new run's data
        setTotalCounts(prevCounts => [...prevCounts, runData]);

        setAttendanceData(newAttendanceData); // Update current state
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        // Handle errors appropriately (e.g., display an error message to the user)
      } finally {
        setIsLoading(false);
      }
    }, 20000); // 20 seconds * 1000 milliseconds/second

    // Ensure cleanup on unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  const onMarkAllPresent = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'Students'));
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnapshot) => {
        const studentDocRef = doc(db, 'Students', docSnapshot.id);
        batch.update(studentDocRef, { present: 1 });
        console.log(studentDocRef.data);
      });
      // Commit the batched write
      await batch.commit();
      alert('All students marked as Present.');
      navigate('/teacherHomepage');
    } catch (error) {
      console.error('Error marking all students present:', error);
      alert('Failed to mark all students as present.');
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

    <div className="container attendance-marking">
    <h1 className="heading">Mark Students</h1>
    <div>
    <h2>Total Counts</h2>
    <ul>
      {totalCounts.map((data, index) => (
        <li key={index}>
          Run {data.run}: Total - {data.total}, Students - {data.students.length}
        </li>
      ))}
    </ul>
   
  </div>

    <div className="buttons-container">
        <a href="/teacherHomepage">
      <button className="mark-all-absent" >
        Mark All Absent
      </button>
      </a>
      <button className="mark-all-present" onClick={onMarkAllPresent}>
        Mark All Present
      </button>
    </div>
  </div>
  </>
  )
}

