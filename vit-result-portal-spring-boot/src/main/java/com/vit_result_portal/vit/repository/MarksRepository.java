package com.vit_result_portal.vit.repository;

import com.vit_result_portal.vit.model.SubjectMarks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<SubjectMarks, Long> {
    List<SubjectMarks> findByStudentPrnIgnoreCaseOrderByIdAsc(String prn);
    Optional<SubjectMarks> findByStudentPrnIgnoreCaseAndSubjectNameIgnoreCase(String prn, String subjectName);
    long countByStudentId(Long studentId);
}
