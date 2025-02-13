import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { db } from '../Firebase/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

const ScheduleClasses = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedTeacherName, setSelectedTeacherName] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [teacherIdNameMap, setTeacherIdNameMap] = useState({});



    const fetchSchedule = async () => {
        try {
            // Check if schedule document exists
            const docRef = doc(db, 'schedule', 'scheduleDocument');
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                // If schedule document exists, fetch schedule data
                const scheduleData = docSnap.data();
                setSchedule(scheduleData);
            } else {
                console.log("No schedule document found.");
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    const formatSchedule = (scheduleData) => {
        const formattedSchedule = {};
        scheduleData.forEach(entry => {
            const { day, slot, teacher, class: className } = entry;
            if (!formattedSchedule[day]) {
                formattedSchedule[day] = {};
            }
            formattedSchedule[day][slot] = { teacher, class: className };
        });
        return formattedSchedule;
    };


    const fetchTeachers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const registeredCoursesData = querySnapshot.docs
                .filter(doc => doc.data().role === "teacher")
                .map(doc => ({ id: doc.id, ...doc.data() }));
            setTeachers(registeredCoursesData);
        } catch (error) {
            console.error("Error fetching registered courses:", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const registeredCoursesData = querySnapshot.docs
                .filter(doc => doc.data().role === "student")
                .map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(registeredCoursesData);
        } catch (error) {
            console.error("Error fetching registered courses:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchStudents();
        fetchSchedule();
    }, []);

    const generateTimeSlots = () => {
        const slots = [];
        let hour = 8;
        let minute = 30;

        while (hour < 10 || (hour === 10 && minute === 0)) {
            slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            minute += 30;
            if (minute === 60) {
                hour += 1;
                minute = 0;
            }
        }

        return slots;
    };

    const handleSlotClick = (slot, day) => {
        setSelectedSlot(slot);
        setSelectedDay(day);
        setModalOpen(true);
    };

    const handleModalApply = () => {
        const selectedTeacherObj = teachers.find(teacher => teacher.fullname === selectedTeacher);
        if (!selectedTeacherObj) {
            console.error("Selected teacher not found.");
            return;
        }
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [selectedDay]: {
                ...prevSchedule[selectedDay],
                [selectedSlot]: {
                    teacher: selectedTeacherObj.id,
                    teacherName: selectedTeacher,
                    class: selectedClass
                }
            }
        }));
        setModalOpen(false);
    };

    const saveSchedule = async () => {
        try {
            // Save schedule data to Firebase Firestore
            await setDoc(doc(db, 'schedule', 'scheduleDocument'), schedule);
            window.alert('Schedule saved successfully');
        } catch (error) {
            console.error('Error saving schedule:', error);
            window.alert('Error while saving schedule');
        }
    };

    return (
        <div className="body">
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#91B3FA' }}>
                <div className="container">
                    <a className="navbar-brand" href="#" style={{ fontWeight: "bold" }}>Manager Dashboard</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/" style={{ marginLeft: "850px", backgroundColor: "#0d6efd", color: "white", borderRadius: '8px' }}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='container my-5'>
                <h2 style={{ color: "white" }}>Schedule Classes</h2>
                <div className="timetable-grid-container">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th style={{ padding: "10px", border: "2px solid white" }}></th>
                                {generateTimeSlots().map((slot, index) => (
                                    <th key={index}>{slot} </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ border: "2px solid #0d2e49", padding: "8px" }}>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                <tr key={day}>
                                    <td>{day}</td>
                                    {generateTimeSlots().map((slot, index) => (
                                        <td key={index} onClick={() => handleSlotClick(slot, day)}>
                                            {schedule[day] && schedule[day][slot] && (
                                                <div className="selected-info">
                                                    <p>Teacher: {schedule[day][slot].teacherName}</p>
                                                    <p>Class: {schedule[day][slot].class}</p>
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <Button onClick={saveSchedule}>Save Schedule</Button>
                <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Teacher and Class</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>
                            Teacher:
                            <select
                                value={selectedTeacher}
                                onChange={(e) => {
                                    setSelectedTeacher(e.target.value);
                                }}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher.fullname}>{teacher.fullname}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Class:
                            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                <option value="">Select Class</option>
                                {students.map((student) => (
                                    <option key={student.id} value={`${student.batchNo} - ${student.department}`}>
                                        {`${student.batchNo} - ${student.department}`}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
                        <Button variant="primary" onClick={handleModalApply}>Apply</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ScheduleClasses;
