# CricScore - Live Cricket Score Platform

A complete, production-grade Spring Boot 4.1.1 web application designed as a live cricket-score dashboard for college project demonstration.

Built with **Java 17**, **Spring Boot**, **Spring Data JPA**, **MySQL**, **Thymeleaf**, and modern vanilla JavaScript for real-time live score polling and dynamic updates.

---

## 1. Project Overview

**CricScore** provides real-time cricket scores, dynamic run rates, ball-by-ball commentary, and full scorecard breakdowns for cricket matches. Scores are calculated on-the-fly from granular ball deliveries (`MatchEvent`), supporting strike rotation, over progression, and live event recording.

### Key Highlights
- **Zero External API Dependency**: Runs completely self-contained with realistic sample data.
- **Pure Student / Faculty Experience**: No authentication, login screens, or admin panels needed. Focuses 100% on cricket score presentation.
- **Dynamic Scoring Engine**: Calculates overs, balls, wickets, runs, CRR, RRR, strike rates, economy rates, and over strips dynamically from ball events.
- **Real-Time Polling**: Automatic polling every 2.5 seconds using JavaScript `fetch` ensures live updates without refreshing the browser.
- **Demonstration Console**: Includes a live simulation panel on the match page to inject runs, boundaries, dots, and wickets during live viva/presentation.

---

## 2. Technologies Used

- **Backend Framework**: Spring Boot 4.1.1 / Spring MVC
- **Language**: Java 17
- **Database**: MySQL 8.0+
- **ORM / Persistence**: Spring Data JPA / Hibernate
- **Template Engine**: Thymeleaf
- **Boilerplate Reduction**: Project Lombok
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Build Tool**: Apache Maven (Wrapper included)

---

## 3. Project Architecture & Structure

```
cricket-score-dashboard/
├── pom.xml
├── mvnw / mvnw.cmd
├── DATABASE_SETUP.md
├── API_TESTING.md
├── README.md
├── CricScore_API.postman_collection.json
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── cricscore/
        │           ├── CricscoreApplication.java
        │           ├── config/
        │           │   └── DataInitializer.java
        │           ├── controller/
        │           │   ├── MatchApiController.java
        │           │   └── MatchViewController.java
        │           ├── dto/
        │           │   ├── ApiResponseDto.java
        │           │   ├── BatsmanScoreDto.java
        │           │   ├── BowlerScoreDto.java
        │           │   ├── InningsScoreDto.java
        │           │   ├── LiveScoreDto.java
        │           │   ├── MatchEventRequestDto.java
        │           │   ├── MatchEventResponseDto.java
        │           │   ├── MatchResponseDto.java
        │           │   ├── MatchSummaryDto.java
        │           │   └── ScorecardDto.java
        │           ├── entity/
        │           │   ├── Innings.java
        │           │   ├── Match.java
        │           │   ├── MatchEvent.java
        │           │   ├── Player.java
        │           │   ├── Team.java
        │           │   └── enums/
        │           │       ├── EventType.java
        │           │       ├── MatchStatus.java
        │           │       └── PlayerRole.java
        │           ├── exception/
        │           │   ├── BadRequestException.java
        │           │   ├── GlobalExceptionHandler.java
        │           │   └── ResourceNotFoundException.java
        │           ├── repository/
        │           │   ├── InningsRepository.java
        │           │   ├── MatchEventRepository.java
        │           │   ├── MatchRepository.java
        │           │   ├── PlayerRepository.java
        │           │   └── TeamRepository.java
        │           └── service/
        │               ├── MatchService.java
        │               └── ScoreService.java
        └── resources/
            ├── application.properties
            ├── static/
            │   ├── css/
            │   │   └── style.css
            │   └── js/
            │       └── live-score.js
            └── templates/
                ├── dashboard.html
                ├── match-details.html
                └── match-summary.html
```

---

## 4. UI Screens & Navigation

The platform contains 3 core web pages:

### 1. Live Matches Dashboard (`/`)
- **Route**: `GET /`
- **Features**:
  - Featured LIVE Hero banner for India vs Australia.
  - Real-time status filter tabs (**All**, **Live**, **Upcoming**, **Completed**).
  - Cards showing match format, venue, teams, scores (`158/3 (16.4 ov)`), current run rate, and situation text.
  - Direct navigation buttons: **View Match** and **Scorecard**.

### 2. Match Details & Live Score (`/matches/{id}`)
- **Route**: `GET /matches/{id}`
- **Features**:
  - Live pulse indicator and match header.
  - Big live scoreboard displaying Runs/Wickets, Overs, CRR, Target, RRR, Runs Needed, Balls Left.
  - Active Batsmen table with strike indicator (`*`), runs, balls, 4s, 6s, and strike rate.
  - Current Bowler table with spell details: overs, maidens, runs conceded, wickets, economy rate.
  - **This Over** circular ball strip (color-coded for dot balls, runs, boundaries, and wickets).
  - Recent ball-by-ball commentary timeline.
  - **Interactive Demo Console**: Buttons to record dot, single, double, four, six, wide, and wicket with instantaneous live update.

