// src/pages/AttendancePage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function AttendancePage() {
  const [sessionId, setSessionId] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);

  async function fetchAttendance() {
    try {
      const res = await axiosClient.get("/api/attendance/");
      setAttendanceList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId || !file) {
      setStatus("⚠️ Hãy chọn Session ID và ảnh khuôn mặt.");
      return;
    }

    setLoading(true);
    setStatus("Đang gửi ảnh và nhận diện...");

    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("file", file);

      const res = await axiosClient.post(
        "/api/attendance/recognize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus(
        `✅ Điểm danh thành công: student_id=${res.data.student_id}, session_id=${res.data.session_id}`
      );
      fetchAttendance();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail || "Lỗi khi nhận diện / điểm danh.";
      setStatus("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          Upload ảnh khuôn mặt để backend nhận diện và ghi nhận điểm danh cho
          buổi học.
        </p>
      </div>

      {/* Form upload ảnh */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Điểm danh bằng ảnh</div>
            <div className="card-subtitle">
              Chọn <b>Session ID</b> tương ứng, sau đó chọn ảnh khuôn mặt (file
              JPG/PNG) và gửi lên.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Session ID</label>
              <input
                className="input"
                type="number"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Ví dụ: 1"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Ảnh khuôn mặt</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Gửi ảnh & điểm danh"}
            </button>
            {status && (
              <span className="text-xs" style={{ maxWidth: 480 }}>
                {status}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Log điểm danh */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Lịch sử điểm danh</div>
            <div className="card-subtitle">
              Toàn bộ bản ghi từ bảng <code>attendance</code>.
            </div>
          </div>
          <button onClick={fetchAttendance} className="btn btn-ghost btn-sm">
            Refresh
          </button>
        </div>

        {attendanceList.length === 0 ? (
          <p className="text-muted">Chưa có bản ghi điểm danh.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Session ID</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.student_id}</td>
                    <td>{a.session_id}</td>
                    <td className="text-xs">{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}