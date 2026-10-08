package org.smapp.socialmediaapp.service;

import org.smapp.socialmediaapp.dto.FollowResponseDTO;
import org.smapp.socialmediaapp.dto.UserResponseDTO;
import org.smapp.socialmediaapp.entity.Follow;
import org.smapp.socialmediaapp.entity.User;
import org.smapp.socialmediaapp.repository.FollowRepository;
import org.smapp.socialmediaapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;


    // FOLLOW USER
    public Follow followUser(Long followerId, Long followingId) {

        if (followerId.equals(followingId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() ->
                        new RuntimeException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() ->
                        new RuntimeException("Following user not found"));

        if (followRepository.existsByFollowerIdAndFollowingId(
                followerId, followingId)) {

            throw new RuntimeException(
                    "You are already following this user");
        }

        Follow follow = new Follow();

        follow.setFollower(follower);
        follow.setFollowing(following);
        follow.setCreatedAt(LocalDateTime.now());

        return followRepository.save(follow);
    }


    // CONVERT FOLLOW TO DTO
    public FollowResponseDTO convertToDTO(Follow follow) {

        User follower = follow.getFollower();
        User following = follow.getFollowing();

        UserResponseDTO followerDTO = new UserResponseDTO(
                follower.getId(),
                follower.getName(),
                follower.getUsername(),
                follower.getEmail(),
                follower.getBio(),
                follower.getProfileImage(),
                follower.getCreatedAt()
        );

        UserResponseDTO followingDTO = new UserResponseDTO(
                following.getId(),
                following.getName(),
                following.getUsername(),
                following.getEmail(),
                following.getBio(),
                following.getProfileImage(),
                following.getCreatedAt()
        );

        return new FollowResponseDTO(
                follow.getId(),
                followerDTO,
                followingDTO,
                follow.getCreatedAt()
        );
    }


    // UNFOLLOW USER
    public String unfollowUser(Long followerId, Long followingId) {

        Follow follow = followRepository
                .findByFollowerIdAndFollowingId(
                        followerId,
                        followingId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "You are not following this user"));

        followRepository.delete(follow);

        return "User unfollowed successfully";
    }


    // GET FOLLOWERS
    public List<Follow> getFollowers(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return followRepository.findByFollowingId(userId);
    }


    // GET FOLLOWING
    public List<Follow> getFollowing(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return followRepository.findByFollowerId(userId);
    }
}