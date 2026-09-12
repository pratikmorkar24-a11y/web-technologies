package com.example.bookstore.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookAdminRequest {
    private String title;
    private String isbn;
    private String description;
    private BigDecimal price;
    private String coverImage;
    private String publisher;
    private Integer publicationYear;
    private Integer pages;
    private String language;
    private Integer stockQuantity;
    private BigDecimal rating;
    private Boolean featured;
    private List<Long> authorIds;
    private List<Long> genreIds;
}
