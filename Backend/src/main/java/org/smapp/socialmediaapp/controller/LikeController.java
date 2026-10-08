package org.smapp.socialmediaapp.controller;

import org.smapp.socialmediaapp.dto.LikeResponseDTO;
import org.smapp.socialmediaapp.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeService likeService;


    // LIKE
    @PostMapping("/user/{userId}/post/{postId}")
    public LikeResponseDTO likePost(
            @PathVariable Long userId,
            @PathVariable Long postId) {

        return likeService.convertToDTO(
                likeService.likePost(userId, postId)
        );
    }


    // UNLIKE
    @DeleteMapping("/user/{userId}/post/{postId}")
    public String unlikePost(
            @PathVariable Long userId,
            @PathVariable Long postId) {

        return likeService.unlikePost(
                userId,
                postId
        );
    }


    // LIKE COUNT
    @GetMapping("/count/{postId}")
    public long getLikeCount(
            @PathVariable Long postId) {

        return likeService.getLikeCount(postId);
    }


    // CHECK LIKE
    @GetMapping("/check/{userId}/{postId}")
    public boolean isPostLiked(
            @PathVariable Long userId,
            @PathVariable Long postId) {

        return likeService.isPostLiked(
                userId,
                postId
        );
    }
}