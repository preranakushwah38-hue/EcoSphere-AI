import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const CLASSIFICATION_PROMPT = `You are a waste classification AI. Analyze this image carefully and identify the type of waste shown.

Return ONLY a valid JSON object (no markdown, no code blocks, pure JSON only) with exactly these fields:
{
  "wasteType": "Plastic" or "Paper" or "Glass" or "Metal" or "Organic" or "E-Waste" or "Mixed" or "Unknown",
  "confidence": integer from 0 to 100,
  "recyclable": true or false,
  "sustainabilityGrade": "A" or "B" or "C" or "D" or "F",
  "recyclingInstructions": "2-3 sentences describing step-by-step how to recycle this item",
  "environmentalImpact": "1-2 sentences about the environmental harm if not properly disposed",
  "disposalRecommendations": "1-2 sentences on where and how to dispose of this specific waste type",
  "funFact": "1 interesting environmental fact about this type of waste"
}`;

router.post("/waste-scanner/classify", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body as {
      imageBase64: string;
      mimeType?: string;
    };

    if (!imageBase64) {
      res.status(400).json({ error: "imageBase64 is required" });
      return;
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: CLASSIFICATION_PROMPT },
          ],
        },
      ],
    });

    const text = result.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Could not parse AI response" });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Classification failed. Please try another image." });
  }
});

export default router;
