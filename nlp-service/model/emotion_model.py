# model/emotion_model.py
from transformers import pipeline

def load_emotion_model():
    """
    Loads the pre-trained emotion classification model.
    """
    model_name = "j-hartmann/emotion-english-distilroberta-base"
    emotion_classifier = pipeline("text-classification", model=model_name, return_all_scores=True)
    return emotion_classifier


def predict_emotions(text):
    """
    Takes a text input and returns emotions with confidence scores.
    """
    classifier = load_emotion_model()
    result = classifier(text)
    return result
