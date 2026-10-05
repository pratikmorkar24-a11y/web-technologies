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
public class ScorecardDto {
    private Long matchId;
    private MatchStatus status;
    private String format;
    private String venue;
    private String team1Name;
    private String team2Name;
    private String resultDescription;

    @Builder.Default
    private List<InningsScoreDto> inningsList = new ArrayList<>();
}
