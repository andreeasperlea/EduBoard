import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Whiteboard } from "../types/whiteboard";
import TeacherNavbar from "../components/TeacherNavbar";

export default function TeacherWhiteboardList() {
  const [boards, setBoards] = useState<Whiteboard[]>([]);
  const [name, setName] = useState("");
  const navigate = useNavigate(); 

  // Load whiteboards
  useEffect(() => {
   
    api.get<Whiteboard[]>("/whiteboards").then((res) => setBoards(res.data));
  }, []);

  // Create
  const createBoard = async () => {
    if (!name.trim()) {
      alert("Please enter a whiteboard name.");
      return;
    }

    try {
      const { data } = await api.post<Whiteboard>("/whiteboards", {
        name,
      });
  
      navigate(`/teacher/whiteboard/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Could not create whiteboard.");
    }
  };

  const deleteBoard = async (id: string) => {
    const confirmDelete = confirm("Delete this whiteboard?");
    if (!confirmDelete) return;

    try {
     
      await api.delete(`/whiteboards/${id}`);
      setBoards((prev) => prev.filter((b) => b.id !== id)); 
    } catch (err) {
      console.error(err);
      alert("Could not delete whiteboard.");
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <TeacherNavbar />

      <div style={{ maxWidth: "900px", margin: "60px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
          Your Whiteboards
        </h1>

        {}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="Whiteboard name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              flex: 1,
            }}
          />
          <button
            onClick={createBoard}
            style={{
              background: "black",
              color: "white",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </div>

        {}
        {boards.length === 0 && <p>No whiteboards yet. Create one!</p>}
        
        {boards.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div
              onClick={() => navigate(`/teacher/whiteboard/${b.id}`)}
              style={{ cursor: "pointer", fontSize: "16px", fontWeight: "500" }}
            >
              📂 {b.name}
            </div>

            <button
              onClick={() => deleteBoard(b.id)}
              style={{
                background: "#ff3b30",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}