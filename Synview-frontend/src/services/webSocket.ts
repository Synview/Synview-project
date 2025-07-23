let socket: WebSocket | null = null;
type Listener = (data: unknown) => void;
import { createLogger, LogLevel } from "../../../common/Logger.ts";
import { MessageSchema } from "../../../common/schemas.ts";
const subscribers = new Map<string, Set<Listener>>();

const logger = createLogger("Frontend [WS]", LogLevel.INFO);

export function connect(url: string) {
  if (socket) return;

  socket = new WebSocket(url);

  socket.onopen = () => {
    logger.info("[WS] is open");
  };

  socket.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data);
      const messages = MessageSchema.parse(json);
      const channelListeners = subscribers.get(messages.channel);
      if (channelListeners) {
        for (const listener of channelListeners) {
          listener(messages.data);
        }
      }
    } catch {
      logger.error("Could not parse socket message");
    }
  };

  socket.onclose = () => {
    logger.info("[WS] Closing");
    socket = null;
  };
  socket.onerror = (err) => {
    logger.error("[WS] Error : " + err);
  };
}

function sendSubscribe(channel: string) {
  if (socket?.readyState === WebSocket.OPEN)
    socket.send(JSON.stringify({ action: "subscribe", channel }));
}
function sendUnsubscribe(channel: string) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: "unsubscribe", channel }));
  }
}

export function subscribe(channel: string, listener: Listener) {
  if (!subscribers.has(channel)) {
    subscribers.set(channel, new Set());
    sendSubscribe(channel);
  }

  subscribers.get(channel)!.add(listener);

  return () => {
    const channelListeners = subscribers.get(channel);
    if (!channelListeners) return;

    channelListeners.delete(listener);

    if (channelListeners.size === 0) {
      subscribers.delete(channel);
      sendUnsubscribe(channel);
    }
  };
}
