import { useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import useCurrentUser from "../hooks/useCurrentUser";

export default function StudentDashboard() {
  const user = useCurrentUser();
  const navigate = useNavigate(); 
  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <StudentNavbar />

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
          Your dashboard is ready.  
          Access your enrolled classes and track your progress here.
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
              backgroundColor: "#28a745", 
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            My classes
          </button>

          {}
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
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            AI Assistant
          </button>
          
        </div>
      </div>
    </div>
  );
}