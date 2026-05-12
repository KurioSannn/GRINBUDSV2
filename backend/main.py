import json
import os
import re
import urllib.error
import urllib.request
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

def _load_local_env() -> None:
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as env_file:
        for line in env_file:
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue

            key, value = stripped.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_local_env()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}

@app.get("/api/data")
async def get_data():
    return {
        "status": "success",
        "data": {
            "items": ["Next.js", "React", "FastAPI", "Tailwind CSS", "Framer Motion"],
            "description": "This is a sample response from the FastAPI backend."
        }
    }


class FinalAssessmentRequest(BaseModel):
    completed_levels: int = Field(..., ge=0)
    game_results: list[dict[str, Any]]
    dyslexia_assessments: list[dict[str, Any]] = Field(default_factory=list)


class FinalAssessment(BaseModel):
    riskLevel: Literal["rendah", "sedang", "tinggi"]
    summary: str
    evidence: list[str]
    recommendation: str
    shouldConsultProfessional: bool
    confidence: Literal["rendah", "sedang", "tinggi"]
    source: Literal["gemini"]


def _extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


def _normalize_assessment(raw: dict[str, Any]) -> FinalAssessment:
    risk = raw.get("riskLevel")
    if risk not in {"rendah", "sedang", "tinggi"}:
        risk = "sedang"

    confidence = raw.get("confidence")
    if confidence not in {"rendah", "sedang", "tinggi"}:
        confidence = "sedang"

    evidence = raw.get("evidence")
    if not isinstance(evidence, list):
        evidence = []

    return FinalAssessment(
        riskLevel=risk,
        summary=str(raw.get("summary") or "Analisis selesai berdasarkan data latihan yang tersedia."),
        evidence=[str(item) for item in evidence[:6]],
        recommendation=str(raw.get("recommendation") or "Lanjutkan latihan dan pantau perkembangan anak secara berkala."),
        shouldConsultProfessional=bool(raw.get("shouldConsultProfessional", risk == "tinggi")),
        confidence=confidence,
        source="gemini",
    )


@app.post("/assess-final", response_model=FinalAssessment)
async def assess_final(payload: FinalAssessmentRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")

    if payload.completed_levels < 8:
        raise HTTPException(status_code=400, detail="At least 8 completed levels are required")

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    compact_results = [
        {
            "level_id": item.get("level_id"),
            "stars": item.get("stars"),
            "total_salah": item.get("total_salah"),
            "rata_waktu": item.get("rata_waktu"),
            "detail_error": item.get("detail_error"),
            "dyslexia_assessment": item.get("dyslexia_assessment"),
        }
        for item in payload.game_results
        if item.get("stars", 0) > 0
    ]

    prompt = {
        "instruction": (
            "Anda adalah asisten analisis edukasi untuk aplikasi latihan membaca anak. "
            "Buat ringkasan risiko berbasis data, bukan diagnosis medis. "
            "Gunakan hasil dyslexia_assessment dari model handwriting sebagai sinyal utama, "
            "lalu gunakan total_salah, rata_waktu, dan pola detail_error sebagai konteks pendukung. "
            "Jika indikasi kuat, sarankan konsultasi dengan profesional. "
            "Balas hanya JSON valid tanpa markdown."
        ),
        "required_json_schema": {
            "riskLevel": "rendah | sedang | tinggi",
            "summary": "string singkat bahasa Indonesia",
            "evidence": ["daftar alasan berbasis data"],
            "recommendation": "string actionable bahasa Indonesia",
            "shouldConsultProfessional": "boolean",
            "confidence": "rendah | sedang | tinggi",
        },
        "completed_levels": payload.completed_levels,
        "game_results": compact_results,
        "dyslexia_assessments": payload.dyslexia_assessments,
    }

    request_body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": json.dumps(prompt, ensure_ascii=False)}],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {detail}") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}") from exc

    try:
        text = response_data["candidates"][0]["content"]["parts"][0]["text"]
        return _normalize_assessment(_extract_json(text))
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Invalid Gemini response") from exc
