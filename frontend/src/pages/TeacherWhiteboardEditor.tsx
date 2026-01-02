import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TeacherNavbar from "../components/TeacherNavbar";
import type { Stroke, Whiteboard, Point } from "../types/whiteboard";

export default function TeacherWhiteboardEditor() {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sheets, setSheets] = useState<Stroke[][]>([[]]);
  const [currentSheetIdx, setCurrentSheetIdx] = useState(0);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [saving, setSaving] = useState(false);

  const currentStrokes = sheets[currentSheetIdx] || [];

  useEffect(() => {
    if (!id) return;
    api.get<Whiteboard>(`/whiteboards/${id}`)
      .then((res) => {
        if (res.data.sheets && res.data.sheets.length > 0) {
            setSheets(res.data.sheets);
        }
      })
      .catch(err => console.error("Error loading board:", err));
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawStroke = (stroke: Stroke) => {
      ctx.strokeStyle = stroke.erase ? "#ffffff" : stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    };
    currentStrokes.forEach(drawStroke);
    if (currentStroke) {
      drawStroke(currentStroke);
    }
  }, [sheets, currentSheetIdx, currentStroke]);

  const getXY = (e: React.MouseEvent | MouseEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const p = getXY(e);
    setCurrentStroke({
      points: [p],
      color,
      size: tool === "eraser" ? size * 5 : size,
      erase: tool === "eraser",
    });
  };

  const draw = (e: React.MouseEvent) => {
    if (!currentStroke) return;
    const p = getXY(e);
    currentStroke.points.push(p);
    setCurrentStroke({ ...currentStroke });
  };

  const endDrawing = () => {
    if (currentStroke) {
      const newSheets = [...sheets];
      newSheets[currentSheetIdx] = [...newSheets[currentSheetIdx], currentStroke];
      setSheets(newSheets);
      
      setRedoStack([]);
      setCurrentStroke(null);
    }
  };
  const undo = () => {
    if (currentStrokes.length === 0) return;
    const last = currentStrokes[currentStrokes.length - 1];
    
    const newSheets = [...sheets];
    newSheets[currentSheetIdx] = currentStrokes.slice(0, -1);
    
    setSheets(newSheets);
    setRedoStack((prev) => [...prev, last]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];

    const newSheets = [...sheets];
    newSheets[currentSheetIdx] = [...currentStrokes, last];
    
    setSheets(newSheets);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  
  const saveBoard = async () => {
    if (!id) return;
    setSaving(true);
    try {
        await api.post(`/whiteboards/${id}/save`, { sheets });
    } catch (e) {
        console.error(e);
    } finally {
        setSaving(false);
    }

  };

      const exportPNG = () => {

  const canvas = canvasRef.current;

  if (!canvas) return;

  const url = canvas.toDataURL("image/png");

  const link = document.createElement("a");

  link.href = url;

  link.download = "whiteboard.png";

  link.click();

  };
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(saveBoard, 5000);
    return () => clearInterval(interval);
  }, [sheets, id]);

  const addSheet = () => {
      setSheets([...sheets, []]);
      setCurrentSheetIdx(sheets.length); 
  };

  const nextSheet = () => {
      if (currentSheetIdx < sheets.length - 1) setCurrentSheetIdx(currentSheetIdx + 1);
  };

  const prevSheet = () => {
      if (currentSheetIdx > 0) setCurrentSheetIdx(currentSheetIdx - 1);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      <TeacherNavbar />

      <div style={{ flex: 1, display: "flex", padding: "20px", gap: "20px", background: "#f8f9fa" }}>
       
        <div style={{ width: "200px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", height: "fit-content" }}>
          <h3 style={{ marginTop: 0 }}>Tools</h3>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={() => setTool("pen")} style={tool === "pen" ? activeBtn : inactiveBtn}>✏️ Pen</button>
            <button onClick={() => setTool("eraser")} style={tool === "eraser" ? activeBtn : inactiveBtn}>🧹 Eraser</button>
          </div>

          <label>Color</label>
          <div style={{display:'flex', gap: 5, marginBottom: 20}}>
            {['#000000', '#E02424', '#1A56DB', '#0E9F6E'].map(c => (
                <div key={c} onClick={() => setColor(c)} 
                     style={{width: 25, height: 25, background: c, borderRadius: '50%', cursor:'pointer', border: color === c ? '2px solid #000' : 'none'}} />
            ))}
          </div>

          <label>Size: {size}px</label>
          <input placeholder="range..." type="range" min="1" max="20" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{width:'100%', marginBottom: 20}} />

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
             <button onClick={undo} style={inactiveBtn}>Undo</button>
             <button onClick={redo} style={inactiveBtn}>Redo</button>
          </div>

          <button onClick={saveBoard} style={{ ...activeBtn, background: saving ? "#999" : "#000", width: "100%" }}>
            {saving ? "Saving..." : "💾 Save"}
          </button>

          <button onClick={exportPNG} style={{ ...activeBtn, background: saving ? "#000" : "#999", width: "100%", marginTop: "5px" }}> Export PNG</button>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <div style={{ marginBottom: "15px", background: "white", padding: "10px 20px", borderRadius: "50px", display: "flex", gap: "15px", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <button onClick={prevSheet} disabled={currentSheetIdx === 0} style={navBtn}>◀</button>
                <span style={{ fontWeight: "bold" }}>Sheet {currentSheetIdx + 1} / {sheets.length}</span>
                <button onClick={nextSheet} disabled={currentSheetIdx === sheets.length - 1} style={navBtn}>▶</button>
                <div style={{width: 1, height: 20, background: '#ddd', margin: '0 5px'}}></div>
                <button onClick={addSheet} style={{...navBtn, color: '#1A56DB'}}>+ New Sheet</button>
            </div>

            <div style={{ border: "1px solid #ccc", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", background: "white" }}>
                <canvas
                    ref={canvasRef}
                    width={1000}
                    height={600}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    style={{ cursor: tool === "eraser" ? "not-allowed" : "crosshair", display: "block" }}
                />
            </div>
        </div>
      </div>
    </div>
  );
}

const activeBtn = { padding: "8px 12px", background: "black", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const inactiveBtn = { padding: "8px 12px", background: "#eee", color: "black", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" };
const navBtn = { background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" as "bold" };