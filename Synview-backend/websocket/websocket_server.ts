import { PostQuestion, Question } from "../../common/types.ts";

const sockets = new Set<WebSocket>();

export async function EntrySocket(socket: WebSocket): Promise<void> {
  socket.onopen = () => sockets.add(socket);
  socket.onclose = () => sockets.delete(socket);
  socket.onerror = () => sockets.delete(socket);
  return;
}

export function sendQuestionToConnectedUsers(data: PostQuestion) {
  const question = JSON.stringify(data);
  for (const socket of sockets) {
    try {
      socket.send(question);
    } catch {
      sockets.delete(socket);
    }
  }
}
