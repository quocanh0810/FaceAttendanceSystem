import numpy as np
import cv2
from insightface.app import FaceAnalysis

_face_analyzer: FaceAnalysis | None = None


def get_face_analyzer() -> FaceAnalysis:
    global _face_analyzer
    if _face_analyzer is None:
        app = FaceAnalysis(name="buffalo_l")  # model detect + embed
        # ctx_id = 0: dùng GPU nếu có, -1: CPU. default = -1
        app.prepare(ctx_id=-1, det_size=(640, 640))
        _face_analyzer = app
    return _face_analyzer


def read_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


def detect_faces(image: np.ndarray):
    # return object InsightFace: bbox, kps, det_score, embedding
    app = get_face_analyzer()
    faces = app.get(image)
    return faces