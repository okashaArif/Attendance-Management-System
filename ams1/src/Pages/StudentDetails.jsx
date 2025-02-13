import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Button, Table, ProgressBar, Modal } from "react-bootstrap";
import { collection, getDocs, doc, setDoc, updateDoc, getDoc, addDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
const StudentDetails = () => {
    const [finalstudents, setfinalstudents] = useState([]);
    const [selectedstudent, setSelectedstudent] = useState(null);

    const [courses, setCourses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchstudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Students")); // Assuming "students" is the name of your collection
            const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setfinalstudents(studentsData);
            console.log("students data:", finalstudents);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const Transferstudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const registeredstudentsData = querySnapshot.docs
                .filter(doc => doc.data().role === "student")
                .map(doc => ({ id: doc.id, ...doc.data() }));
            registeredstudentsData.forEach(async student => {
                try {
                    const studentDocRef = doc(db, "Students", student.id);
                    const studentDoc = await getDoc(studentDocRef);
                    if (!studentDoc.exists()) {
                        await setDoc(studentDocRef, student);
                    } else {
                        console.log("student already exists in the students collection:", student.id);
                    }
                } catch (error) {
                    console.error("Error adding student to students collection:", error);
                }
            });
        } catch (error) {
            console.error("Error fetching registered students:", error);
        }
    };

    const handleRegisterCourse = (student) => {
        setSelectedstudent(student); // Set the selected student
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const coursesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCourses(coursesData);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };



    const handleCourseSelect = async (course) => {
        try {
            // Ensure selectedstudent is defined
            if (!selectedstudent || !selectedstudent.id) {
                console.error("Selected student is undefined or does not have an ID.");
                return;
            }

            const studentRef = doc(db, "Students", selectedstudent.id);
            const studentDoc = await getDoc(studentRef);

            if (studentDoc.exists()) {
                const studentData = studentDoc.data();
                const existingCourses = studentData.courses || [];

                // Check if the course is already registered
                if (existingCourses.some(c => c.courseId === course.id)) {
                    console.error("Course is already registered.");
                    window.alert("This course is already registered.");
                    return;
                }

                // Check if the student already has the maximum number of courses
                if (existingCourses.length >= 6) {
                    console.error("Cannot register more than 6 courses.");
                    window.alert("A student can only register up to 6 courses.");
                    return;
                }

                const updatedCourses = [
                    ...existingCourses,
                    {
                        courseId: course.id || null,
                        courseCode: course.courseCode || null,
                        courseName: course.courseName || null,
                    }
                ];

                await setDoc(studentRef, { courses: updatedCourses }, { merge: true });
                console.log("Course registered successfully");

                fetchstudents(); // Fetch the updated student data after registration
            } else {
                console.log("student document does not exist");
            }

            setModalOpen(false); // Close the modal after registering
        } catch (error) {
            console.error("Error registering course:", error);
        }
    };



    useEffect(() => {
        fetchCourses();
        Transferstudents();
        fetchstudents();
    }, []);

    return (
        <div className="body">
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#91B3FA' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <a className="navbar-brand" href="/manager" style={{ fontWeight: "bold" }}>Manager Dashboard</a>
                    <div className="d-flex">
                        <a className="nav-link" href="/manager" style={{ marginRight: '10px', backgroundColor: "#0d6efd", color: "white", borderRadius: '8px', padding: '5px 10px' }}>Back</a>
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
                        <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Action</th>

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
                                <td><Button onClick={() => handleRegisterCourse(student)}>Register Course</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={modalOpen} onHide={handleModalClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Register Course</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.courseCode}</td>
                                    <td>{course.courseName}</td>
                                    <td>
                                        <Button onClick={() => handleCourseSelect(course)}>Register</Button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>

                    </Table>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentDetails;
