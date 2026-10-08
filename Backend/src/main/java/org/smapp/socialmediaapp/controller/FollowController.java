package org.smapp.socialmediaapp.controller;

import org.smapp.socialmediaapp.dto.FollowResponseDTO;
import org.smapp.socialmediaapp.entity.Follow;
import org.smapp.socialmediaapp.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@CrossOrigin
public class FollowController {

    @Autowired
    private FollowService followService;


    // FOLLOW
    @PostMapping("/flw/{followerId}/flwg/{followingId}")
    public FollowResponseDTO followUser(
            @PathVariable Long followerId,
            @PathVariable Long followingId) {

        return followService.convertToDTO(
                followService.followUser(followerId, followingId)
        );
    }


    // UNFOLLOW
    @DeleteMapping("/flw/{followerId}/flwg/{followingId}")
    public String unfollowUser(
            @PathVariable Long followerId,
            @PathVariable Long followingId) {

        return followService.unfollowUser(
                followerId,
                followingId
        );
    }


    // GET FOLLOWERS
    @GetMapping("/followers/{userId}")
    public List<FollowResponseDTO> getFollowers(
            @PathVariable Long userId) {

        return followService.getFollowers(userId)
                .stream()
                .map(followService::convertToDTO)
                .toList();
    }


    // GET FOLLOWING
    @GetMapping("/following/{userId}")
    public List<FollowResponseDTO> getFollowing(
            @PathVariable Long userId) {

        return followService.getFollowing(userId)
                .stream()
                .map(followService::convertToDTO)
                .toList();
    }
}