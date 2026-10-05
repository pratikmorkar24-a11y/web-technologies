package com.cricscore.config;

import com.cricscore.entity.*;
import com.cricscore.entity.enums.EventType;
import com.cricscore.entity.enums.MatchStatus;
import com.cricscore.entity.enums.PlayerRole;
import com.cricscore.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final InningsRepository inningsRepository;
    private final MatchEventRepository matchEventRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (matchRepository.count() > 0) {
            log.info("Database already initialized.");
            return;
        }

        log.info("Initializing CricScore realistic sample data...");

        // 1. TEAMS
        Team india = teamRepository.save(Team.builder().name("India").shortName("IND").country("India").build());
        Team australia = teamRepository.save(Team.builder().name("Australia").shortName("AUS").country("Australia").build());
        Team england = teamRepository.save(Team.builder().name("England").shortName("ENG").country("England").build());
        Team pakistan = teamRepository.save(Team.builder().name("Pakistan").shortName("PAK").country("Pakistan").build());

        // 2. PLAYERS
        // India Players
        Player rohit = createPlayer("Rohit Sharma", PlayerRole.BATSMAN, india);
        Player gill = createPlayer("Shubman Gill", PlayerRole.BATSMAN, india);
        Player kohli = createPlayer("Virat Kohli", PlayerRole.BATSMAN, india);
        Player surya = createPlayer("Suryakumar Yadav", PlayerRole.BATSMAN, india);
        Player pant = createPlayer("Rishabh Pant", PlayerRole.WICKET_KEEPER, india);
        Player hardik = createPlayer("Hardik Pandya", PlayerRole.ALL_ROUNDER, india);
        Player jadeja = createPlayer("Ravindra Jadeja", PlayerRole.ALL_ROUNDER, india);
        Player axar = createPlayer("Axar Patel", PlayerRole.ALL_ROUNDER, india);
        Player kuldeep = createPlayer("Kuldeep Yadav", PlayerRole.BOWLER, india);
        Player bumrah = createPlayer("Jasprit Bumrah", PlayerRole.BOWLER, india);
        Player arshdeep = createPlayer("Arshdeep Singh", PlayerRole.BOWLER, india);

        // Australia Players
        Player head = createPlayer("Travis Head", PlayerRole.BATSMAN, australia);
        Player warner = createPlayer("David Warner", PlayerRole.BATSMAN, australia);
        Player marsh = createPlayer("Mitchell Marsh", PlayerRole.ALL_ROUNDER, australia);
        Player maxwell = createPlayer("Glenn Maxwell", PlayerRole.ALL_ROUNDER, australia);
        Player stoinis = createPlayer("Marcus Stoinis", PlayerRole.ALL_ROUNDER, australia);
        Player david = createPlayer("Tim David", PlayerRole.BATSMAN, australia);
        Player wade = createPlayer("Matthew Wade", PlayerRole.WICKET_KEEPER, australia);
        Player cummins = createPlayer("Pat Cummins", PlayerRole.BOWLER, australia);
        Player starc = createPlayer("Mitchell Starc", PlayerRole.BOWLER, australia);
        Player zampa = createPlayer("Adam Zampa", PlayerRole.BOWLER, australia);
        Player hazlewood = createPlayer("Josh Hazlewood", PlayerRole.BOWLER, australia);

        // England Players
        Player buttler = createPlayer("Jos Buttler", PlayerRole.WICKET_KEEPER, england);
        Player salt = createPlayer("Phil Salt", PlayerRole.BATSMAN, england);
        Player jacks = createPlayer("Will Jacks", PlayerRole.BATSMAN, england);
        Player bairstow = createPlayer("Jonny Bairstow", PlayerRole.BATSMAN, england);
        Player brook = createPlayer("Harry Brook", PlayerRole.BATSMAN, england);
        Player moeen = createPlayer("Moeen Ali", PlayerRole.ALL_ROUNDER, england);
        Player livingstone = createPlayer("Liam Livingstone", PlayerRole.ALL_ROUNDER, england);
        Player curran = createPlayer("Sam Curran", PlayerRole.ALL_ROUNDER, england);
        Player jordan = createPlayer("Chris Jordan", PlayerRole.BOWLER, england);
        Player archer = createPlayer("Jofra Archer", PlayerRole.BOWLER, england);
        Player rashid = createPlayer("Adil Rashid", PlayerRole.BOWLER, england);

        // Pakistan Players
        Player babar = createPlayer("Babar Azam", PlayerRole.BATSMAN, pakistan);
        Player rizwan = createPlayer("Mohammad Rizwan", PlayerRole.WICKET_KEEPER, pakistan);
        Player fakhar = createPlayer("Fakhar Zaman", PlayerRole.BATSMAN, pakistan);
        Player iftikhar = createPlayer("Iftikhar Ahmed", PlayerRole.ALL_ROUNDER, pakistan);
        Player shadab = createPlayer("Shadab Khan", PlayerRole.ALL_ROUNDER, pakistan);
        Player imad = createPlayer("Imad Wasim", PlayerRole.ALL_ROUNDER, pakistan);
        Player shaheen = createPlayer("Shaheen Afridi", PlayerRole.BOWLER, pakistan);
        Player naseem = createPlayer("Naseem Shah", PlayerRole.BOWLER, pakistan);
        Player rauf = createPlayer("Haris Rauf", PlayerRole.BOWLER, pakistan);
        Player amir = createPlayer("Mohammad Amir", PlayerRole.BOWLER, pakistan);
        Player usman = createPlayer("Usman Khan", PlayerRole.BATSMAN, pakistan);

        // 3. MATCH 1: India vs Australia — LIVE
        Match liveMatch = matchRepository.save(Match.builder()
                .team1(india)
                .team2(australia)
                .venue("Narendra Modi Stadium, Ahmedabad")
                .matchDate(LocalDateTime.now().minusHours(2))
                .format("T20I")
                .totalOvers(20)
                .status(MatchStatus.LIVE)
                .tossWinner(australia)
                .tossDecision("BAT")
                .battingFirstTeam(australia)
                .build());

        // Innings 1: Australia (185/6 in 20.0 ov)
        Innings ausInnings = inningsRepository.save(Innings.builder()
                .match(liveMatch)
                .battingTeam(australia)
                .bowlingTeam(india)
                .inningsNumber(1)
                .runs(185)
                .wickets(6)
                .balls(120)
                .completed(true)
                .build());

        seedAusInnings1(ausInnings, List.of(head, warner, marsh, maxwell, stoinis, david, wade, cummins),
                List.of(bumrah, arshdeep, kuldeep, axar, hardik));

        // Innings 2: India chasing 186 (158/3 in 16.4 ov, target 186, needs 28 runs in 20 balls)
        Innings indInnings = inningsRepository.save(Innings.builder()
                .match(liveMatch)
                .battingTeam(india)
                .bowlingTeam(australia)
                .inningsNumber(2)
                .target(186)
                .runs(158)
                .wickets(3)
                .balls(100)
                .completed(false)
                .build());

        seedIndChaseEvents(indInnings, rohit, gill, kohli, surya, hardik, starc, hazlewood, cummins, zampa);

        // 4. MATCH 2: England vs Pakistan — UPCOMING
        matchRepository.save(Match.builder()
                .team1(england)
                .team2(pakistan)
                .venue("Lord's Cricket Ground, London")
                .matchDate(LocalDateTime.now().plusDays(1).withHour(19).withMinute(0))
                .format("T20I")
                .totalOvers(20)
                .status(MatchStatus.UPCOMING)
                .build());

        // 5. MATCH 3: India vs England — COMPLETED
        Match completedMatch = matchRepository.save(Match.builder()
                .team1(india)
                .team2(england)
                .venue("Wankhede Stadium, Mumbai")
                .matchDate(LocalDateTime.now().minusDays(2))
                .format("T20I")
                .totalOvers(20)
                .status(MatchStatus.COMPLETED)
                .tossWinner(england)
                .tossDecision("BOWL")
                .battingFirstTeam(india)
                .winner(india)
                .playerOfTheMatch(bumrah)
                .resultDescription("India won by 24 runs")
                .build());

        // Innings 1: India 198/5 (20.0 ov)
        Innings compIndInnings = inningsRepository.save(Innings.builder()
                .match(completedMatch)
                .battingTeam(india)
                .bowlingTeam(england)
                .inningsNumber(1)
                .runs(198)
                .wickets(5)
                .balls(120)
                .completed(true)
                .build());

        seedMatch3Innings(compIndInnings,
                List.of(rohit, gill, kohli, surya, pant, hardik),
                List.of(archer, curran, rashid, jordan), 198, 5);

        // Innings 2: England 174/9 (20.0 ov)
        Innings compEngInnings = inningsRepository.save(Innings.builder()
                .match(completedMatch)
                .battingTeam(england)
                .bowlingTeam(india)
                .inningsNumber(2)
                .target(199)
                .runs(174)
                .wickets(9)
                .balls(120)
                .completed(true)
                .build());

        seedMatch3Innings(compEngInnings,
                List.of(buttler, salt, jacks, bairstow, brook, moeen, livingstone, curran, jordan),
                List.of(bumrah, arshdeep, kuldeep, axar, hardik), 174, 9);

        log.info("CricScore sample data loaded successfully!");
    }

    private Player createPlayer(String name, PlayerRole role, Team team) {
        return playerRepository.save(Player.builder()
                .name(name)
                .role(role)
                .team(team)
                .build());
    }

    private void seedAusInnings1(Innings inn, List<Player> bats, List<Player> bowls) {
        LocalDateTime time = LocalDateTime.now().minusHours(2);
        // Over patterns that sum exactly to 185 runs across 20 overs (6 wickets)
        int[][] overRuns = {
            {1, 0, 4, 1, 0, 0}, // 6  (ov 0, Bumrah)
            {0, 2, 0, 4, 1, 1}, // 8  (ov 1, Arshdeep)
            {4, 1, 0, 6, 0, 0}, // 11 (ov 2, Bumrah)
            {1, 0, 4, 0, 1, 1}, // 7  (ov 3, Arshdeep)
            {6, 1, 1, 4, 2, 0}, // 14 (ov 4, Hardik)
            {1, 0, 4, 1, 0, 2}, // 8  (ov 5, Axar) -> 54/0
            {0, 1, 0, 0, 4, 1}, // 6  (ov 6, Kuldeep - wkt 1)
            {1, 2, 0, 1, 4, 1}, // 9  (ov 7, Axar)
            {4, 0, 6, 1, 1, 0}, // 12 (ov 8, Kuldeep)
            {1, 0, 0, 1, 4, 1}, // 7  (ov 9, Axar - wkt 2)
            {0, 2, 1, 4, 0, 1}, // 8  (ov 10, Hardik)
            {1, 1, 4, 0, 2, 2}, // 10 (ov 11, Kuldeep)
            {6, 1, 0, 4, 1, 1}, // 13 (ov 12, Hardik - wkt 3)
            {1, 0, 2, 1, 4, 1}, // 9  (ov 13, Axar)
            {4, 1, 0, 6, 0, 0}, // 11 (ov 14, Kuldeep - wkt 4)
            {2, 4, 1, 6, 1, 1}, // 15 (ov 15, Arshdeep)
            {1, 0, 1, 4, 1, 1}, // 8  (ov 16, Bumrah - wkt 5)
            {2, 1, 4, 0, 2, 1}, // 10 (ov 17, Arshdeep)
            {1, 0, 1, 0, 4, 1}, // 7  (ov 18, Bumrah - wkt 6)
            {1, 2, 0, 1, 1, 1}  // 6  (ov 19, Arshdeep) -> total: 185
        };

        Player b1 = bats.get(0); // Head
        Player b2 = bats.get(1); // Warner
        int nextBat = 2;

        int[] wktBalls = {39, 58, 76, 88, 99, 112}; // 6 wickets
        int ballCount = 0;

        for (int ov = 0; ov < 20; ov++) {
            Player bowler = bowls.get(ov % bowls.size());
            for (int b = 1; b <= 6; b++) {
                ballCount++;
                time = time.plusSeconds(30);
                int r = overRuns[ov][b - 1];

                boolean isWkt = false;
                for (int wb : wktBalls) {
                    if (ballCount == wb) { isWkt = true; break; }
                }

                EventType type = EventType.RUN;
                String wktType = null;
                if (isWkt) {
                    type = EventType.WICKET;
                    wktType = (ballCount % 2 == 0) ? "CAUGHT" : "BOWLED";
                    r = 0;
                } else if (r == 4) type = EventType.FOUR;
                else if (r == 6) type = EventType.SIX;
                else if (r == 0) type = EventType.DOT_BALL;

                String desc = bowler.getName() + " to " + b1.getName() + ", " +
                        (isWkt ? ("OUT! " + wktType + "!") : (r + " runs."));

                matchEventRepository.save(MatchEvent.builder()
                        .innings(inn)
                        .overNumber(ov)
                        .ballNumber(b)
                        .eventType(type)
                        .runs(r)
                        .extraRuns(0)
                        .wicketType(wktType)
                        .striker(b1)
                        .nonStriker(b2)
                        .bowler(bowler)
                        .description(desc)
                        .timestamp(time)
                        .build());

                if (isWkt && nextBat < bats.size()) {
                    b1 = bats.get(nextBat++);
                } else if (r % 2 != 0) {
                    Player t = b1; b1 = b2; b2 = t;
                }
            }
            Player t = b1; b1 = b2; b2 = t;
        }
    }

    private void seedIndChaseEvents(Innings inn, Player rohit, Player gill, Player kohli, Player surya, Player hardik,
                                    Player starc, Player hazlewood, Player cummins, Player zampa) {
        LocalDateTime time = LocalDateTime.now().minusMinutes(45);

        // Over patterns that sum to EXACTLY 158 runs across 16.4 overs (100 balls)
        // 16 full overs + 4 balls in 17th over = 100 legal balls
        // Over by over runs:
        // 8 + 6 + 12 + 6 + 12 + 9 + 8 + 6 + 12 + 6 + 6 + 13 + 8 + 13 + 9 + 17 + 7 = 158 runs
        int[][] overData = {
            {1, 0, 4, 1, 0, 2}, // 8  (ov 0, Starc) - Rohit & Gill
            {0, 1, 0, 4, 1, 0}, // 6  (ov 1, Hazlewood)
            {4, 0, 6, 1, 0, 1}, // 12 (ov 2, Starc)
            {0, 1, 0, 0, 1, 4}, // 6  (ov 3, Hazlewood - ball 4: Wicket Gill!) -> score 32/1
            {1, 4, 0, 1, 6, 0}, // 12 (ov 4, Cummins)
            {1, 1, 0, 4, 1, 2}, // 9  (ov 5, Zampa) -> score 53/1 (Powerplay)
            {1, 0, 2, 1, 4, 0}, // 8  (ov 6, Cummins)
            {1, 1, 0, 1, 1, 2}, // 6  (ov 7, Zampa)
            {6, 1, 4, 0, 1, 0}, // 12 (ov 8, Starc) -> Rohit on 42
            {1, 0, 0, 1, 4, 0}, // 6  (ov 9, Hazlewood - ball 3: Wicket Rohit!) -> score 85/2
            {1, 1, 0, 2, 1, 1}, // 6  (ov 10, Zampa)
            {4, 1, 1, 6, 0, 1}, // 13 (ov 11, Cummins)
            {0, 1, 4, 1, 2, 0}, // 8  (ov 12, Zampa)
            {1, 6, 1, 0, 1, 4}, // 13 (ov 13, Starc - ball 4: Wicket Surya!) -> score 125/3
            {1, 1, 0, 2, 1, 4}, // 9  (ov 14, Hazlewood)
            {6, 1, 4, 1, 1, 4}, // 17 (ov 15, Zampa) -> score 151/3
            {1, 0, 2, 4}        // 7  (ov 16, Cummins: 4 balls) -> score 158/3 in 16.4 ov
        };

        Player b1 = rohit;
        Player b2 = gill;

        int ballCounter = 0;

        for (int ov = 0; ov < 17; ov++) {
            // Pick realistic bowler: Starc, Hazlewood, Cummins, Zampa
            Player bowler;
            if (ov == 0 || ov == 2 || ov == 8 || ov == 13) bowler = starc;
            else if (ov == 1 || ov == 3 || ov == 9 || ov == 14) bowler = hazlewood;
            else if (ov == 5 || ov == 7 || ov == 10 || ov == 12 || ov == 15) bowler = zampa;
            else bowler = cummins; // ov 4, 6, 11, 16

            int ballsInOver = (ov == 16) ? 4 : 6;

            for (int b = 1; b <= ballsInOver; b++) {
                ballCounter++;
                time = time.plusSeconds(25);
                int r = overData[ov][b - 1];

                boolean isWkt = false;
                String wktType = null;

                // Wickets at ball 22 (Gill), ball 57 (Rohit), ball 82 (Surya)
                if (ballCounter == 22) { // Gill bowled
                    isWkt = true;
                    wktType = "BOWLED";
                    r = 0;
                } else if (ballCounter == 57) { // Rohit caught
                    isWkt = true;
                    wktType = "CAUGHT";
                    r = 0;
                } else if (ballCounter == 82) { // Surya caught
                    isWkt = true;
                    wktType = "CAUGHT";
                    r = 0;
                }

                EventType type = EventType.RUN;
                if (isWkt) type = EventType.WICKET;
                else if (r == 4) type = EventType.FOUR;
                else if (r == 6) type = EventType.SIX;
                else if (r == 0) type = EventType.DOT_BALL;

                String desc;
                if (isWkt) {
                    desc = bowler.getName() + " to " + b1.getName() + ", OUT! " + wktType + "! Huge breakthrough!";
                } else if (r == 4) {
                    desc = bowler.getName() + " to " + b1.getName() + ", FOUR! Beautifully timed to the boundary!";
                } else if (r == 6) {
                    desc = bowler.getName() + " to " + b1.getName() + ", SIX! High and handsome into the stands!";
                } else if (r == 0) {
                    desc = bowler.getName() + " to " + b1.getName() + ", no run. Good delivery defended well.";
                } else {
                    desc = bowler.getName() + " to " + b1.getName() + ", " + r + (r == 1 ? " run." : " runs.");
                }

                matchEventRepository.save(MatchEvent.builder()
                        .innings(inn)
                        .overNumber(ov)
                        .ballNumber(b)
                        .eventType(type)
                        .runs(r)
                        .extraRuns(0)
                        .wicketType(wktType)
                        .striker(b1)
                        .nonStriker(b2)
                        .bowler(bowler)
                        .description(desc)
                        .timestamp(time)
                        .build());

                if (isWkt) {
                    if (ballCounter == 22) b1 = kohli;
                    else if (ballCounter == 57) b1 = surya;
                    else if (ballCounter == 82) b1 = hardik;
                } else if (r % 2 != 0) {
                    Player t = b1; b1 = b2; b2 = t;
                }
            }

            if (ballsInOver == 6) {
                Player t = b1; b1 = b2; b2 = t;
            }
        }
    }

    private void seedMatch3Innings(Innings inn, List<Player> bats, List<Player> bowls, int targetRuns, int targetWkts) {
        LocalDateTime time = LocalDateTime.now().minusDays(2);
        Player b1 = bats.get(0);
        Player b2 = bats.get(1);
        int nextBat = 2;
        int ballCount = 0;
        int currentRuns = 0;
        int currentWkts = 0;

        for (int ov = 0; ov < 20; ov++) {
            Player bowler = bowls.get(ov % bowls.size());
            for (int b = 1; b <= 6; b++) {
                ballCount++;
                time = time.plusSeconds(30);

                boolean isWkt = false;
                if (currentWkts < targetWkts && (ballCount % (120 / (targetWkts + 1)) == 0)) {
                    isWkt = true;
                    currentWkts++;
                }

                int r = 1;
                if (isWkt) {
                    r = 0;
                } else if (ballCount % 7 == 0) {
                    r = 4;
                } else if (ballCount % 15 == 0) {
                    r = 6;
                } else if (ballCount % 4 == 0) {
                    r = 0;
                } else if (ballCount % 8 == 0) {
                    r = 2;
                }

                currentRuns += r;

                EventType type = EventType.RUN;
                if (isWkt) type = EventType.WICKET;
                else if (r == 4) type = EventType.FOUR;
                else if (r == 6) type = EventType.SIX;
                else if (r == 0) type = EventType.DOT_BALL;

                String desc = bowler.getName() + " to " + b1.getName() + ", " + (isWkt ? "OUT!" : (r + " runs."));

                matchEventRepository.save(MatchEvent.builder()
                        .innings(inn)
                        .overNumber(ov)
                        .ballNumber(b)
                        .eventType(type)
                        .runs(r)
                        .extraRuns(0)
                        .wicketType(isWkt ? "CAUGHT" : null)
                        .striker(b1)
                        .nonStriker(b2)
                        .bowler(bowler)
                        .description(desc)
                        .timestamp(time)
                        .build());

                if (isWkt && nextBat < bats.size()) {
                    b1 = bats.get(nextBat++);
                } else if (r % 2 != 0) {
                    Player t = b1; b1 = b2; b2 = t;
                }
            }
            Player t = b1; b1 = b2; b2 = t;
        }
    }
}