### 3. Match Summary & Scorecard (`/matches/{id}/summary`)
- **Route**: `GET /matches/{id}/summary`
- **Features**:
  - Match outcome banner (e.g. *"India won by 24 runs"*).
  - Player of the Match badge (e.g. Jasprit Bumrah).
  - Toss result, venue, match date & format.
  - Complete Batting Scorecards for Innings 1 and Innings 2 with dismissals, runs, balls, 4s, 6s, SR, and extras.
  - Complete Bowling Scorecards with overs, maidens, runs, wickets, and economy.

---

## 5. MySQL Database Setup

1. Start your local MySQL server (port 3306).
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS cricscore_db;
   ```
3. Update credentials in `src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cricscore_db?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=Pratik#sql20
   ```
4. Hibernate automatically creates all tables (`teams`, `players`, `matches`, `innings`, `match_events`) on startup.

---

## 6. How to Run the Application

### Option A: Using Maven Wrapper (Command Line)
```bash
# In the project directory:
./mvnw clean spring-boot:run
```

### Option B: Build and Run JAR
```bash
./mvnw clean package -DskipTests
java -jar target/cricscore-1.0.0.jar
```

### Option C: In IDE (IntelliJ IDEA / Eclipse / VS Code)
Open the project root, navigate to `com.cricscore.CricscoreApplication`, and click **Run**.

Once started, open your browser at:
- **Dashboard**: [http://localhost:8080/](http://localhost:8080/)
- **Live Match Details**: [http://localhost:8080/matches/1](http://localhost:8080/matches/1)
- **Match Scorecard**: [http://localhost:8080/matches/1/summary](http://localhost:8080/matches/1/summary)
- **Completed Match Scorecard**: [http://localhost:8080/matches/3/summary](http://localhost:8080/matches/3/summary)

---

## 7. Sample Data Included

On initial launch, `DataInitializer.java` automatically seeds:
- **4 International Teams**: India (IND), Australia (AUS), England (ENG), Pakistan (PAK).
- **44 Players**: 11 players per team with realistic player roles (`BATSMAN`, `BOWLER`, `ALL_ROUNDER`, `WICKET_KEEPER`).
- **3 Realistic Matches**:
  1. **India vs Australia (LIVE)**:
     - Australia: 185/6 (20.0 overs)
     - India: 158/3 (16.4 overs) chasing 186. Needs 28 runs in 20 balls.
     - Striker: Virat Kohli (76* off 41), Non-striker: Hardik Pandya (14* off 9).
     - Bowler: Pat Cummins (3.4 overs).
  2. **England vs Pakistan (UPCOMING)**: Scheduled for tomorrow evening at Lord's.
  3. **India vs England (COMPLETED)**:
     - India: 198/5 (20.0 overs)
     - England: 174/9 (20.0 overs)
     - Result: India won by 24 runs. Player of the Match: Jasprit Bumrah.

---

## 8. REST API Endpoints

### Match Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/matches` | List all matches ordered by date |
| `GET` | `/api/matches/live` | List currently live matches |
| `GET` | `/api/matches/upcoming` | List upcoming scheduled matches |
| `GET` | `/api/matches/completed` | List completed matches |
| `GET` | `/api/matches/{id}` | Match details by ID |

### Live Score & Statistics Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/matches/{id}/score` | Real-time score, run rates, batsmen, bowler, and over strip |
| `GET` | `/api/matches/{id}/batting` | Batting statistics for current innings |
| `GET` | `/api/matches/{id}/bowling` | Bowling statistics for current innings |
| `GET` | `/api/matches/{id}/events` | Chronological ball-by-ball delivery events |
| `GET` | `/api/matches/{id}/scorecard` | Complete two-innings scorecard |
| `GET` | `/api/matches/{id}/summary` | Full match summary with toss, POTM, and scores |

### Demonstration / Simulation Endpoint
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/matches/{id}/events` | Records a new delivery and recalculates match state |

**Sample POST Body**:
```json
{
  "eventType": "FOUR",
  "runs": 4
}
```

---

## 9. How Real-time Polling Works

In `src/main/resources/static/js/live-score.js`:
1. When `/matches/{id}` loads, `initLiveScorePolling(matchId)` starts an interval timer (`setInterval`, 2500ms).
2. Every 2.5 seconds, the browser issues an asynchronous `fetch('/api/matches/' + matchId + '/score')`.
3. The JSON response parses current scores, overs, run rates, active striker, non-striker, bowler spell, and ball badges.
4. Javascript selectively patches the relevant DOM nodes without flickering or reloading the entire page.
5. If an event is triggered via the interactive button console or via external Postman call, the next poll tick (or immediate callback) instantly updates the score on screen!

---

## 10. How to Test APIs

1. **Postman**: Import `CricScore_API.postman_collection.json` into Postman and execute requests against `http://localhost:8080`.
2. **Terminal (cURL)**:
   ```bash
   # Get live score
   curl http://localhost:8080/api/matches/1/score

   # Simulate a Six
   curl -X POST http://localhost:8080/api/matches/1/events -H "Content-Type: application/json" -d '{"eventType":"SIX","runs":6}'
   ```
3. See [API_TESTING.md](file:///E:/College/Third%20Year/Web%20Technologies/web-technologies/cricket-score-dashboard/API_TESTING.md) for full endpoint specifications, request payloads, and expected responses.
