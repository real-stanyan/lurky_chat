"use client";
import { useEffect, useState } from "react";

interface Message {
  userId: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/chatStream");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">客服后台</h1>
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-4">
        {messages.length === 0 ? (
          <p>暂无消息</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="border-b py-2">
              <p className="text-sm text-gray-600">
                访客ID: <span className="font-mono">{msg.userId}</span>
              </p>
              <p className="text-lg">{msg.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
