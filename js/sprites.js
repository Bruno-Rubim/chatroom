export class Sprite {
    src;
    img;
    constructor(imageName) {
        if (Math.floor(Math.random() * 1000000) == 1) {
            imageName = "9s";
        }
        this.src = "./images/" + imageName + ".png";
        this.img = new Image();
    }
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
await Promise.all(promises);
