import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();

  const [motherName, setMotherName] = useState("");
  const [error, setError] = useState("");

  const prn = localStorage.getItem("loggedInPRN");

  const handleVerify = (e) => {
    e.preventDefault();

    if (!prn) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(
      localStorage.getItem(`user_${prn}`)
    );

    if (
      motherName.trim().toLowerCase() !==
      userData.motherName.trim().toLowerCase()
    ) {
      setError("Mother's name does not match.");
      return;
    }

    localStorage.setItem("verified", "true");

    navigate("/marksheet");
  };

  return (
    <div className="page-container">

      <div className="card">

        <h1>Verify Identity</h1>

        <p className="subtitle">
          Enter your mother's name to view your marksheet.
        </p>

        <form onSubmit={handleVerify}>

          <label>Mother's Name</label>

          <input
            type="text"
            value={motherName}
            onChange={(e) =>
              setMotherName(e.target.value)
            }
            placeholder="Enter mother's name"
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button type="submit">
            Verify & View Marksheet
          </button>

        </form>

      </div>

    </div>
  );
}

export default Verify;