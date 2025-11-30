# app/face_engine/matcher.py
from typing import List, Tuple, Optional
import numpy as np


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """
    Cosine similarity giữa 2 vector embedding.
    Kết quả: [-1, 1], càng gần 1 càng giống.
    """
    if a is None or b is None:
        return -1.0

    a = a.astype("float32")
    b = b.astype("float32")

    denom = (np.linalg.norm(a) * np.linalg.norm(b)) + 1e-8
    return float(np.dot(a, b) / denom)


def find_best_match(
    target_emb: np.ndarray,
    candidates: List[Tuple[int, np.ndarray]],
    threshold: float,
) -> Optional[int]:
    """
    Tìm student_id có embedding giống nhất với target_emb.

    candidates: list[(student_id, embedding)]
    threshold: ngưỡng tối thiểu để chấp nhận (ví dụ 0.45–0.6)
    """
    best_id = None
    best_score = -1.0

    for student_id, emb in candidates:
        score = cosine_similarity(target_emb, emb)
        if score > best_score:
            best_score = score
            best_id = student_id

    if best_id is not None and best_score >= threshold:
        return best_id

    return None