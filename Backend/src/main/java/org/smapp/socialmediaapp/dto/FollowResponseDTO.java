package org.smapp.socialmediaapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponseDTO {

    private Long id;
    private UserResponseDTO follower;
    private UserResponseDTO following;
    private LocalDateTime createdAt;
}