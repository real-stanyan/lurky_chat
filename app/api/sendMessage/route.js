import connectToDatabase from "../../../lib/mongodb";
import Message from "../../../models/Message";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { userId, message } = req.body;
  if (!userId || !message)
    return res.status(400).json({ error: "缺少 userId 或 message" });
  try {
    await connectToDatabase();
    const newMessage = await Message.create({ userId, message });
    return res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
