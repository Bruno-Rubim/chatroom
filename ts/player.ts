import { canvasManager } from "./canvasManager.js";
import GameObject from "./gameElements/gameObject.js";
import Position from "./gameElements/position.js";
import { DOWN, LEFT, RIGHT, UP, type direction } from "./global.js";
import { sendUpdate } from "./serverService.js";
import { sprites } from "./sprites.js";
import { Timer } from "./timer/timer.js";
import timeTracker from "./timer/timeTracker.js";
import type { PlayerState } from "./user.js";

const dirToPos: Record<direction, Position> = {
  down: new Position(0, 16),
  left: new Position(-32, 0),
  right: new Position(32, 0),
  up: new Position(0, -16),
};

type playerAction = {
  name: "moving" | "idle";
  dir: direction;
  timer: Timer | null;
};

export default class Player extends GameObject {
  action: playerAction = { name: "idle", dir: RIGHT, timer: null };
  facing: typeof LEFT | typeof RIGHT = RIGHT;
  horMoveTime = 0.9;
  verMoveTime = this.horMoveTime / 2;
  ticStoppedMoving = 0;
  id: number;

  constructor(id: number, state: PlayerState) {
    super({
      sprite: sprites.bruno,
      pos: state.pos,
    });
    this.id = id;
  }

  moveNotch(dir: direction) {
    if (this.action.name == "moving") {
      return;
    }
    sendUpdate({ type: "movement", dir: dir });
    if (timeTracker.currentGameTic > this.ticStoppedMoving) {
      this.firstAnimationTic = timeTracker.currentGameTic;
    }
    this.action.timer = new Timer({
      goalSecs: [DOWN, UP].includes(dir) ? this.verMoveTime : this.horMoveTime,
      goalFunc: () => {
        this.action.timer = null;
        this.action.name = "idle";
        this.pos = this.pos.add(dirToPos[dir]);
        this.ticStoppedMoving = timeTracker.currentGameTic;
      },
    });
    if (dir == LEFT || dir == RIGHT) {
      this.facing = dir;
    }
    this.action.name = "moving";
    this.action.dir = dir;
  }

  render(): void {
    let pos = new Position(this.pos);
    if (this.action.name == "moving" && this.action.timer) {
      switch (this.action.dir) {
        case "down":
          pos = pos.add(0, 16 * (this.action.timer.percentageIncr / 100));
          break;
        case "up":
          pos = pos.add(0, -16 * (this.action.timer.percentageIncr / 100));
          break;
        case "left":
          pos = pos.add(-32 * (this.action.timer.percentageIncr / 100), 0);
          break;
        case "right":
          pos = pos.add(32 * (this.action.timer.percentageIncr / 100), 0);
          break;
      }
    }
    let spritePosY = 0;
    if (this.facing == LEFT) {
      spritePosY += 1;
    }
    if (this.action.name == "moving") {
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

  updatePlayerState(state: PlayerState) {
    this.pos.update(state.pos);
    this.facing = state.facing;
  }
}
