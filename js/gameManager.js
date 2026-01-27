import { Action } from "./action.js";
import { canvasManager } from "./canvasManager.js";
import { timerManager } from "./timer/timerManager.js";
import { bindListeners, inputState } from "./input/inputState.js";
import gameState from "./gameState.js";
export default class GameManager {
    constructor() {
        bindListeners(canvasManager.canvasElement);
    }
    handleAction(action) {
        if (!action) {
            return;
        }
    }
    checkTimers() {
        timerManager.queue.forEach((timer) => {
            let action = null;
            if (timer.ticsRemaining <= 0 && !timer.ended) {
                if (timer.goalFunc) {
                    action = timer.goalFunc();
                }
                if (timer.loop) {
                    timer.rewind();
                }
                else {
                    timer.ended = true;
                    if (timer.deleteAtEnd) {
                        timerManager.deleteTimer(timer);
                    }
                }
                this.handleAction(action);
            }
        });
    }
    handleKeyInput() { }
    updateGame() {
        this.checkTimers();
        const gameObjects = gameState.gameObjects;
        const actions = [];
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
