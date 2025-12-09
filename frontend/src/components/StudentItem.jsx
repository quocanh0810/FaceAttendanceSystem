// src/components/StudentItem.jsx
import { useRef, useState } from "react";
import axiosClient from "../api/axiosClient";

function StudentItem({ student, onAfterEnroll }) {
  const fileInputRef = useRef(null);
  const [enrollStatus, setEnrollStatus] = useState(null); // "loading" | "success" | "error" | null

  const handleClickEnroll = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setEnrollStatus("loading");

      const formData = new FormData();
      formData.append("file", file);

      await axiosClient.post(
        `/api/students/${student.id}/enroll-face`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEnrollStatus("success");
      // gọi lại API để cập nhật cột "Đã enroll"
      onAfterEnroll && onAfterEnroll();
    } catch (err) {
      console.error("Enroll face error:", err);
      setEnrollStatus("error");
    } finally {
      // cho phép chọn lại cùng một file
      e.target.value = "";
    }
  };

  return (
    <tr>
      <td>{student.id}</td>
      <td>{student.student_code}</td>
      <td>{student.full_name}</td>
      <td>{student.class_name}</td>

      <td className="face-cell">
        <div className="face-actions">
          <span
            className={
              student.face_registered
                ? "badge badge-success"
                : "badge badge-warning"
            }
          >
            {student.face_registered ? "Đã enroll" : "Chưa enroll"}
          </span>

          <button
            type="button"
            onClick={handleClickEnroll}
            className="btn btn-sm"
            disabled={enrollStatus === "loading"}
          >
            {enrollStatus === "loading" ? "Đang upload..." : "Enroll face"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {enrollStatus === "success" && (
          <div className="mt-1 text-xs text-emerald">
            Upload thành công
          </div>
        )}
        {enrollStatus === "error" && (
          <div className="mt-1 text-xs text-error">
            Lỗi khi enroll khuôn mặt
          </div>
        )}
      </td>
    </tr>
  );
}

export default StudentItem;