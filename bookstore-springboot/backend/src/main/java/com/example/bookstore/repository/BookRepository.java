package com.example.bookstore.repository;

import com.example.bookstore.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {

    List<Book> findByIdIn(List<Long> ids);

    List<Book> findByFeaturedTrueOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}
