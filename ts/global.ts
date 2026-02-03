export const GAMEWIDTH = 288;
export const GAMEHEIGHT = 256;

export const MAXSCALE = 3;
export const TILESIZE = 32;

export const RIGHT = "right";
export const LEFT = "left";
export const UP = "up";
export const DOWN = "down";
export type direction = typeof RIGHT | typeof LEFT | typeof UP | typeof DOWN;

export const CENTER = "center";

export const DEV = localStorage.getItem("is_dev") == "true";
// Run one of the next lines to turn dev settings on or off
// localStorage.setItem("is_dev", "true");
// localStorage.setItem("is_dev", "false");

export const API = "http://localhost:8080";
