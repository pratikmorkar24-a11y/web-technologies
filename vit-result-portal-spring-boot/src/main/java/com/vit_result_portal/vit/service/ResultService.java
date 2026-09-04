package com.vit_result_portal.vit.service;

import com.vit_result_portal.vit.dto.ResultResponse;
import com.vit_result_portal.vit.exception.ResourceNotFoundException;
import com.vit_result_portal.vit.model.Student;
import com.vit_result_portal.vit.model.SubjectMarks;
import com.vit_result_portal.vit.repository.MarksRepository;
import com.vit_result_portal.vit.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ResultService {

    private final StudentRepository studentRepository;
    private final MarksRepository marksRepository;

    public ResultService(StudentRepository studentRepository, MarksRepository marksRepository) {
        this.studentRepository = studentRepository;
        this.marksRepository = marksRepository;
    }

    public ResultResponse getResult(String prn, String motherName) {
        Student student = studentRepository.findByPrnIgnoreCase(prn.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid PRN or mother's name."));

        if (!student.getMotherName().trim().equalsIgnoreCase(motherName.trim())) {
            throw new ResourceNotFoundException("Invalid PRN or mother's name.");
        }

        List<SubjectMarks> marks = marksRepository.findByStudentPrnIgnoreCaseOrderByIdAsc(prn.trim());
        List<ResultResponse.SubjectResult> subjects = new ArrayList<>();

        double total = 0.0;
        boolean allPassed = marks.size() == 4;

        for (SubjectMarks mark : marks) {
            String grade = grade(mark.getTotalMarks());
            String status = mark.getTotalMarks() >= 40 ? "PASS" : "FAIL";
            if (!status.equals("PASS")) {
                allPassed = false;
            }

            subjects.add(new ResultResponse.SubjectResult(
                    mark.getSubjectName(),
                    mark.getMseMarks(),
                    mark.getMseWeighted(),
                    mark.getEseMarks(),
                    mark.getEseWeighted(),
                    mark.getTotalMarks(),
                    grade,
                    status
            ));
            total += mark.getTotalMarks();
        }

        double percentage = marks.isEmpty() ? 0 : round(total / 4.0);
        String overallGrade = grade(percentage);
        String overallStatus = allPassed ? "PASS" : "FAIL";

        return new ResultResponse(
                new ResultResponse.StudentSummary(
                        student.getPrn(),
                        student.getName(),
                        student.getBranch(),
                        student.getSemester()
                ),
                subjects,
                round(total),
                percentage,
                overallGrade,
                overallStatus
        );
    }

    private String grade(double marks) {
        if (marks >= 90) return "A+";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B+";
        if (marks >= 60) return "B";
        if (marks >= 50) return "C";
        if (marks >= 40) return "D";
        return "F";
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
