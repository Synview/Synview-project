const sockets = new Set<WebSocket>();

export async function EntrySocket(socket: WebSocket): Promise<void> {
  socket.onopen = () => sockets.add(socket);
  socket.onclose = () => sockets.delete(socket);
  socket.onerror = () => sockets.delete(socket);
  return;
}

export function sendDataToUsers(data: any) {
  const jsonData = JSON.stringify(data);
  for (const socket of sockets) {
    try {
      socket.send(jsonData);
    } catch {
      sockets.delete(socket);
    }
  }
}
