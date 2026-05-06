// Dynamic import ensures socket.io-client (and engine.io-client) is never
// bundled or evaluated on the server, where `localStorage` does not exist.
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (typeof window === 'undefined') {
    throw new Error('getSocket() must only be called in the browser');
  }
  if (!socket) {
    const { io } = await import('socket.io-client');
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001', {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }
  return socket;
}

export async function connectSocket(): Promise<Socket> {
  const s = await getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket(): void {
  socket?.disconnect();
}
