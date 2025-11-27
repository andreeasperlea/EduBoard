import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherWhiteboardEditor from "./pages/TeacherWhiteboardEditor";
import TeacherWhiteboardList from "./pages/TeacherWhiteboardList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/whiteboard"
          element={
            <ProtectedRoute>
              <TeacherWhiteboardList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/whiteboard/:id"
          element={
            <ProtectedRoute>
              <TeacherWhiteboardEditor />
    </ProtectedRoute>
  }/>
      </Routes>
      
    </BrowserRouter>
  );
}
