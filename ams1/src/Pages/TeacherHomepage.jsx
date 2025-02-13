import React from 'react';

export function TeacherHomepage() {
    return (
        <div className="">
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#91B3FA' }}>
                <div className="container">
                    <a className="navbar-brand" href="#" style={{ fontWeight: "bold" }}>Teacher Dashboard</a>
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
                <div className="row">
                    <div className="col-md-4">
                        <a href="/teacherattendance" className="text-decoration-none">
                            <div className="card bg-primary text-white mb-3 rounded-3 shadow-lg">
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/cour2.png')} style={{ width: '240px', height: '240px' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">Add Attendance</h5>
                                        
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4 ">
                        <a href="/teacher" className="text-decoration-none">
                            <div className="card bg-info text-white mb-3 rounded-3 shadow-lg">
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/teach.png')} style={{ width: '100%', height: '240px' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">View Courses</h5>
                                        
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4 ">
                        <a href="/markattendance" className="text-decoration-none">
                            <div className="card bg-info text-white mb-3 rounded-3 shadow-lg">
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/stud.jpg')} style={{ width: '100%', height: '240px' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">Mark Attendance</h5>
                                        
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TeacherHomepage;
