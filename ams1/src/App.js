import { BrowserRouter,Routes,Route } from "react-router-dom";
import { Home } from './Pages/Home';
import Registration from "./Pages/Registration";
import ManagerDashboard from "./Pages/ManagerDashboard";
import AllCourses from "./Pages/AllCourses";
import AddNewCourse from "./Pages/AddNewCourse";
import EditCourse from "./Pages/EditCourse";
import TeacherDetails from "./Pages/TeacherDetails";
import StudentDetails from "./Pages/StudentDetails";
import ScheduleClasses from "./Pages/ScheduleClasses";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import StudentHomepage from "./Pages/StudentHomepage";
import StudentAttendance from "./Pages/StudentAttendance";
import TeacherHomepage from "./Pages/TeacherHomepage";
import TeacherAttendance from "./Pages/TeacherAttendance";
import MarkAttendance from "./Pages/MarkAttendance";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={[<Home />]}
            path="/"
          />
          <Route element={[<StudentHomepage />]}
            path="/studentHomepage"
          />
          <Route element={[<StudentAttendance />]}
            path="/studentattendance"
          />
           <Route element={[<TeacherHomepage />]}
            path="/teacherHomepage"
          />
          <Route element={[<MarkAttendance />]}
            path="/markattendance"
          />
          <Route element={[<TeacherAttendance />]}
            path="/teacherattendance"
          />
          <Route element={[<Registration />]}
            path="/signup"
          />
          <Route element={[<ManagerDashboard />]}
            path="/manager"
          />
          <Route element={[<AllCourses />]}
            path="/manager/AllCourses"
          />
          <Route element={[<AddNewCourse />]}
            path="/manager/addNewCourse"
          />
          <Route element={[<EditCourse />]}
            path="/manager/editCourse/:courseId"
          />
          <Route element={[<TeacherDetails />]}
            path="/manager/TeacherDetails"
          />
          <Route element={[<StudentDetails />]}
            path="/manager/StudentDetails"
          />
          <Route element={[<ScheduleClasses />]}
            path="/manager/ScheduleClasses"
          />
          <Route element={[<StudentDashboard />]}
            path="/student"
          />
          <Route element={[<TeacherDashboard />]}
            path="/teacher"
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
