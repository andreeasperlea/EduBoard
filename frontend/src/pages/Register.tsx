import { Button, TextField, Stack, MenuItem, Typography, Alert, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios";
import RegisterImage from "../assets/_ (1).jpeg"; 

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "", 
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const validateForm = () => {
    if (!form.full_name.trim().includes(" ")) {
      return "Please enter your full name (First & Last Name).";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
     if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
    
      const { confirmPassword, ...payload } = form;

      await api.post("/auth/register", payload);
      
      alert("Account created successfully! Please log in.");
      navigate("/login"); 

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
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
          
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            name="full_name"
            label="Full Name"
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField 
            name="email" 
            label="Email Address" 
            type="email"
            onChange={handleChange} 
            required
            fullWidth
          />

          <TextField
            name="role"
            label="I am a..."
            select
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
          </TextField>

          <TextField
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            required
            fullWidth
            helperText="Min. 6 characters"
          />

          {}
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "black",
              "&:hover": { background: "#333" },
              borderRadius: "20px",
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '16px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "black", fontWeight: 700, textDecoration: 'none' }}>
              Log in
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
}