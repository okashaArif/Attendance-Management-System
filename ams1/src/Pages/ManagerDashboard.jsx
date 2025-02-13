import React from 'react';

export function ManagerDashboard() {
    return (
        <div className="">
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
            {/* <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4">
                        <a href="/manager/AllCourses" className="text-decoration-none">
                            <div className="card bg-primary text-white mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">View Courses</h5>
                                    <p className="card-text">View all available courses.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="/manager/TeacherDetails" className="text-decoration-none">
                            <div className="card bg-info text-white mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">View Teachers</h5>
                                    <p className="card-text">View all registered teachers.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="/manager/StudentDetails" className="text-decoration-none">
                            <div className="card bg-success text-white mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">View Students</h5>
                                    <p className="card-text">View all registered students.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="/manager/ScheduleClasses" className="text-decoration-none">
                            <div className="card bg-danger text-white mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Schedule Classes</h5>
                                    <p className="card-text">Schedule classes for students.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div> */}
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4">
                        <a href="/manager/AllCourses" className="text-decoration-none">
                            <div className="card bg-primary text-white mb-3 rounded-3 shadow-lg">
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/cour2.png')} style={{ width: '240px', height: '240px' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">View Courses</h5>
                                        <p className="card-text">Explore all available courses.</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4 ">
                        <a href="/manager/TeacherDetails" className="text-decoration-none">
                            <div className="card bg-info text-white mb-3 rounded-3 shadow-lg">
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/teach.png')} style={{ width: '100%', height: '240px' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">View Teachers</h5>
                                        <p className="card-text">Discover all registered teachers.</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="/manager/StudentDetails" className="text-decoration-none">
                            <div className="card text-white mb-3 rounded-3 shadow-lg" style={{ backgroundColor: '#C2E8E9' }}>
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/stud.jpg')} style={{ width: '100%', height: '240px' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">View Students</h5>
                                        <p className="card-text">Browse all registered students.</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="/manager/ScheduleClasses" className="text-decoration-none">
                            <div className="card text-white mb-3 rounded-3 shadow-lg" style={{ backgroundColor: '#06A9D9' }}>
                                <div className="card-body" row>
                                    <div className="col">
                                        <img src={require('../assets/images/sch2.webp')} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <div className="col " style={{ marginTop: '12px' }}>
                                        <h5 className="card-title fw-bold">Schedule Classes</h5>
                                        <p className="card-text">Plan classes for students.</p>
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

export default ManagerDashboard;
