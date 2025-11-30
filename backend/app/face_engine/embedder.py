from typing import Optional
import numpy as np

from .detector import get_face_analyzer


def get_face_embedding(image: np.ndarray) -> Optional[np.ndarray]:
    """
    Input: ảnh BGR (OpenCV)
    Output: embedding của khuôn mặt đầu tiên (vector numpy 512-d),
            hoặc None nếu không tìm thấy mặt.
    """
    app = get_face_analyzer()
    faces = app.get(image)

    if not faces:
        return None

    # Tạm thời lấy khuôn mặt có score cao nhất
    best_face = max(faces, key=lambda f: f.det_score)

    # embedding là numpy.ndarray
    emb = best_face.embedding
    # Ép về float32 cho gọn
    return emb.astype("float32")