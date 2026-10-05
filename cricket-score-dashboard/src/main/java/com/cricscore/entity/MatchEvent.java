package com.cricscore.entity;

import com.cricscore.entity.enums.EventType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @Column(nullable = false)
    private int overNumber; // 0-indexed or 1-indexed (e.g., 0 for first over, 16 for 17th over)

    @Column(nullable = false)
    private int ballNumber; // 1 to 6 (or more if extras)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventType eventType;

    @Column(nullable = false)
    @Builder.Default
    private int runs = 0; // Batting runs

    @Column(nullable = false)
    @Builder.Default
    private int extraRuns = 0; // Extras

    @Column(length = 20)
    private String extraType; // WIDE, NO_BALL, BYE, LEG_BYE

    @Column(length = 30)
    private String wicketType; // BOWLED, CAUGHT, LBW, RUN_OUT, STUMPED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "striker_id", nullable = false)
    private Player striker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "non_striker_id")
    private Player nonStriker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bowler_id", nullable = false)
    private Player bowler;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
