import TeacherNavbar from "../components/TeacherNavbar";
import useCurrentUser from "../hooks/useCurrentUser";

export default function TeacherDashboard() {
  const user = useCurrentUser();
  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
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
          Welcome {user.full_name}
        </h1>

        <p
          style={{
            maxWidth: "500px",
            color: "#555",
            fontSize: "18px",
            lineHeight: "1.5",
          }}
        >
          You're logged in as a teacher.  
          Manage your classes, interact with students, and begin teaching using the integrated whiteboard.
        </p>
      </div>
    </div>
  );
}
