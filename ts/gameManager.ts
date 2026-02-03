import { Action } from "./action.js";
import { canvasManager } from "./canvasManager.js";
import { timerManager } from "./timer/timerManager.js";
import { bindListeners, inputState } from "./input/inputState.js";
import gameState from "./gameState.js";
import { DOWN, LEFT, RIGHT, UP } from "./global.js";
import { localUser } from "./user.js";
import { userList } from "./userList.js";
import Player from "./player.js";
import Position from "./gameElements/position.js";

// Says if the cursor has changed or if there's an item description to show TO-DO: change this
type actionResponse = "cursorChange" | "itemDescription" | void;

export default class GameManager {
  constructor() {
    bindListeners(canvasManager.canvasElement);
  }

  /**
   * Routes an action to its handeling function
   * @param action
   * @returns
   */
  handleAction(action: Action | void | null): actionResponse {
    if (!action) {
      return;
    }
  }

  /**
   * Loops through all timers in game, triggering their functions if ready and handling their actions
   */
  checkTimers() {
    timerManager.queue.forEach((timer) => {
      // Possible action in result of timer reaching goal
      let action: Action | void | null = null;
      if (timer.ticsRemaining <= 0 && !timer.ended) {
        if (timer.goalFunc) {
          action = timer.goalFunc();
        }
        if (timer.loop) {
          timer.rewind();
        } else {
          timer.ended = true;
          if (timer.deleteAtEnd) {
            // Deletes timer
            timerManager.deleteTimer(timer);
          }
        }
        this.handleAction(action);
      }
    });
  }

  /**
   * Checks if specific keys are held and
   * @returns
   */
  handleKeyInput() {
    const player = gameState.players.find((p) => p.id == localUser.id);
    if (!player) {
      return;
    }
    if (
      inputState.keyboard.ArrowRight == "pressed" ||
      inputState.keyboard.d == "pressed"
    ) {
      player.moveNotch(RIGHT);
    }
    if (
      inputState.keyboard.ArrowLeft == "pressed" ||
      inputState.keyboard.a == "pressed"
    ) {
      player.moveNotch(LEFT);
    }
    if (
      inputState.keyboard.ArrowUp == "pressed" ||
      inputState.keyboard.w == "pressed"
    ) {
      player.moveNotch(UP);
    }
    if (
      inputState.keyboard.ArrowDown == "pressed" ||
      inputState.keyboard.s == "pressed"
    ) {
      player.moveNotch(DOWN);
    }
  }

  updatePlayers() {
    userList.forEach((u) => {
      const player = gameState.players.find((p) => p.id == u.id);
      if (!player) {
        gameState.players.push(new Player(u.id, new Position(u.pos)));
        return;
      }
      if (u.id == localUser.id) {
        return;
      }
      player.pos.update(u.pos);
    });
    const userIds = userList.map((u) => u.id);
    gameState.players = gameState.players.filter((p) => userIds.includes(p.id));
  }

  /**
   * Checks for actions with current input state and game state and handles them
   */
  updateGame() {
    this.checkTimers();
    this.updatePlayers();

    const actions: Action[] | void = [];

    actions?.forEach((action) => {
      this.handleAction(action);
    });

    inputState.mouse.clickedRight = false;
    inputState.mouse.clickedLeft = false;

    this.handleAction(this.handleKeyInput());
  }

  renderGame() {
    canvasManager.clearCanvas();
    const gameObjects = gameState.gameObjects.sort((a, b) => a.pos.y - b.pos.y);
    gameObjects.forEach((o) => {
      o.render();
    });
  }
}
