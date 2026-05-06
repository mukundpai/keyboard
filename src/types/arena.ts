export type RoomStatus = 'waiting' | 'countdown' | 'racing' | 'finished';

export interface ArenaPlayer {
  id: string;
  username: string;
  avatarUrl?: string;
  progress: number; // 0–100 percentage
  wpm: number;
  accuracy: number;
  isReady: boolean;
  isFinished: boolean;
  finishedAt?: number;
  rank?: number;
}

export interface ArenaRoom {
  id: string;
  hostId: string;
  status: RoomStatus;
  players: ArenaPlayer[];
  text: string;
  maxPlayers: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  countdownSeconds: number;
}

export type ArenaEventType =
  | 'player_joined'
  | 'player_left'
  | 'player_ready'
  | 'progress_update'
  | 'race_countdown'
  | 'race_start'
  | 'player_finished'
  | 'race_end';

export interface ArenaEvent {
  type: ArenaEventType;
  payload: Record<string, unknown>;
}
