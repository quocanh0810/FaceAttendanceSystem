// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudentsPage from "./pages/StudentsPage";
import ClassesPage from "./pages/ClassesPage";
import SessionsPage from "./pages/SessionsPage";
import AttendancePage from "./pages/AttendancePage";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/students" replace />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;