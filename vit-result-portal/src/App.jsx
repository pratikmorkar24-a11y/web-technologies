import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AddUser from "./pages/AddUser";
import AddMarks from "./pages/AddMarks";
import Verify from "./pages/Verify";
import Marksheet from "./pages/Marksheet";

function App() {
  const studentDetails = [
    { label: "Name", value: "Pratik Morkar" },
    { label: "Class", value: "TY-CS-H" },
    { label: "PRN", value: "12410961" },
    { label: "Roll No.", value: "19" },
  ];

  return (
    <>
      <Navbar />

      <section className='student-details' aria-label='Student details'>
        <div className='student-details-container'>
          <h2>Student Details</h2>

          {studentDetails.map((detail) => (
            <div key={detail.label}>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/add-user' element={<AddUser />} />
        <Route path='/add-marks' element={<AddMarks />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/marksheet' element={<Marksheet />} />
      </Routes>
    </>
  );
}

export default App;
