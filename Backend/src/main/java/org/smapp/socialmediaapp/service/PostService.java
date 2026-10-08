package org.smapp.socialmediaapp.service;

import org.smapp.socialmediaapp.dto.PostResponseDTO;
import org.smapp.socialmediaapp.dto.UserResponseDTO;
import org.smapp.socialmediaapp.entity.Post;
import org.smapp.socialmediaapp.entity.User;
import org.smapp.socialmediaapp.repository.PostRepository;
import org.smapp.socialmediaapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    private final String uploadDirectory = "uploads/images/";

    public Post createPost(
            Long userId,
            Post post,
            MultipartFile image) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {

            try {

                Path uploadPath = Paths.get(uploadDirectory);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalName = image.getOriginalFilename();

                String extension = "";

                if (originalName != null && originalName.contains(".")) {
                    extension = originalName.substring(
                            originalName.lastIndexOf(".")
                    );
                }

                String fileName =
                        UUID.randomUUID().toString() + extension;

                Path filePath = uploadPath.resolve(fileName);

                Files.copy(
                        image.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                post.setImage(fileName);

            } catch (IOException e) {
                throw new RuntimeException(
                        "Image upload failed"
                );
            }
        }

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));
    }

    public List<Post> getPostsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return postRepository.findByUserId(userId);
    }

    public Post updatePost(
            Long postId,
            Long userId,
            Post post) {

        Post existingPost = getPostById(postId);

        if (!existingPost.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You can only update your own post"
            );
        }

        existingPost.setContent(post.getContent());
        existingPost.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(existingPost);
    }

    public String deletePost(
            Long postId,
            Long userId) {

        Post post = getPostById(postId);

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You can only delete your own post"
            );
        }

        if (post.getImage() != null &&
                !post.getImage().isEmpty()) {

            try {

                Path imagePath = Paths.get(
                        uploadDirectory + post.getImage()
                );

                Files.deleteIfExists(imagePath);

            } catch (IOException e) {
                System.out.println(
                        "Could not delete image: "
                                + e.getMessage()
                );
            }
        }

        postRepository.delete(post);

        return "Post deleted successfully";
    }

    public PostResponseDTO convertToDTO(Post post) {

        User user = post.getUser();

        UserResponseDTO userDTO =
                new UserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getBio(),
                        user.getProfileImage(),
                        user.getCreatedAt()
                );

        return new PostResponseDTO(
                post.getId(),
                post.getContent(),
                post.getImage(),
                post.getCreatedAt(),
                userDTO
        );
    }
}