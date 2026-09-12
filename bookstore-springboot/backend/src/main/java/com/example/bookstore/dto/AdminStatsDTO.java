package com.example.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalBooks;
    private long totalUsers;
    private long totalOrders;
    private BigDecimal revenue;
}
