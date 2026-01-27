import Position from "./position.js";
import { Sprite } from "../sprites.js";
import Hitbox from "./hitbox.js";
import timeTracker from "../timer/timeTracker.js";
import { canvasManager } from "../canvasManager.js";
import { TILESIZE } from "../global.js";

// Represents a given object in game, can have interaction functions that return Actions
export default class GameObject {
  sprite: Sprite;
  hidden: boolean = false;

  pos: Position;
  width: number;
  height: number;
  hitbox: Hitbox;
  hitboxPosShift: Position | undefined; // Shifts the object's hitbox, used when a hitbox is of a different size than the object

  mouseHovering: boolean = false;
  mouseHeldLeft: boolean = false;
  mouseHeldRight: boolean = false;

  firstAnimationTic: number;

  constructor(args: {
    sprite: Sprite;
    pos?: Position;
    width?: number;
    height?: number;
    hitboxWidth?: number;
    hitboxHeight?: number;
    hitboxPosShift?: Position;
  }) {
    this.sprite = args.sprite;
    this.pos = args.pos ?? new Position();
    this.width = args.width ?? TILESIZE;
    this.height = args.height ?? TILESIZE;
    this.hitboxPosShift = args.hitboxPosShift;
    this.hitbox = new Hitbox({
      objPos: this.pos,
      width: args.hitboxWidth ?? this.width,
      height: args.hitboxHeight ?? this.height,
      shiftPos: args.hitboxPosShift,
    });
    this.firstAnimationTic = timeTracker.currentGameTic;
  }

  /**
   * Updates its position to a new Position object and adds its current value to the hitbox objPos with the shift
   * @param newPos
   */
  updatePosition(newPos: Position) {
    this.pos = newPos;
    this.hitbox.objPos = this.pos.add(this.hitboxPosShift ?? new Position());
  }

  /**
   * Render the object's sprite with its stats using the canvasManager
   * @returns
   */
  render() {
    if (this.hidden) {
      return;
    }
    canvasManager.renderSprite(this.sprite, this.pos, this.width, this.height);
  }

  /**
   * Updates its firstAnimationTic
   */
  resetAnimation() {
    this.firstAnimationTic = timeTracker.currentGameTic;
  }

  /**
   * Sets the firstAnimationTic to -Infinity (ultimately making it so it's impossible for the animation to not be finished)
   */
  endAnimation() {
    this.firstAnimationTic = -Infinity;
  }
}
