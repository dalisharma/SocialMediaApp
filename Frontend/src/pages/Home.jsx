import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/api";

const IMAGE_BASE_URL = "http://localhost:9091/uploads/images/";

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            if (!parsedUser || !parsedUser.id) {
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setUser(parsedUser);
        } catch (error) {
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await getPosts();
                setPosts(data || []);
            } catch (error) {
                console.error("Failed to load posts:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    function refreshPosts() {
        getPosts()
            .then(data => setPosts(data || []))
            .catch(error => console.error("Failed to refresh posts:", error));
    }

    if (!user) return null;

    return (
        <>
            <Navbar />

            <div className="home-page">
                <div className="home-container">

                    <div className="welcome-card">
                        <div>
                            <h2>Welcome, {user.name} 👋</h2>
                            <p>Share your thoughts with the community.</p>
                        </div>
                    </div>

                    <div className="feed-heading">
                        <h2>Latest Posts</h2>
                        <span>
                            {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                        </span>
                    </div>

                    {loading ? (
                        <div className="loading-card">
                            <div className="loading-spinner"></div>
                            <p>Loading posts...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="empty-feed">
                            <div className="empty-icon">📝</div>
                            <h3>No posts yet</h3>
                            <p>Be the first person to share something!</p>
                        </div>
                    ) : (
                        <div className="posts-feed">
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={{
                                        ...post,
                                        image: post.image
                                            ? IMAGE_BASE_URL + post.image
                                            : ""
                                    }}
                                    currentUser={user}
                                    onUpdate={refreshPosts}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}