import GameObject from "./gameElements/gameObject.js";
import { GAMEHEIGHT, GAMEWIDTH } from "./global.js";
import player from "./player.js";
import { sprites } from "./sprites.js";

// Holds the current state of the game at any given time
export class GameState {
  gameObjects: GameObject[] = [
    new GameObject({
      sprite: sprites.bg_test,
      width: GAMEWIDTH,
      height: GAMEHEIGHT,
    }),
    player,
  ];
}

const gameState = new GameState();

export default gameState;
