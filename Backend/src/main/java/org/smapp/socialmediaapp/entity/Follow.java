package org.smapp.socialmediaapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "followers", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"follower_id", "following_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;
    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private User following;
    private LocalDateTime createdAt;
}