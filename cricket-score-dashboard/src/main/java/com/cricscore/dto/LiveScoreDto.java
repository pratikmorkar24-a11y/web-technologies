package com.cricscore.dto;

import com.cricscore.entity.enums.MatchStatus;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveScoreDto {
    private Long matchId;
    private MatchStatus status;
    private String format;
    private String venue;
    private Integer totalOvers;

    private Long team1Id;
    private String team1Name;
    private String team1ShortName;

    private Long team2Id;
    private String team2Name;
    private String team2ShortName;

    private Long battingTeamId;
    private String battingTeamName;
    private String battingTeamShortName;

    private Long bowlingTeamId;
    private String bowlingTeamName;
    private String bowlingTeamShortName;

    private int inningsNumber;
    private int runs;
    private int wickets;
    private int balls;
    private String overs; // e.g. "16.4"
    private double runRate;

    private Integer target;
    private Double requiredRunRate;
    private Integer runsNeeded;
    private Integer ballsRemaining;
    private String matchSituation;

    private BatsmanScoreDto striker;
    private BatsmanScoreDto nonStriker;
    private BowlerScoreDto currentBowler;

    @Builder.Default
    private List<String> currentOverBalls = new ArrayList<>();

    @Builder.Default
    private List<MatchEventResponseDto> recentEvents = new ArrayList<>();
}
