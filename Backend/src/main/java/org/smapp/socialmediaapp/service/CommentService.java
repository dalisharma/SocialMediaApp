package org.smapp.socialmediaapp.service;

import org.smapp.socialmediaapp.dto.CommentResponseDTO;
import org.smapp.socialmediaapp.dto.UserResponseDTO;
import org.smapp.socialmediaapp.entity.Comment;
import org.smapp.socialmediaapp.entity.Post;
import org.smapp.socialmediaapp.entity.User;
import org.smapp.socialmediaapp.repository.CommentRepository;
import org.smapp.socialmediaapp.repository.PostRepository;
import org.smapp.socialmediaapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;


    // ADD COMMENT
    public Comment addComment(Long userId, Long postId, Comment comment) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        if (comment.getContent() == null ||
                comment.getContent().trim().isEmpty()) {

            throw new RuntimeException(
                    "Comment cannot be empty");
        }

        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }


    // CONVERT COMMENT TO DTO
    public CommentResponseDTO convertToDTO(Comment comment) {

        User user = comment.getUser();

        UserResponseDTO userDTO = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getBio(),
                user.getProfileImage(),
                user.getCreatedAt()
        );

        return new CommentResponseDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                userDTO
        );
    }


    // GET COMMENTS OF A POST
    public List<Comment> getCommentsByPost(Long postId) {

        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }

        return commentRepository
                .findByPostIdOrderByCreatedAtAsc(postId);
    }


    // GET COMMENT BY ID
    public Comment getCommentById(Long id) {

        return commentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Comment not found"));
    }


    // UPDATE COMMENT
    public Comment updateComment(
            Long commentId,
            Long userId,
            Comment updatedComment) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() ->
                        new RuntimeException("Comment not found"));

        // Check comment owner
        if (!comment.getUser().getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to update this comment");
        }

        if (updatedComment.getContent() == null ||
                updatedComment.getContent().trim().isEmpty()) {

            throw new RuntimeException(
                    "Comment cannot be empty");
        }

        comment.setContent(updatedComment.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }


    // DELETE COMMENT
    public String deleteComment(Long commentId, Long userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() ->
                        new RuntimeException("Comment not found"));

        // Check comment owner
        if (!comment.getUser().getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);

        return "Comment deleted successfully";
    }
}