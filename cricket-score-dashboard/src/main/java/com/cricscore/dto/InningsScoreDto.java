package com.cricscore.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InningsScoreDto {
    private Long inningsId;
    private int inningsNumber;
    private Long battingTeamId;
    private String battingTeamName;
    private String battingTeamShortName;
    private Long bowlingTeamId;
    private String bowlingTeamName;
    private String bowlingTeamShortName;

    private int runs;
    private int wickets;
    private int balls;
    private String overs;
    private double runRate;
    private Integer target;
    private int extras;
    private boolean completed;

    @Builder.Default
    private List<BatsmanScoreDto> batsmen = new ArrayList<>();

    @Builder.Default
    private List<BowlerScoreDto> bowlers = new ArrayList<>();
}
