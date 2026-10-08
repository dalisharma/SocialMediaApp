import React, { useEffect, useState } from "react";
import {
    getComments,
    addComment,
    deleteComment
} from "../services/api";

export default function CommentBox({ postId, currentUser }) {

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadComments() {
        try {
            const data = await getComments(postId);
            setComments(data || []);
        } catch (error) {
            console.error("Comment loading error:", error);
        }
    }

    useEffect(() => {
        if (postId) {
            loadComments();
        }
    }, [postId]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        if (!currentUser?.id) {
            alert("Please login first");
            return;
        }

        try {
            setLoading(true);

            await addComment(
                currentUser.id,
                postId,
                {
                    content: content.trim()
                }
            );

            setContent("");

            await loadComments();

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(commentId) {
        try {
            await deleteComment(
                commentId,
                currentUser.id
            );

            await loadComments();

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="comment-box">

            <form onSubmit={handleSubmit} className="comment-form">

                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Comment"}
                </button>

            </form>

            <div className="comments-list">

                {comments.length === 0 ? (
                    <p className="no-comments">
                        No comments yet.
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            className="comment-item"
                            key={comment.id}
                        >

                            <div className="comment-content">

                                <strong>
                                    {comment.user?.name || "User"}
                                </strong>

                                <span>
                                    @{comment.user?.username || ""}
                                </span>

                                <p>
                                    {comment.content}
                                </p>

                            </div>

                            {comment.user?.id === currentUser?.id && (
                                <button
                                    className="delete-comment-btn"
                                    onClick={() => handleDelete(comment.id)}
                                >
                                    Delete
                                </button>
                            )}

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}