import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";
import { db, conversationsTable, messagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are EcoSphere AI, an expert sustainability coach. You help users reduce their environmental impact through practical, evidence-based advice. You have deep knowledge of:
- Carbon footprint reduction (transport, diet, home energy)
- Water conservation techniques
- Recycling and waste reduction
- Renewable energy (solar, wind, heat pumps)
- Climate change science and solutions
- Sustainable shopping and consumption
- Eco-friendly home improvements
- Green travel alternatives

Guidelines:
- Give specific, actionable advice with real numbers and estimates where possible (e.g. "switching to LED bulbs saves ~$75/year")
- Be encouraging and positive, never preachy
- Keep responses focused and conversational — 2-4 short paragraphs max
- Use bullet points for lists of tips
- Occasionally reference the user's EcoSphere data (carbon score, water usage, etc.) to personalise advice
- If asked something outside sustainability, gently redirect to eco topics`;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

// GET /gemini/conversations
router.get("/gemini/conversations", async (req, res) => {
  try {
    const convs = await db
      .select()
      .from(conversationsTable)
      .orderBy(asc(conversationsTable.createdAt));
    res.json(convs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// POST /gemini/conversations
router.post("/gemini/conversations", async (req, res) => {
  try {
    const { title } = req.body as { title: string };
    if (!title?.trim()) {
      res.status(400).json({ error: "title is required" });
      return;
    }
    const [conv] = await db
      .insert(conversationsTable)
      .values({ title: title.trim() })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// GET /gemini/conversations/:id
router.get("/gemini/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [conv] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, id))
      .orderBy(asc(messagesTable.createdAt));
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// DELETE /gemini/conversations/:id
router.delete("/gemini/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [conv] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    await db.delete(conversationsTable).where(eq(conversationsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// GET /gemini/conversations/:id/messages
router.get("/gemini/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const msgs = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, id))
      .orderBy(asc(messagesTable.createdAt));
    res.json(msgs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /gemini/conversations/:id/messages  — SSE streaming
router.post("/gemini/conversations/:id/messages", async (req, res) => {
  const convId = parseInt(req.params.id, 10);
  const { content } = req.body as { content: string };

  if (!content?.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  // Verify conversation exists
  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, convId));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Save user message
  await db.insert(messagesTable).values({
    conversationId: convId,
    role: "user",
    content: content.trim(),
  });

  // Load full history for context
  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, convId))
    .orderBy(asc(messagesTable.createdAt));

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let fullResponse = "";

  try {
    const ai = getAI();

    const contents = history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        maxOutputTokens: 8192,
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    // Save assistant message
    await db.insert(messagesTable).values({
      conversationId: convId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    req.log.error(err);
    res.write(`data: ${JSON.stringify({ error: "AI generation failed. Please try again." })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;
