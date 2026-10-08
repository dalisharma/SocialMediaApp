package org.smapp.socialmediaapp.repository;

import org.smapp.socialmediaapp.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long userId);

    List<Post> findAllByOrderByCreatedAtDesc();
}
