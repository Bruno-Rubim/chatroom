import GameObject from "./gameElements/gameObject.js";
import Position from "./gameElements/position.js";
import { GAMEHEIGHT, GAMEWIDTH } from "./global.js";
import { sprites } from "./sprites.js";
export class GameState {
    gameObjects = [
        new GameObject({
            sprite: sprites.bg_test,
            width: GAMEWIDTH,
            height: GAMEHEIGHT,
        }),
        new GameObject({
            sprite: sprites.jess,
            pos: new Position(48, 58),
        }),
    ];
}
const gameState = new GameState();
export default gameState;
