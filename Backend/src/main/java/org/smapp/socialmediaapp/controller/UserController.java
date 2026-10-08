package org.smapp.socialmediaapp.controller;

import jakarta.validation.Valid;
import org.smapp.socialmediaapp.dto.UserResponseDTO;
import org.smapp.socialmediaapp.entity.User;
import org.smapp.socialmediaapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody User user) {

        return userService.convertToDTO(userService.register(user));
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody User user) {

        return userService.convertToDTO(
                userService.login(user.getUsername(), user.getPassword())
        );
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(userService::convertToDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUser(@PathVariable Long id) {

        return userService.convertToDTO(
                userService.getUserById(id)
        );
    }

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        return userService.deleteUser(id);
    }
}
