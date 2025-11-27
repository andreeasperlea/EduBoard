import { Button, TextField, Stack, MenuItem, Typography } from "@mui/material";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios";
import RegisterImage from "../assets/_ (1).jpeg";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "student",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      window.location.href = "/";
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Bring Yourself To The Top"
      subtitle="Create your EduBoard account."
      image={RegisterImage}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="full_name"
            label="Full Name"
            onChange={handleChange}
          />
          <TextField name="email" label="Email" onChange={handleChange} />

          <TextField
            name="role"
            label="Role"
            select
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
          </TextField>

          <TextField
            name="password"
            label="Password"
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
            Register
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <a href="/" style={{ color: "black", fontWeight: 600 }}>
              Log in
            </a>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}
