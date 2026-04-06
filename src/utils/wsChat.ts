import { getToken } from '@/utils/request';

let wsClient: WebSocket | null = null;
const subscriptionMap = new Map<string, { callback: (data: any) => void; headers: Record<string, any> }>();
let reconnectTimer: any = null;
let heartbeatTimer: any = null;
let isConnecting = false; // 防重复连接锁

const RECONNECT_DELAY = 3000;
const HEARTBEAT_OUTGOING = 4000;

export const initStomp = () => {
  if (wsClient || isConnecting) return;

  const token = getToken();
  if (!token) {
    console.warn('⚠️ 无 Token，不连接 WebSocket');
    return;
  }

  isConnecting = true;
  const wsUrl = `ws://39.96.214.163:8080/ws/chat?token=${encodeURIComponent(token)}`;
  wsClient = new WebSocket(wsUrl);

  wsClient.onopen = (event) => {
    console.log('✅ WebSocket 连接成功', event);
    isConnecting = false;

    if (reconnectTimer) clearTimeout(reconnectTimer);
    startHeartbeat();
    resumeSubscriptions();
    window.dispatchEvent(new CustomEvent('stomp-connected'));
  };
  wsClient.onmessage = (event) => {
    resetHeartbeat();
    try {
      const message = JSON.parse(event.data);
      const { destination, body } = message;
      if (destination && subscriptionMap.has(destination)) {
        const { callback } = subscriptionMap.get(destination)!;
        try {
          callback(JSON.parse(body));
        } catch {
          callback(body);
        }
      }
    } catch {
      // 非JSON消息忽略
    }
  };

  wsClient.onerror = (error) => {
    console.error('❌ WebSocket 错误', error);
    isConnecting = false;
  };

  wsClient.onclose = (event) => {
    console.log(`🔌 WebSocket 断开 code: ${event.code}, reason: ${event.reason}`);
    isConnecting = false;
    stopHeartbeat();
    wsClient = null;

    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(initStomp, RECONNECT_DELAY);
  };
};

const startHeartbeat = () => {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (wsClient?.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify({ type: 'heartbeat', data: 'ping' }));
    }
  }, HEARTBEAT_OUTGOING);
};

const resetHeartbeat = () => {
  stopHeartbeat();
  startHeartbeat();
};

const stopHeartbeat = () => {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
};

const resumeSubscriptions = () => {
  if (!subscriptionMap.size) return;
  subscriptionMap.forEach(({ headers }, topic) => {
    wsClient?.send(JSON.stringify({
      action: 'subscribe',
      destination: topic,
      headers
    }));
  });
};

export const subscribe = (
  topic: string,
  callback: (data: any) => void,
  headers: Record<string, any> = {}
) => {
  if (!wsClient) initStomp();
  subscriptionMap.set(topic, { callback, headers });

  const onConnected = () => {
    if (wsClient?.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify({
        action: 'subscribe',
        destination: topic,
        headers
      }));
    }
    window.removeEventListener('stomp-connected', onConnected);
  };

  window.addEventListener('stomp-connected', onConnected);
  return () => {
    subscriptionMap.delete(topic);
    window.removeEventListener('stomp-connected', onConnected);
    if (wsClient?.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify({ action: 'unsubscribe', destination: topic }));
    }
  };
};

export const publish = (destination: string, data: any, headers = {}) => {
  if (wsClient?.readyState !== WebSocket.OPEN) {
    console.error('❌ 未连接，无法发送');
    return;
  }
  wsClient.send(JSON.stringify({
    destination,
    body: data,
    headers: { 'content-type': 'application/json', ...headers }
  }));
};

export const disconnect = () => {
  subscriptionMap.clear();
  stopHeartbeat();
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (wsClient) {
    wsClient.close();
    wsClient = null;
  }
  console.log('🔌 已主动断开 WebSocket');
};

export default {
  init: initStomp,
  subscribe,
  publish,
  disconnect,
};
