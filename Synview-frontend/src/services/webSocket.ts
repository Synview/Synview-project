let socket: WebSocket | null = null;
type Listener = (data: unknown) => void;
import { createLogger, LogLevel } from "../../../common/Logger.ts";
import { MessageSchema } from "../../../common/schemas.ts";
import type { UserData } from "../../../common/types.ts";
import sleep from "../utils/sleep.ts";
const subscribers = new Map<string, Set<Listener>>();

const logger = createLogger("Frontend [WS]", LogLevel.INFO);

export function connect(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (socket && socket.readyState === WebSocket.CONNECTING) return resolve();

    socket = new WebSocket(url);

    socket.onopen = () => {
      logger.info("[WS] is open");
      resolve();
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

    socket.onclose = async () => {
      logger.warn("[WS] Closing - reconnecting");
      await sleep(1000);
      connect(url);
    };
    socket.onerror = async (err) => {
      logger.warn(`[WS] Error - reconnecting : ${err}`);
      await sleep(1000);
      connect(url);
    };
  });
}

function sendSubscribe(channel: string) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: "subscribe", channel }));
  }
}
function sendUnsubscribe(channel: string) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: "unsubscribe", channel }));
  }
}

export function sendIsPresent(channel: string, userData: UserData) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: "join", channel, userData }));
  }
}

export function sendIsGone(channel: string) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ action: "leave", channel }));
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
