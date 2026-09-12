package com.example.bookstore.service;

import com.example.bookstore.dto.AdminStatsDTO;
import com.example.bookstore.dto.BookDTO;
import com.example.bookstore.entity.Book;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.OrderRepository;
import com.example.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final BookService bookService;

    @Transactional(readOnly = true)
    public AdminStatsDTO getStats() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        BigDecimal revenue = orderRepository.findAll().stream()
                .filter(o -> !"cancelled".equals(o.getStatus()))
                .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new AdminStatsDTO(totalBooks, totalUsers, totalOrders, revenue);
    }

    @Transactional(readOnly = true)
    public List<BookDTO> lowStock(int threshold, int limit) {
        return bookRepository.findAll(Sort.by("stockQuantity").ascending()).stream()
                .filter(b -> b.getStockQuantity() <= threshold)
                .limit(limit)
                .map(bookService::toDTO)
                .collect(Collectors.toList());
    }
}
