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

  /* ----------------------------------
     Load Initial Board
  ---------------------------------- */
  useEffect(() => {
    if (!id) return;

    api.get<Whiteboard>(`/whiteboard/${id}`).then((res) => {
      setStrokes(res.data.strokes ?? []);
    });
  }, [id]);

  /* ----------------------------------
     Draw everything
  ---------------------------------- */
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

    // Draw saved strokes
    strokes.forEach(drawStroke);

    // Draw the current stroke live
    if (currentStroke) {
      drawStroke(currentStroke);
    }

  }, [strokes, currentStroke]);

  /* ----------------------------------
     Helpers
  ---------------------------------- */
  const getXY = (e: MouseEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  /* ----------------------------------
     Mouse Events
  ---------------------------------- */
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

    // smooth strokes a bit
    const previous = currentStroke.points[currentStroke.points.length - 1];
    const dist = Math.hypot(p.x - previous.x, p.y - previous.y);

    if (dist > 1) {
      currentStroke.points.push(p);
      setCurrentStroke({ ...currentStroke });
    }
  };

  const endDrawing = () => {
    if (currentStroke) {
      setStrokes((prev) => [...prev, currentStroke]);
      setRedoStack([]); // clear redo stack
      setCurrentStroke(null);
    }
  };

  /* ----------------------------------
     Undo / Redo
  ---------------------------------- */
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

  /* ----------------------------------
     Save to backend
  ---------------------------------- */
  const saveBoard = async () => {
    if (!id) return;
    await api.post(`/whiteboard/${id}/save`, { strokes });
    alert("Saved!");
  };

  /* ----------------------------------
     Auto-save (every 8s)
  ---------------------------------- */
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      api.post(`/whiteboard/${id}/save`, { strokes });
    }, 8000);

    return () => clearInterval(interval);
  }, [strokes, id]);

  /* ----------------------------------
     Export as PNG
  ---------------------------------- */
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "whiteboard.png";
    link.click();
  };

  /* ----------------------------------
     UI + Canvas
  ---------------------------------- */
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <TeacherNavbar />

      <div style={{ display: "flex", padding: "20px", gap: "20px" }}>

        {/* Toolbar */}
        <div style={{ width: "160px" }}>
          <h3 style={{ marginBottom: "10px" }}>Tools</h3>

          <button
            onClick={() => setTool("pen")}
            style={tool === "pen" ? activeBtn : inactiveBtn}
          >
            Pen
          </button>

          <button
            onClick={() => setTool("eraser")}
            style={tool === "eraser" ? activeBtn : inactiveBtn}
          >
            Eraser
          </button>

          <br /><br />

          <label>Color</label>
          <input
            type="color"
            value={color}
            disabled={tool === "eraser"}
            onChange={(e) => setColor(e.target.value)}
          />
          <br /><br />

          <label>Size</label>
          <input
            type="range"
            min={1}
            max={20}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />

          <br /><br />

          <button onClick={undo} style={inactiveBtn}>Undo</button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            style={inactiveBtn}
            >
            Redo
            </button>


          <br /><br />

          <button onClick={saveBoard} style={activeBtn}>Save</button>

          <br /><br />

          <button onClick={exportPNG} style={inactiveBtn}>Export PNG</button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          style={{
            border: "1px solid #ccc",
            background: "white",
            cursor: tool === "eraser" ? "not-allowed" : "crosshair",
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------
   Style Helpers
------------------------------ */

const activeBtn: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  background: "black",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginBottom: "6px",
};

const inactiveBtn: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  background: "#f0f0f0",
  color: "black",
  borderRadius: "6px",
  border: "1px solid #ddd",
  cursor: "pointer",
  marginBottom: "6px",
};
