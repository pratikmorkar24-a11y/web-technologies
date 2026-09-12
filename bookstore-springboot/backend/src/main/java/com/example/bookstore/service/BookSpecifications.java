package com.example.bookstore.service;

import com.example.bookstore.entity.Author;
import com.example.bookstore.entity.Book;
import com.example.bookstore.entity.Genre;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Builds a dynamic JPA Specification for the catalogue search/filter form,
 * mirroring the WHERE-clause builder used by the original Express bookModel.
 */
public class BookSpecifications {

    public static Specification<Book> build(String search, Long genreId, Long authorId,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              boolean inStockOnly) {
        return (root, query, cb) -> {
            if (Long.class != query.getResultType() && long.class != query.getResultType()) {
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();
            Join<Book, Author> authorJoin = null;

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                authorJoin = root.join("authors", JoinType.LEFT);
                Predicate byTitle = cb.like(cb.lower(root.get("title")), like);
                Predicate byDescription = cb.like(cb.lower(cb.coalesce(root.get("description"), "")), like);
                Predicate byAuthor = cb.like(cb.lower(authorJoin.get("name")), like);
                predicates.add(cb.or(byTitle, byDescription, byAuthor));
            }

            if (genreId != null) {
                Join<Book, Genre> genreJoin = root.join("genres", JoinType.LEFT);
                predicates.add(cb.equal(genreJoin.get("id"), genreId));
            }

            if (authorId != null) {
                if (authorJoin == null) {
                    authorJoin = root.join("authors", JoinType.LEFT);
                }
                predicates.add(cb.equal(authorJoin.get("id"), authorId));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (inStockOnly) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
