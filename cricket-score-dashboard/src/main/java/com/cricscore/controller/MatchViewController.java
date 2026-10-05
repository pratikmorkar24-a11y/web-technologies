package com.cricscore.controller;

import com.cricscore.dto.LiveScoreDto;
import com.cricscore.dto.MatchResponseDto;
import com.cricscore.dto.MatchSummaryDto;
import com.cricscore.dto.ScorecardDto;
import com.cricscore.service.MatchService;
import com.cricscore.service.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MatchViewController {

    private final MatchService matchService;
    private final ScoreService scoreService;

    @GetMapping("/")
    public String viewDashboard(Model model) {
        List<MatchResponseDto> allMatches = matchService.getAllMatches();
        List<MatchResponseDto> liveMatches = matchService.getLiveMatches();
        List<MatchResponseDto> upcomingMatches = matchService.getUpcomingMatches();
        List<MatchResponseDto> completedMatches = matchService.getCompletedMatches();

        model.addAttribute("allMatches", allMatches);
        model.addAttribute("liveMatches", liveMatches);
        model.addAttribute("upcomingMatches", upcomingMatches);
        model.addAttribute("completedMatches", completedMatches);

        return "dashboard";
    }

    @GetMapping("/matches/{id}")
    public String viewMatchDetails(@PathVariable Long id, Model model) {
        MatchResponseDto match = matchService.getMatchById(id);
        LiveScoreDto liveScore = scoreService.getLiveScore(id);

        model.addAttribute("match", match);
        model.addAttribute("liveScore", liveScore);

        return "match-details";
    }

    @GetMapping("/matches/{id}/summary")
    public String viewMatchSummary(@PathVariable Long id, Model model) {
        MatchResponseDto match = matchService.getMatchById(id);
        MatchSummaryDto summary = scoreService.getSummary(id);
        ScorecardDto scorecard = scoreService.getScorecard(id);

        model.addAttribute("match", match);
        model.addAttribute("summary", summary);
        model.addAttribute("scorecard", scorecard);

        return "match-summary";
    }
}
