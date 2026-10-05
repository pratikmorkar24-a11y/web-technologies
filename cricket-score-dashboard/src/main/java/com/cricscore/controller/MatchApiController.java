package com.cricscore.controller;

import com.cricscore.dto.*;
import com.cricscore.service.MatchService;
import com.cricscore.service.ScoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MatchApiController {

    private final MatchService matchService;
    private final ScoreService scoreService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<MatchResponseDto>>> getAllMatches() {
        List<MatchResponseDto> matches = matchService.getAllMatches();
        return ResponseEntity.ok(ApiResponseDto.success("Matches retrieved successfully", matches));
    }

    @GetMapping("/live")
    public ResponseEntity<ApiResponseDto<List<MatchResponseDto>>> getLiveMatches() {
        List<MatchResponseDto> liveMatches = matchService.getLiveMatches();
        return ResponseEntity.ok(ApiResponseDto.success("Live matches retrieved successfully", liveMatches));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponseDto<List<MatchResponseDto>>> getUpcomingMatches() {
        List<MatchResponseDto> upcomingMatches = matchService.getUpcomingMatches();
        return ResponseEntity.ok(ApiResponseDto.success("Upcoming matches retrieved successfully", upcomingMatches));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponseDto<List<MatchResponseDto>>> getCompletedMatches() {
        List<MatchResponseDto> completedMatches = matchService.getCompletedMatches();
        return ResponseEntity.ok(ApiResponseDto.success("Completed matches retrieved successfully", completedMatches));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<MatchResponseDto>> getMatchById(@PathVariable Long id) {
        MatchResponseDto match = matchService.getMatchById(id);
        return ResponseEntity.ok(ApiResponseDto.success("Match retrieved successfully", match));
    }

    @GetMapping("/{id}/score")
    public ResponseEntity<ApiResponseDto<LiveScoreDto>> getLiveScore(@PathVariable Long id) {
        LiveScoreDto score = scoreService.getLiveScore(id);
        return ResponseEntity.ok(ApiResponseDto.success("Live score retrieved successfully", score));
    }

    @GetMapping("/{id}/batting")
    public ResponseEntity<ApiResponseDto<List<BatsmanScoreDto>>> getBattingStats(@PathVariable Long id) {
        List<BatsmanScoreDto> batting = scoreService.getBattingStats(id);
        return ResponseEntity.ok(ApiResponseDto.success("Batting statistics retrieved successfully", batting));
    }

    @GetMapping("/{id}/bowling")
    public ResponseEntity<ApiResponseDto<List<BowlerScoreDto>>> getBowlingStats(@PathVariable Long id) {
        List<BowlerScoreDto> bowling = scoreService.getBowlingStats(id);
        return ResponseEntity.ok(ApiResponseDto.success("Bowling statistics retrieved successfully", bowling));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<ApiResponseDto<List<MatchEventResponseDto>>> getEvents(@PathVariable Long id) {
        List<MatchEventResponseDto> events = scoreService.getEvents(id);
        return ResponseEntity.ok(ApiResponseDto.success("Match events retrieved successfully", events));
    }

    @GetMapping("/{id}/scorecard")
    public ResponseEntity<ApiResponseDto<ScorecardDto>> getScorecard(@PathVariable Long id) {
        ScorecardDto scorecard = scoreService.getScorecard(id);
        return ResponseEntity.ok(ApiResponseDto.success("Scorecard retrieved successfully", scorecard));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<ApiResponseDto<MatchSummaryDto>> getSummary(@PathVariable Long id) {
        MatchSummaryDto summary = scoreService.getSummary(id);
        return ResponseEntity.ok(ApiResponseDto.success("Match summary retrieved successfully", summary));
    }

    @PostMapping("/{id}/events")
    public ResponseEntity<ApiResponseDto<MatchEventResponseDto>> recordEvent(
            @PathVariable Long id,
            @Valid @RequestBody MatchEventRequestDto request) {
        MatchEventResponseDto event = scoreService.recordEvent(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("Match event recorded successfully", event));
    }
}
