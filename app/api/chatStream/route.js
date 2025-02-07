export async function GET(_request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 初始消息
      controller.enqueue(encoder.encode(`data: Connected\n\n`));

      // 模拟每秒推送一次消息
      const interval = setInterval(() => {
        controller.enqueue(
          encoder.encode(`data: message at ${new Date().toISOString()}\n\n`)
        );
      }, 1000);

      // 50秒后关闭连接，避免超时
      setTimeout(() => {
        clearInterval(interval);
        controller.enqueue(encoder.encode(`data: Connection closing...\n\n`));
        controller.close();
      }, 50000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
