// src/pages/StudentsPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import StudentItem from "../components/StudentItem";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState({
    student_code: "",
    full_name: "",
    class_name: "",
  });

  async function fetchStudents() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/students/");
      setStudents(res.data || []);
      setErrMsg("");
    } catch (err) {
      console.error(err);
      setErrMsg("Không load được danh sách sinh viên.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_code || !form.full_name) {
      setErrMsg("Hãy nhập đủ Mã SV và Họ tên.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/api/students/", form);
      setForm({ student_code: "", full_name: "", class_name: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        "Lỗi khi tạo sinh viên (có thể trùng mã).";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Students</h1>
        <p className="page-subtitle">
          Quản lý danh sách sinh viên. Việc enroll khuôn mặt sẽ cập nhật trạng
          thái <b>Enrolled</b> tương ứng.
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Thêm sinh viên</div>
            <div className="card-subtitle">
              Nhập mã sinh viên, họ tên và lớp hiển thị.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Mã sinh viên</label>
              <input
                className="input"
                name="student_code"
                value={form.student_code}
                onChange={handleChange}
                placeholder="22A12345"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Họ tên</label>
              <input
                className="input"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Lớp (hiển thị)</label>
              <input
                className="input"
                name="class_name"
                value={form.class_name}
                onChange={handleChange}
                placeholder="K58CNTT1"
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" className="btn">
              + Thêm sinh viên
            </button>
            {loading && <span className="text-xs text-muted">Đang xử lý...</span>}
          </div>
          {errMsg && <p className="text-error">{errMsg}</p>}
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Danh sách sinh viên</div>
            <div className="card-subtitle">
              Dữ liệu đang lấy từ API FastAPI `/api/students/`.
            </div>
          </div>
          <button onClick={fetchStudents} className="btn btn-ghost btn-sm">
            🔄 Refresh
          </button>
        </div>

        {loading && students.length === 0 && (
          <p className="text-muted">Đang tải...</p>
        )}
        {!loading && students.length === 0 && (
          <p className="text-muted">Chưa có sinh viên nào.</p>
        )}

        {students.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã SV</th>
                  <th>Họ tên</th>
                  <th>Lớp</th>
                  <th>Face</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <StudentItem key={s.id} student={s} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}