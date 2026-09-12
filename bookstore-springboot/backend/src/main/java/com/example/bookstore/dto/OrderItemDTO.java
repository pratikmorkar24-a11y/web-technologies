package com.example.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long bookId;
    private String title;
    private String coverImage;
    private Integer quantity;
    private BigDecimal unitPrice;
}
