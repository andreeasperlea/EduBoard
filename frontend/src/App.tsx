import { useState, useEffect } from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherWhiteboardEditor from "./pages/TeacherWhiteboardEditor";
import TeacherWhiteboardList from "./pages/TeacherWhiteboardList";
import Classes from "./pages/Classes"; 
import ClassDetails from "./pages/ClassDetails";
import AIAssistant from "./pages/AIAssistant";
import LandingPage from "./pages/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
export default function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {}
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
          }
        />

        {}
        <Route 
          path="/classes" 
          element={
            <ProtectedRoute>
              <Classes />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/classes/:id" 
          element={
            <ProtectedRoute>
              <ClassDetails />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ai-assistant" 
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </BrowserRouter>
  );
}