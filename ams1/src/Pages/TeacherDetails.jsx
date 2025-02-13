import React, { useState, useEffect } from 'react';
import {  Button, Table, ProgressBar, Modal } from "react-bootstrap";
import { collection, getDocs, doc, setDoc, getDoc} from "firebase/firestore";
import { db } from "../Firebase/firebase";
const TeacherDetails = () => {
    const [finalteachers, setfinalTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const [courses, setCourses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchTeachers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Teachers")); // Assuming "teachers" is the name of your collection
            const teachersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setfinalTeachers(teachersData);
            console.log("Teachers data:", finalteachers);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const TransferTeachers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const registeredTeachersData = querySnapshot.docs
                .filter(doc => doc.data().role === "teacher")
                .map(doc => ({ id: doc.id, ...doc.data() }));
            registeredTeachersData.forEach(async teacher => {
                try {
                    const teacherDocRef = doc(db, "Teachers", teacher.id);
                    const teacherDoc = await getDoc(teacherDocRef);
                    if (!teacherDoc.exists()) {
                        await setDoc(teacherDocRef, teacher);
                    } else {
                        console.log("Teacher already exists in the Teachers collection:", teacher.id);
                    }
                } catch (error) {
                    console.error("Error adding teacher to Teachers collection:", error);
                }
            });
        } catch (error) {
            console.error("Error fetching registered teachers:", error);
        }
    };

    const handleRegisterCourse = (teacher) => {
        setSelectedTeacher(teacher); // Set the selected teacher
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
            // Ensure selectedTeacher is defined
            if (!selectedTeacher || !selectedTeacher.id) {
                console.error("Selected teacher is undefined or does not have an ID.");
                return;
            }

            const teacherRef = doc(db, "Teachers", selectedTeacher.id);
            const teacherDoc = await getDoc(teacherRef);

            if (teacherDoc.exists()) {
                const teacherData = teacherDoc.data();
                const existingCourses = teacherData.courses || [];

                // Check if the course is already registered
                if (existingCourses.some(c => c.courseId === course.id)) {
                    console.error("Course is already registered.");
                    window.alert("This course is already registered.");
                    return;
                }

                // Check if the teacher already has the maximum number of courses
                if (existingCourses.length >= 6) {
                    console.error("Cannot register more than 6 courses.");
                    window.alert("A teacher can only register up to 6 courses.");
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

                await setDoc(teacherRef, { courses: updatedCourses }, { merge: true });
                console.log("Course registered successfully");

                fetchTeachers(); // Fetch the updated teacher data after registration
            } else {
                console.log("Teacher document does not exist");
            }

            setModalOpen(false); // Close the modal after registering
        } catch (error) {
            console.error("Error registering course:", error);
        }
    };



    useEffect(() => {
        fetchCourses();
        TransferTeachers();
        fetchTeachers();
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
                <h2 style={{ color: "white" }}>Teacher Details</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Full Name</th>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Email</th>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Deparment</th>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Registration ID</th>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Course</th>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Attendance</th>
                            <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }}>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {finalteachers.map((teacher) => (
                            <tr key={teacher.id}>
                                <td>{teacher.fullname}</td>
                                <td>{teacher.email}</td>
                                <td>{teacher.department}</td>
                                <td>{teacher.registrationNo}</td>
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
                                <td><Button onClick={() => handleRegisterCourse(teacher)}>Register Course</Button></td>
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

export default TeacherDetails;
