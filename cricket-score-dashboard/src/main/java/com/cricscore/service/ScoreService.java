package com.cricscore.service;

import com.cricscore.dto.*;
import com.cricscore.entity.*;
import com.cricscore.entity.enums.EventType;
import com.cricscore.entity.enums.MatchStatus;
import com.cricscore.exception.BadRequestException;
import com.cricscore.exception.ResourceNotFoundException;
import com.cricscore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final MatchRepository matchRepository;
    private final InningsRepository inningsRepository;
    private final MatchEventRepository matchEventRepository;
    private final PlayerRepository playerRepository;

    @Transactional(readOnly = true)
    public LiveScoreDto getLiveScore(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));

        List<Innings> inningsList = inningsRepository.findByMatchIdOrderByInningsNumberAsc(matchId);
        if (inningsList.isEmpty()) {
            return buildEmptyLiveScore(match);
        }

        // Active innings is the latest one (or the first incomplete one)
        Innings currentInnings = inningsList.get(inningsList.size() - 1);
        if (inningsList.size() > 1 && !inningsList.get(0).isCompleted()) {
            currentInnings = inningsList.get(0);
        }

        List<MatchEvent> events = matchEventRepository.findByInningsIdOrderByTimestampAsc(currentInnings.getId());

        // Calculate scores from events
        int totalRuns = 0;
        int totalWickets = 0;
        int legalBalls = 0;

        for (MatchEvent e : events) {
            totalRuns += e.getRuns() + e.getExtraRuns();
            if (e.getEventType() == EventType.WICKET) {
                totalWickets++;
            }
            if (isLegalDelivery(e.getEventType())) {
                legalBalls++;
            }
        }

        String oversStr = (legalBalls / 6) + "." + (legalBalls % 6);
        double runRate = calculateRunRate(totalRuns, legalBalls);

        // Required run rate / target calculation
        Integer target = currentInnings.getTarget();
        Double reqRunRate = null;
        Integer runsNeeded = null;
        Integer ballsRemaining = null;
        String matchSituation;

        if (target != null && target > 0) {
            runsNeeded = Math.max(0, target - totalRuns);
            int maxBalls = match.getTotalOvers() * 6;
            ballsRemaining = Math.max(0, maxBalls - legalBalls);
            if (ballsRemaining > 0 && runsNeeded > 0) {
                double remOvers = ballsRemaining / 6.0;
                reqRunRate = Math.round((runsNeeded / remOvers) * 100.0) / 100.0;
                matchSituation = currentInnings.getBattingTeam().getName() + " need " + runsNeeded + " runs from " + ballsRemaining + " balls";
            } else if (runsNeeded <= 0) {
                matchSituation = currentInnings.getBattingTeam().getName() + " won by " + (10 - totalWickets) + " wickets";
            } else {
                matchSituation = "Innings completed";
            }
        } else {
            matchSituation = currentInnings.getBattingTeam().getName() + " are batting first (" + currentInnings.getOversString() + " ov)";
        }

        if (match.getStatus() == MatchStatus.COMPLETED && match.getResultDescription() != null) {
            matchSituation = match.getResultDescription();
        }

        // Batsmen & Bowler calculations
        List<BatsmanScoreDto> batsmen = calculateBattingStatsFromEvents(currentInnings, events);
        List<BowlerScoreDto> bowlers = calculateBowlingStatsFromEvents(currentInnings, events);

        // Find active batsmen (striker and non-striker)
        BatsmanScoreDto striker = null;
        BatsmanScoreDto nonStriker = null;

        List<BatsmanScoreDto> notOutBatsmen = batsmen.stream()
                .filter(b -> !b.isOut())
                .collect(Collectors.toList());

        if (!notOutBatsmen.isEmpty()) {
            striker = notOutBatsmen.stream().filter(BatsmanScoreDto::isOnStrike).findFirst()
                    .orElse(notOutBatsmen.get(0));
            if (notOutBatsmen.size() > 1) {
                final Long strikerId = striker.getPlayerId();
                nonStriker = notOutBatsmen.stream().filter(b -> !b.getPlayerId().equals(strikerId)).findFirst().orElse(null);
            }
        }

        BowlerScoreDto currentBowler = bowlers.stream()
                .filter(BowlerScoreDto::isCurrentBowler)
                .findFirst()
                .orElse(bowlers.isEmpty() ? null : bowlers.get(bowlers.size() - 1));

        // Current over balls
        int currentOverNumber = legalBalls / 6;
        if (legalBalls % 6 == 0 && legalBalls > 0 && !events.isEmpty()) {
            // Check if the last ball finished the over
            MatchEvent lastEvent = events.get(events.size() - 1);
            currentOverNumber = lastEvent.getOverNumber();
        }
        final int targetOver = currentOverNumber;
        List<String> currentOverBalls = events.stream()
                .filter(e -> e.getOverNumber() == targetOver)
                .map(this::formatBallBadge)
                .collect(Collectors.toList());

        // Recent events (last 8)
        List<MatchEventResponseDto> recentEvents = events.stream()
                .sorted(Comparator.comparing(MatchEvent::getTimestamp).reversed())
                .limit(8)
                .map(this::mapToEventDto)
                .collect(Collectors.toList());

        return LiveScoreDto.builder()
                .matchId(match.getId())
                .status(match.getStatus())
                .format(match.getFormat())
                .venue(match.getVenue())
                .totalOvers(match.getTotalOvers())
                .team1Id(match.getTeam1().getId())
                .team1Name(match.getTeam1().getName())
                .team1ShortName(match.getTeam1().getShortName())
                .team2Id(match.getTeam2().getId())
                .team2Name(match.getTeam2().getName())
                .team2ShortName(match.getTeam2().getShortName())
                .battingTeamId(currentInnings.getBattingTeam().getId())
                .battingTeamName(currentInnings.getBattingTeam().getName())
                .battingTeamShortName(currentInnings.getBattingTeam().getShortName())
                .bowlingTeamId(currentInnings.getBowlingTeam().getId())
                .bowlingTeamName(currentInnings.getBowlingTeam().getName())
                .bowlingTeamShortName(currentInnings.getBowlingTeam().getShortName())
                .inningsNumber(currentInnings.getInningsNumber())
                .runs(totalRuns)
                .wickets(totalWickets)
                .balls(legalBalls)
                .overs(oversStr)
                .runRate(runRate)
                .target(target)
                .requiredRunRate(reqRunRate)
                .runsNeeded(runsNeeded)
                .ballsRemaining(ballsRemaining)
                .matchSituation(matchSituation)
                .striker(striker)
                .nonStriker(nonStriker)
                .currentBowler(currentBowler)
                .currentOverBalls(currentOverBalls)
                .recentEvents(recentEvents)
                .build();
    }

    @Transactional(readOnly = true)
    public List<BatsmanScoreDto> getBattingStats(Long matchId) {
        Innings innings = getCurrentOrLatestInnings(matchId);
        List<MatchEvent> events = matchEventRepository.findByInningsIdOrderByTimestampAsc(innings.getId());
        return calculateBattingStatsFromEvents(innings, events);
    }

    @Transactional(readOnly = true)
    public List<BowlerScoreDto> getBowlingStats(Long matchId) {
        Innings innings = getCurrentOrLatestInnings(matchId);
        List<MatchEvent> events = matchEventRepository.findByInningsIdOrderByTimestampAsc(innings.getId());
        return calculateBowlingStatsFromEvents(innings, events);
    }

    @Transactional(readOnly = true)
    public List<MatchEventResponseDto> getEvents(Long matchId) {
        List<MatchEvent> events = matchEventRepository.findByInningsMatchIdOrderByTimestampDesc(matchId);
        return events.stream().map(this::mapToEventDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScorecardDto getScorecard(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));

        List<Innings> inningsList = inningsRepository.findByMatchIdOrderByInningsNumberAsc(matchId);
        List<InningsScoreDto> dtoList = new ArrayList<>();

        for (Innings inn : inningsList) {
            List<MatchEvent> events = matchEventRepository.findByInningsIdOrderByTimestampAsc(inn.getId());
            List<BatsmanScoreDto> batsmen = calculateBattingStatsFromEvents(inn, events);
            List<BowlerScoreDto> bowlers = calculateBowlingStatsFromEvents(inn, events);

            int extras = events.stream().mapToInt(MatchEvent::getExtraRuns).sum();

            dtoList.add(InningsScoreDto.builder()
                    .inningsId(inn.getId())
                    .inningsNumber(inn.getInningsNumber())
                    .battingTeamId(inn.getBattingTeam().getId())
                    .battingTeamName(inn.getBattingTeam().getName())
                    .battingTeamShortName(inn.getBattingTeam().getShortName())
                    .bowlingTeamId(inn.getBowlingTeam().getId())
                    .bowlingTeamName(inn.getBowlingTeam().getName())
                    .bowlingTeamShortName(inn.getBowlingTeam().getShortName())
                    .runs(inn.getRuns())
                    .wickets(inn.getWickets())
                    .balls(inn.getBalls())
                    .overs(inn.getOversString())
                    .runRate(inn.getRunRate())
                    .target(inn.getTarget())
                    .extras(extras)
                    .completed(inn.isCompleted())
                    .batsmen(batsmen)
                    .bowlers(bowlers)
                    .build());
        }

        return ScorecardDto.builder()
                .matchId(match.getId())
                .status(match.getStatus())
                .format(match.getFormat())
                .venue(match.getVenue())
                .team1Name(match.getTeam1().getName())
                .team2Name(match.getTeam2().getName())
                .resultDescription(match.getResultDescription())
                .inningsList(dtoList)
                .build();
    }

    @Transactional(readOnly = true)
    public MatchSummaryDto getSummary(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));

        ScorecardDto scorecard = getScorecard(matchId);

        String tossInfo = null;
        if (match.getTossWinner() != null) {
            tossInfo = match.getTossWinner().getName() + " won the toss and chose to " +
                    (match.getTossDecision() != null ? match.getTossDecision().toLowerCase() : "bat");
        }

        return MatchSummaryDto.builder()
                .matchId(match.getId())
                .status(match.getStatus())
                .format(match.getFormat())
                .venue(match.getVenue())
                .matchDate(match.getMatchDate())
                .team1Name(match.getTeam1().getName())
                .team1ShortName(match.getTeam1().getShortName())
                .team2Name(match.getTeam2().getName())
                .team2ShortName(match.getTeam2().getShortName())
                .tossWinnerName(match.getTossWinner() != null ? match.getTossWinner().getName() : null)
                .tossDecision(match.getTossDecision())
                .tossInfo(tossInfo)
                .battingFirstTeamName(match.getBattingFirstTeam() != null ? match.getBattingFirstTeam().getName() : null)
                .winnerName(match.getWinner() != null ? match.getWinner().getName() : null)
                .playerOfMatchName(match.getPlayerOfTheMatch() != null ? match.getPlayerOfTheMatch().getName() : null)
                .resultDescription(match.getResultDescription())
                .scorecard(scorecard)
                .build();
    }

    @Transactional
    public MatchEventResponseDto recordEvent(Long matchId, MatchEventRequestDto request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));

        if (match.getStatus() == MatchStatus.COMPLETED) {
            throw new BadRequestException("Match is already completed. Cannot record new events.");
        }

        List<Innings> inningsList = inningsRepository.findByMatchIdOrderByInningsNumberAsc(matchId);
        if (inningsList.isEmpty()) {
            throw new BadRequestException("No innings found for this match.");
        }

        Innings currentInnings = inningsList.get(inningsList.size() - 1);
        if (inningsList.size() > 1 && !inningsList.get(0).isCompleted()) {
            currentInnings = inningsList.get(0);
        }

        List<MatchEvent> events = matchEventRepository.findByInningsIdOrderByTimestampAsc(currentInnings.getId());

        // Resolve striker, non-striker, bowler
        Player striker = resolveStriker(currentInnings, events, request.getStrikerId());
        Player nonStriker = resolveNonStriker(currentInnings, events, striker, request.getNonStrikerId());
        Player bowler = resolveBowler(currentInnings, events, request.getBowlerId());

        // Calculate over and ball numbers
        int legalBallsSoFar = (int) events.stream().filter(e -> isLegalDelivery(e.getEventType())).count();
        int overNumber = legalBallsSoFar / 6;
        int ballNumber = (legalBallsSoFar % 6) + 1;

        // Auto-configure event properties
        int runs = request.getRuns() != null ? request.getRuns() : 0;
        int extraRuns = request.getExtraRuns() != null ? request.getExtraRuns() : 0;
        String extraType = request.getExtraType();
        String wicketType = request.getWicketType();

        switch (request.getEventType()) {
            case FOUR:
                runs = 4;
                extraRuns = 0;
                break;
            case SIX:
                runs = 6;
                extraRuns = 0;
                break;
            case DOT_BALL:
                runs = 0;
                extraRuns = 0;
                break;
            case WIDE:
                extraType = "WIDE";
                if (extraRuns == 0) extraRuns = 1;
                runs = 0;
                break;
            case NO_BALL:
                extraType = "NO_BALL";
                if (extraRuns == 0) extraRuns = 1;
                break;
            case BYE:
                extraType = "BYE";
                if (extraRuns == 0) extraRuns = runs > 0 ? runs : 1;
                runs = 0;
                break;
            case LEG_BYE:
                extraType = "LEG_BYE";
                if (extraRuns == 0) extraRuns = runs > 0 ? runs : 1;
                runs = 0;
                break;
            case WICKET:
                if (wicketType == null) wicketType = "CAUGHT";
                break;
            case RUN:
            default:
                break;
        }

        String description = request.getDescription();
        if (description == null || description.trim().isEmpty()) {
            description = generateEventDescription(request.getEventType(), runs, extraRuns, extraType,
                    wicketType, striker, bowler);
        }

        MatchEvent event = MatchEvent.builder()
                .innings(currentInnings)
                .overNumber(overNumber)
                .ballNumber(ballNumber)
                .eventType(request.getEventType())
                .runs(runs)
                .extraRuns(extraRuns)
                .extraType(extraType)
                .wicketType(wicketType)
                .striker(striker)
                .nonStriker(nonStriker)
                .bowler(bowler)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();

        MatchEvent savedEvent = matchEventRepository.save(event);

        // Update innings cumulative scores
        int newRuns = currentInnings.getRuns() + runs + extraRuns;
        int newBalls = currentInnings.getBalls() + (isLegalDelivery(request.getEventType()) ? 1 : 0);
        int newWickets = currentInnings.getWickets() + (request.getEventType() == EventType.WICKET ? 1 : 0);

        currentInnings.setRuns(newRuns);
        currentInnings.setBalls(newBalls);
        currentInnings.setWickets(newWickets);

        // Check completion condition
        int maxLegalBalls = match.getTotalOvers() * 6;
        boolean inningsDone = false;

        if (newWickets >= 10 || newBalls >= maxLegalBalls) {
            inningsDone = true;
        }

        // Second innings chase condition
        if (currentInnings.getTarget() != null && currentInnings.getTarget() > 0) {
            if (newRuns >= currentInnings.getTarget()) {
                inningsDone = true;
                match.setStatus(MatchStatus.COMPLETED);
                match.setWinner(currentInnings.getBattingTeam());
                int wicketsLeft = 10 - newWickets;
                match.setResultDescription(currentInnings.getBattingTeam().getName() + " won by " + wicketsLeft + " wickets");
            } else if (inningsDone) {
                // All out or overs completed and target not met
                match.setStatus(MatchStatus.COMPLETED);
                if (newRuns == currentInnings.getTarget() - 1) {
                    match.setResultDescription("Match tied");
                } else {
                    match.setWinner(currentInnings.getBowlingTeam());
                    int runsDiff = (currentInnings.getTarget() - 1) - newRuns;
                    match.setResultDescription(currentInnings.getBowlingTeam().getName() + " won by " + runsDiff + " runs");
                }
            }
        } else if (inningsDone && currentInnings.getInningsNumber() == 1) {
            currentInnings.setCompleted(true);
            // Check if 2nd innings already exists; if not, create it
            if (inningsList.size() == 1) {
                Innings secondInnings = Innings.builder()
                        .match(match)
                        .battingTeam(currentInnings.getBowlingTeam())
                        .bowlingTeam(currentInnings.getBattingTeam())
                        .inningsNumber(2)
                        .target(newRuns + 1)
                        .runs(0)
                        .wickets(0)
                        .balls(0)
                        .completed(false)
                        .build();
                inningsRepository.save(secondInnings);
            }
        }

        currentInnings.setCompleted(inningsDone);
        inningsRepository.save(currentInnings);
        matchRepository.save(match);

        return mapToEventDto(savedEvent);
    }

    // --- Private Helper Methods ---

    private boolean isLegalDelivery(EventType type) {
        return type != EventType.WIDE && type != EventType.NO_BALL;
    }

    private double calculateRunRate(int runs, int balls) {
        if (balls == 0) return 0.0;
        double overs = (balls / 6) + ((balls % 6) / 6.0);
        return Math.round((runs / overs) * 100.0) / 100.0;
    }

    private Innings getCurrentOrLatestInnings(Long matchId) {
        List<Innings> inningsList = inningsRepository.findByMatchIdOrderByInningsNumberAsc(matchId);
        if (inningsList.isEmpty()) {
            throw new ResourceNotFoundException("No innings found for match id: " + matchId);
        }
        Innings current = inningsList.get(inningsList.size() - 1);
        if (inningsList.size() > 1 && !inningsList.get(0).isCompleted()) {
            current = inningsList.get(0);
        }
        return current;
    }

    private List<BatsmanScoreDto> calculateBattingStatsFromEvents(Innings innings, List<MatchEvent> events) {
        Map<Long, BatsmanScoreDto> map = new LinkedHashMap<>();

        // Track strike and dismissals
        Long lastStrikerId = null;
        Long lastNonStrikerId = null;
        int totalStrikerRunsThisOver = 0;

        for (MatchEvent e : events) {
            // Striker
            Player s = e.getStriker();
            BatsmanScoreDto sDto = map.computeIfAbsent(s.getId(), k -> BatsmanScoreDto.builder()
                    .playerId(s.getId())
                    .playerName(s.getName())
                    .runs(0)
                    .balls(0)
                    .fours(0)
                    .sixes(0)
                    .strikeRate(0.0)
                    .out(false)
                    .dismissalInfo("not out")
                    .onStrike(false)
                    .build());

            sDto.setRuns(sDto.getRuns() + e.getRuns());
            if (e.getEventType() != EventType.WIDE) {
                sDto.setBalls(sDto.getBalls() + 1);
            }
            if (e.getEventType() == EventType.FOUR || e.getRuns() == 4) {
                sDto.setFours(sDto.getFours() + 1);
            } else if (e.getEventType() == EventType.SIX || e.getRuns() == 6) {
                sDto.setSixes(sDto.getSixes() + 1);
            }

            if (e.getEventType() == EventType.WICKET) {
                sDto.setOut(true);
                String dism = (e.getWicketType() != null ? e.getWicketType().toLowerCase() : "caught")
                        + " b " + e.getBowler().getName();
                sDto.setDismissalInfo(dism);
            }

            // Non-striker registration
            if (e.getNonStriker() != null) {
                Player ns = e.getNonStriker();
                map.computeIfAbsent(ns.getId(), k -> BatsmanScoreDto.builder()
                        .playerId(ns.getId())
                        .playerName(ns.getName())
                        .runs(0)
                        .balls(0)
                        .fours(0)
                        .sixes(0)
                        .strikeRate(0.0)
                        .out(false)
                        .dismissalInfo("not out")
                        .onStrike(false)
                        .build());
            }

            // Track who is on strike
            // Runs that swap strike: odd runs (1, 3) or bye/leg-bye odd
            int runsToRotate = e.getRuns() + (("BYE".equals(e.getExtraType()) || "LEG_BYE".equals(e.getExtraType())) ? e.getExtraRuns() : 0);
            boolean strikeChanged = (runsToRotate % 2 != 0);

            if (lastStrikerId == null) {
                lastStrikerId = s.getId();
                lastNonStrikerId = e.getNonStriker() != null ? e.getNonStriker().getId() : null;
            } else {
                lastStrikerId = s.getId();
                lastNonStrikerId = e.getNonStriker() != null ? e.getNonStriker().getId() : lastNonStrikerId;
            }

            if (strikeChanged && lastNonStrikerId != null) {
                Long temp = lastStrikerId;
                lastStrikerId = lastNonStrikerId;
                lastNonStrikerId = temp;
            }

            // If end of over (6th legal ball of over), rotate strike
            if (isLegalDelivery(e.getEventType()) && e.getBallNumber() == 6 && lastNonStrikerId != null) {
                Long temp = lastStrikerId;
                lastStrikerId = lastNonStrikerId;
                lastNonStrikerId = temp;
            }
        }

        // Calculate strike rates and mark onStrike
        for (BatsmanScoreDto dto : map.values()) {
            if (dto.getBalls() > 0) {
                double sr = Math.round((dto.getRuns() * 100.0 / dto.getBalls()) * 100.0) / 100.0;
                dto.setStrikeRate(sr);
            }
            if (lastStrikerId != null && dto.getPlayerId().equals(lastStrikerId) && !dto.isOut()) {
                dto.setOnStrike(true);
            }
        }

        return new ArrayList<>(map.values());
    }

    private List<BowlerScoreDto> calculateBowlingStatsFromEvents(Innings innings, List<MatchEvent> events) {
        Map<Long, BowlerScoreDto> map = new LinkedHashMap<>();
        Long lastBowlerId = null;

        for (MatchEvent e : events) {
            Player b = e.getBowler();
            lastBowlerId = b.getId();

            BowlerScoreDto bDto = map.computeIfAbsent(b.getId(), k -> BowlerScoreDto.builder()
                    .playerId(b.getId())
                    .playerName(b.getName())
                    .ballsBowled(0)
                    .overs("0.0")
                    .maidens(0)
                    .runsConceded(0)
                    .wickets(0)
                    .economyRate(0.0)
                    .currentBowler(false)
                    .build());

            if (isLegalDelivery(e.getEventType())) {
                bDto.setBallsBowled(bDto.getBallsBowled() + 1);
            }

            // In cricket, byes & leg byes do not count towards bowler's runs conceded
            boolean isBye = "BYE".equalsIgnoreCase(e.getExtraType()) || "LEG_BYE".equalsIgnoreCase(e.getExtraType());
            if (!isBye) {
                bDto.setRunsConceded(bDto.getRunsConceded() + e.getRuns() + e.getExtraRuns());
            }

            if (e.getEventType() == EventType.WICKET) {
                // run outs don't credit to bowler in cricket, but for demo wicket counts to bowler
                if (!"RUN_OUT".equalsIgnoreCase(e.getWicketType())) {
                    bDto.setWickets(bDto.getWickets() + 1);
                }
            }
        }

        for (BowlerScoreDto dto : map.values()) {
            int balls = dto.getBallsBowled();
            dto.setOvers((balls / 6) + "." + (balls % 6));
            if (balls > 0) {
                double overs = (balls / 6) + ((balls % 6) / 6.0);
                double econ = Math.round((dto.getRunsConceded() / overs) * 100.0) / 100.0;
                dto.setEconomyRate(econ);
            }
            if (lastBowlerId != null && dto.getPlayerId().equals(lastBowlerId)) {
                dto.setCurrentBowler(true);
            }
        }

        return new ArrayList<>(map.values());
    }

    private String formatBallBadge(MatchEvent e) {
        if (e.getEventType() == EventType.WICKET) return "W";
        if (e.getEventType() == EventType.FOUR) return "4";
        if (e.getEventType() == EventType.SIX) return "6";
        if (e.getEventType() == EventType.DOT_BALL) return "0";
        if (e.getEventType() == EventType.WIDE) return (e.getExtraRuns() > 1 ? e.getExtraRuns() : "") + "Wd";
        if (e.getEventType() == EventType.NO_BALL) return "Nb";
        if (e.getEventType() == EventType.BYE) return e.getExtraRuns() + "B";
        if (e.getEventType() == EventType.LEG_BYE) return e.getExtraRuns() + "Lb";
        return String.valueOf(e.getRuns());
    }

    private MatchEventResponseDto mapToEventDto(MatchEvent e) {
        return MatchEventResponseDto.builder()
                .id(e.getId())
                .overNumber(e.getOverNumber())
                .ballNumber(e.getBallNumber())
                .ballDisplay(e.getOverNumber() + "." + e.getBallNumber())
                .eventType(e.getEventType())
                .runs(e.getRuns())
                .extraRuns(e.getExtraRuns())
                .extraType(e.getExtraType())
                .wicketType(e.getWicketType())
                .strikerId(e.getStriker().getId())
                .strikerName(e.getStriker().getName())
                .nonStrikerId(e.getNonStriker() != null ? e.getNonStriker().getId() : null)
                .nonStrikerName(e.getNonStriker() != null ? e.getNonStriker().getName() : null)
                .bowlerId(e.getBowler().getId())
                .bowlerName(e.getBowler().getName())
                .description(e.getDescription())
                .eventBadge(formatBallBadge(e))
                .timestamp(e.getTimestamp())
                .build();
    }

    private String generateEventDescription(EventType eventType, int runs, int extraRuns, String extraType,
                                             String wicketType, Player striker, Player bowler) {
        switch (eventType) {
            case FOUR:
                return bowler.getName() + " to " + striker.getName() + ", FOUR runs! Beautiful stroke through the boundary rope.";
            case SIX:
                return bowler.getName() + " to " + striker.getName() + ", SIX runs! Smashed high into the stands!";
            case WICKET:
                return bowler.getName() + " to " + striker.getName() + ", OUT! " +
                        (wicketType != null ? wicketType : "CAUGHT") + "! Huge breakthrough for the bowling side!";
            case WIDE:
                return bowler.getName() + " to " + striker.getName() + ", Wide ball! Way outside the tramline.";
            case NO_BALL:
                return bowler.getName() + " to " + striker.getName() + ", No ball! Overstepping the bowling crease.";
            case DOT_BALL:
                return bowler.getName() + " to " + striker.getName() + ", no run. Good length ball defended cautiously.";
            case RUN:
                return bowler.getName() + " to " + striker.getName() + ", " + runs + (runs == 1 ? " run." : " runs.") + " Worked into the gap.";
            default:
                return bowler.getName() + " to " + striker.getName() + ", " + (runs + extraRuns) + " runs scored.";
        }
    }

    private Player resolveStriker(Innings innings, List<MatchEvent> events, Long requestedId) {
        if (requestedId != null) {
            return playerRepository.findById(requestedId)
                    .orElseThrow(() -> new ResourceNotFoundException("Striker not found with id: " + requestedId));
        }
        if (!events.isEmpty()) {
            MatchEvent last = events.get(events.size() - 1);
            if (last.getEventType() == EventType.WICKET) {
                // Striker got out, pick next player from batting team who hasn't batted yet
                Set<Long> battedPlayerIds = events.stream().map(e -> e.getStriker().getId()).collect(Collectors.toSet());
                List<Player> teamPlayers = playerRepository.findByTeamId(innings.getBattingTeam().getId());
                return teamPlayers.stream()
                        .filter(p -> !battedPlayerIds.contains(p.getId()))
                        .findFirst()
                        .orElse(last.getStriker());
            }
            // Check if last delivery was odd runs or end of over
            int runs = last.getRuns() + last.getExtraRuns();
            boolean rotated = (runs % 2 != 0);
            if (isLegalDelivery(last.getEventType()) && last.getBallNumber() == 6) {
                rotated = !rotated;
            }
            if (rotated && last.getNonStriker() != null) {
                return last.getNonStriker();
            }
            return last.getStriker();
        }
        // First ball of innings - pick first batsman of batting team
        List<Player> battingTeamPlayers = playerRepository.findByTeamId(innings.getBattingTeam().getId());
        if (battingTeamPlayers.isEmpty()) {
            throw new BadRequestException("Batting team has no players configured.");
        }
        return battingTeamPlayers.get(0);
    }

    private Player resolveNonStriker(Innings innings, List<MatchEvent> events, Player currentStriker, Long requestedId) {
        if (requestedId != null) {
            return playerRepository.findById(requestedId)
                    .orElseThrow(() -> new ResourceNotFoundException("Non-striker not found with id: " + requestedId));
        }
        if (!events.isEmpty()) {
            MatchEvent last = events.get(events.size() - 1);
            if (last.getNonStriker() != null && !last.getNonStriker().getId().equals(currentStriker.getId())) {
                return last.getNonStriker();
            }
            if (!last.getStriker().getId().equals(currentStriker.getId())) {
                return last.getStriker();
            }
        }
        List<Player> battingTeamPlayers = playerRepository.findByTeamId(innings.getBattingTeam().getId());
        return battingTeamPlayers.stream()
                .filter(p -> !p.getId().equals(currentStriker.getId()))
                .findFirst()
                .orElse(null);
    }

    private Player resolveBowler(Innings innings, List<MatchEvent> events, Long requestedId) {
        if (requestedId != null) {
            return playerRepository.findById(requestedId)
                    .orElseThrow(() -> new ResourceNotFoundException("Bowler not found with id: " + requestedId));
        }
        if (!events.isEmpty()) {
            MatchEvent last = events.get(events.size() - 1);
            // If over finished (6 legal balls), in real match bowler changes, but keep same or pick another bowler
            int legalBalls = (int) events.stream().filter(e -> isLegalDelivery(e.getEventType())).count();
            if (legalBalls > 0 && legalBalls % 6 == 0) {
                // Switch to another bowler from bowling team
                List<Player> bowlingTeamPlayers = playerRepository.findByTeamId(innings.getBowlingTeam().getId());
                return bowlingTeamPlayers.stream()
                        .filter(p -> !p.getId().equals(last.getBowler().getId()))
                        .findFirst()
                        .orElse(last.getBowler());
            }
            return last.getBowler();
        }
        List<Player> bowlingTeamPlayers = playerRepository.findByTeamId(innings.getBowlingTeam().getId());
        if (bowlingTeamPlayers.isEmpty()) {
            throw new BadRequestException("Bowling team has no players configured.");
        }
        // Return a bowler (usually from bottom of list or role BOWLER)
        return bowlingTeamPlayers.stream()
                .filter(p -> p.getRole() == com.cricscore.entity.enums.PlayerRole.BOWLER)
                .findFirst()
                .orElse(bowlingTeamPlayers.get(bowlingTeamPlayers.size() - 1));
    }

    private LiveScoreDto buildEmptyLiveScore(Match match) {
        return LiveScoreDto.builder()
                .matchId(match.getId())
                .status(match.getStatus())
                .format(match.getFormat())
                .venue(match.getVenue())
                .totalOvers(match.getTotalOvers())
                .team1Id(match.getTeam1().getId())
                .team1Name(match.getTeam1().getName())
                .team1ShortName(match.getTeam1().getShortName())
                .team2Id(match.getTeam2().getId())
                .team2Name(match.getTeam2().getName())
                .team2ShortName(match.getTeam2().getShortName())
                .matchSituation(match.getStatus() == MatchStatus.UPCOMING ? "Match yet to begin" : "No score available")
                .build();
    }
}
