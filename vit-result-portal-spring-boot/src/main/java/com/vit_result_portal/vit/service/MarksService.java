package com.vit_result_portal.vit.service;

import com.vit_result_portal.vit.dto.MarksRequest;
import com.vit_result_portal.vit.exception.DuplicateResourceException;
import com.vit_result_portal.vit.exception.ResourceNotFoundException;
import com.vit_result_portal.vit.model.Student;
import com.vit_result_portal.vit.model.SubjectMarks;
import com.vit_result_portal.vit.repository.MarksRepository;
import com.vit_result_portal.vit.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;

    public MarksService(MarksRepository marksRepository, StudentRepository studentRepository) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
    }

    public SubjectMarks addMarks(MarksRequest request) {
        String prn = request.getPrn().trim().toUpperCase();
        String subject = request.getSubjectName().trim();

        Student student = studentRepository.findByPrnIgnoreCase(prn)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for PRN: " + prn));

        if (marksRepository.countByStudentId(student.getId()) >= 4) {
            throw new DuplicateResourceException("A student can have marks for only four subjects.");
        }

        if (marksRepository.findByStudentPrnIgnoreCaseAndSubjectNameIgnoreCase(prn, subject).isPresent()) {
            throw new DuplicateResourceException("Marks for this subject already exist for the student.");
        }

        SubjectMarks marks = new SubjectMarks();
        marks.setStudent(student);
        marks.setSubjectName(subject);
        marks.setMseMarks(request.getMseMarks());
        marks.setEseMarks(request.getEseMarks());
        marks.calculateWeightedMarks();

        return marksRepository.save(marks);
    }

    public List<SubjectMarks> getMarksForStudent(String prn, String motherName) {

        Student student = studentRepository.findByPrnIgnoreCase(prn.trim())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invalid PRN or mother's name."
                        ));

        if (!student.getMotherName().trim()
                .equalsIgnoreCase(motherName.trim())) {
                    
            throw new ResourceNotFoundException(
                    "Invalid PRN or mother's name."
            );
        }

        return marksRepository
                .findByStudentPrnIgnoreCaseOrderByIdAsc(prn.trim());
    }

    public List<SubjectMarks> getAllMarks() {
        return marksRepository.findAll();
    }
}
