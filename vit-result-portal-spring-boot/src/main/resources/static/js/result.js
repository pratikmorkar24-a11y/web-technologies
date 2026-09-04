const resultForm = document.getElementById("resultForm");
const message = document.getElementById("message");
const result = document.getElementById("result");

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
}

resultForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const prn = document.getElementById("prn").value.trim();
    const motherName = document.getElementById("motherName").value.trim();

    if (!/^[A-Za-z0-9]{6,30}$/.test(prn) || motherName.length < 2) {
        showMessage("Enter a valid PRN and mother's name.", "error");
        return;
    }

    try {
        const url = `/api/result?prn=${encodeURIComponent(prn)}&motherName=${encodeURIComponent(motherName)}`;
        const response = await fetch(url);
        const body = await response.json();

        if (!response.ok) throw new Error(body.message || "Result not found.");

        const student = body.student;
        const rows = body.subjects.map(subject => `
            <tr>
                <td>${escapeHtml(subject.subjectName)}</td>
                <td>${subject.mseOutOf100.toFixed(2)}</td>
                <td>${subject.mseWeight30.toFixed(2)}</td>
                <td>${subject.eseOutOf100.toFixed(2)}</td>
                <td>${subject.eseWeight70.toFixed(2)}</td>
                <td><strong>${subject.totalOutOf100.toFixed(2)}</strong></td>
                <td class="grade">${subject.grade}</td>
                <td class="${subject.status === "PASS" ? "status-pass" : "status-fail"}">${subject.status}</td>
            </tr>`).join("");

        result.innerHTML = `
            <div class="result-header">
                <div>
                    <span class="eyebrow">SEMESTER RESULT</span>
                    <h2>${escapeHtml(student.name)}</h2>
                    <p><strong>PRN:</strong> ${escapeHtml(student.prn)} &nbsp; · &nbsp;
                       <strong>Branch:</strong> ${escapeHtml(student.branch)} &nbsp; · &nbsp;
                       <strong>Semester:</strong> ${escapeHtml(student.semester)}</p>
                </div>
                <div class="result-score">
                    <strong>${body.percentage.toFixed(2)}%</strong>
                    <span>${body.overallGrade} · ${body.status}</span>
                </div>
            </div>

            <section class="table-card">
                <div class="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th><th>MSE /100</th><th>MSE 30%</th>
                                <th>ESE /100</th><th>ESE 70%</th><th>Total /100</th>
                                <th>Grade</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </section>

            <section class="info-panel">
                <h3>Semester Summary</h3>
                <div class="formula-grid">
                    <div><strong>Total Marks</strong><span>${body.totalOutOf400.toFixed(2)} / 400</span></div>
                    <div><strong>Percentage</strong><span>${body.percentage.toFixed(2)}%</span></div>
                    <div><strong>Overall Result</strong><span>${body.overallGrade} · ${body.status}</span></div>
                </div>
            </section>`;
        result.classList.remove("hidden");
        showMessage("Result loaded successfully.", "success");
    } catch (error) {
        result.classList.add("hidden");
        showMessage(error.message, "error");
    }
});

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}
