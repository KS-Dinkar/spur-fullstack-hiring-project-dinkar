import { GoogleGenAI } from "@google/genai";
import { db } from "../db/sqlite.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY || "",
});

export async function handleQuery(
  sessionId: string,
  query: string
): Promise<{ sessionId: string; response: string }> {
  const conversationHistory = getRecentHistory(sessionId, 5);
  const historyString = conversationHistory
  .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`)
  .join('\n---\n');
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Previous Conversation:\n${historyString}\n\nUser Query: ${query}`,
    config: {
      systemInstruction: `You are a helpful support agent for a small e‑commerce store. Answer clearly and concisely
                          Your support hours are from 9 AM to 5 PM, Monday to Friday.
                          You have refund policies for all electronics and clothing items within 30 days of purchase.
                          You are not able to ship on your own but you use reliable courier services to ensure timely delivery.`,
    },
  });
  insertUserAndAiMessages(sessionId, query, response.text || "No response generated.");
  const rows = db.prepare("SELECT * FROM conversations").all();
  const msgRows = db.prepare("SELECT * FROM messages").all();
  console.log("Conversations:", rows);
  console.log("Messages:", msgRows);

  return {
    sessionId,
    response: response.text || "No response generated,Please try again after some time.",
  };
}

function insertUserAndAiMessages(
  sessionId: string,
  userText: string,
  aiText: string
) {
  const insertConversationIfNotExists = db.prepare(`
    INSERT INTO conversations (sessionId)
    SELECT ?
    WHERE NOT EXISTS (
      SELECT 1 FROM conversations WHERE sessionId = ?
    )
  `);

  const getConversationId = db.prepare(`
    SELECT id FROM conversations WHERE sessionId = ?
  `);

  const insertMessage = db.prepare(`
    INSERT INTO messages (conversationId, sender, text)
    VALUES (?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    // 1. Ensure conversation exists
    insertConversationIfNotExists.run(sessionId, sessionId);

    // 2. Fetch conversationId
    const conversation = getConversationId.get(sessionId) as { id: number };
    const conversationId = conversation.id;

    // 3. Insert user message
    insertMessage.run(conversationId, "user", userText);

    // 4. Insert AI message
    insertMessage.run(conversationId, "ai", aiText);

    return conversationId;
  });

  return transaction();
}


export async function getAllMessages(sessionId: string) {
  const getConversationId = db.prepare(`
    SELECT id FROM conversations WHERE sessionId = ?
  `);
  const conversation = getConversationId.get(sessionId) as { id: number };
  const conversationId = conversation.id;

  const messages = db.prepare(`
    SELECT messages.sender AS type,messages.text FROM messages WHERE conversationId = ? ORDER BY id ASC
  `).all(conversationId);

  return messages;
}

function getRecentHistory(sessionId: string, limit: number = 10) {
  const conversation = db.prepare('SELECT id FROM conversations WHERE sessionId = ?').get(sessionId) as { id: number } | undefined;
  
  if (!conversation) return [];

  const messages = db.prepare(`
    SELECT sender, text FROM (
      SELECT sender, text, id FROM messages 
      WHERE conversationId = ? 
      ORDER BY id DESC LIMIT ?
    ) ORDER BY id ASC
  `).all(conversation.id, limit) as { sender: string, text: string }[];

  return messages

}
