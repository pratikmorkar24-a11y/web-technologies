package com.cricscore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "innings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Innings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batting_team_id", nullable = false)
    private Team battingTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bowling_team_id", nullable = false)
    private Team bowlingTeam;

    @Column(nullable = false)
    @Builder.Default
    private int runs = 0;

    @Column(nullable = false)
    @Builder.Default
    private int wickets = 0;

    @Column(nullable = false)
    @Builder.Default
    private int balls = 0; // Number of legal deliveries bowled

    @Column
    private Integer target;

    @Column(nullable = false)
    @Builder.Default
    private int inningsNumber = 1;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    public String getOversString() {
        int completedOvers = balls / 6;
        int remainingBalls = balls % 6;
        return completedOvers + "." + remainingBalls;
    }

    public double getRunRate() {
        if (balls == 0) return 0.0;
        double overs = (balls / 6) + ((balls % 6) / 6.0);
        return Math.round((runs / overs) * 100.0) / 100.0;
    }
}
