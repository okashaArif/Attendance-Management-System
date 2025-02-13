import React, { useState, useEffect } from "react";
import {  Button,  ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";

const TeacherDashboard = () => {
  const [finalTeachers, setfinalTeachers] = useState([]);
  const userId = sessionStorage.getItem('userId');
  console.log(userId);


  const fetchTeachers = async () => {
    try {
      const docRef = doc(db, "Teachers", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const TeacherData = { id: docSnap.id, ...docSnap.data() };
        setfinalTeachers([TeacherData]);
        console.log("Teacher data:", TeacherData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching Teacher:", error);
    }
  };
  
useEffect(() => {
  fetchTeachers();
}, []);
  return (
    <div className="body">
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#91B3FA' }}>
        <div className="container d-flex justify-content-between align-items-center">
            <a className="navbar-brand" href="/teacherHomepage" style={{ fontWeight: "bold" }}>Teacher Dashboard</a>
            <div className="d-flex">
                <a className="nav-link" href="/teacherHomepage" style={{ marginRight: '10px', backgroundColor: "#0d6efd", color: "white", borderRadius: '8px', padding: '5px 10px' }}>Back</a>
                <a className="nav-link" href="/" style={{ backgroundColor: "#0d6efd", color: "white", borderRadius: '8px', padding: '5px 10px' }}>Logout</a>
            </div>
        </div>

    </nav>
    <div className='container my-5'>
        <h2 style={{ color: "white" }}>Teacher Details</h2>
        <table className="table">
            <thead>
                <tr>
                    <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Full Name</th>
                    <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Email</th>
                    <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Deparment</th>
                    <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Course</th>
                    <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Attendance</th>

                </tr>
            </thead>
            <tbody>
                {finalTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                        <td>{teacher.fullname}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.department}</td>
                        <td>
                            {teacher.courses ? (
                                <>
                                    {/* Read-only dropdown to display courses */}
                                    <select >
                                        {teacher.courses.map((course) => (
                                            <option key={course.courseCode} value={course.courseCode}>
                                                {course.courseCode} - {course.courseName}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <span>No courses</span>
                            )}
                        </td>

                        <td><ProgressBar now={teacher.attendance || 0} label={`${teacher.attendance}%`} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    
</div>
  );
};

export default TeacherDashboard;
