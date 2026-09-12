package com.example.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private List<OrderItemDTO> items;

    // populated only for the admin "all orders" view
    private String customerName;
    private String customerEmail;
}
