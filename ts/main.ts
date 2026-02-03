import GameManager from "./gameManager.js";
import { loginUser, requestGameUpdate } from "./serverService.js";

export const gameManager = new GameManager();

await loginUser();
await requestGameUpdate();

/**
 * Recursive function to update the game and render it
 */
function frameLoop() {
  gameManager.updateGame();
  gameManager.renderGame();
  requestAnimationFrame(frameLoop);
}

frameLoop();

setInterval(async () => {
  await requestGameUpdate();
}, 500);
