import Position from "./gameElements/position.js";

export type User = {
  id: number;
  logged: boolean;
  pos: Position;
  lastPing: number;
};

export const localUser: User = {
  id: Math.floor(Math.random() * 100000),
  logged: false,
  pos: new Position(16, 90),
  lastPing: 0,
};
