package org.smapp.socialmediaapp.service;

import org.smapp.socialmediaapp.dto.LikeResponseDTO;
import org.smapp.socialmediaapp.dto.UserResponseDTO;
import org.smapp.socialmediaapp.entity.Like;
import org.smapp.socialmediaapp.entity.Post;
import org.smapp.socialmediaapp.entity.User;
import org.smapp.socialmediaapp.repository.LikeRepository;
import org.smapp.socialmediaapp.repository.PostRepository;
import org.smapp.socialmediaapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;


    // LIKE POST
    public Like likePost(Long userId, Long postId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException(
                    "You already liked this post");
        }

        Like like = new Like();

        like.setUser(user);
        like.setPost(post);
        like.setCreatedAt(LocalDateTime.now());

        return likeRepository.save(like);
    }


    // CONVERT LIKE TO DTO
    public LikeResponseDTO convertToDTO(Like like) {

        User user = like.getUser();

        UserResponseDTO userDTO = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getBio(),
                user.getProfileImage(),
                user.getCreatedAt()
        );

        return new LikeResponseDTO(
                like.getId(),
                userDTO,
                like.getPost().getId(),
                like.getCreatedAt()
        );
    }


    // UNLIKE POST
    public String unlikePost(Long userId, Long postId) {

        Like like = likeRepository.findByUserIdAndPostId(
                userId,
                postId
        ).orElseThrow(() ->
                new RuntimeException(
                        "You have not liked this post"));

        likeRepository.delete(like);

        return "Post unliked successfully";
    }


    // GET LIKE COUNT
    public long getLikeCount(Long postId) {

        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }

        return likeRepository.countByPostId(postId);
    }


    // CHECK WHETHER USER LIKED POST
    public boolean isPostLiked(Long userId, Long postId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }

        return likeRepository.existsByUserIdAndPostId(
                userId,
                postId
        );
    }
}