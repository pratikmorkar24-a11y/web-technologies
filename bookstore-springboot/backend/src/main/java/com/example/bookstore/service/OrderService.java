package com.example.bookstore.service;

import com.example.bookstore.dto.*;
import com.example.bookstore.entity.*;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.InventoryTransactionRepository;
import com.example.bookstore.repository.OrderRepository;
import com.example.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final InventoryTransactionRepository inventoryRepository;

    /**
     * Places an order transactionally: validates stock for every line item,
     * creates the Order + OrderItems, decrements book stock, and logs an
     * inventory transaction — all inside a single DB transaction so a failure
     * anywhere rolls everything back (mirrors the original Express checkout).
     */
    @Transactional
    public CheckoutResponse checkout(Long userId, CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Your cart is empty.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("confirmed");

        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutItemRequest item : request.getItems()) {
            if (item.getBookId() == null || item.getQuantity() == null || item.getQuantity() <= 0) continue;

            Book book = bookRepository.findById(item.getBookId())
                    .orElseThrow(() -> new IllegalArgumentException("Book with id " + item.getBookId() + " no longer exists."));

            if (book.getStockQuantity() < item.getQuantity()) {
                throw new IllegalStateException("Not enough stock for \"" + book.getTitle() + "\" — only " + book.getStockQuantity() + " left.");
            }

            BigDecimal lineTotal = book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(book.getPrice());
            order.getItems().add(orderItem);

            book.setStockQuantity(book.getStockQuantity() - item.getQuantity());
            bookRepository.save(book);

            InventoryTransaction tx = new InventoryTransaction();
            tx.setBook(book);
            tx.setChangeQty(-item.getQuantity());
            tx.setReason("sale");
            inventoryRepository.save(tx);
        }

        if (order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Your cart is empty.");
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        return new CheckoutResponse(true, saved.getId(), total);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> findByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> findAll() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::toAdminDTO).collect(Collectors.toList());
    }

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(i -> new OrderItemDTO(i.getBook().getId(), i.getBook().getTitle(), i.getBook().getCoverImage(), i.getQuantity(), i.getUnitPrice()))
                .collect(Collectors.toList());
        return new OrderDTO(order.getId(), order.getOrderDate(), order.getTotalAmount(), order.getStatus(), order.getShippingAddress(), items, null, null);
    }

    private OrderDTO toAdminDTO(Order order) {
        OrderDTO dto = toDTO(order);
        dto.setCustomerName(order.getUser().getFullName());
        dto.setCustomerEmail(order.getUser().getEmail());
        return dto;
    }
}
