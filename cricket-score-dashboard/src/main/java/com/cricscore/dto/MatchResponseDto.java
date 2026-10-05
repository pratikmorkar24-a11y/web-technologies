package com.cricscore.dto;

import com.cricscore.entity.enums.MatchStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponseDto {
    private Long id;
    private String format;
    private String venue;
    private LocalDateTime matchDate;
    private MatchStatus status;
    private Integer totalOvers;

    private Long team1Id;
    private String team1Name;
    private String team1ShortName;
    private String team1Country;

    private Long team2Id;
    private String team2Name;
    private String team2ShortName;
    private String team2Country;

    private String tossWinnerName;
    private String tossDecision;
    private String winnerName;
    private String playerOfMatchName;
    private String resultDescription;

    private String team1Score;
    private String team2Score;
    private String currentRunRate;
    private String statusText;
}
