// src/components/StudentItem.jsx
export default function StudentItem({ student }) {
    return (
      <tr>
        <td>{student.id}</td>
        <td style={{ fontFamily: "monospace" }}>{student.student_code}</td>
        <td>{student.full_name}</td>
        <td>{student.class_name || "-"}</td>
        <td>
          {student.face_registered ? (
            <span className="badge badge-success">Enrolled</span>
          ) : (
            <span className="badge badge-muted">Not enrolled</span>
          )}
        </td>
      </tr>
    );
  }