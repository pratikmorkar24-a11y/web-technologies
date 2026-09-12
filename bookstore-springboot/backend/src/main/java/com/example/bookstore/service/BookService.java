package com.example.bookstore.service;

import com.example.bookstore.dto.*;
import com.example.bookstore.entity.Author;
import com.example.bookstore.entity.Book;
import com.example.bookstore.entity.Genre;
import com.example.bookstore.entity.InventoryTransaction;
import com.example.bookstore.repository.AuthorRepository;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.GenreRepository;
import com.example.bookstore.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final GenreRepository genreRepository;
    private final InventoryTransactionRepository inventoryRepository;

    private static final int DEFAULT_LIMIT = 12;

    @Transactional(readOnly = true)
    public PageResponse<BookDTO> search(String search, Long genreId, Long authorId,
                                          BigDecimal minPrice, BigDecimal maxPrice,
                                          boolean inStockOnly, String sort, int page, int limit) {
        int safePage = Math.max(1, page);
        int safeLimit = limit > 0 ? limit : DEFAULT_LIMIT;

        Sort sortSpec = resolveSort(sort);
        Pageable pageable = PageRequest.of(safePage - 1, safeLimit, sortSpec);

        Specification<Book> spec = BookSpecifications.build(search, genreId, authorId, minPrice, maxPrice, inStockOnly);
        Page<Book> result = bookRepository.findAll(spec, pageable);

        List<BookDTO> dtos = result.getContent().stream().map(this::toDTO).collect(Collectors.toList());
        return new PageResponse<>(dtos, result.getTotalElements(), safePage, safeLimit, Math.max(1, result.getTotalPages()));
    }

    private Sort resolveSort(String sort) {
        if (sort == null) sort = "newest";
        return switch (sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "title_asc" -> Sort.by("title").ascending();
            case "title_desc" -> Sort.by("title").descending();
            case "rating" -> Sort.by("rating").descending();
            case "year_new" -> Sort.by("publicationYear").descending();
            case "year_old" -> Sort.by("publicationYear").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }

    @Transactional(readOnly = true)
    public BookDTO findById(Long id) {
        Book book = bookRepository.findById(id).orElse(null);
        return book == null ? null : toDTO(book);
    }

    @Transactional(readOnly = true)
    public List<BookDTO> findFeatured(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findByFeaturedTrueOrderByCreatedAtDesc(pageable)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookDTO> findByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        return bookRepository.findByIdIn(ids).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GenreDTO> allGenres() {
        return genreRepository.findAllOrderedByName().stream()
                .map(g -> new GenreDTO(g.getId(), g.getName(), g.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuthorDTO> allAuthors() {
        return authorRepository.findAllOrderedByName().stream()
                .map(a -> new AuthorDTO(a.getId(), a.getName(), a.getBio()))
                .collect(Collectors.toList());
    }

    // ---------------- Admin CRUD ----------------

    @Transactional
    public BookDTO create(BookAdminRequest req) {
        Book book = new Book();
        applyRequest(book, req);
        Book saved = bookRepository.save(book);

        if (req.getStockQuantity() != null && req.getStockQuantity() > 0) {
            logInventory(saved, req.getStockQuantity(), "initial");
        }
        return toDTO(saved);
    }

    @Transactional
    public BookDTO update(Long id, BookAdminRequest req) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found"));
        applyRequest(book, req);
        return toDTO(bookRepository.save(book));
    }

    private void applyRequest(Book book, BookAdminRequest req) {
        book.setTitle(req.getTitle());
        book.setIsbn(req.getIsbn());
        book.setDescription(req.getDescription());
        book.setPrice(req.getPrice() != null ? req.getPrice() : BigDecimal.ZERO);
        book.setCoverImage(req.getCoverImage() != null ? req.getCoverImage() : "/images/covers/default.svg");
        book.setPublisher(req.getPublisher());
        book.setPublicationYear(req.getPublicationYear());
        book.setPages(req.getPages());
        book.setLanguage(req.getLanguage() != null ? req.getLanguage() : "English");
        book.setRating(req.getRating() != null ? req.getRating() : new BigDecimal("4.0"));
        book.setFeatured(Boolean.TRUE.equals(req.getFeatured()));
        if (book.getId() == null) {
            book.setStockQuantity(req.getStockQuantity() != null ? req.getStockQuantity() : 0);
        }
        if (req.getAuthorIds() != null) {
            Set<Author> authors = req.getAuthorIds().stream()
                    .map(aid -> authorRepository.findById(aid).orElse(null))
                    .filter(a -> a != null)
                    .collect(Collectors.toSet());
            book.setAuthors(authors);
        }
        if (req.getGenreIds() != null) {
            Set<Genre> genres = req.getGenreIds().stream()
                    .map(gid -> genreRepository.findById(gid).orElse(null))
                    .filter(g -> g != null)
                    .collect(Collectors.toSet());
            book.setGenres(genres);
        }
    }

    @Transactional
    public void delete(Long id) {
        bookRepository.deleteById(id);
    }

    @Transactional
    public void adjustStock(Long id, int delta, String reason) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found"));
        int newQty = Math.max(0, book.getStockQuantity() + delta);
        book.setStockQuantity(newQty);
        bookRepository.save(book);
        logInventory(book, delta, reason == null ? "adjustment" : reason);
    }

    private void logInventory(Book book, int changeQty, String reason) {
        InventoryTransaction tx = new InventoryTransaction();
        tx.setBook(book);
        tx.setChangeQty(changeQty);
        tx.setReason(reason);
        inventoryRepository.save(tx);
    }

    // ---------------- Mapping ----------------

    public BookDTO toDTO(Book b) {
        List<AuthorDTO> authors = b.getAuthors().stream()
                .map(a -> new AuthorDTO(a.getId(), a.getName(), a.getBio()))
                .collect(Collectors.toList());
        List<GenreDTO> genres = b.getGenres().stream()
                .map(g -> new GenreDTO(g.getId(), g.getName(), g.getDescription()))
                .collect(Collectors.toList());

        BookDTO dto = new BookDTO();
        dto.setId(b.getId());
        dto.setTitle(b.getTitle());
        dto.setIsbn(b.getIsbn());
        dto.setDescription(b.getDescription());
        dto.setPrice(b.getPrice());
        dto.setCoverImage(b.getCoverImage());
        dto.setPublisher(b.getPublisher());
        dto.setPublicationYear(b.getPublicationYear());
        dto.setPages(b.getPages());
        dto.setLanguage(b.getLanguage());
        dto.setStockQuantity(b.getStockQuantity());
        dto.setRating(b.getRating());
        dto.setFeatured(b.getFeatured());
        dto.setAuthors(authors);
        dto.setGenres(genres);
        dto.setAuthorNames(authors.stream().map(AuthorDTO::getName).collect(Collectors.joining(", ")));
        dto.setGenreNames(genres.stream().map(GenreDTO::getName).collect(Collectors.joining(", ")));
        return dto;
    }
}
