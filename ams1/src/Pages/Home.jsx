
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase"; 

export function Home() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
  
    setIsLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check if the userType matches
        if (userData.role === role) {
          console.log("User Data:", userData);
          sessionStorage.setItem('userId', user.uid);
          sessionStorage.setItem('name', userData.fullname);
          sessionStorage.setItem('department', userData.department);
          sessionStorage.setItem('registrationNo', userData.registration);
          sessionStorage.setItem('userType', userData.role);
          console.log(userData.role, userData.registration, userData.fullname);
  
          // Add user data to students or teachers collection based on role
          if (role === 'student') {
            const studentDocRef = doc(db, "Students", user.uid);
            const studentDoc = await getDoc(studentDocRef);
            if (!studentDoc.exists()) {
              await setDoc(studentDocRef, userData);
            }
            navigate('/studentHomepage');
          } else if (role === 'teacher') {
            const teacherDocRef = doc(db, "Teachers", user.uid);
            const teacherDoc = await getDoc(teacherDocRef);
            if (!teacherDoc.exists()) {
              await setDoc(teacherDocRef, userData);
            }
            navigate('/teacherHomepage');
          } else if (role === 'manager') {
            navigate('/manager');
          }
        } else {
          window.alert("User type does not match.");
        }
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      window.alert(error.message);
    }
  
    setIsLoading(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#91B3FA' }}>
        <div className="container">
          <a className="navbar-brand" style={{ fontWeight: "bold", fontSize: "20px" }} href="#">
            Smart Attendance Management System
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" style={{ marginLeft: "90px" }} href="#">Student Attendance</a>
              </li>
            </ul>
            <div className="text-end">
              <a href="/signup" className="btn btn-primary me-2">Registration</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="row" style={{ width: "100%" }}>
        <div className="row" style={{ flexDirection: 'row', width: "100%", height: "100%", padding: '50px' }}>
          <div className="col">
            <img src={require('../assets/images/attendance.png')} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="col col-5 ms-10 d-flex align-items-center justify-content-center">
            <div style={{ width: '80%' }}>
              <div className="card shadow-lg" style={{ borderRadius: '12px', paddingLeft: '12px', paddingRight: '12px' }}>
                <div className="card-body">
                  <h5 className="card-title text-center">Login</h5>
                  <form>
                    <div className="mb-3" style={{ fontWeight: "bold", fontSize: "15px" }}>
                      <label style={{ marginBottom: '4px' }} htmlFor="userType">Login As</label>
                      <select
                        id="userType"
                        className="form-select"
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div className="mb-3" style={{ fontWeight: "bold" }}>
                      <label style={{ marginBottom: '4px' }} htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3" style={{ fontWeight: "bold" }}>
                      <label style={{ marginBottom: '4px' }} htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-block"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {isLoading && (
                <div className="text-center mt-3">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

