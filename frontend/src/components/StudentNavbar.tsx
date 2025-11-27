import useCurrentUser from "../hooks/useCurrentUser";

export default function StudentNavbar() {
  const user = useCurrentUser();
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
      {/* LEFT: logo + links */}
      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          EduBoard
        </h2>

        <div style={{ display: "flex", gap: "28px" }}>
          <a
            href="/student"
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: 500,
            }}
          >
            Home
          </a>
          <a
            href="/student/classes"
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: 500,
            }}
          >
            Classes
          </a>
        </div>
      </div>

      {/* RIGHT: name + logout */}
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
