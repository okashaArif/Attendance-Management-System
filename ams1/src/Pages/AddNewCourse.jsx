import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";

const AddNewCourse = () => {
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState('');
    const [assignedClass, setAssignedClass] = useState('');
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const fetchTeachers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const teachersData = querySnapshot.docs
                .filter(doc => doc.data().role === "teacher")
                .map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(teachersData);
            setTeachers(teachersData);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const [students, setStudents] = useState([]);
    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const studentsData = querySnapshot.docs
                .filter(doc => doc.data().role === "student")
                .map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(studentsData);
            setStudents(studentsData);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newCourse = {
                courseCode,
                courseName,
                assignedTeacher,
                assignedClass
            };
            await setDoc(doc(collection(db, "courses"), courseCode), newCourse);
            console.log('Course added successfully:', newCourse);
            // Navigate back to the manager dashboard or display a success message
            navigate('/manager');
        } catch (error) {
            console.error("Error adding course:", error);
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="/manager" style={{ fontWeight: "bold" }}>Manager Dashboard</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="http://localhost:3000/" style={{ marginLeft: "850px", border: "2px solid #0d2e49", backgroundColor: "#2e91e8", color: "white" }}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2 className="mb-4">Add New Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="courseCode" className="form-label">Course Code:</label>
                        <input type="text" className="form-control" id="courseCode" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="courseName" className="form-label">Course Name:</label>
                        <input type="text" className="form-control" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="assignedTeacher" className="form-label">Assigned Teacher:</label>
                        <select className="form-select" id="assignedTeacher" value={assignedTeacher} onChange={(e) => setAssignedTeacher(e.target.value)}>
                            <option value="">Select Teacher</option>
                            {teachers?.map((teacher) => (
                                <option key={teacher.id} value={teacher.fullname}>{teacher.fullname}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="assignedClass" className="form-label">Assigned Class:</label>
                        <select className="form-select" id="assignedClass" value={assignedClass} onChange={(e) => setAssignedClass(e.target.value)}>
                            <option value="">Select Class</option>
                            {students.map((student) => (
                                <option key={student.id} value={`${student.batchNo} - ${student.department}`}>{`${student.batchNo} - ${student.department}`}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Course</button>
                </form>
            </div>
        </div>
    );
};

export default AddNewCourse;
