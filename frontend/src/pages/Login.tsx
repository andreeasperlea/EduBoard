import { Button, TextField, Stack, Typography } from "@mui/material";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios";
import LoginImage from "../assets/Ryan Gillett.jpeg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.access_token);
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));

      navigate(payload.role === "student" ? "/student" : "/teacher");
    } catch {
      alert("Login failed");
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
          <TextField label="Email" name="email" onChange={handleChange} />
          <TextField
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "black",
              "&:hover": { background: "#333" },
              borderRadius: "20px",
              py: 1.2,
            }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center">
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "black", fontWeight: 600 }}>
              Sign up
            </a>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}
