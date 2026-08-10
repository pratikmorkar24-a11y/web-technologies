import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prn: "",
    name: "",
    motherName: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(formData.prn)) {
      setError("PRN must contain exactly 8 digits.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter the student's name.");
      return;
    }

    if (!formData.motherName.trim()) {
      setError("Please enter mother's name.");
      return;
    }

    localStorage.setItem(
      `user_${formData.prn}`,
      JSON.stringify(formData)
    );

    setError("");
    setSuccess("User added successfully!");

    setTimeout(() => {
      navigate("/add-marks");
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>Add Student</h1>
        <p className="subtitle">
          Enter student details
        </p>

        <form onSubmit={handleSubmit}>

          <label>PRN</label>
          <input
            type="text"
            name="prn"
            value={formData.prn}
            onChange={handleChange}
            placeholder="Enter 8 digit PRN"
            maxLength="8"
          />

          <label>Student Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
          />

          <label>Mother's Name</label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Enter mother's name"
          />

          {error && <div className="error">{error}</div>}

          {success && <div className="success">{success}</div>}

          <button type="submit">
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;