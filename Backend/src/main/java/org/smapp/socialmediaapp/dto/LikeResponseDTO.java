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
public class LikeResponseDTO {

    private Long id;
    private UserResponseDTO user;
    private Long postId;
    private LocalDateTime createdAt;
}