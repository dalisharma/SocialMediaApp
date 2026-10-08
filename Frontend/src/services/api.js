const BASE_URL = "http://localhost:9091/api";

async function request(url, options = {}) {
    const response = await fetch(BASE_URL + url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
    }

    return data;
}


// USER

export const registerUser = (data) =>
    request("/users/register", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const loginUser = (data) =>
    request("/users/login", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getUser = (id) =>
    request(`/users/${id}`);

export const getUsers = () =>
    request("/users");

// POSTS

export const getPosts = () =>
    request("/posts");

export const createPost = (userId, content, image) => {
    const formData = new FormData();

    formData.append("content", content);

    if (image) {
        formData.append("image", image);
    }

    return fetch(`${BASE_URL}/posts/user/${userId}`, {
        method: "POST",
        body: formData
    }).then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Something went wrong");
        }

        return data;
    });
};

export const updatePost = (postId, userId, data) =>
    request(`/posts/${postId}/user/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deletePost = (postId, userId) =>
    request(`/posts/${postId}/user/${userId}`, {
        method: "DELETE"
    });


// COMMENTS

export const getComments = (postId) =>
    request(`/comments/post/${postId}`);

export const addComment = (userId, postId, data) =>
    request(`/comments/user/${userId}/post/${postId}`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const deleteComment = (commentId, userId) =>
    request(`/comments/${commentId}/user/${userId}`, {
        method: "DELETE"
    });


// LIKES

export const likePost = (userId, postId) =>
    request(`/likes/user/${userId}/post/${postId}`, {
        method: "POST"
    });

export const unlikePost = (userId, postId) =>
    request(`/likes/user/${userId}/post/${postId}`, {
        method: "DELETE"
    });

export const getLikeCount = (postId) =>
    request(`/likes/count/${postId}`);

export const checkLike = (userId, postId) =>
    request(`/likes/check/${userId}/${postId}`);


// FOLLOW

export const followUser = (followerId, followingId) =>
    request(`/follows/flw/${followerId}/flwg/${followingId}`, {
        method: "POST"
    });

export const unfollowUser = (followerId, followingId) =>
    request(`/follows/flw/${followerId}/flwg/${followingId}`, {
        method: "DELETE"
    });

export const getFollowers = (userId) =>
    request(`/follows/followers/${userId}`);

export const getFollowing = (userId) =>
    request(`/follows/following/${userId}`);