import { Link, useNavigate } from "react-router-dom"; 
import useCurrentUser from "../hooks/useCurrentUser";

export default function TeacherNavbar() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#000",
    fontWeight: 500,
    cursor: "pointer"
  };

  return (
    <nav
      style={{
        width: "100%",
        background: "white",
        color: "black",
        padding: "18px 80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {}
      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>
          EduBoard
        </h2>

        <div style={{ display: "flex", gap: "28px" }}>
          <Link to="/teacher" style={linkStyle}>
            Home
          </Link>
          
          {}
          <Link to="/classes" style={linkStyle}>
            Classes
          </Link>
          
          <Link to="/teacher/whiteboard" style={linkStyle}>
            Whiteboards
          </Link>

          {}
          <Link to="/ai-assistant" style={{...linkStyle, color: "#6f42c1", fontWeight: 700}}>
            AI Assistant
          </Link>
        </div>
      </div>

      {}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <span style={{ fontWeight: 500, fontSize: "14px" }}>
          {user.full_name}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "black",
            color: "white",
            padding: "8px 20px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "14px",
            boxShadow: "0 0 0 1px #000 inset",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}