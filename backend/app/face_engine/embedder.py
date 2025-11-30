from typing import Optional
import numpy as np

from .detector import get_face_analyzer


def get_face_embedding(image: np.ndarray) -> Optional[np.ndarray]:
    """
    Input: BGR
    Output: embedding vector numpy 512-d / None
    """
    app = get_face_analyzer()
    faces = app.get(image)

    if not faces:
        return None

    # score max của mặt
    best_face = max(faces, key=lambda f: f.det_score)

    emb = best_face.embedding
    return emb.astype("float32")