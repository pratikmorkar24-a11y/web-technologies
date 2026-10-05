package com.cricscore.dto;

import com.cricscore.entity.enums.EventType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEventResponseDto {
    private Long id;
    private int overNumber;
    private int ballNumber;
    private String ballDisplay; // e.g., "16.4"
    private EventType eventType;
    private int runs;
    private int extraRuns;
    private String extraType;
    private String wicketType;
    private Long strikerId;
    private String strikerName;
    private Long nonStrikerId;
    private String nonStrikerName;
    private Long bowlerId;
    private String bowlerName;
    private String description;
    private String eventBadge; // e.g., "4", "6", "W", "1", "WD"
    private LocalDateTime timestamp;
}
