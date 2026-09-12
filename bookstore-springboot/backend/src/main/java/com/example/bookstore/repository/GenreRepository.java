package com.example.bookstore.repository;

import com.example.bookstore.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    @Query("SELECT g FROM Genre g ORDER BY g.name ASC")
    List<Genre> findAllOrderedByName();
}
