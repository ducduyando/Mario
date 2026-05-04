import { PLAYER, WORLD } from "./constants.js";
import { levelData } from "./level.js";
import { clamp, overlaps } from "./physics.js";

function cloneEntity(entity) {
  return { ...entity };
}

export class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.player = {
      x: 80,
      y: 360,
      width: PLAYER.width,
      height: PLAYER.height,
      vx: 0,
      vy: 0,
      onGround: false,
      lives: 3,
      form: "small",
      invulnerableFor: 0
    };
    this.platforms = levelData.platforms.map(cloneEntity);
    this.pipes = levelData.pipes.map(cloneEntity);
    this.blocks = levelData.blocks.map(cloneEntity);
    this.enemies = levelData.enemies.map(cloneEntity);
    this.coins = levelData.coins.map(cloneEntity);
    this.powerUps = levelData.powerUps.map(cloneEntity);
    this.goal = cloneEntity(levelData.goal);
    this.cameraX = 0;
    this.score = 0;
    this.timeLeft = WORLD.timerSeconds;
    this.finished = false;
    this.won = false;
    this.justJumped = false;
    this.events = {
      jump: false,
      coin: false,
      stomp: false,
      powerup: false,
      hurt: false,
      win: false,
      lose: false
    };
  }

  update(input, dt) {
    if (this.finished) return;

    this.resetEvents();
    const player = this.player;
    this.justJumped = false;

    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this.finished = true;
      this.won = false;
      this.events.lose = true;
      return;
    }

    if (player.invulnerableFor > 0) {
      player.invulnerableFor = Math.max(0, player.invulnerableFor - dt);
    }

    player.vx = 0;
    if (input.left) player.vx -= PLAYER.moveSpeed;
    if (input.right) player.vx += PLAYER.moveSpeed;

    if (input.jump && player.onGround) {
      player.vy = -PLAYER.jumpForce;
      player.onGround = false;
      this.justJumped = true;
      this.events.jump = true;
    }

    player.vy += WORLD.gravity * dt;
    player.vy = clamp(player.vy, -9999, PLAYER.maxFallSpeed);

    this.moveX(player, dt);
    this.moveY(player, dt);
    player.onGround = false;
    this.resolveGroundCollision(player);

    if (player.y > WORLD.height + 50) {
      this.loseLifeAndRespawn();
    }

    player.x = clamp(player.x, 0, WORLD.width - player.width);

    this.updateEnemies(dt);
    this.updatePowerUps(dt);
    this.collectCoins();
    this.checkPowerUps();
    this.checkEnemyContacts();
    this.checkGoal();

    this.cameraX = clamp(
      player.x - 300,
      0,
      WORLD.width - 960
    );
  }

  resetEvents() {
    Object.keys(this.events).forEach((key) => {
      this.events[key] = false;
    });
  }

  solidBodies() {
    return [...this.platforms, ...this.pipes, ...this.blocks];
  }

  moveX(entity, dt) {
    entity.x += entity.vx * dt;
    for (const body of this.solidBodies()) {
      if (!overlaps(entity, body)) continue;
      if (entity.vx > 0) {
        entity.x = body.x - entity.width;
      } else if (entity.vx < 0) {
        entity.x = body.x + body.width;
      }
    }
  }

  moveY(entity, dt) {
    const previousY = entity.y;
    entity.y += entity.vy * dt;
    for (const body of this.solidBodies()) {
      if (!overlaps(entity, body)) continue;
      if (entity.vy > 0 && previousY + entity.height <= body.y) {
        entity.y = body.y - entity.height;
        entity.vy = 0;
      } else if (entity.vy < 0 && previousY >= body.y + body.height) {
        entity.y = body.y + body.height;
        entity.vy = 0;
        this.onHeadHit(body);
      }
    }
  }

  resolveGroundCollision(entity) {
    for (const body of this.solidBodies()) {
      const onTop =
        Math.abs(entity.y + entity.height - body.y) < 0.5 &&
        entity.x + entity.width > body.x &&
        entity.x < body.x + body.width;
      if (onTop) {
        entity.onGround = true;
        return;
      }
    }
  }

  onHeadHit(block) {
    if (!this.blocks.includes(block)) return;
    if (block.kind === "brick" && this.player.form === "big") {
      block.used = true;
      block.width = 0;
      block.height = 0;
      this.score += 50;
      return;
    }
    if (block.kind !== "question" || block.used) return;
    block.used = true;
    if (block.reward === "coin") {
      this.score += 50;
      this.events.coin = true;
    } else if (block.reward === "mushroom") {
      this.powerUps.push({
        x: block.x + 4,
        y: block.y - 28,
        width: 30,
        height: 30,
        vx: 70,
        vy: 0
      });
    }
  }

  updateEnemies(dt) {
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      enemy.x += enemy.speed * enemy.direction * dt;
      if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
        enemy.direction *= -1;
      }
    });
  }

  updatePowerUps(dt) {
    this.powerUps.forEach((item) => {
      item.vy += WORLD.gravity * dt;
      item.y += item.vy * dt;
      item.x += item.vx * dt;

      for (const body of this.solidBodies()) {
        if (!overlaps(item, body)) continue;
        if (item.vx > 0 && item.x + item.width > body.x && item.x < body.x) {
          item.x = body.x - item.width;
          item.vx *= -1;
        } else if (item.vx < 0 && item.x < body.x + body.width && item.x > body.x) {
          item.x = body.x + body.width;
          item.vx *= -1;
        }
        if (item.vy > 0 && item.y + item.height >= body.y) {
          item.y = body.y - item.height;
          item.vy = 0;
        }
      }
    });
  }

  collectCoins() {
    this.coins.forEach((coin) => {
      if (!coin.collected && overlaps(this.player, coin)) {
        coin.collected = true;
        this.score += 10;
        this.events.coin = true;
      }
    });
  }

  checkPowerUps() {
    this.powerUps = this.powerUps.filter((item) => {
      if (!overlaps(this.player, item)) return true;
      this.player.form = "big";
      this.player.height = PLAYER.bigHeight;
      this.score += 200;
      this.events.powerup = true;
      return false;
    });
  }

  checkEnemyContacts() {
    for (const enemy of this.enemies) {
      if (!enemy.alive || !overlaps(this.player, enemy)) continue;
      const stomped =
        this.player.vy > 0 &&
        this.player.y + this.player.height - enemy.y < 20;
      if (stomped) {
        enemy.alive = false;
        this.player.vy = -430;
        this.score += 100;
        this.events.stomp = true;
      } else if (this.player.invulnerableFor <= 0) {
        this.takeDamage();
      }
    }
  }

  checkGoal() {
    if (overlaps(this.player, this.goal)) {
      this.finished = true;
      this.won = true;
      this.events.win = true;
    }
  }

  takeDamage() {
    if (this.player.form === "big") {
      this.player.form = "small";
      this.player.height = PLAYER.height;
      this.player.invulnerableFor = PLAYER.invulnerableSeconds;
      this.events.hurt = true;
      return;
    }
    this.loseLifeAndRespawn();
    this.events.hurt = true;
  }

  loseLifeAndRespawn() {
    this.player.lives -= 1;
    if (this.player.lives <= 0) {
      this.finished = true;
      this.won = false;
      this.events.lose = true;
      return;
    }
    this.player.x = 80;
    this.player.y = 360;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.form = "small";
    this.player.height = PLAYER.height;
    this.player.invulnerableFor = PLAYER.invulnerableSeconds;
  }
}
