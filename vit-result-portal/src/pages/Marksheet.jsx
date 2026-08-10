import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import vitLogo from "../assets/vit-logo.png";

function Marksheet() {
  const navigate = useNavigate();

  const prn = localStorage.getItem("loggedInPRN");
  const verified = localStorage.getItem("verified");

  useEffect(() => {
    if (!prn || verified !== "true") {
      navigate("/");
    }
  }, [prn, verified, navigate]);

  if (!prn || verified !== "true") {
    return null;
  }

  const user = JSON.parse(
    localStorage.getItem(`user_${prn}`)
  );

  const marks = JSON.parse(
    localStorage.getItem(`marks_${prn}`)
  );

  if (!marks) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Marks Not Available</h2>

          <p>
            Marks have not been entered for this student.
          </p>
        </div>
      </div>
    );
  }

  /*
    MSE is entered out of 100
    ESE is entered out of 100

    MSE contribution = MSE × 30 / 100
    ESE contribution = ESE × 70 / 100

    Final marks = MSE contribution + ESE contribution
  */

  const calculatedMarks = marks.map((item) => {
    const mseContribution =
      (Number(item.mse) * 30) / 100;

    const eseContribution =
      (Number(item.ese) * 70) / 100;

    const finalMarks =
      mseContribution + eseContribution;

    return {
      ...item,
      mseContribution,
      eseContribution,
      finalMarks,
    };
  });

  // Total marks out of 400
  const total = calculatedMarks.reduce(
    (sum, item) => sum + item.finalMarks,
    0
  );

  // Percentage out of 100
  const percentage = (total / 400) * 100;

  return (
    <div className="page-container">

      <div className="marksheet">

        <div className="marksheet-header">

          <img
            src={vitLogo}
            alt="VIT Logo"
            className="marksheet-logo"
          />

          <div>
            <h1>
              Vishwakarma Institute of Technology
            </h1>

            <h2>
              Semester Marksheet
            </h2>
          </div>

        </div>

        <div className="student-info">

          <div>
            <strong>Student Name</strong>
            <p>{user.name}</p>
          </div>

          <div>
            <strong>PRN</strong>
            <p>{user.prn}</p>
          </div>

        </div>

        <table>

          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Subject</th>
              <th>MSE / 100</th>
              <th>ESE / 100</th>
              <th>Final / 100</th>
            </tr>
          </thead>

          <tbody>

            {calculatedMarks.map((item, index) => (

              <tr key={item.subject}>

                <td>
                  {index + 1}
                </td>

                <td>
                  {item.subject}
                </td>

                <td>
                  {item.mse}
                </td>

                <td>
                  {item.ese}
                </td>

                <td>
                  {item.finalMarks.toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="calculation-info">

          <p>
            <strong>MSE Weightage:</strong> 30%
          </p>

          <p>
            <strong>ESE Weightage:</strong> 70%
          </p>

        </div>

        <div className="result-summary">

          <div>
            <strong>Total Marks</strong>

            <span>
              {total.toFixed(2)} / 400
            </span>
          </div>

          <div>
            <strong>Percentage</strong>

            <span>
              {percentage.toFixed(2)}%
            </span>
          </div>

        </div>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("loggedInPRN");
            localStorage.removeItem("verified");

            navigate("/");
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Marksheet;