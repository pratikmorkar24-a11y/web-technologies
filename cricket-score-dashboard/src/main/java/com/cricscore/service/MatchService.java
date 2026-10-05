package com.cricscore.service;

import com.cricscore.dto.MatchResponseDto;
import com.cricscore.entity.Innings;
import com.cricscore.entity.Match;
import com.cricscore.entity.enums.MatchStatus;
import com.cricscore.exception.ResourceNotFoundException;
import com.cricscore.repository.InningsRepository;
import com.cricscore.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final InningsRepository inningsRepository;

    @Transactional(readOnly = true)
    public List<MatchResponseDto> getAllMatches() {
        return matchRepository.findAllByOrderByMatchDateDesc().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDto> getLiveMatches() {
        return matchRepository.findByStatus(MatchStatus.LIVE).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDto> getUpcomingMatches() {
        return matchRepository.findByStatus(MatchStatus.UPCOMING).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDto> getCompletedMatches() {
        return matchRepository.findByStatus(MatchStatus.COMPLETED).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchResponseDto getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
        return convertToResponseDto(match);
    }

    public MatchResponseDto convertToResponseDto(Match match) {
        List<Innings> inningsList = inningsRepository.findByMatchIdOrderByInningsNumberAsc(match.getId());

        String team1Score = null;
        String team2Score = null;
        String currentRunRate = null;
        String statusText = null;

        for (Innings inn : inningsList) {
            String scoreStr = inn.getBattingTeam().getShortName() + " " + inn.getRuns() + "/" + inn.getWickets() + " (" + inn.getOversString() + " ov)";
            if (inn.getBattingTeam().getId().equals(match.getTeam1().getId())) {
                team1Score = scoreStr;
            } else if (inn.getBattingTeam().getId().equals(match.getTeam2().getId())) {
                team2Score = scoreStr;
            }
        }

        if (match.getStatus() == MatchStatus.LIVE) {
            if (!inningsList.isEmpty()) {
                Innings activeInnings = inningsList.get(inningsList.size() - 1);
                if (inningsList.size() > 1 && !inningsList.get(0).isCompleted()) {
                    activeInnings = inningsList.get(0);
                }
                currentRunRate = String.format("%.2f", activeInnings.getRunRate());

                if (activeInnings.getTarget() != null && activeInnings.getTarget() > 0) {
                    int runsNeeded = activeInnings.getTarget() - activeInnings.getRuns();
                    int maxBalls = match.getTotalOvers() * 6;
                    int ballsLeft = Math.max(0, maxBalls - activeInnings.getBalls());
                    if (runsNeeded > 0 && ballsLeft > 0) {
                        statusText = activeInnings.getBattingTeam().getShortName() + " need " + runsNeeded + " runs in " + ballsLeft + " balls";
                    } else if (runsNeeded <= 0) {
                        statusText = activeInnings.getBattingTeam().getShortName() + " won the match";
                    } else {
                        statusText = "Target: " + activeInnings.getTarget() + " runs";
                    }
                } else {
                    statusText = activeInnings.getBattingTeam().getName() + " batting first (" + activeInnings.getOversString() + " ov)";
                }
            } else {
                statusText = "Match in progress";
            }
        } else if (match.getStatus() == MatchStatus.COMPLETED) {
            statusText = match.getResultDescription() != null ? match.getResultDescription() : "Match Completed";
        } else if (match.getStatus() == MatchStatus.UPCOMING) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd, yyyy - hh:mm a");
            statusText = "Starts: " + (match.getMatchDate() != null ? match.getMatchDate().format(dtf) : "Scheduled");
        }

        return MatchResponseDto.builder()
                .id(match.getId())
                .format(match.getFormat())
                .venue(match.getVenue())
                .matchDate(match.getMatchDate())
                .status(match.getStatus())
                .totalOvers(match.getTotalOvers())
                .team1Id(match.getTeam1().getId())
                .team1Name(match.getTeam1().getName())
                .team1ShortName(match.getTeam1().getShortName())
                .team1Country(match.getTeam1().getCountry())
                .team2Id(match.getTeam2().getId())
                .team2Name(match.getTeam2().getName())
                .team2ShortName(match.getTeam2().getShortName())
                .team2Country(match.getTeam2().getCountry())
                .tossWinnerName(match.getTossWinner() != null ? match.getTossWinner().getName() : null)
                .tossDecision(match.getTossDecision())
                .winnerName(match.getWinner() != null ? match.getWinner().getName() : null)
                .playerOfMatchName(match.getPlayerOfTheMatch() != null ? match.getPlayerOfTheMatch().getName() : null)
                .resultDescription(match.getResultDescription())
                .team1Score(team1Score)
                .team2Score(team2Score)
                .currentRunRate(currentRunRate)
                .statusText(statusText)
                .build();
    }
}
