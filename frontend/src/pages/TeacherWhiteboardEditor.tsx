import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TeacherNavbar from "../components/TeacherNavbar";
import type { Stroke, Whiteboard, Point } from "../types/whiteboard";

export default function TeacherWhiteboardEditor() {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [saving, setSaving] = useState(false);
 
  useEffect(() => {
    if (!id) return;
    
    // FIX: URL plural
    api.get<Whiteboard>(`/whiteboards/${id}`)
      .then((res) => {
        // Dacă există desene salvate, le punem pe tablă
        setStrokes(res.data.strokes ?? []);
      })
      .catch(err => console.error("Eroare la încărcarea tablei:", err));
  }, [id]);

 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    strokes.forEach(drawStroke);

    if (currentStroke) {
      drawStroke(currentStroke);
    }
  }, [strokes, currentStroke]);

  const getXY = (e: MouseEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = getXY(e.nativeEvent);
    setCurrentStroke({
      points: [p],
      color,
      size: tool === "eraser" ? size * 5 : size,
      erase: tool === "eraser",
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentStroke) return;
    const p = getXY(e.nativeEvent);
    currentStroke.points.push(p);
    setCurrentStroke({ ...currentStroke }); 
  };

  const endDrawing = () => {
    if (currentStroke) {
      setStrokes((prev) => [...prev, currentStroke]);
      setRedoStack([]);
      setCurrentStroke(null);
    }
  };

  const undo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const lastStroke = prev[prev.length - 1];
      setRedoStack((r) => [...r, lastStroke]);
      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setStrokes((s) => [...s, last]);
      return prev.slice(0, -1);
    });
  };

 
  const saveBoard = async () => {
    if (!id) return;
    setSaving(true);
    try {
        
        await api.post(`/whiteboards/${id}/save`, { strokes });
       
    } catch (e) {
        alert("Eroare la salvare!");
    } finally {
        setSaving(false);
    }
  };

  useEffect(() => {
    if (!id || strokes.length === 0) return;
    const interval = setInterval(() => {
      saveBoard();
    }, 5000);
    return () => clearInterval(interval);
  }, [strokes, id]);


  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "whiteboard.png";
    link.click();
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <TeacherNavbar />

      <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
        {}
        <div style={{ width: "160px" }}>
          <h3 style={{ marginBottom: "10px" }}>Tools</h3>

          <div style={{marginBottom: 20}}>
            <button onClick={() => setTool("pen")} style={tool === "pen" ? activeBtn : inactiveBtn}>Pen</button>
            <button onClick={() => setTool("eraser")} style={tool === "eraser" ? activeBtn : inactiveBtn}>Eraser</button>
          </div>

          <label>Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} disabled={tool==="eraser"} />
          
          <br /><br />
          <label>Size: {size}px</label>
          <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} />

          <br /><br />
          <button onClick={undo} style={inactiveBtn}>Undo</button>
          <button onClick={redo} disabled={redoStack.length===0} style={inactiveBtn}>Redo</button>

          <div style={{marginTop: "30px", borderTop: "1px solid #ccc", paddingTop: "20px"}}>
             <button onClick={saveBoard} style={{...activeBtn, background: saving ? "#ccc" : "#28a745"}}>
                {saving ? "Saving..." : "💾 Save Board"}
             </button>
             <button onClick={exportPNG} style={inactiveBtn}>🖼️ Export PNG</button>
          </div>
        </div>

        {}
        <div style={{position: 'relative', border: "1px solid #ccc", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"}}>
            <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            style={{
                background: "white",
                cursor: tool === "eraser" ? "not-allowed" : "crosshair",
                display: "block"
            }}
            />
        </div>
      </div>
    </div>
  );
}

const activeBtn: React.CSSProperties = {
  width: "100%", padding: "8px", background: "black", color: "white", borderRadius: "6px", border: "none", cursor: "pointer", marginBottom: "6px",
};
const inactiveBtn: React.CSSProperties = {
  width: "100%", padding: "8px", background: "#f0f0f0", color: "black", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer", marginBottom: "6px",
};