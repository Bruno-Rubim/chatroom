import GameObject from "./gameElements/gameObject.js";
import { GAMEHEIGHT, GAMEWIDTH } from "./global.js";
import type Player from "./player.js";
import { sprites } from "./sprites.js";

// Holds the current state of the game at any given time
export class GameState {
  background = new GameObject({
    sprite: sprites.bg_test,
    width: GAMEWIDTH,
    height: GAMEHEIGHT,
  });
  players: Player[] = [];

  get gameObjects() {
    return [this.background, ...this.players];
  }
}

const gameState = new GameState();

export default gameState;
