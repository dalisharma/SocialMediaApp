import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getUsers,
    getFollowing,
    followUser,
    unfollowUser
} from "../services/api";

export default function Friends() {

    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionUser, setActionUser] = useState(null);

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser
        ? JSON.parse(storedUser)
        : null;

    useEffect(() => {
        loadFriends();
    }, []);

    async function loadFriends() {
        try {
            setLoading(true);

            if (!currentUser?.id) {
                return;
            }

            const [usersData, followingData] = await Promise.all([
                getUsers(),
                getFollowing(currentUser.id)
            ]);

            setUsers(usersData || []);
            setFollowing(followingData || []);

        } catch (error) {
            console.error("Friends loading error:", error);
        } finally {
            setLoading(false);
        }
    }

    function isFollowing(userId) {
        return following.some(
            item => item.following?.id === userId
        );
    }

    async function handleFollow(userId) {

        if (!currentUser?.id) {
            alert("Please login first.");
            return;
        }

        try {
            setActionUser(userId);

            if (isFollowing(userId)) {

                await unfollowUser(
                    currentUser.id,
                    userId
                );

            } else {

                await followUser(
                    currentUser.id,
                    userId
                );
            }

            const updatedFollowing =
                await getFollowing(currentUser.id);

            setFollowing(updatedFollowing || []);

        } catch (error) {
            alert(error.message);
        } finally {
            setActionUser(null);
        }
    }

    const otherUsers = users.filter(
        user => user.id !== currentUser?.id
    );

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="friends-page">
                    <div className="friends-container">

                        <div className="friends-loading">
                            <div className="spinner-border text-primary"></div>
                            <p>Loading friends...</p>
                        </div>

                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="friends-page">

                <div className="friends-container">

                    <div className="friends-header">
                        <div>
                            <h2>Friends</h2>
                            <p>
                                Find people and connect with them.
                            </p>
                        </div>

                        <span className="friends-count">
                            {otherUsers.length} Users
                        </span>
                    </div>


                    {otherUsers.length === 0 ? (

                        <div className="no-friends">
                            <div className="no-friends-icon">
                                👥
                            </div>

                            <h4>No users found</h4>

                            <p>
                                There are no other users available.
                            </p>
                        </div>

                    ) : (

                        <div className="friends-grid">

                            {otherUsers.map(user => {

                                const followingStatus =
                                    isFollowing(user.id);

                                const processing =
                                    actionUser === user.id;

                                return (

                                    <div
                                        className="friend-card"
                                        key={user.id}
                                    >

                                        <Link
                                            to={`/profile/${user.id}`}
                                            className="friend-profile-link"
                                        >

                                            <div className="friend-avatar">

                                                {user.profileImage ? (

                                                    <img
                                                        src={
                                                            user.profileImage.startsWith("http")
                                                                ? user.profileImage
                                                                : `http://localhost:9091/uploads/images/${user.profileImage}`
                                                        }
                                                        alt={user.name}
                                                    />

                                                ) : (

                                                    user.name
                                                        ?.charAt(0)
                                                        .toUpperCase()

                                                )}

                                            </div>

                                            <h5>
                                                {user.name}
                                            </h5>

                                            <p>
                                                @{user.username}
                                            </p>

                                        </Link>


                                        <button
                                            className={
                                                followingStatus
                                                    ? "friend-follow-btn following"
                                                    : "friend-follow-btn"
                                            }
                                            onClick={() =>
                                                handleFollow(user.id)
                                            }
                                            disabled={processing}
                                        >

                                            {processing
                                                ? "Please wait..."
                                                : followingStatus
                                                    ? "Following"
                                                    : "Add Friend"
                                            }

                                        </button>

                                    </div>

                                );
                            })}

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}