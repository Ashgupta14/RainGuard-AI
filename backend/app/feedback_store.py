from typing import List
from .feedback import Feedback
from datetime import datetime

class FeedbackStore:
    def __init__(self):
        self.feedbacks: List[Feedback] = []

    def add_feedback(self, feedback: Feedback):
        if not feedback.timestamp:
            feedback.timestamp = datetime.utcnow().isoformat()
        self.feedbacks.append(feedback)

    def get_feedback(self) -> List[Feedback]:
        return self.feedbacks

    def get_feedback_for_cell(self, cell_id: str) -> List[Feedback]:
        return [fb for fb in self.feedbacks if fb.cell_id == cell_id]

    def get_feedback_for_alert(self, alert_id: str) -> List[Feedback]:
        return [fb for fb in self.feedbacks if fb.alert_id == alert_id]

feedback_store = FeedbackStore()
