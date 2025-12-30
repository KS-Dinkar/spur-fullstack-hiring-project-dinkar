import { Router, Request, Response } from "express";
import { getAllMessages, handleQuery } from "../services/query.service.js";

const router = Router();

router.post("/sendQuery", async (req: Request, res: Response) => {
  const { sessionId, query } = req.body;

  // basic validation
  if (!sessionId || !query) {
    return res.status(400).json({
      error: "sessionId and query are required"
    });
  }

  const result = await handleQuery(sessionId, query);

  return res.status(200).json(result);
});   


router.get('/messages', async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId query parameter' });
  }

  // Fetch messages from store or return empty array 
  const messages = await getAllMessages(sessionId);

  return res.json(messages);
});
export default router;
