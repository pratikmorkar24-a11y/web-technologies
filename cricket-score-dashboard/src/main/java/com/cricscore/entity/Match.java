package com.cricscore.entity;

import com.cricscore.entity.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team1_id", nullable = false)
    private Team team1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team2_id", nullable = false)
    private Team team2;

    @Column(nullable = false, length = 150)
    private String venue;

    @Column(nullable = false)
    private LocalDateTime matchDate;

    @Column(nullable = false, length = 20)
    private String format; // e.g. T20, ODI, TEST

    @Column(nullable = false)
    private Integer totalOvers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MatchStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "toss_winner_id")
    private Team tossWinner;

    @Column(length = 20)
    private String tossDecision; // e.g., "BAT", "BOWL"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batting_first_team_id")
    private Team battingFirstTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "winner_id")
    private Team winner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_of_match_id")
    private Player playerOfTheMatch;

    @Column(length = 255)
    private String resultDescription;
}
