package com.example.bookstore.controller;

import com.example.bookstore.dto.GenreDTO;
import com.example.bookstore.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {
    private final BookService bookService;

    @GetMapping
    public List<GenreDTO> all() {
        return bookService.allGenres();
    }
}
