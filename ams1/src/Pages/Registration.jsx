import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app, auth, db } from "../Firebase/firebase"; 

export function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "",
    registrationNo: "",
    fullName: "",
    email: "",
    batchNo: "",
    department: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    courses:"",
    present:null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleRegister = async () => {
    const { userType, registrationNo, fullName, email, batchNo, department, password, confirmPassword, profilePicture } = formData;

    if (password !== confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        role: userType,
        fullname: fullName,
        email: email,
        registration:registrationNo,
        batchNo: userType === "student" ? batchNo : "0",
        department: department,
        profilePicture: profilePicture ? profilePicture.name : "", 
        courses:null,
        present:0
      });
      
      
      navigate("/");
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
                <a className="nav-link" style={{ marginLeft: "90px" }} href="#">
                  Student Attendance
                </a>
              </li>
            </ul>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="text-end">
                <a href="/" className="btn btn-primary me-2">Login</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="row" style={{ width: "100%" }}>
        <div className="row" style={{ flexDirection: 'row', width: "100%", height: "100%", padding: '50px' }}>
          <div className="col">
            <img src={require('../assets/images/attendance.png')} style={{ width: '100%', height: '400px' }} />
          </div>
          <div className="col col-5 ms-10 d-flex align-items-center justify-content-center">
            <div style={{ width: '80%' }}>
              <div className="card shadow-lg" style={{ borderRadius: '12px', paddingLeft: '12px', paddingRight: '12px' }}>
                <div className="card-body">
                  <h5 className="card-title text-center">Registration</h5>
                  <form>
                    <div className="mb-3" style={{ fontWeight: "bold" }}>
                      <label style={{ marginBottom: '4px' }} htmlFor="userType">Register As:</label>
                      <select
                        id="userType"
                        name="userType"
                        className="form-select"
                        onChange={handleChange}
                      >
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="manager">manager</option>
                      </select>
                    </div>
                    {formData.userType === "student" && (
                      <>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="profilePicture">Profile Picture:</label>
                          <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            className="form-control"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="registrationNo">Registration No:</label>
                          <input
                            type="text"
                            id="registrationNo"
                            name="registrationNo"
                            className="form-control"
                            placeholder="FA20-BSE-149"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="fullName">Full Name:</label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            placeholder="Enter Full Name"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="email">Email:</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="batchNo">Batch No:</label>
                          <input
                            type="text"
                            id="batchNo"
                            name="batchNo"
                            className="form-control"
                            placeholder="FA20"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="department">Department:</label>
                          <input
                            type="text"
                            id="department"
                            name="department"
                            className="form-control"
                            placeholder="BCS"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    {formData.userType === "teacher" && (
                      <>
                      <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="profilePicture">Profile Picture:</label>
                          <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            className="form-control"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="fullName">Full Name:</label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            placeholder="Enter Full Name"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="email">Email:</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="department">Department:</label>
                          <input
                            type="text"
                            id="department"
                            name="department"
                            className="form-control"
                            placeholder="Enter Department"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="department">Registration No:</label>
                          <input
                            type="text"
                            id="registerationNo"
                            name="registerationNO"
                            className="form-control"
                            placeholder="Enter Registeration ID"
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </>
                    )}
                    {formData.userType === "manager" && (
                      <>
                      
                
                        <div className="mb-3" style={{ fontWeight: "bold" }}>
                          <label style={{ marginBottom: '4px' }} htmlFor="email">Email:</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                      </>
                    )} 
                    <div className="mb-3" style={{ fontWeight: "bold" }}>
                      <label style={{ marginBottom: '4px' }} htmlFor="password">Password:</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3" style={{ fontWeight: "bold" }}>
                      <label style={{ marginBottom: '4px' }} htmlFor="confirmPassword">Confirm Password:</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </form>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </button>
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
      </div>
    </div>
  );
}

export default Registration;

