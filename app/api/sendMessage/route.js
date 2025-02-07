import connectToDatabase from "../../../lib/mongodb";
import Message from "../../../models/Message";
import { NextResponse } from "next/server";

// 设置 CORS 相关的 header
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 或者指定允许访问的域名，如 "https://www.lurky.com.au"
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 处理预检请求
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { userId, message } = await request.json();
    if (!userId || !message) {
      return NextResponse.json(
        { error: "缺少 userId 或 message" },
        { status: 400, headers: corsHeaders }
      );
    }
    const newMessage = await Message.create({ userId, message });
    return NextResponse.json(
      { success: true, message: newMessage },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
