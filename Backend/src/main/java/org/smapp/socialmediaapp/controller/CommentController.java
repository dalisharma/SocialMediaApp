package org.smapp.socialmediaapp.controller;

import jakarta.validation.Valid;
import org.smapp.socialmediaapp.dto.CommentResponseDTO;
import org.smapp.socialmediaapp.entity.Comment;
import org.smapp.socialmediaapp.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;


    // ADD COMMENT
    @PostMapping("/user/{userId}/post/{postId}")
    public CommentResponseDTO addComment(
            @PathVariable Long userId,
            @PathVariable Long postId,
            @Valid @RequestBody Comment comment) {

        return commentService.convertToDTO(
                commentService.addComment(userId, postId, comment)
        );
    }


    // GET ALL COMMENTS OF A POST
    @GetMapping("/post/{postId}")
    public List<CommentResponseDTO> getCommentsByPost(
            @PathVariable Long postId) {

        return commentService.getCommentsByPost(postId)
                .stream()
                .map(commentService::convertToDTO)
                .toList();
    }


    // GET COMMENT BY ID
    @GetMapping("/{id}")
    public CommentResponseDTO getCommentById(
            @PathVariable Long id) {

        return commentService.convertToDTO(
                commentService.getCommentById(id)
        );
    }


    // UPDATE COMMENT
    @PutMapping("/{commentId}/user/{userId}")
    public CommentResponseDTO updateComment(
            @PathVariable Long commentId,
            @PathVariable Long userId,
            @Valid @RequestBody Comment comment) {

        return commentService.convertToDTO(
                commentService.updateComment(
                        commentId,
                        userId,
                        comment
                )
        );
    }


    // DELETE COMMENT
    @DeleteMapping("/{commentId}/user/{userId}")
    public String deleteComment(
            @PathVariable Long commentId,
            @PathVariable Long userId) {

        return commentService.deleteComment(
                commentId,
                userId
        );
    }
}