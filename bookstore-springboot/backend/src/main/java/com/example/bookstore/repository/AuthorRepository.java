package com.example.bookstore.repository;

import com.example.bookstore.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    @Query("SELECT a FROM Author a ORDER BY a.name ASC")
    List<Author> findAllOrderedByName();
}
