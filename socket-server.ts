/**
 * Arena Socket.io Server — runs standalone on port 3001.
 * Start with: npm run dev:socket
 */

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomStatus = 'waiting' | 'countdown' | 'racing' | 'finished';

interface Player {
  id: string;
  socketId: string;
  username: string;
  avatarUrl?: string;
  isReady: boolean;
  isFinished: boolean;
  progress: number;
  wpm: number;
  accuracy: number;
  rank?: number;
  finishedAt?: number;
}

interface Room {
  id: string;
  hostId: string;
  status: RoomStatus;
  players: Player[];
  text: string;
  maxPlayers: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  countdownSeconds: number;
}

// ─── Race texts ───────────────────────────────────────────────────────────────

const RACE_TEXTS = [
  'The quick brown fox jumps over the lazy dog near the riverbank while the sun sets behind the mountains.',
  'Programming is the art of telling another human what one wants the computer to do in a clear and precise manner.',
  'Success is not final failure is not fatal it is the courage to continue that counts and makes all the difference.',
  'The best way to predict the future is to invent it and work hard every single day to make it happen with passion.',
  'Learning to type fast requires consistent practice and dedication to building strong muscle memory over time.',
  'In the middle of every difficulty lies an opportunity to grow and become a stronger more resilient person.',
  'Technology is best when it brings people together and enables them to collaborate and create something amazing.',
  'The keyboard is the instrument of the modern world and mastering it opens countless doors to creativity.',
  'Great things are not done by impulse but by a series of small things brought together through effort and time.',
  'Speed and accuracy are the twin pillars of efficient typing and both improve with deliberate daily practice.',
];

function pickRaceText(): string {
  return RACE_TEXTS[Math.floor(Math.random() * RACE_TEXTS.length)];
}

// ─── In-memory state ──────────────────────────────────────────────────────────

const rooms = new Map<string, Room>();
/** socketId → roomId */
const socketRoom = new Map<string, string>();
/** socketId → playerId */
const socketPlayer = new Map<string, string>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roomPublicView(room: Room) {
  return {
    id: room.id,
    hostId: room.hostId,
    status: room.status,
    players: room.players.map(playerPublicView),
    text: room.text,
    maxPlayers: room.maxPlayers,
    createdAt: room.createdAt,
    startedAt: room.startedAt,
    finishedAt: room.finishedAt,
    countdownSeconds: room.countdownSeconds,
  };
}

function playerPublicView(p: Player) {
  return {
    id: p.id,
    username: p.username,
    avatarUrl: p.avatarUrl,
    isReady: p.isReady,
    isFinished: p.isFinished,
    progress: p.progress,
    wpm: p.wpm,
    accuracy: p.accuracy,
    rank: p.rank,
    finishedAt: p.finishedAt,
  };
}

function getPlayerBySocketId(socketId: string): { room: Room; player: Player } | null {
  const roomId = socketRoom.get(socketId);
  if (!roomId) return null;
  const room = rooms.get(roomId);
  if (!room) return null;
  const playerId = socketPlayer.get(socketId);
  const player = room.players.find((p) => p.id === playerId);
  if (!player) return null;
  return { room, player };
}

function broadcastRoomState(io: Server, room: Room) {
  io.to(room.id).emit('room:state', roomPublicView(room));
}

function allPlayersReady(room: Room): boolean {
  return room.players.length >= 2 && room.players.every((p) => p.isReady);
}

function allPlayersFinished(room: Room): boolean {
  return room.players.length > 0 && room.players.every((p) => p.isFinished);
}

// ─── Countdown + race start ───────────────────────────────────────────────────

const countdownTimers = new Map<string, NodeJS.Timeout>();
const raceEndTimers = new Map<string, NodeJS.Timeout>();

function startCountdown(io: Server, room: Room) {
  if (room.status !== 'waiting') return;

  room.status = 'countdown';
  room.text = pickRaceText();

  // Reset player state for a fresh race
  for (const p of room.players) {
    p.isFinished = false;
    p.progress = 0;
    p.wpm = 0;
    p.accuracy = 100;
    p.rank = undefined;
    p.finishedAt = undefined;
  }

  broadcastRoomState(io, room);

  let seconds = 3;
  io.to(room.id).emit('room:countdown', { seconds });

  const tick = () => {
    seconds -= 1;
    if (seconds > 0) {
      io.to(room.id).emit('room:countdown', { seconds });
      const t = setTimeout(tick, 1000);
      countdownTimers.set(room.id, t);
    } else {
      // seconds === 0 → "GO"
      io.to(room.id).emit('room:countdown', { seconds: 0 });

      const goTimer = setTimeout(() => {
        room.status = 'racing';
        room.startedAt = Date.now();
        broadcastRoomState(io, room);
        io.to(room.id).emit('room:start', roomPublicView(room));

        // Auto-end after 3 minutes if not everyone finishes
        const endTimer = setTimeout(() => {
          endRace(io, room);
        }, 3 * 60 * 1000);
        raceEndTimers.set(room.id, endTimer);
      }, 1000);
      countdownTimers.set(room.id, goTimer);
    }
  };

  const t = setTimeout(tick, 1000);
  countdownTimers.set(room.id, t);
}

