package com.vit_result_portal.vit.repository;

import com.vit_result_portal.vit.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByPrnIgnoreCase(String prn);
    boolean existsByPrnIgnoreCase(String prn);
}
