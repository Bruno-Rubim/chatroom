import { Action } from "./action.js";
import { canvasManager } from "./canvasManager.js";
import type GameObject from "./gameElements/gameObject.js";
import { timerManager } from "./timer/timerManager.js";
import { bindListeners, inputState } from "./input/inputState.js";
import gameState from "./gameState.js";
import player from "./player.js";
import { DOWN, LEFT, RIGHT, UP } from "./global.js";

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

  /**
   * Checks for actions with current input state and game state and handles them
   */
  updateGame() {
    this.checkTimers();

    const gameObjects: GameObject[] = gameState.gameObjects;

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
    gameState.gameObjects.forEach((o) => {
      o.render();
    });
  }
}
