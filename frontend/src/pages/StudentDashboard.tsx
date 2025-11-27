import StudentNavbar from "../components/StudentNavbar";
import useCurrentUser from "../hooks/useCurrentUser";

export default function StudentDashboard() {
  const user = useCurrentUser();
  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
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
          Welcome {user.full_name}
        </h1>

        <p
          style={{
            maxWidth: "480px",
            color: "#555",
            fontSize: "18px",
            lineHeight: "1.5",
          }}
        >
          Your dashboard is coming soon.  
          We're building a better experience to help you reach the top.
        </p>
      </div>
    </div>
  );
}
