export const levelData = {
  platforms: [
    { x: 0, y: 500, width: 820, height: 40 },
    { x: 900, y: 500, width: 260, height: 40 },
    { x: 1240, y: 500, width: 450, height: 40 },
    { x: 1780, y: 500, width: 620, height: 40 },
    { x: 1050, y: 410, width: 150, height: 20 },
    { x: 1460, y: 360, width: 140, height: 20 }
  ],
  pipes: [
    { x: 680, y: 430, width: 58, height: 70 },
    { x: 1660, y: 390, width: 58, height: 110 }
  ],
  blocks: [
    { x: 930, y: 350, width: 40, height: 40, kind: "question", reward: "coin", used: false },
    { x: 980, y: 350, width: 40, height: 40, kind: "question", reward: "mushroom", used: false },
    { x: 1030, y: 350, width: 40, height: 40, kind: "brick", reward: "none", used: false }
  ],
  enemies: [
    { x: 540, y: 468, width: 32, height: 32, speed: 80, direction: 1, minX: 460, maxX: 760, alive: true },
    { x: 1330, y: 468, width: 32, height: 32, speed: 95, direction: -1, minX: 1260, maxX: 1620, alive: true }
  ],
  coins: [
    { x: 1070, y: 380, width: 20, height: 20, collected: false },
    { x: 1120, y: 380, width: 20, height: 20, collected: false },
    { x: 1500, y: 320, width: 20, height: 20, collected: false },
    { x: 1550, y: 320, width: 20, height: 20, collected: false },
    { x: 1710, y: 340, width: 20, height: 20, collected: false }
  ],
  powerUps: [],
  goal: { x: 2280, y: 390, width: 40, height: 110 }
};
