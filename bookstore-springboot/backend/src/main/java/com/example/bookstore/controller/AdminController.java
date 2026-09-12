package com.example.bookstore.controller;

import com.example.bookstore.dto.*;
import com.example.bookstore.service.AdminService;
import com.example.bookstore.service.BookService;
import com.example.bookstore.service.OrderService;
import com.example.bookstore.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BookService bookService;
    private final OrderService orderService;
    private final AdminService adminService;

    private ResponseEntity<ApiError> guard(HttpServletRequest request) {
        if (!SessionUtil.isAuthenticated(request)) {
            return ResponseEntity.status(401).body(new ApiError("You must be logged in."));
        }
        if (!SessionUtil.isAdmin(request)) {
            return ResponseEntity.status(403).body(new ApiError("Admin access required."));
        }
        return null;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats(HttpServletRequest request) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<?> lowStock(HttpServletRequest request,
                                       @RequestParam(defaultValue = "10") int threshold,
                                       @RequestParam(defaultValue = "8") int limit) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        return ResponseEntity.ok(adminService.lowStock(threshold, limit));
    }

    @GetMapping("/books")
    public ResponseEntity<?> allBooks(HttpServletRequest request) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        PageResponse<BookDTO> page = bookService.search(null, null, null, null, null, false, "title_asc", 1, 500);
        return ResponseEntity.ok(page.getItems());
    }

    @PostMapping("/books")
    public ResponseEntity<?> createBook(HttpServletRequest request, @RequestBody BookAdminRequest req) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        return ResponseEntity.ok(bookService.create(req));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<?> updateBook(HttpServletRequest request, @PathVariable Long id, @RequestBody BookAdminRequest req) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        try {
            return ResponseEntity.ok(bookService.update(id, req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(new ApiError(e.getMessage()));
        }
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<?> deleteBook(HttpServletRequest request, @PathVariable Long id) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        try {
            bookService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiError("Could not delete book (it may have existing orders)."));
        }
    }

    @PostMapping("/books/{id}/stock")
    public ResponseEntity<?> adjustStock(HttpServletRequest request, @PathVariable Long id, @RequestBody StockAdjustRequest req) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        if (req.getDelta() == null || req.getDelta() == 0) {
            return ResponseEntity.badRequest().body(new ApiError("Enter a non-zero quantity."));
        }
        bookService.adjustStock(id, req.getDelta(), req.getReason());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<?> allOrders(HttpServletRequest request) {
        ResponseEntity<ApiError> denied = guard(request);
        if (denied != null) return denied;
        List<OrderDTO> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }
}
