const searchForm = document.getElementById("searchForm");
const message = document.getElementById("message");
const tableWrap = document.getElementById("tableWrap");
const studentInfo = document.getElementById("studentInfo");

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prn = document.getElementById("prn").value.trim();
    const motherName = document.getElementById("motherName").value.trim();

    if (!/^[A-Za-z0-9]{6,30}$/.test(prn)) {
        showMessage("Enter a valid PRN.", "error");
        return;
    }

if (motherName.length < 2) {
    showMessage("Enter a valid mother's name.", "error");
    return;
}

    try {
        const studentResponse = await fetch(`/api/students/${encodeURIComponent(prn)}`);
        if (!studentResponse.ok) throw new Error("Student not found.");
        const student = await studentResponse.json();

        const marksResponse = await fetch(
            `/api/marks/student/${encodeURIComponent(prn)}?motherName=${encodeURIComponent(motherName)}`
        );
        if (!marksResponse.ok) {
            const body = await marksResponse.json();
            throw new Error(body.message || "Unable to load marks.");
        }
        const marks = await marksResponse.json();

        studentInfo.innerHTML = `
            <div><span>PRN</span><strong>${escapeHtml(student.prn)}</strong></div>
            <div><span>Name</span><strong>${escapeHtml(student.name)}</strong></div>
            <div><span>Branch</span><strong>${escapeHtml(student.branch)}</strong></div>
            <div><span>Semester</span><strong>${escapeHtml(student.semester)}</strong></div>`;
        studentInfo.classList.remove("hidden");

        const tbody = document.getElementById("marksBody");
        tbody.innerHTML = "";

        if (marks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No marks have been entered yet.</td></tr>`;
        } else {
            marks.forEach(mark => {
                tbody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${escapeHtml(mark.subjectName)}</td>
                        <td>${mark.mseMarks.toFixed(2)}</td>
                        <td>${mark.mseWeighted.toFixed(2)}</td>
                        <td>${mark.eseMarks.toFixed(2)}</td>
                        <td>${mark.eseWeighted.toFixed(2)}</td>
                        <td><strong>${mark.totalMarks.toFixed(2)}</strong></td>
                    </tr>`);
            });
        }

        tableWrap.classList.remove("hidden");
        showMessage("Marks loaded successfully.", "success");
    } catch (error) {
        studentInfo.classList.add("hidden");
        tableWrap.classList.add("hidden");
        showMessage(error.message, "error");
    }
});

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}
