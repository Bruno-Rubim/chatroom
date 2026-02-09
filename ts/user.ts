import Position from "./gameElements/position.js";

export type PlayerState = {
  pos: Position;
  facing: "left" | "right";
};

export type User = {
  id: number;
  logged: boolean;
  lastPing: number;
  playerState: PlayerState;
};

export const localUser: User = {
  id: Math.floor(Math.random() * 100000),
  logged: false,
  playerState: {
    pos: new Position(16, 90),
    facing: "right",
  },
  lastPing: 0,
};
