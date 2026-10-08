import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getUser,
    getFollowers,
    getFollowing,
    getPosts,
    followUser,
    unfollowUser
} from "../services/api";

const IMAGE_BASE_URL = "http://localhost:9091/uploads/images/";

export default function Profile() {

    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);

    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);

    const storedUser = localStorage.getItem("user");
    const loggedInUser = storedUser
        ? JSON.parse(storedUser)
        : null;

    useEffect(() => {
        loadProfile();
    }, [id]);

    async function loadProfile() {

        try {

            setLoading(true);

            const userData = await getUser(id);
            const followerData = await getFollowers(id);
            const followingData = await getFollowing(id);
            const allPosts = await getPosts();

            setUser(userData);
            setFollowers(followerData || []);
            setFollowing(followingData || []);

            const userPosts = (allPosts || []).filter(
                post => post.user?.id === Number(id)
            );

            setPosts(userPosts);

            if (loggedInUser) {

                const alreadyFollowing = (followerData || []).some(
                    item =>
                        item.follower?.id === loggedInUser.id
                );

                setIsFollowing(alreadyFollowing);
            }

        } catch (error) {

            console.error("Profile loading error:", error);

        } finally {

            setLoading(false);

        }
    }

    async function handleFollow() {

        if (!loggedInUser) {
            alert("Please login first.");
            return;
        }

        if (loggedInUser.id === Number(id)) {
            return;
        }

        try {

            setFollowLoading(true);

            if (isFollowing) {

                await unfollowUser(
                    loggedInUser.id,
                    Number(id)
                );

                setIsFollowing(false);

                setFollowers(prev =>
                    prev.filter(
                        item =>
                            item.follower?.id !== loggedInUser.id
                    )
                );

            } else {

                await followUser(
                    loggedInUser.id,
                    Number(id)
                );

                setIsFollowing(true);

                const updatedFollowers =
                    await getFollowers(id);

                setFollowers(updatedFollowers || []);
            }

        } catch (error) {

            alert(error.message);

        } finally {

            setFollowLoading(false);

        }
    }

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="profile-loading">
                    <div className="spinner-border"></div>
                    <p>Loading profile...</p>
                </div>
            </>
        );
    }

    if (!user) {

        return (
            <>
                <Navbar />

                <div className="profile-not-found">

                    <h3>User not found</h3>

                    <Link
                        to="/home"
                        className="btn btn-dark mt-3"
                    >
                        Back to Home
                    </Link>

                </div>
            </>
        );
    }

    const isOwnProfile =
        loggedInUser?.id === Number(id);

    return (
        <>
            <Navbar />

            <div className="profile-page">

                <div className="profile-container">

                    {/* PROFILE TOP */}

                    <div className="profile-top">

                        {/* PROFILE IMAGE */}

                        <div className="profile-avatar">

                            {user.profileImage ? (

                                <img
                                    src={
                                        user.profileImage.startsWith("http")
                                            ? user.profileImage
                                            : IMAGE_BASE_URL + user.profileImage
                                    }
                                    alt={user.name}
                                />

                            ) : (

                                user.name
                                    ?.charAt(0)
                                    .toUpperCase()

                            )}

                        </div>


                        {/* PROFILE DETAILS */}

                        <div className="profile-details">

                            <div className="profile-name-row">

                                <h2>
                                    {user.username}
                                </h2>

                                {!isOwnProfile && (

                                    <button
                                        className={
                                            isFollowing
                                                ? "profile-follow-btn following"
                                                : "profile-follow-btn"
                                        }
                                        onClick={handleFollow}
                                        disabled={followLoading}
                                    >
                                        {followLoading
                                            ? "Please wait..."
                                            : isFollowing
                                                ? "Following"
                                                : "Follow"
                                        }
                                    </button>

                                )}

                            </div>


                            {/* STATS */}

                            <div className="profile-stats">

                                <div className="profile-stat">
                                    <strong>
                                        {posts.length}
                                    </strong>
                                    <span>posts</span>
                                </div>

                                <div className="profile-stat">
                                    <strong>
                                        {followers.length}
                                    </strong>
                                    <span>followers</span>
                                </div>

                                <div className="profile-stat">
                                    <strong>
                                        {following.length}
                                    </strong>
                                    <span>following</span>
                                </div>

                            </div>


                            {/* NAME + BIO */}

                            <div className="profile-about">

                                <strong>
                                    {user.name}
                                </strong>

                                <p>
                                    {user.bio ||
                                        "No bio available."}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* FOLLOWERS */}

                    <div className="profile-social-section">

                        <div className="profile-section-heading">

                            <h4>Followers</h4>

                            <span>
                                {followers.length}
                            </span>

                        </div>

                        {followers.length === 0 ? (

                            <p className="profile-empty-text">
                                No followers yet.
                            </p>

                        ) : (

                            <div className="profile-user-list">

                                {followers.slice(0, 5).map(
                                    item => (

                                        <Link
                                            to={`/profile/${item.follower.id}`}
                                            className="profile-user"
                                            key={item.id}
                                        >

                                            <div className="profile-small-avatar">

                                                {item.follower.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <strong>
                                                {item.follower.username}
                                            </strong>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* FOLLOWING */}

                    <div className="profile-social-section">

                        <div className="profile-section-heading">

                            <h4>Following</h4>

                            <span>
                                {following.length}
                            </span>

                        </div>

                        {following.length === 0 ? (

                            <p className="profile-empty-text">
                                Not following anyone yet.
                            </p>

                        ) : (

                            <div className="profile-user-list">

                                {following.slice(0, 5).map(
                                    item => (

                                        <Link
                                            to={`/profile/${item.following.id}`}
                                            className="profile-user"
                                            key={item.id}
                                        >

                                            <div className="profile-small-avatar">

                                                {item.following.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <strong>
                                                {item.following.username}
                                            </strong>

                                        </Link>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* POSTS */}

                    <div className="profile-post-section">

                        <div className="profile-post-heading">

                            <span>▦</span>

                            <h4>Posts</h4>

                        </div>


                        {posts.length === 0 ? (

                            <div className="profile-no-posts">

                                <div>
                                    📷
                                </div>

                                <h5>
                                    No posts yet
                                </h5>

                                <p>
                                    When {user.username} shares
                                    photos, they will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="profile-grid">

                                {posts.map(post => (

                                    <div
                                        className="profile-grid-post"
                                        key={post.id}
                                    >

                                        {post.image ? (

                                            <img
                                                src={
                                                    post.image.startsWith("http")
                                                        ? post.image
                                                        : IMAGE_BASE_URL + post.image
                                                }
                                                alt="Post"
                                            />

                                        ) : (

                                            <div className="profile-grid-text">
                                                {post.content}
                                            </div>

                                        )}

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </>
    );
}