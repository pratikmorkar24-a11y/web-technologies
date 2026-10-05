// CricScore Live Score Polling and Event Simulation Script

let pollingInterval = null;

function initLiveScorePolling(matchId) {
    if (!matchId) return;

    // Fetch immediately on load
    fetchLiveScore(matchId);

    // Set polling interval every 2.5 seconds (2500ms)
    pollingInterval = setInterval(() => {
        fetchLiveScore(matchId);
    }, 2500);
}

async function fetchLiveScore(matchId) {
    try {
        const response = await fetch(`/api/matches/${matchId}/score`);
        if (!response.ok) {
            console.warn("Failed to fetch live score, status:", response.status);
            return;
        }

        const resData = await response.json();
        if (resData.success && resData.data) {
            updateLiveScoreDOM(resData.data);
        }
    } catch (err) {
        console.error("Error polling live score:", err);
    }
}

function updateLiveScoreDOM(data) {
    // 1. Team scores and match state
    const runsEl = document.getElementById("liveRuns");
    const wktsEl = document.getElementById("liveWickets");
    const oversEl = document.getElementById("liveOvers");
    const rrEl = document.getElementById("liveRunRate");
    const sitEl = document.getElementById("liveSituation");
    const battingTeamEl = document.getElementById("liveBattingTeam");

    if (runsEl) runsEl.textContent = data.runs;
    if (wktsEl) wktsEl.textContent = data.wickets;
    if (oversEl) oversEl.textContent = data.overs;
    if (rrEl) rrEl.textContent = (data.runRate || 0).toFixed(2);
    if (sitEl && data.matchSituation) sitEl.textContent = data.matchSituation;
    if (battingTeamEl && data.battingTeamName) battingTeamEl.textContent = data.battingTeamName;

    // 2. Chasing stats (Target, RRR, Balls Left)
    const targetWrap = document.getElementById("chaseStatsWrap");
    if (data.target && data.target > 0) {
        if (targetWrap) targetWrap.style.display = "flex";
        const targetEl = document.getElementById("liveTarget");
        const rrrEl = document.getElementById("liveReqRate");
        const runsNeedEl = document.getElementById("liveRunsNeeded");
        const ballsLeftEl = document.getElementById("liveBallsLeft");

        if (targetEl) targetEl.textContent = data.target;
        if (rrrEl) rrrEl.textContent = data.requiredRunRate ? data.requiredRunRate.toFixed(2) : "--";
        if (runsNeedEl) runsNeedEl.textContent = data.runsNeeded != null ? data.runsNeeded : "--";
        if (ballsLeftEl) ballsLeftEl.textContent = data.ballsRemaining != null ? data.ballsRemaining : "--";
    }

    // 3. Current Batsmen Table
    const batBody = document.getElementById("batsmenTableBody");
    if (batBody) {
        let rowsHtml = "";
        if (data.striker) {
            rowsHtml += renderBatsmanRow(data.striker, true);
        }
        if (data.nonStriker) {
            rowsHtml += renderBatsmanRow(data.nonStriker, false);
        }
        if (!data.striker && !data.nonStriker) {
            rowsHtml = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No batsmen active</td></tr>`;
        }
        batBody.innerHTML = rowsHtml;
    }

    // 4. Current Bowler Table
    const bowlBody = document.getElementById("bowlerTableBody");
    if (bowlBody) {
        let bowlHtml = "";
        if (data.currentBowler) {
            const b = data.currentBowler;
            bowlHtml = `
                <tr>
                    <td><strong>${escapeHtml(b.playerName)}</strong> <span class="strike-indicator">*</span></td>
                    <td>${b.overs}</td>
                    <td>${b.maidens}</td>
                    <td>${b.runsConceded}</td>
                    <td><strong style="color: #ffffff;">${b.wickets}</strong></td>
                    <td>${(b.economyRate || 0).toFixed(2)}</td>
                </tr>
            `;
        } else {
            bowlHtml = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No bowler assigned</td></tr>`;
        }
        bowlBody.innerHTML = bowlHtml;
    }

    // 5. Current Over Balls Strip
    const overBallsWrap = document.getElementById("currentOverBallsWrap");
    if (overBallsWrap && data.currentOverBalls) {
        if (data.currentOverBalls.length === 0) {
            overBallsWrap.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;">New over starting...</span>`;
        } else {
            overBallsWrap.innerHTML = data.currentOverBalls.map(ball => {
                const cls = getBallClass(ball);
                return `<span class="ball-circle ${cls}">${ball}</span>`;
            }).join(" ");
        }
    }

    // 6. Recent Events Commentary
    const comList = document.getElementById("recentEventsList");
    if (comList && data.recentEvents && data.recentEvents.length > 0) {
        comList.innerHTML = data.recentEvents.map(e => {
            let itemCls = "commentary-item";
            if (e.eventType === "WICKET") itemCls += " wicket";
            else if (e.eventType === "FOUR") itemCls += " boundary";
            else if (e.eventType === "SIX") itemCls += " six";

            return `
                <div class="${itemCls}">
                    <div class="commentary-ball">
                        <span class="ball-circle ${getBallClass(e.eventBadge)}" style="width: 28px; height: 28px; font-size: 0.75rem;">${e.eventBadge}</span>
                    </div>
                    <div class="commentary-content">
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2px;">Over ${e.ballDisplay}</div>
                        <div class="commentary-text">${escapeHtml(e.description || "")}</div>
                    </div>
                </div>
            `;
        }).join("");
    }
}

