const API_BASE = process.env.NEXT_PUBLIC_FINAL_ASSESSMENT_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://dyslexia-grinbuds.up.railway.app";

export interface FinalAiAssessment {
  riskLevel: "rendah" | "sedang" | "tinggi";
  summary: string;
  evidence: string[];
  recommendation: string;
  shouldConsultProfessional: boolean;
  confidence: "rendah" | "sedang" | "tinggi";
  source: "gemini";
}

export interface FinalAssessmentPayload {
  completed_levels: number;
  game_results: Array<Record<string, unknown>>;
  dyslexia_assessments: Array<Record<string, unknown>>;
}

export async function generateFinalAssessment(payload: FinalAssessmentPayload): Promise<FinalAiAssessment | null> {
  try {
    const response = await fetch(`${API_BASE}/assess-final`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("[FinalAssessmentAPI] Request failed:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn("[FinalAssessmentAPI] Error:", error);
    return null;
  }
}
