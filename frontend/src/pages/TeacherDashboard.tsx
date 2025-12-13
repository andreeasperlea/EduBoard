import { useNavigate } from "react-router-dom"; 
import TeacherNavbar from "../components/TeacherNavbar";
import useCurrentUser from "../hooks/useCurrentUser";

export default function TeacherDashboard() {
  const user = useCurrentUser();
  const navigate = useNavigate(); 
  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <TeacherNavbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "80px auto",
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: 700,
            marginBottom: "20px",
            color: "#000",
            lineHeight: "1.2",
          }}
        >
          Welcome, {user.full_name}
        </h1>

        <p
          style={{
            maxWidth: "600px",
            color: "#555",
            fontSize: "18px",
            lineHeight: "1.5",
            marginBottom: "40px", 
          }}
        >
          You're logged in as a teacher.  
          Manage your classes, interact with students, and begin teaching using the integrated whiteboard.
        </p>

        {}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          {}
          <button
            onClick={() => navigate("/classes")}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              backgroundColor: "#007bff", // Blue color
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            📂 Manage Classes
          </button>

          {}
          <button
            onClick={() => navigate("/teacher/whiteboard")}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#333",
              backgroundColor: "#f0f0f0", 
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          >
            ✏️ Go to Whiteboards
          </button>

          <button
                    onClick={() => navigate("/ai-assistant")}
                    style={{
                        padding: "15px 30px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#fff",
                        backgroundColor: "#6f42c1", 
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                    }}
                    >
                    AI Assistant
        </button>

        </div>
        {}

      </div>
    </div>
  );
}