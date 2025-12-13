import { Button, TextField, Stack, Typography, Alert, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; 
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios";
import LoginImage from "../assets/Ryan Gillett.jpeg"; 

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.access_token);

      // Decodăm token-ul pentru a afla rolul (Metoda rapidă pe care o aveai)
      // Folosim try/catch aici pentru siguranță în caz de caractere speciale
      try {
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        navigate(payload.role === "student" ? "/student" : "/teacher");
      } catch (e) {
        // Fallback: Dacă decodarea eșuează, facem request la /me
        const meRes = await api.get("/auth/me", {
             headers: { Authorization: `Bearer ${data.access_token}` }
        });
        if (meRes.data.role === "teacher") navigate("/teacher");
        else navigate("/student");
      }

    } catch (err: any) {
      // Afișăm eroarea specifică din backend
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail); // Ex: "Incorrect email or password"
      } else {
        setError("Login failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bring Yourself To The Top"
      subtitle="Log in to continue into your dashboard."
      image={LoginImage}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          
          {}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField 
            label="Email" 
            name="email" 
            onChange={handleChange} 
            required 
            error={!!error} // Se înroșește inputul dacă e eroare
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
            error={!!error}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "black",
              "&:hover": { background: "#333" },
              borderRadius: "20px",
              py: 1.2,
              minHeight: "45px" // Previne schimbarea dimensiunii când apare loaderul
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" align="center">
            Don’t have an account?{" "}
            {}
            <Link to="/register" style={{ color: "black", fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}