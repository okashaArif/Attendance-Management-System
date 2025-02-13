import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebase"; 
import { collection, getDocs, doc, getDoc , deleteDoc } from "firebase/firestore";

export function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [teacherFullNames, setTeacherFullNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      fetchTeacherFullNames();
    }
  }, [courses]);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchTeacherFullNames = async () => {
    try {
      const teacherIds = [...new Set(courses.map((course) => course.assignedTeacher))];
      const requests = teacherIds.map(async (teacherId) => {
        const docRef = doc(db, "users", teacherId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { [teacherId]: docSnap.data().teacherFullName };
        } else {
          console.log("No such document!");
          return { [teacherId]: "Unknown" };
        }
      });
      const responses = await Promise.all(requests);
      const fullNameMap = responses.reduce((acc, response) => ({ ...acc, ...response }), {});
      setTeacherFullNames(fullNameMap);
    } catch (error) {
      console.error("Error fetching teacher full names:", error);
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/manager/editCourse/${courseId}`, { state: { courseId } });
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
        try {
            await deleteDoc(doc(db, "courses", courseId));
            setCourses(courses.filter(course => course._id !== courseId));
            console.log("Deleted course with id:", courseId);
            alert("Course deleted successfully!");
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    }
};

  const handleAddCourse = () => {
    navigate("/manager/addNewCourse");
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
        <button className="btn btn-primary mb-3" onClick={handleAddCourse}>
          Add New Course
        </button>
        <table className="table">
          <thead>
            <tr>
              <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }} scope="col">Course Code</th>
              <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }} scope="col">Course Name</th>
              <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }} scope="col">Assigned Teacher</th>
              <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }} scope="col">Assigned Class</th>
              <th style={{ background: "#0d2e49", color: "white", padding: "10px", border: "2px solid white" }} scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{course.courseCode}</td>
                <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{course.courseName}</td>
                <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{ course.assignedTeacher|| "Loading..."}</td>
                <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>{course.assignedClass}</td>
                <td style={{ border: "2px solid #0d2e49", padding: "8px" }}>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => handleEditCourse(course._id)}
                    
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllCourses;
