import { Client } from '@stomp/stompjs';
import { getToken } from '@/utils/request';

// 全局实例
let stompClient: Client | null = null;
// 订阅存储（重连恢复）
const subscriptionMap = new Map<string, any>();
export const initStomp = () => {
  if (stompClient) return;
  const token = getToken();
  stompClient = new Client({
    webSocketFactory: () => {
      return new WebSocket(`/ws/chat`,[token]);
    },
    debug:(e)=>{console.log(e)},

    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    reconnectDelay: 3000,

    // 连接成功
    onConnect: (frame) => {
      console.log('✅ STOMP 连接成功', frame);
      // 自动恢复所有订阅
      resumeSubscriptions();
      window.dispatchEvent(new CustomEvent('stomp-connected'));
    },

    // 连接失败
    onStompError: (frame) => {
      console.error('❌ STOMP 错误:', frame.body);
    },

    // 断开连接
    onDisconnect: () => {
      console.log('🔌 STOMP 已断开');
    },
  });

  // 激活连接
  stompClient.activate();
};

/**
 * 重连后自动恢复订阅
 */
const resumeSubscriptions = () => {
  if (!stompClient || !subscriptionMap.size) return;

  subscriptionMap.forEach((callback, topic) => {
    stompClient!.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (e) {
        callback(message.body);
      }
    });
  });
};

/**
 * 订阅主题（支持断开重连自动恢复）
 */
export const subscribe = (
  topic: string,
  callback: (data: any) => void,
  headers = {}
) => {
  // 未初始化 → 先初始化
  if (!stompClient) {
    initStomp();
  }

  // 存储回调，用于重连恢复
  subscriptionMap.set(topic, callback);

  // 已连接 → 立即订阅
  if (stompClient.active) {
    return stompClient.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (e) {
        callback(message.body);
      }
    }, headers);
  }

  // 未连接 → 等待连接成功后订阅
  const onConnected = () => {
    stompClient!.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (e) {
        callback(message.body);
      }
    }, headers);
    window.removeEventListener('stomp-connected', onConnected);
  };
  window.addEventListener('stomp-connected', onConnected);

  // 取消订阅方法
  return () => {
    subscriptionMap.delete(topic);
    window.removeEventListener('stomp-connected', onConnected);
  };
};

/**
 * 发送消息
 */
export const publish = (
  destination: string,
  data: any,
  headers = {}
) => {
  if (!stompClient || !stompClient.active) {
    console.error('❌ 未连接，无法发送消息');
    return;
  }

  stompClient.publish({
    destination,
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  });
};

/**
 * 断开连接
 */
export const disconnect = () => {
  subscriptionMap.clear();
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export default {
  init: initStomp,
  subscribe,
  publish,
  disconnect,
};
