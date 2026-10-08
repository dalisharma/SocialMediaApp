import React, { useEffect, useState } from "react";

import {
    likePost,
    unlikePost,
    checkLike,
    getLikeCount,
    deletePost
} from "../services/api";

import CommentBox from "./CommentBox";

export default function PostCard({ post, currentUser, onUpdate }) {

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const postId = post?.id;
    const userId = currentUser?.id;

    useEffect(() => {
        if (!postId || !userId) {
            return;
        }

        async function loadLikeData() {
            try {
                const likedStatus = await checkLike(userId, postId);
                const count = await getLikeCount(postId);

                setLiked(likedStatus);
                setLikeCount(count);
            } catch (error) {
                console.error("Like data error:", error);
            }
        }

        loadLikeData();
    }, [postId, userId]);

    async function handleLike() {
        if (!postId || !userId) {
            return;
        }

        try {
            setLoading(true);

            if (liked) {
                await unlikePost(userId, postId);
                setLiked(false);
                setLikeCount(prev => prev - 1);
            } else {
                await likePost(userId, postId);
                setLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!postId || !userId) {
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deletePost(postId, userId);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            alert(error.message);
        }
    }

    if (!postId) {
        return null;
    }

    return (
        <div className="post-card">

            <div className="post-header">

                <div>
                    <div className="post-user">
                        {post.user?.name || "User"}
                    </div>

                    <div className="post-username">
                        @{post.user?.username || ""}
                    </div>
                </div>

                {post.user?.id === userId && (
                    <button
                        className="delete-post-btn"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}

            </div>

            <div className="post-content">
                {post.content}
            </div>

            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="post-image"
                />
            )}

            <div className="post-actions">

                <button
                    onClick={handleLike}
                    disabled={loading}
                >
                    {liked ? "❤️" : "♡"} {likeCount}
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                >
                    💬 Comment
                </button>

            </div>

            {showComments && (
                <CommentBox
                    postId={postId}
                    currentUser={currentUser}
                />
            )}

        </div>
    );
}