const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');
const systemPrompt = require('../prompts/system');

const router = express.Router();

const ActionSchema = z.object({
  type: z.enum(['ADD', 'REMOVE', 'UPDATE_QTY', 'CLEAR']),
  itemId: z.string().nullish(),
  quantity: z.number().int().positive().nullish(),
  size: z.enum(['Small', 'Large']).nullable().optional(),
});

const ResponseSchema = z.object({
  reply: z.string().min(1),
  actions: z.array(ActionSchema).default([]),
  cartSummary: z.string().optional(),
});

const VALID_ITEM_IDS = new Set([
  'S1', 'S2', 'S3', 'S4',
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6',
  'D1', 'D2', 'D3', 'D4', 'D5',
  'DS1', 'DS2', 'DS3',
]);

/**
 * Pull the first balanced JSON object out of a string. The model is asked to
 * respond with pure JSON, but this is a safety net if it wraps the payload in
 * prose or markdown fences.
 */
function extractJsonObject(text) {
  if (!text) return null;
  const trimmed = text.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  const start = candidate.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return candidate.slice(start, i + 1);
      }
    }
  }
  return null;
}

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

router.post('/parse-order', async (req, res) => {
  const { message, cartContext } = req.body ?? {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message (string) is required' });
  }

  const client = getClient();
  if (!client) {
    return res.status(500).json({
      error: 'Server misconfigured',
      details:
        'GEMINI_API_KEY is not set. Add it to server/.env (local) or Vercel env vars.',
    });
  }

  try {
    const cartContextText =
      Array.isArray(cartContext) && cartContext.length > 0
        ? `Current cart: ${JSON.stringify(cartContext)}`
        : 'Current cart: (empty)';

    const userContent = `${cartContextText}\n\nUser says: "${message}"`;

    const model = client.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(userContent);
    const rawText = result?.response?.text?.() ?? '';

    const jsonText = extractJsonObject(rawText) ?? rawText.trim();
    if (!jsonText) {
      console.error('Empty model output');
      return res.status(502).json({
        error: 'Model did not return JSON',
        details: '(empty output)',
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (jsonErr) {
      console.error('JSON parse error:', jsonErr, 'raw:', jsonText);
      return res.status(502).json({
        error: 'Invalid JSON from model',
        details: jsonErr.message,
      });
    }

    const validated = ResponseSchema.parse(parsed);

    const filteredActions = validated.actions.filter((a) => {
      if (a.type === 'CLEAR') return true;
      return a.itemId && VALID_ITEM_IDS.has(a.itemId);
    });

    return res.json({
      reply: validated.reply,
      actions: filteredActions,
      cartSummary: validated.cartSummary,
    });
  } catch (err) {
    console.error('Error in /parse-order:', err);
    return res.status(500).json({
      error: 'Failed to parse order',
      details: err?.message ?? String(err),
    });
  }
});

module.exports = router;
