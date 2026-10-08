
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createPost } from "../services/api";

export default function CreatePost() {
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [posting, setPosting] = useState(false);

    if (!user) {
        navigate("/login");
        return null;
    }

    function handleImageChange(e) {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Image size should be less than 10 MB.");
            e.target.value = "";
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    function removeImage() {
        setImage(null);
        setPreview("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent && !image) {
            alert("Please write something or select an image.");
            return;
        }

        if (trimmedContent.length > 5000) {
            alert("Post content cannot exceed 5000 characters.");
            return;
        }

        if (!user?.id) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        try {
            setPosting(true);

            await createPost(
                user.id,
                trimmedContent,
                image
            );

            alert("Post created successfully!");

            setContent("");
            setImage(null);
            setPreview("");

            navigate("/home");
        } catch (error) {
            alert(error.message);
        } finally {
            setPosting(false);
        }
    }

    return (
        <>
            <Navbar />

            <div className="create-page">
                <div className="create-post-page-card">

                    <h2>Create Post</h2>

                    <p className="create-post-subtitle">
                        Share something with your community
                    </p>

                    <form onSubmit={handleSubmit}>

                        <textarea
                            className="post-textarea"
                            placeholder="What's on your mind?"
                            value={content}
                            maxLength={5000}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {preview && (
                            <div className="image-preview">
                                <img
                                    src={preview}
                                    alt="Preview"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="remove-image-btn"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <div className="create-page-options">

                            <label className="image-upload-btn">
                                📷 Add Photo

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </label>

                            <span>
                                {content.length}/5000
                            </span>

                        </div>

                        <button
                            type="submit"
                            className="post-button create-submit-btn"
                            disabled={posting}
                        >
                            {posting ? "Posting..." : "Create Post"}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}
