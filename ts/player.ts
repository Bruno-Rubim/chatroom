import { canvasManager } from "./canvasManager.js";
import GameObject from "./gameElements/gameObject.js";
import Position from "./gameElements/position.js";
import { DOWN, LEFT, RIGHT, UP, type direction } from "./global.js";
import { sendUpdate } from "./serverService.js";
import { sprites } from "./sprites.js";
import { Timer } from "./timer/timer.js";
import timeTracker from "./timer/timeTracker.js";

const dirToPos: Record<direction, Position> = {
  down: new Position(0, 16),
  left: new Position(-32, 0),
  right: new Position(32, 0),
  up: new Position(0, -16),
};

type playerState = {
  name: "moving" | "idle";
  dir: direction;
  timer: Timer | null;
};

export default class Player extends GameObject {
  state: playerState = { name: "idle", dir: RIGHT, timer: null };
  facing: typeof LEFT | typeof RIGHT = RIGHT;
  horMoveTime = 0.9;
  verMoveTime = this.horMoveTime / 2;
  ticStoppedMoving = 0;
  id: number;

  constructor(id: number, pos: Position) {
    super({
      sprite: sprites.bruno,
      pos: pos,
    });
    this.id = id;
  }

  moveNotch(dir: direction) {
    if (this.state.name == "moving") {
      return;
    }
    sendUpdate({ type: "movement", dir: dir });
    if (timeTracker.currentGameTic > this.ticStoppedMoving) {
      this.firstAnimationTic = timeTracker.currentGameTic;
    }
    this.state.timer = new Timer({
      goalSecs: [DOWN, UP].includes(dir) ? this.verMoveTime : this.horMoveTime,
      goalFunc: () => {
        this.state.timer = null;
        this.state.name = "idle";
        this.pos = this.pos.add(dirToPos[dir]);
        this.ticStoppedMoving = timeTracker.currentGameTic;
      },
    });
    if (dir == LEFT || dir == RIGHT) {
      this.facing = dir;
    }
    this.state.name = "moving";
    this.state.dir = dir;
  }

  render(): void {
    let pos = new Position(this.pos);
    if (this.state.name == "moving" && this.state.timer) {
      switch (this.state.dir) {
        case "down":
          pos = pos.add(0, 16 * (this.state.timer.percentageIncr / 100));
          break;
        case "up":
          pos = pos.add(0, -16 * (this.state.timer.percentageIncr / 100));
          break;
        case "left":
          pos = pos.add(-32 * (this.state.timer.percentageIncr / 100), 0);
          break;
        case "right":
          pos = pos.add(32 * (this.state.timer.percentageIncr / 100), 0);
          break;
      }
    }
    let spritePosY = 0;
    if (this.facing == LEFT) {
      spritePosY += 1;
    }
    if (this.state.name == "moving") {
      canvasManager.renderAnimationFrame(
        this.sprite,
        pos,
        this.width,
        this.height,
        4,
        1,
        this.firstAnimationTic,
        timeTracker.currentGameTic,
        0.4,
        new Position(0, 2 + spritePosY),
      );
      return;
    }
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      pos,
      this.width,
      this.height,
      new Position(0, spritePosY),
    );
  }
}