function renderBatsmanRow(b, isStriker) {
    return `
        <tr>
            <td>
                <strong>${escapeHtml(b.playerName)}</strong>
                ${b.onStrike ? '<span class="strike-indicator">*</span>' : ''}
                <div class="dismissal-text">${escapeHtml(b.dismissalInfo || 'not out')}</div>
            </td>
            <td><strong style="color: #ffffff;">${b.runs}</strong></td>
            <td>${b.balls}</td>
            <td>${b.fours}</td>
            <td>${b.sixes}</td>
            <td>${(b.strikeRate || 0).toFixed(2)}</td>
        </tr>
    `;
}

function getBallClass(badge) {
    if (!badge) return "ball-0";
    const b = badge.toLowerCase();
    if (b.includes("w") && !b.includes("wd")) return "ball-w";
    if (b.includes("wd") || b.includes("nb")) return "ball-wd";
    if (b === "4") return "ball-4";
    if (b === "6") return "ball-6";
    if (b === "0") return "ball-0";
    if (b === "1" || b === "2" || b === "3") return "ball-1";
    return "ball-1";
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Quick Demonstration / Event Simulation Action
async function simulateEvent(matchId, eventType, runs = 0) {
    const feedbackEl = document.getElementById("simFeedback");
    if (feedbackEl) {
        feedbackEl.textContent = `Recording ${eventType}...`;
        feedbackEl.style.opacity = "1";
    }

    try {
        const body = {
            eventType: eventType,
            runs: runs,
            extraRuns: (eventType === 'WIDE' || eventType === 'NO_BALL') ? 1 : 0
        };

        const res = await fetch(`/api/matches/${matchId}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (res.ok && data.success) {
            if (feedbackEl) {
                feedbackEl.textContent = `Recorded: ${data.data.eventBadge} (${data.data.description})`;
                setTimeout(() => { feedbackEl.style.opacity = "0"; }, 3000);
            }
            // Immediate refresh
            fetchLiveScore(matchId);
        } else {
            if (feedbackEl) {
                feedbackEl.textContent = data.message || "Failed to record event";
            }
        }
    } catch (err) {
        console.error("Error simulating event:", err);
        if (feedbackEl) {
            feedbackEl.textContent = "Error communicating with server.";
        }
    }
}
