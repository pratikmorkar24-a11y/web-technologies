package com.example.bookstore.dto;

import lombok.Data;

@Data
public class StockAdjustRequest {
    private Integer delta;
    private String reason; // "restock" or "adjustment"
}
