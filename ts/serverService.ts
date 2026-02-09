import Position from "./gameElements/position.js";
import { API, type direction } from "./global.js";
import { localUser, type User } from "./user.js";
import { userList } from "./userList.js";

export async function loginUser() {
  console.log("logging user", localUser.id);
  const response = await fetch("http://localhost:8080/login", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localUser),
  });
  if (response.status == 200) {
    localUser.logged = true;
    console.log("user logged");
    return;
  }
  console.log("user not logged");
}

export async function requestGameUpdate() {
  localUser.lastPing = Date.now();
  const response = await fetch(`${API}/gameUpdate/${localUser.id}`);
  if (response.status != 200) {
    location.reload();
  }
  const serverUserList: User[] = await response.json();
  const serverIdList = serverUserList.map((x) => x.id);
  serverUserList.forEach((u) => {
    if (u.id == localUser.id) {
      return;
    }
    u.playerState.pos = new Position(u.playerState.pos.x, u.playerState.pos.y);
    const user = userList.find((x) => x.id == u.id);
    if (!user) {
      userList.push(u);
      return;
    }
    user.playerState = u.playerState;
  });
  userList.forEach((u, i) => {
    if (!serverIdList.includes(u.id)) {
      userList.splice(i, 1);
    }
  });
}

export type playerUpdate = {
  type: "movement";
  dir: direction;
};

export async function sendUpdate(update: playerUpdate) {
  await fetch(`${API}/playerUpdate`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...update, id: localUser.id }),
  });
  localUser.lastPing = Date.now();
}
