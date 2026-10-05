package com.cricscore.dto;

import com.cricscore.entity.enums.EventType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEventRequestDto {

    @NotNull(message = "Event type is required (e.g. RUN, FOUR, SIX, WICKET, WIDE, NO_BALL, DOT_BALL)")
    private EventType eventType;

    @Min(value = 0, message = "Runs cannot be negative")
    @Builder.Default
    private Integer runs = 0;

    @Min(value = 0, message = "Extra runs cannot be negative")
    @Builder.Default
    private Integer extraRuns = 0;

    private String extraType; // WIDE, NO_BALL, BYE, LEG_BYE

    private String wicketType; // BOWLED, CAUGHT, LBW, RUN_OUT, STUMPED

    private Long strikerId;

    private Long nonStrikerId;

    private Long bowlerId;

    private String description;
}
