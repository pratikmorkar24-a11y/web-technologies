import { useState } from "react";

const subjects = [
  "Data Structures",
  "Computer Networks",
  "Web Technologies",
  "Data Science",
];

function AddMarks() {
  const [prn, setPrn] = useState("");

  const [marks, setMarks] = useState(
    subjects.map((subject) => ({
      subject,
      mse: "",
      ese: "",
    }))
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleMarksChange = (index, field, value) => {
    const updatedMarks = [...marks];

    updatedMarks[index][field] = value;

    setMarks(updatedMarks);
  };

  const validateMarks = () => {
    for (const item of marks) {
      const mse = Number(item.mse);
      const ese = Number(item.ese);

      if (
        item.mse === "" ||
        item.ese === "" ||
        mse < 0 ||
        mse > 100 ||
        ese < 0 ||
        ese > 100
      ) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Validate PRN
    if (!/^\d{8}$/.test(prn)) {
      setError("PRN must contain exactly 8 digits.");
      return;
    }

    // Check if student exists
    const user = localStorage.getItem(`user_${prn}`);

    if (!user) {
      setError("Student not found. Please add the student first.");
      return;
    }

    // Validate marks
    if (!validateMarks()) {
      setError(
        "MSE and ESE marks must be between 0 and 100."
      );
      return;
    }

    // Save marks
    localStorage.setItem(
      `marks_${prn}`,
      JSON.stringify(marks)
    );

    setMessage("Marks saved successfully!");
  };

  return (
    <div className="page-container">
      <div className="card marks-card">

        <h1>Add Marks</h1>

        <p className="subtitle">
          Enter MSE and ESE marks out of 100
        </p>

        <form onSubmit={handleSubmit}>

          <label>Student PRN</label>

          <input
            type="text"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
            placeholder="Enter 8 digit PRN"
            maxLength="8"
          />

          <div className="marks-table">

            <div className="table-header">
              <span>Subject</span>
              <span>MSE / 100</span>
              <span>ESE / 100</span>
            </div>

            {marks.map((item, index) => (
              <div
                className="marks-row"
                key={item.subject}
              >

                <span>{item.subject}</span>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.mse}
                  onChange={(e) =>
                    handleMarksChange(
                      index,
                      "mse",
                      e.target.value
                    )
                  }
                  placeholder="0-100"
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.ese}
                  onChange={(e) =>
                    handleMarksChange(
                      index,
                      "ese",
                      e.target.value
                    )
                  }
                  placeholder="0-100"
                />

              </div>
            ))}

          </div>

          <p className="marks-info">
            MSE will contribute 30% and ESE will contribute
            70% to the final marks.
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          <button type="submit">
            Save Marks
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddMarks;