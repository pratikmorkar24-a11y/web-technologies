const form = document.getElementById("studentForm");
const message = document.getElementById("message");

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        prn: document.getElementById("prn").value.trim(),
        name: document.getElementById("name").value.trim(),
        motherName: document.getElementById("motherName").value.trim(),
        branch: document.getElementById("branch").value.trim(),
        semester: document.getElementById("semester").value
    };

    if (!/^[A-Za-z0-9]{6,30}$/.test(data.prn)) {
        showMessage("PRN must contain 6-30 letters/numbers only.", "error");
        return;
    }
    if (data.name.length < 2 || data.motherName.length < 2 || data.branch.length < 2) {
        showMessage("Please enter valid student details.", "error");
        return;
    }
    if (!data.semester) {
        showMessage("Please select a semester.", "error");
        return;
    }

    try {
        const response = await fetch("/api/students", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        const body = await response.json();

        if (!response.ok) {
            const errors = body.errors ? Object.values(body.errors).join(" ") : body.message;
            throw new Error(errors || "Unable to save student.");
        }

        showMessage(`Student ${body.name} added successfully.`, "success");
        form.reset();
    } catch (error) {
        showMessage(error.message, "error");
    }
});