function endRace(io: Server, room: Room) {
  if (room.status === 'finished') return;
  room.status = 'finished';
  room.finishedAt = Date.now();

  // Assign ranks for anyone who didn't finish
  let rank = room.players.filter((p) => p.isFinished).length + 1;
  for (const p of room.players) {
    if (!p.isFinished) {
      p.rank = rank++;
    }
  }

  broadcastRoomState(io, room);
  io.to(room.id).emit('room:end', roomPublicView(room));

  // Clean up auto-end timer
  const t = raceEndTimers.get(room.id);
  if (t) { clearTimeout(t); raceEndTimers.delete(room.id); }

  // Auto-reset room to waiting state after 30s so players can race again
  setTimeout(() => {
    if (!rooms.has(room.id)) return;
    room.status = 'waiting';
    room.startedAt = undefined;
    room.finishedAt = undefined;
    room.text = '';
    for (const p of room.players) {
      p.isReady = false;
      p.isFinished = false;
      p.progress = 0;
      p.wpm = 0;
      p.accuracy = 100;
      p.rank = undefined;
    }
    broadcastRoomState(io, room);
  }, 30_000);
}

// ─── Server ───────────────────────────────────────────────────────────────────

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', process.env.NEXT_PUBLIC_APP_URL ?? ''].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // ── Create room ──────────────────────────────────────────────────────────
  socket.on('room:create', ({ roomId, username, avatarUrl }: {
    roomId: string;
    username: string;
    avatarUrl?: string;
  }) => {
    if (rooms.has(roomId)) {
      socket.emit('room:error', { message: 'Room already exists.' });
      return;
    }

    const playerId = socket.id;
    const player: Player = {
      id: playerId,
      socketId: socket.id,
      username: username || 'Player',
      avatarUrl,
      isReady: false,
      isFinished: false,
      progress: 0,
      wpm: 0,
      accuracy: 100,
    };

    const room: Room = {
      id: roomId,
      hostId: playerId,
      status: 'waiting',
      players: [player],
      text: '',
      maxPlayers: 5,
      createdAt: Date.now(),
      countdownSeconds: 3,
    };

    rooms.set(roomId, room);
    socketRoom.set(socket.id, roomId);
    socketPlayer.set(socket.id, playerId);

    socket.join(roomId);

    // Send the full state to the creator, including their player id
    socket.emit('self:joined', {
      playerId,
      room: roomPublicView(room),
    });

    console.log(`[room] created: ${roomId} by ${username}`);
  });

  // ── Join room ────────────────────────────────────────────────────────────
  socket.on('room:join', ({ roomId, username, avatarUrl }: {
    roomId: string;
    username: string;
    avatarUrl?: string;
  }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('room:error', { message: 'Room not found.' });
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit('room:error', { message: 'Room is full.' });
      return;
    }
    if (room.status === 'racing') {
      socket.emit('room:error', { message: 'Race already in progress.' });
      return;
    }

    // If player already in room (reconnect), skip adding
    const existing = room.players.find((p) => p.socketId === socket.id);
    if (existing) {
      socket.join(roomId);
      socketRoom.set(socket.id, roomId);
      socketPlayer.set(socket.id, existing.id);
      socket.emit('self:joined', { playerId: existing.id, room: roomPublicView(room) });
      return;
    }

    const playerId = socket.id;
    const player: Player = {
      id: playerId,
      socketId: socket.id,
      username: username || 'Guest',
      avatarUrl,
      isReady: false,
      isFinished: false,
      progress: 0,
      wpm: 0,
      accuracy: 100,
    };

    room.players.push(player);
    socketRoom.set(socket.id, roomId);
    socketPlayer.set(socket.id, playerId);

    socket.join(roomId);

    // Tell the joiner who they are + full room state
    socket.emit('self:joined', {
      playerId,
      room: roomPublicView(room),
    });

    // Broadcast new player to everyone else
    socket.to(roomId).emit('player:join', playerPublicView(player));

    console.log(`[room] ${username} joined: ${roomId}`);
  });

  // ── Toggle ready ─────────────────────────────────────────────────────────
  socket.on('player:ready', () => {
    const ctx = getPlayerBySocketId(socket.id);
    if (!ctx || ctx.room.status !== 'waiting') return;

    ctx.player.isReady = !ctx.player.isReady;
    io.to(ctx.room.id).emit('room:patch', {
      players: ctx.room.players.map(playerPublicView),
    });
  });

  // ── Host: start race ─────────────────────────────────────────────────────
  socket.on('room:start', () => {
    const ctx = getPlayerBySocketId(socket.id);
    if (!ctx) return;
    const { room, player } = ctx;

    if (room.hostId !== player.id) {
      socket.emit('room:error', { message: 'Only the host can start the race.' });
      return;
    }
    if (room.status !== 'waiting') return;
    if (room.players.length < 1) return; // allow solo for testing

    // Mark all players ready on host start
    for (const p of room.players) p.isReady = true;
    startCountdown(io, room);
  });

  // ── Progress update ──────────────────────────────────────────────────────
  socket.on('player:progress', ({ progress, wpm, accuracy }: {
    progress: number;
    wpm: number;
    accuracy: number;
  }) => {
    const ctx = getPlayerBySocketId(socket.id);
    if (!ctx || ctx.room.status !== 'racing') return;

    ctx.player.progress = Math.min(100, Math.max(0, progress));
    ctx.player.wpm = wpm;
    ctx.player.accuracy = accuracy;

    // Broadcast to others in the room (not back to sender)
    socket.to(ctx.room.id).emit('player:progress', {
      id: ctx.player.id,
      progress: ctx.player.progress,
      wpm,
      accuracy,
    });
  });

  // ── Player finished ──────────────────────────────────────────────────────
  socket.on('player:finish', ({ wpm, accuracy }: { wpm: number; accuracy: number }) => {
    const ctx = getPlayerBySocketId(socket.id);
    if (!ctx || ctx.room.status !== 'racing') return;

    const { room, player } = ctx;
    if (player.isFinished) return;

    const finishedCount = room.players.filter((p) => p.isFinished).length;
    player.isFinished = true;
    player.progress = 100;
    player.wpm = wpm;
    player.accuracy = accuracy;
    player.rank = finishedCount + 1;
    player.finishedAt = Date.now();

    io.to(room.id).emit('player:finish', {
      id: player.id,
      rank: player.rank,
      wpm,
      accuracy,
    });

    // Update progress for everyone (so track shows 100%)
    io.to(room.id).emit('player:progress', {
      id: player.id,
      progress: 100,
      wpm,
      accuracy,
    });

    if (allPlayersFinished(room)) {
      endRace(io, room);
    }
  });

  // ── Leave room ────────────────────────────────────────────────────────────
  socket.on('room:leave', ({ roomId }: { roomId: string }) => {
    handleLeave(socket, roomId, io);
  });

  // ── Disconnect ───────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const roomId = socketRoom.get(socket.id);
    if (roomId) handleLeave(socket, roomId, io);
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

