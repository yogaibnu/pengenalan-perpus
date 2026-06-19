import Phaser from "phaser";
import { TitleScene } from "./scenes/TitleScene";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene";
import { ClassroomScene } from "./scenes/ClassroomScene";
import { LibraryScene } from "./scenes/LibraryScene";
import { DigitalLibraryScene } from "./scenes/DigitalLibraryScene";
import { QuizScene } from "./scenes/QuizScene";
import { EndingScene } from "./scenes/EndingScene";
import { BootScene } from "./scenes/BootScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0f172a",
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
  },
  scene: [
    BootScene,
    TitleScene,
    CharacterSelectScene,
    ClassroomScene,
    LibraryScene,
    DigitalLibraryScene,
    QuizScene,
    EndingScene,
  ],
};

new Phaser.Game(config);
