import React, { useState, useEffect } from "react";
import {  ProgressBar } from "react-bootstrap";
import { doc,getDoc} from "firebase/firestore";
import { db} from "../Firebase/firebase";

const StudentDashboard = () => {
  const [finalstudents, setfinalstudents] = useState([]);
  const userId = sessionStorage.getItem('userId');
  console.log(userId)
  const registration = sessionStorage.getItem('registration');
  console.log(registration)


  const fetchstudents = async () => {
    try {
      const docRef = doc(db, "Students", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const studentData = { id: docSnap.id, ...docSnap.data() };
        setfinalstudents([studentData]);
        console.log("Student data:", studentData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };
  
useEffect(() => {
  fetchstudents();
}, []);
  return (
    <>
     <div className="body">
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#91B3FA' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <a className="navbar-brand" href="/studentHomepage" style={{ fontWeight: "bold" }}>Student Dashboard</a>
                    <div className="d-flex">
                        <a className="nav-link" href="/studentHomepage" style={{ marginRight: '10px', backgroundColor: "#0d6efd", color: "white", borderRadius: '8px', padding: '5px 10px' }}>Back</a>
                        <a className="nav-link" href="/" style={{ backgroundColor: "#0d6efd", color: "white", borderRadius: '8px', padding: '5px 10px' }}>Logout</a>
                    </div>
                </div>

            </nav>
            <div className='container my-5'>
                <h2 style={{ color: "white" }}>Student Details</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Full Name</th>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Email</th>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Deparment</th>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>BatchNo</th>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Registration No</th>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Course</th>
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Attendance</th>

                    </tr>
                    </thead>
                    <tbody>
                        {finalstudents.map((student) => (
                            <tr key={student.id}>
                                <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{student.fullname}</td>
                            <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{student.email}</td>
                            <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{student.department}</td>
                            <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{student.batchNo}</td>
                            <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{student.registration}</td>
                                <td>
                                    {student.courses ? (
                                        <>
                                            {/* Read-only dropdown to display courses */}
                                            <select >
                                                {student.courses.map((course) => (
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

                                <td><ProgressBar now={student.attendance || 0} label={`${student.attendance}%`} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  );
};

export default StudentDashboard;
