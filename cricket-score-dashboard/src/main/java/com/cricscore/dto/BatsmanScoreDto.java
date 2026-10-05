package com.cricscore.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatsmanScoreDto {
    private Long playerId;
    private String playerName;
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private double strikeRate;
    private boolean out;
    private String dismissalInfo;
    private boolean onStrike;
}
