# nlp-service/model/__init__.py

import logging
from transformers import pipeline

# --- CONFIG ---
MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"
CONFIDENCE_THRESHOLD = 0.60   # if score < threshold, treat as 'neutral'

# --- LOAD MODEL ONCE ---

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nlp-model")

try:
    logger.info(f"Loading model: {MODEL_NAME} (this may take a minute on first run)...")
    nlp_pipeline = pipeline(
        "text-classification",
        model=MODEL_NAME,
        return_all_scores=True  # important for multi-emotion detection
    )
    logger.info("Model loaded and ready.")
except Exception as e:
    logger.exception("Failed to load transformer model. Make sure internet is available for first download.")
    raise

# --- ANALYSIS FUNCTION ---
def analyze_mood(text: str, multi: bool = False):
    """
    Analyze `text` and return:
      If multi=False:
        { "label": <raw_label>, "score": <confidence>, "final_label": <label_or_neutral> }
      If multi=True:
        { <emotion_label>: <score>, ... }  # all emotions with confidence scores above threshold
    """
    text = (text or "").strip()
    if not text:
        return {"label": "neutral", "score": 0.0, "final_label": "neutral"} if not multi else {"neutral": 1.0}

    # Run the pipeline (returns list of list of dicts)
    results = nlp_pipeline(text)[0]  # results = [{'label': 'joy', 'score': 0.92}, ...]

    if multi:
        # Return all emotions above threshold
        return {r['label']: r['score'] for r in results if r['score'] >= CONFIDENCE_THRESHOLD}
    else:
        # Return top emotion
        top = max(results, key=lambda x: x['score'])
        final_label = top['label'] if top['score'] >= CONFIDENCE_THRESHOLD else "neutral"
        return {"label": top['label'], "score": top['score'], "final_label": final_label}

# --- WARM-UP ---
try:
    _ = nlp_pipeline("I feel fine.")
    logger.info("Warm-up inference complete.")
except Exception:
    logger.warning("Warm-up inference failed (non-fatal).")

