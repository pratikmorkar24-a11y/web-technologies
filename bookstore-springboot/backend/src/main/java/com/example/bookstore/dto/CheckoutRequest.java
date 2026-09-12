package com.example.bookstore.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {
    private List<CheckoutItemRequest> items;
    private String shippingAddress;
}
