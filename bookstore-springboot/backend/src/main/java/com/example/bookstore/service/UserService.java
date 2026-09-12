package com.example.bookstore.service;

import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.dto.UserDTO;
import com.example.bookstore.entity.User;
import com.example.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase());
    }

    @Transactional(readOnly = true)
    public Optional<UserDTO> findDTOById(Long id) {
        return userRepository.findById(id).map(this::toDTO);
    }

    @Transactional
    public User register(RegisterRequest req) {
        User user = new User();
        user.setFullName(req.getFullName().trim());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPasswordHash(BCrypt.hashpw(req.getPassword(), BCrypt.gensalt(10)));
        user.setRole("customer");
        user.setAddress(req.getAddress());
        return userRepository.save(user);
    }

    public boolean verifyPassword(String plain, String hash) {
        return BCrypt.checkpw(plain, hash);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email.trim().toLowerCase());
    }

    public UserDTO toDTO(User u) {
        return new UserDTO(u.getId(), u.getFullName(), u.getEmail(), u.getRole(), u.getAddress());
    }
}
