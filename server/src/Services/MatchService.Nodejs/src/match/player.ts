import {Team} from './team';
import {WebSocket} from '@fastify/websocket';

export class Player {
  team?: Team;

  constructor(
    readonly id: string,
    private readonly socket: WebSocket,
  ) {}

  private send(
    type: 'info' | 'error' | 'data',
    message: Record<string, unknown>,
  ) {
    this.socket.send(JSON.stringify({type, ...message}));
  }

  sendInfo(code: number, details?: unknown) {
    this.send('info', {code, details});
  }

  sendError(code: number, message?: string) {
    this.send('error', {code, message});
  }

  sendData(sender: string, data: unknown) {
    this.send('data', {sender, data});
  }

  disconnect(reason?: string) {
    this.socket.close(1000, reason);
  }
}
