const sockets = new Set<WebSocket>();
const subscribers = new Map<string, Set<WebSocket>>();
const socketChannels = new Map<WebSocket, Set<string>>();
const socketUserData = new Map<WebSocket, UserData>();
const broadcastChannels = new Map<string, BroadcastChannel>();

import { createLogger, LogLevel } from "../../common/Logger.ts";
import type { UserData } from "../../common/types.ts";

const logger = createLogger("Backend [WS]", LogLevel.ERROR);

export function EntrySocket(socket: WebSocket): void {
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
    let message: { action: string; channel: string; userData: UserData };

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
    if (message.action === "join") {
      joinProject(socket, message.channel, message.userData);
    }
    if (message.action === "leave") {
      leaveProject(socket, message.channel);
    }
  };
  return;
}

function createBroadcastChannel(channel: string) {
  if (!broadcastChannels.has(channel)) {
    const bc = new BroadcastChannel(channel);
    bc.onmessage = (msg) => {
      const subs = subscribers.get(channel);
      if (subs) {
        for (const sub of subs) {
          sub.send(msg.data);
        }
      }
    };
    broadcastChannels.set(channel, bc);
  }
}

function joinProject(socket: WebSocket, channel: string, userData: UserData) {
  socketUserData.set(socket, userData);

  if (!subscribers.has(channel)) {
    subscribers.set(channel, new Set());
  }
  subscribers.get(channel)!.add(socket);
  if (!socketChannels.has(socket)) {
    socketChannels.set(socket, new Set());
  }
  socketChannels.get(socket)!.add(channel);

  broadcastPresence(channel);
}
function leaveProject(socket: WebSocket, channel: string) {
  socketUserData.delete(socket);

  subscribers.get(channel)?.delete(socket);
  if (subscribers.get(channel)?.size === 0) {
    cleanupBroadcast(channel);

    subscribers.delete(channel);
  }

  socketChannels.get(socket)?.delete(channel);
  if (socketChannels.get(socket)?.size === 0) {
    socketChannels.delete(socket);
  }
  broadcastPresence(channel);
}

function cleanupSocket(socket: WebSocket) {
  sockets.delete(socket);
  const channels = socketChannels.get(socket);

  if (channels) {
    for (const channel of channels) {
      subscribers.get(channel)?.delete(socket);
      if (subscribers.get(channel)?.size === 0) {
        cleanupBroadcast(channel);

        subscribers.delete(channel);
      }
      broadcastPresence(channel);
    }
    socketChannels.delete(socket);
  }
}

function cleanupBroadcast(channel: string) {
  broadcastChannels.delete(channel);
}

function subscribeToChannel(socket: WebSocket, channel: string) {
  createBroadcastChannel(channel);

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
  const subs = subscribers.get(channel);
  if (subs) {
    subs.delete(socket);
    if (subs.size === 0) {
      cleanupBroadcast(channel);
      subscribers.delete(channel);
    }
  }
  if (socketChannels.get(socket)) {
    socketChannels.get(socket)!.delete(channel);
  }
}

export function broadcastPresence(channel: string) {
  const subs = subscribers.get(channel);
  if (!subs) return;

  const present = Array.from(subs)
    .map((sub) => socketUserData.get(sub))
    .filter((userData) => userData !== undefined);

  const data = JSON.stringify({ channel, data: { present } });
  for (const sub of subs) {
    try {
      sub.send(data);
    } catch {
      cleanupSocket(sub);
    }
  }
}

export function sendToChannel(channel: string, payload: any) {
  const jsonData = JSON.stringify({ channel, data: payload });
  const channelSubscribers = subscribers.get(channel);
  broadcastChannels.get(channel)?.postMessage(jsonData);
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
