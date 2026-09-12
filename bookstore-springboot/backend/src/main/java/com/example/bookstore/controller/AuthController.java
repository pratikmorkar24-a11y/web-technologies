package com.example.bookstore.controller;

import com.example.bookstore.dto.ApiError;
import com.example.bookstore.dto.LoginRequest;
import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.dto.UserDTO;
import com.example.bookstore.entity.User;
import com.example.bookstore.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletRequest httpRequest) {
        if (req.getFullName() == null || req.getFullName().isBlank()
                || req.getEmail() == null || req.getEmail().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(new ApiError("Name, email and password are required."));
        }
        if (req.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(new ApiError("Password must be at least 6 characters."));
        }
        if (req.getConfirmPassword() != null && !req.getPassword().equals(req.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new ApiError("Passwords do not match."));
        }
        if (userService.emailExists(req.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiError("An account with that email already exists."));
        }

        User user = userService.register(req);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole());

        return ResponseEntity.ok(userService.toDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest httpRequest) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(new ApiError("Please enter both email and password."));
        }
        Optional<User> userOpt = userService.findByEmail(req.getEmail());
        if (userOpt.isEmpty() || !userService.verifyPassword(req.getPassword(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body(new ApiError("Invalid email or password."));
        }
        User user = userOpt.get();
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole());

        return ResponseEntity.ok(userService.toDTO(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body(new ApiError("Not logged in."));
        }
        Long userId = (Long) session.getAttribute("userId");
        Optional<UserDTO> user = userService.findDTOById(userId);
        if (user.isEmpty()) {
            session.invalidate();
            return ResponseEntity.status(401).body(new ApiError("Not logged in."));
        }
        return ResponseEntity.ok(user.get());
    }
}
