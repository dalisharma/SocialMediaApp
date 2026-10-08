package org.smapp.socialmediaapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Comment cannot be empty")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Comment kis user ne kiya
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Comment kis post par hai
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}