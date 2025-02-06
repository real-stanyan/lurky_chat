import connectToDatabase from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { userId, message } = await request.json();
    if (!userId || !message) {
      return NextResponse.json(
        { error: "缺少 userId 或 message" },
        { status: 400 }
      );
    }
    const newMessage = await Message.create({ userId, message });
    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
