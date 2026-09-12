package com.example.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private boolean success;
    private Long orderId;
    private BigDecimal total;
}
