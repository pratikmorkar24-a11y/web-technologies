package com.vit_result_portal.vit.controller;

import com.vit_result_portal.vit.dto.ResultResponse;
import com.vit_result_portal.vit.service.ResultService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/result")
@CrossOrigin
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public ResultResponse getResult(
            @RequestParam String prn,
            @RequestParam String motherName) {
        return resultService.getResult(prn, motherName);
    }
}
