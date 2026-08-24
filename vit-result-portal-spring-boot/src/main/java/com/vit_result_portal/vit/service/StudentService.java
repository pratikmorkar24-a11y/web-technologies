package com.vit_result_portal.vit.service;

import com.vit_result_portal.vit.exception.DuplicateResourceException;
import com.vit_result_portal.vit.exception.ResourceNotFoundException;
import com.vit_result_portal.vit.model.Student;
import com.vit_result_portal.vit.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student addStudent(Student student) {
        student.setPrn(student.getPrn().trim().toUpperCase());
        student.setName(student.getName().trim());
        student.setMotherName(student.getMotherName().trim());
        student.setBranch(student.getBranch().trim());
        student.setSemester(student.getSemester().trim());

        if (studentRepository.existsByPrnIgnoreCase(student.getPrn())) {
            throw new DuplicateResourceException("A student with this PRN already exists.");
        }

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getByPrn(String prn) {
        return studentRepository.findByPrnIgnoreCase(prn.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for PRN: " + prn));
    }
}
