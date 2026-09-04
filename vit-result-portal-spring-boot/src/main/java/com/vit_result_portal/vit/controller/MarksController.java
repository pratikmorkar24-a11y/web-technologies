package com.vit_result_portal.vit.controller;

import com.vit_result_portal.vit.dto.MarksRequest;
import com.vit_result_portal.vit.model.SubjectMarks;
import com.vit_result_portal.vit.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectMarks addMarks(@Valid @RequestBody MarksRequest request) {
        return marksService.addMarks(request);
    }

    @GetMapping("/student/{prn}")
    public List<SubjectMarks> getStudentMarks(
            @PathVariable String prn,
            @RequestParam String motherName) {

        return marksService.getMarksForStudent(prn, motherName);
    }

    @GetMapping
    public List<SubjectMarks> getAllMarks() {
        return marksService.getAllMarks();
    }
}
