import numpy as np
import cv2
from insightface.app import FaceAnalysis

# Biến global giữ singleton của FaceAnalysis
_face_analyzer: FaceAnalysis | None = None


def get_face_analyzer() -> FaceAnalysis:
    """
    Khởi tạo (nếu chưa) và trả về FaceAnalysis.
    Dùng chung cho detector + embedder để tiết kiệm tài nguyên.
    """
    global _face_analyzer
    if _face_analyzer is None:
        app = FaceAnalysis(name="buffalo_l")  # model tổng hợp: detect + embed
        # ctx_id = 0: dùng GPU nếu có, -1: CPU. Mặc định để -1 cho an toàn.
        app.prepare(ctx_id=-1, det_size=(640, 640))
        _face_analyzer = app
    return _face_analyzer


def read_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """
    Chuyển bytes (upload từ FastAPI) sang ảnh BGR (OpenCV).
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


def detect_faces(image: np.ndarray):
    """
    Trả về danh sách faces (object của InsightFace).
    Mỗi 'face' có các thuộc tính như: bbox, kps, det_score, embedding (nếu lấy).
    """
    app = get_face_analyzer()
    faces = app.get(image)
    return faces