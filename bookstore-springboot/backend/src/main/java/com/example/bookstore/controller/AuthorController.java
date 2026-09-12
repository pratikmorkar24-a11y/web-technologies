package com.example.bookstore.controller;

import com.example.bookstore.dto.AuthorDTO;
import com.example.bookstore.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final BookService bookService;

    @GetMapping
    public List<AuthorDTO> all() {
        return bookService.allAuthors();
    }
}
