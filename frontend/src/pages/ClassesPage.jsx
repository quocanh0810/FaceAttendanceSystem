// src/pages/ClassesPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ class_code: "", class_name: "" });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function fetchClasses() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/classes/");
      setClasses(res.data || []);
      setErrMsg("");
    } catch (err) {
      console.error(err);
      setErrMsg("Không load được danh sách lớp.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.class_code || !form.class_name) {
      setErrMsg("Hãy nhập đủ Mã lớp và Tên lớp.");
      return;
    }
    try {
      setLoading(true);
      await axiosClient.post("/api/classes/", form);
      setForm({ class_code: "", class_name: "" });
      fetchClasses();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        "Lỗi khi tạo lớp (có thể trùng mã lớp).";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Classes</h1>
        <p className="page-subtitle">
          Quản lý các lớp học, dùng để gán với các buổi học (sessions).
        </p>
      </div>

      {/* Form thêm lớp */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Thêm lớp học</div>
            <div className="card-subtitle">
              Mỗi lớp có một <b>Mã lớp</b> riêng và <b>Tên lớp</b> mô tả.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Mã lớp</label>
              <input
                className="input"
                name="class_code"
                value={form.class_code}
                onChange={handleChange}
                placeholder="K58CNTT1"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Tên lớp</label>
              <input
                className="input"
                name="class_name"
                value={form.class_name}
                onChange={handleChange}
                placeholder="Công nghệ thông tin 1"
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" className="btn">
              + Thêm lớp
            </button>
            {loading && (
              <span className="text-xs text-muted">Đang xử lý...</span>
            )}
          </div>
          {errMsg && <p className="text-error">{errMsg}</p>}
        </form>
      </div>

      {/* Bảng danh sách lớp */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Danh sách lớp</div>
            <div className="card-subtitle">
              Dữ liệu lấy từ API <code>/api/classes/</code>.
            </div>
          </div>
          <button onClick={fetchClasses} className="btn btn-ghost btn-sm">
            Refresh
          </button>
        </div>

        {loading && classes.length === 0 && (
          <p className="text-muted">Đang tải...</p>
        )}
        {!loading && classes.length === 0 && (
          <p className="text-muted">Chưa có lớp nào.</p>
        )}

        {classes.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã lớp</th>
                  <th>Tên lớp</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td style={{ fontFamily: "monospace" }}>
                      {c.class_code}
                    </td>
                    <td>{c.class_name}</td>
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