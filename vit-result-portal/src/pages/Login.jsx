import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [prn, setPrn] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(prn)) {
      setError("PRN must contain exactly 8 digits.");
      return;
    }

    const user = localStorage.getItem(`user_${prn}`);

    if (!user) {
      setError("PRN not found. Please register first.");
      return;
    }

    localStorage.setItem("loggedInPRN", prn);

    navigate("/verify");
  };

  return (
    <div className="page-container">

      <div className="card login-card">

        <div className="vit-icon">
          VIT
        </div>

        <h1>Semester Result</h1>

        <p className="subtitle">
          Student Login
        </p>

        <form onSubmit={handleSubmit}>

          <label>PRN</label>

          <input
            type="text"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
            placeholder="Enter your 8 digit PRN"
            maxLength="8"
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button type="submit">
            Continue
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;