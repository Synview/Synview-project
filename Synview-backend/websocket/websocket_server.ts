import { PostQuestion, Question } from "../../common/types.ts";

const sockets = new Set<WebSocket>();
const subscribers = new Map<string, Set<WebSocket>>();
const socketChannels = new Map<WebSocket, Set<string>>();

import { createLogger, LogLevel } from "../../common/Logger.ts";

const logger = createLogger("Backend [WS]", LogLevel.ERROR);

export function EntrySocket(socket: WebSocket): Promise<void> {
  sockets.add(socket);
  socket.onclose = () => {
    logger.info("Socket closed");
    cleanupSocket(socket);
  };
  socket.onerror = () => {
    logger.error("Socket error");
    cleanupSocket(socket);
  };

  socket.onmessage = (event) => {
    let message: { action: string; channel: string };

    try {
      message = JSON.parse(event.data);
    } catch {
      logger.error("Could not parse message");
      return;
    }

    if (message.action === "subscribe") {
      subscribeToChannel(socket, message.channel);
    }
    if (message.action === "unsubscribe") {
      unsubscribeFromChannel(socket, message.channel);
    }
  };

  return;
}
function cleanupSocket(socket: WebSocket) {
  sockets.delete(socket);
  const channels = socketChannels.get(socket);

  if (channels) {
    for (const channel of channels) {
      subscribers.get(channel)?.delete(socket);
      if (subscribers.get(channel)?.size === 0) {
        subscribers.delete(channel);
      }
    }
    socketChannels.delete(socket);
  }
}

function subscribeToChannel(socket: WebSocket, channel: string) {
  if (!subscribers.has(channel)) {
    subscribers.set(channel, new Set());
  }
  subscribers.get(channel)!.add(socket);

  if (!socketChannels.has(socket)) {
    socketChannels.set(socket, new Set());
  }
  socketChannels.get(socket)!.add(channel);
}
function unsubscribeFromChannel(socket: WebSocket, channel: string) {
  if (subscribers.get(channel)) {
    subscribers.get(channel)!.delete(socket);
  }
  if (socketChannels.get(socket)) {
    socketChannels.get(socket)!.delete(channel);
  }
}

export function sendToChannel(channel: string, payload: any) {
  const jsonData = JSON.stringify({ channel, data: payload });
  const channelSubscribers = subscribers.get(channel);
  if (channelSubscribers) {
    for (const subscriber of channelSubscribers) {
      try {
        subscriber.send(jsonData);
      } catch {
        cleanupSocket(subscriber);
      }
    }
  }
}
