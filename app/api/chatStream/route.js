import connectToDatabase from "../../../lib/mongodb";
import Message from "../../../models/Message";

export async function GET() {
  await connectToDatabase();
  const encoder = new TextEncoder();

  let changeStream;
  const stream = new ReadableStream({
    start(controller) {
      changeStream = Message.watch([{ $match: { operationType: "insert" } }]);
      changeStream.on("change", (change) => {
        const data = JSON.stringify(change.fullDocument);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      });
    },
    cancel() {
      changeStream.close();
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
