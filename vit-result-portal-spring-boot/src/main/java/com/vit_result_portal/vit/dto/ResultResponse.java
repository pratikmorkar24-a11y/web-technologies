package com.vit_result_portal.vit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ResultResponse {
    private StudentSummary student;
    private List<SubjectResult> subjects;
    private double totalOutOf400;
    private double percentage;
    private String overallGrade;
    private String status;

    @Getter
    @AllArgsConstructor
    public static class StudentSummary {
        private String prn;
        private String name;
        private String branch;
        private String semester;
    }

    @Getter
    @AllArgsConstructor
    public static class SubjectResult {
        private String subjectName;
        private double mseOutOf100;
        private double mseWeight30;
        private double eseOutOf100;
        private double eseWeight70;
        private double totalOutOf100;
        private String grade;
        private String status;
    }
}
