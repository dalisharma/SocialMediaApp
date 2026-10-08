package org.smapp.socialmediaapp.controller;

import org.smapp.socialmediaapp.dto.PostResponseDTO;
import org.smapp.socialmediaapp.entity.Post;
import org.smapp.socialmediaapp.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping(value = "/user/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PostResponseDTO createPost(
            @PathVariable Long userId,
            @RequestPart("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        Post post = new Post();
        post.setContent(content);

        return postService.convertToDTO(
                postService.createPost(userId, post, image)
        );
    }

    @GetMapping
    public List<PostResponseDTO> getAllPosts() {
        return postService.getAllPosts()
                .stream()
                .map(postService::convertToDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public PostResponseDTO getPostById(@PathVariable Long id) {
        return postService.convertToDTO(
                postService.getPostById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public List<PostResponseDTO> getPostsByUser(@PathVariable Long userId) {
        return postService.getPostsByUser(userId)
                .stream()
                .map(postService::convertToDTO)
                .toList();
    }

    @PutMapping("/{postId}/user/{userId}")
    public PostResponseDTO updatePost(
            @PathVariable Long postId,
            @PathVariable Long userId,
            @RequestBody Post post) {

        return postService.convertToDTO(
                postService.updatePost(postId, userId, post)
        );
    }

    @DeleteMapping("/{postId}/user/{userId}")
    public String deletePost(
            @PathVariable Long postId,
            @PathVariable Long userId) {

        return postService.deletePost(postId, userId);
    }
}