package com.example.bookstore.controller;

import com.example.bookstore.dto.ApiError;
import com.example.bookstore.dto.CheckoutRequest;
import com.example.bookstore.dto.CheckoutResponse;
import com.example.bookstore.dto.OrderDTO;
import com.example.bookstore.service.OrderService;
import com.example.bookstore.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        Long userId = SessionUtil.getUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).body(new ApiError("You must be logged in."));
        }
        try {
            CheckoutResponse response = orderService.checkout(userId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> myOrders(HttpServletRequest httpRequest) {
        Long userId = SessionUtil.getUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).body(new ApiError("You must be logged in."));
        }
        List<OrderDTO> orders = orderService.findByUser(userId);
        return ResponseEntity.ok(orders);
    }
}
