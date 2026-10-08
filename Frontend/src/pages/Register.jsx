import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        bio: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function validateForm() {
        const name = formData.name.trim();
        const username = formData.username.trim();
        const email = formData.email.trim();
        const password = formData.password;

        if (!name) {
            return "Name is required.";
        }

        if (name.length < 2 || name.length > 50) {
            return "Name must be between 2 and 50 characters.";
        }

        if (!/^[A-Za-z ]+$/.test(name)) {
            return "Name can contain only letters and spaces.";
        }

        if (!username) {
            return "Username is required.";
        }

        if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) {
            return "Username must be 3-30 characters and contain only letters, numbers and underscore.";
        }

        if (!email) {
            return "Email is required.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Please enter a valid email address.";
        }

        if (!password) {
            return "Password is required.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (password.length > 100) {
            return "Password cannot exceed 100 characters.";
        }

        if (formData.bio.length > 500) {
            return "Bio cannot exceed 500 characters.";
        }

        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await registerUser({
                ...formData,
                name: formData.name.trim(),
                username: formData.username.trim(),
                email: formData.email.trim()
            });

            setMessage("Registration successful! Please login.");

            setFormData({
                name: "",
                username: "",
                email: "",
                password: "",
                bio: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-box">

                <h1>Create Account</h1>

                <p className="subtitle">
                    Join our social media community
                </p>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={50}
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        maxLength={30}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        maxLength={100}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        maxLength={100}
                    />

                    <textarea
                        name="bio"
                        placeholder="Bio (optional)"
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength={500}
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}