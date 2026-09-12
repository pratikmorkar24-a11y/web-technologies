package com.example.bookstore.dto;

import lombok.Data;

@Data
public class CheckoutItemRequest {
    private Long bookId;
    private Integer quantity;
}
