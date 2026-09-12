package com.example.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
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
    private List<AuthorDTO> authors;
    private List<GenreDTO> genres;

    /** Comma-joined author/genre names, kept for parity with the original catalogue-card display. */
    private String authorNames;
    private String genreNames;
}
