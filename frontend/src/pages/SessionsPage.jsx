// src/pages/SessionsPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ class_id: "", topic: "" });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function fetchSessions() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/sessions/");
      setSessions(res.data || []);
      setErrMsg("");
    } catch (err) {
      console.error(err);
      setErrMsg("Không load được danh sách buổi học.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchClasses() {
    try {
      const res = await axiosClient.get("/api/classes/");
      setClasses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchClasses();
    fetchSessions();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.class_id || !form.topic) {
      setErrMsg("Hãy chọn lớp và nhập chủ đề buổi học.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/api/sessions/", {
        class_id: Number(form.class_id),
        topic: form.topic,
      });
      setForm({ class_id: "", topic: "" });
      fetchSessions();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Lỗi khi tạo buổi học.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const getClassLabel = (id) => {
    const c = classes.find((x) => x.id === id);
    if (!c) return `Class ${id}`;
    return `${c.class_code} - ${c.class_name}`;
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Sessions</h1>
        <p className="page-subtitle">
          Mỗi session tương ứng với một buổi học cụ thể của một lớp.
        </p>
      </div>

      {/* Form tạo session */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Tạo buổi học</div>
            <div className="card-subtitle">
              Gán buổi học với lớp, ví dụ: Buổi 1 - Giới thiệu môn học.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Lớp</label>
              <select
                name="class_id"
                value={form.class_id}
                onChange={handleChange}
              >
                <option value="">-- Chọn lớp --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.class_code} - {c.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Chủ đề buổi học</label>
              <input
                className="input"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="Buổi 1: Giới thiệu môn học"
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" className="btn">
              + Tạo buổi học
            </button>
            {loading && (
              <span className="text-xs text-muted">Đang xử lý...</span>
            )}
          </div>
          {errMsg && <p className="text-error">{errMsg}</p>}
        </form>
      </div>

      {/* Bảng danh sách sessions */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Danh sách buổi học</div>
            <div className="card-subtitle">
              Dữ liệu lấy từ API <code>/api/sessions/</code>.
            </div>
          </div>
          <button onClick={fetchSessions} className="btn btn-ghost btn-sm">
            Refresh
          </button>
        </div>

        {loading && sessions.length === 0 && (
          <p className="text-muted">Đang tải...</p>
        )}
        {!loading && sessions.length === 0 && (
          <p className="text-muted">Chưa có buổi học nào.</p>
        )}

        {sessions.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Lớp</th>
                  <th>Chủ đề</th>
                  <th>Thời gian bắt đầu</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{getClassLabel(s.class_id)}</td>
                    <td>{s.topic}</td>
                    <td className="text-xs">{s.start_time}</td>
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