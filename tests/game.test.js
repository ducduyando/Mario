import { describe, expect, it } from "vitest";
import { Game } from "../src/game/Game.js";

describe("Game core rules", () => {
  it("collecting a coin increases score", () => {
    const game = new Game();
    const firstCoin = game.coins[0];
    game.player.x = firstCoin.x;
    game.player.y = firstCoin.y;

    game.collectCoins();

    expect(firstCoin.collected).toBe(true);
    expect(game.score).toBe(10);
  });

  it("hitting enemy decreases lives and respawns", () => {
    const game = new Game();
    const firstEnemy = game.enemies[0];
    game.player.x = firstEnemy.x;
    game.player.y = firstEnemy.y;
    game.player.vy = 0;

    game.checkEnemyContacts();

    expect(game.player.lives).toBe(2);
    expect(game.player.x).toBe(80);
    expect(game.player.y).toBe(360);
    expect(game.finished).toBe(false);
  });

  it("stomping enemy defeats it and gives score", () => {
    const game = new Game();
    const firstEnemy = game.enemies[0];
    game.player.x = firstEnemy.x;
    game.player.y = firstEnemy.y - game.player.height + 10;
    game.player.vy = 120;

    game.checkEnemyContacts();

    expect(firstEnemy.alive).toBe(false);
    expect(game.score).toBe(100);
    expect(game.events.stomp).toBe(true);
  });

  it("touching goal wins the game", () => {
    const game = new Game();
    game.player.x = game.goal.x;
    game.player.y = game.goal.y;

    game.checkGoal();

    expect(game.finished).toBe(true);
    expect(game.won).toBe(true);
  });

  it("losing all lives ends game", () => {
    const game = new Game();
    game.loseLifeAndRespawn();
    game.loseLifeAndRespawn();
    game.loseLifeAndRespawn();

    expect(game.player.lives).toBe(0);
    expect(game.finished).toBe(true);
    expect(game.won).toBe(false);
  });

  it("collecting mushroom makes player big", () => {
    const game = new Game();
    game.powerUps.push({ x: game.player.x, y: game.player.y, width: 30, height: 30, vx: 0, vy: 0 });

    game.checkPowerUps();

    expect(game.player.form).toBe("big");
    expect(game.events.powerup).toBe(true);
  });
});