function handleLeave(socket: Socket, roomId: string, io: Server) {
  const room = rooms.get(roomId);
  socketRoom.delete(socket.id);
  socketPlayer.delete(socket.id);
  socket.leave(roomId);

  if (!room) return;

  const playerId = socket.id;
  room.players = room.players.filter((p) => p.socketId !== socket.id);

  if (room.players.length === 0) {
    // Cleanup empty room
    rooms.delete(roomId);
    const ct = countdownTimers.get(roomId);
    if (ct) { clearTimeout(ct); countdownTimers.delete(roomId); }
    const rt = raceEndTimers.get(roomId);
    if (rt) { clearTimeout(rt); raceEndTimers.delete(roomId); }
    console.log(`[room] deleted (empty): ${roomId}`);
    return;
  }

  // Reassign host if host left
  if (room.hostId === playerId) {
    room.hostId = room.players[0].id;
  }

  socket.to(roomId).emit('player:leave', playerId);
  socket.to(roomId).emit('room:patch', {
    hostId: room.hostId,
    players: room.players.map(playerPublicView),
  });

  // If racing and all remaining players finished, end race
  if (room.status === 'racing' && allPlayersFinished(room)) {
    endRace(io, room);
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.SOCKET_PORT ?? '3001', 10);
httpServer.listen(PORT, () => {
  console.log(`[arena] Socket.io server listening on port ${PORT}`);
});
