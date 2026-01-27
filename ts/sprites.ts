// Represents an image in game
export class Sprite {
  src: string;
  img: HTMLImageElement;
  constructor(imageName: string) {
    if (Math.floor(Math.random() * 1000000) == 1) {
      imageName = "9s";
    }
    this.src = "./images/" + imageName + ".png";
    this.img = new Image();
  }

  // Waits for image to load
  load() {
    const { src, img } = this;
    return new Promise((done, fail) => {
      img.onload = () => done(img);
      img.onerror = fail;
      img.src = src;
    });
  }
}

export const sprites = {
  placeholder: new Sprite("placeholder"),
  bg_test: new Sprite("bg_test"),
  jess: new Sprite("jess"),
};

const spriteArr = Object.values(sprites);
const promises = spriteArr.map((sprite) => sprite.load());
// Awaits all images on spriteArr to load
await Promise.all(promises);
