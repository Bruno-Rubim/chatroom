import Position from "./gameElements/position.js";
import { sprites } from "./sprites.js";
import { utils } from "./utils.js";
export const fontMaps = {};
export function measureTextWidth(font, text) {
    let width = 0;
    let chars = text.split("");
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        if (char == "$") {
            char = chars.slice(i, i + 4).join("");
            i += 3;
            width += fontMaps["icons"]?.charMaps[char]?.width ?? 0;
        }
        else {
            width += fontMaps[font]?.charMaps[char]?.width ?? 0;
        }
    }
    return width;
}
export function measureTextBoxHeight(font, text, limitWidth, fontSize = 1) {
    if (utils.lastOfArray(text.split("")) == "\n") {
        text = text.slice(0, text.length - 2);
    }
    const fontMap = fontMaps[font];
    const words = text.split(" ");
    let height = fontMap.cellHeight * fontSize;
    let currentLineWidth = 0;
    words.forEach((word, i) => {
        let iconLength = 0;
        if (word[0] == "$") {
            word = word.slice(4, word.length - 1);
            iconLength = 9 * fontSize;
        }
        if (word.includes("\n")) {
            const breakWords = word.split("\n");
            const firstWidth = measureTextWidth(font, breakWords[0]) * fontSize;
            const lastWidth = measureTextWidth(font, utils.lastOfArray(breakWords)) * fontSize;
            if (currentLineWidth + firstWidth > limitWidth) {
                words[i] = "\n" + words[i];
            }
            currentLineWidth = lastWidth;
            height += fontMap.cellHeight * fontSize;
            return;
        }
        const wordWidth = measureTextWidth(font, word) * fontSize;
        if (currentLineWidth + wordWidth + iconLength > limitWidth) {
            height += fontMap.cellHeight * fontSize;
            currentLineWidth =
                wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
        }
        else {
            currentLineWidth +=
                wordWidth + (fontMap.charMaps[" "]?.width ?? 0) * fontSize;
        }
    });
    return height;
}
