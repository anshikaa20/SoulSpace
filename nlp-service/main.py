# activate virtual env everytime you want to run main.py using - .\.env\Scripts\activate
# pip install -r requirements.txt
# Start fastAPI server : uvicorn main:app --reload

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from model import analyze_mood

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/")
async def predict(request: Request):
    payload = await request.json()
    text = payload.get("text", "")
    print(f"🔹 Received text: {text}")

    try:
        result = analyze_mood(text)  # Use your model function
        print(f"🔹 Final processed result: {result}")

        # Extract the final label
        emotion = result.get("final_label", "neutral")
        confidence = result.get("score", 0.0)

        return {"emotion": emotion, "confidence": confidence}

    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return {"error": "Something went wrong"}


