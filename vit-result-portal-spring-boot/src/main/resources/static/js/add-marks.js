const form = document.getElementById("marksForm");
const message = document.getElementById("message");
const mseInput = document.getElementById("mseMarks");
const eseInput = document.getElementById("eseMarks");

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message show ${type}`;
}

function updatePreview() {
    const mse = Number(mseInput.value) || 0;
    const ese = Number(eseInput.value) || 0;
    const mseWeighted = mse * 0.30;
    const eseWeighted = ese * 0.70;
    document.getElementById("mseWeighted").textContent = mseWeighted.toFixed(2);
    document.getElementById("eseWeighted").textContent = eseWeighted.toFixed(2);
    document.getElementById("totalMarks").textContent = `${(mseWeighted + eseWeighted).toFixed(2)} / 100`;
}
mseInput.addEventListener("input", updatePreview);
eseInput.addEventListener("input", updatePreview);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mse = Number(mseInput.value);
    const ese = Number(eseInput.value);

    if (!document.getElementById("prn").value.trim()) {
        showMessage("PRN is required.", "error");
        return;
    }
    if (!document.getElementById("subjectName").value.trim()) {
        showMessage("Subject name is required.", "error");
        return;
    }
    if (!Number.isFinite(mse) || mse < 0 || mse > 100 || !Number.isFinite(ese) || ese < 0 || ese > 100) {
        showMessage("MSE and ESE marks must be between 0 and 100.", "error");
        return;
    }

    const data = {
        prn: document.getElementById("prn").value.trim(),
        subjectName: document.getElementById("subjectName").value.trim(),
        mseMarks: mse,
        eseMarks: ese
    };

    try {
        const response = await fetch("/api/marks", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Unable to save marks.");
        }

        showMessage(`Marks saved. Subject total: ${body.totalMarks.toFixed(2)}/100.`, "success");
        document.getElementById("subjectName").value = "";
        mseInput.value = "";
        eseInput.value = "";
        updatePreview();
    } catch (error) {
        showMessage(error.message, "error");
    }
});
