package com.cricscore.dto;

import com.cricscore.entity.enums.MatchStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchSummaryDto {
    private Long matchId;
    private MatchStatus status;
    private String format;
    private String venue;
    private LocalDateTime matchDate;

    private String team1Name;
    private String team1ShortName;
    private String team2Name;
    private String team2ShortName;

    private String tossWinnerName;
    private String tossDecision;
    private String tossInfo;
    private String battingFirstTeamName;
    private String winnerName;
    private String playerOfMatchName;
    private String resultDescription;

    private ScorecardDto scorecard;
}
