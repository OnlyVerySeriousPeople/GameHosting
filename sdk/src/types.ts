export type GameMessage =
  | {
      type: 'info';
      code: number;
      details?: {
        teams?: string[][];
        currentNumberOfPlayers?: number;
      };
      message?: string;
    }
  | {
      type: 'data';
      sender: string;
      data: unknown;
    }
  | {
      type: 'error';
      code: number;
      message?: string;
    };
