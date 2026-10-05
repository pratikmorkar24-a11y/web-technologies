package com.cricscore.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BowlerScoreDto {
    private Long playerId;
    private String playerName;
    private String overs; // e.g. "3.4"
    private int ballsBowled;
    private int maidens;
    private int runsConceded;
    private int wickets;
    private double economyRate;
    private boolean currentBowler;
}
