import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AddUser from "./pages/AddUser";
import AddMarks from "./pages/AddMarks";
import Verify from "./pages/Verify";
import Marksheet from "./pages/Marksheet";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-marks" element={<AddMarks />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/marksheet" element={<Marksheet />} />
      </Routes>
    </>
  );
}

export default App;