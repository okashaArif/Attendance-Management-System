import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../Firebase/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const EditCourse = () => {
    const { courseId } = useParams();
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState('');
    const [assignedClass, setAssignedClass] = useState('');
    const [students, setStudents] = useState([]);  

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseDetails();
    }, []);

    const fetchCourseDetails = async () => {
        try {
            const docRef = doc(db, 'courses', courseId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(data)
                setCourseCode(data.courseCode);
                setCourseName(data.courseName);
                setAssignedTeacher(data.assignedTeacher);
                setAssignedClass(data.assignedClass);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    const [teachers, setTeachers] = useState([]);
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const registeredCoursesData = querySnapshot.docs
          .filter(doc => doc.data().role === "teacher" )
          .map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(registeredCoursesData)
          setTeachers(registeredCoursesData);
      } catch (error) {
        console.error("Error fetching registered courses:", error);
      }
    };
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const registeredCoursesData = querySnapshot.docs
          .filter(doc => doc.data().role === "student" )
          .map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(registeredCoursesData)
          setStudents(registeredCoursesData);
      } catch (error) {
        console.error("Error fetching registered courses:", error);
      }
    };
  
  
    useEffect(() => {
      fetchTeachers();
      fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedCourse = {
            courseCode,
            courseName,
            assignedTeacher,
            assignedClass
        };

        try {
            const docRef = doc(db, 'courses', courseId);
            await setDoc(docRef, updatedCourse, { merge: true }); 
            console.log('Course updated successfully!');
            navigate('/manager/allCourses');
        } catch (error) {
            console.error('Error updating course:', error);
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
            <div className="container mt-5">
                <h2 className="mb-4" style={{ color: "white" }}>Edit Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="courseCode" className="form-label" style={{ color: "white" }}>Course Code:</label>
                        <input type="text" className="form-control" id="courseCode" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="courseName" className="form-label" style={{ color: "white" }}>Course Name:</label>
                        <input type="text" className="form-control" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="assignedTeacher" className="form-label" style={{ color: "white" }}>Assigned Teacher:</label>
                        <select className="form-select" id="assignedTeacher" value={assignedTeacher} onChange={(e) => setAssignedTeacher(e.target.value)}>
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>{teacher.fullname}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="assignedClass" className="form-label" style={{ color: "white" }}>Assigned Class:</label>
                        <select className="form-select" id="assignedClass" value={assignedClass} onChange={(e) => setAssignedClass(e.target.value)}>
                            <option value="">Select Class</option>
                            {students.map((classItem) => (
                                <option key={classItem._id} value={`${classItem.batchNo} - ${classItem.department}`}>{`${classItem.batchNo} - ${classItem.department}`}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Update Course</button>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;
