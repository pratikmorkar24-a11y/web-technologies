package com.example.bookstore.controller;

import com.example.bookstore.dto.ApiError;
import com.example.bookstore.dto.BookDTO;
import com.example.bookstore.dto.PageResponse;
import com.example.bookstore.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public PageResponse<BookDTO> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long genre,
            @RequestParam(required = false) Long author,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "false") boolean inStockOnly,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "12") int limit
    ) {
        return bookService.search(search, genre, author, minPrice, maxPrice, inStockOnly, sort, page, limit);
    }

    @GetMapping("/featured")
    public List<BookDTO> featured(@RequestParam(required = false, defaultValue = "6") int limit) {
        return bookService.findFeatured(limit);
    }

    @GetMapping("/lookup")
    public List<BookDTO> lookup(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::parseLong)
                .toList();
        return bookService.findByIds(idList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        BookDTO book = bookService.findById(id);
        if (book == null) {
            return ResponseEntity.status(404).body(new ApiError("Book not found."));
        }
        return ResponseEntity.ok(book);
    }
}
