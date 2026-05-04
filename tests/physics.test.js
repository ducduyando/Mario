import { describe, expect, it } from "vitest";
import { clamp, overlaps, resolvePlatformCollision } from "../src/game/physics.js";

describe("physics helpers", () => {
  it("clamp limits values to range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("overlaps returns true for intersected rectangles", () => {
    const a = { x: 10, y: 10, width: 10, height: 10 };
    const b = { x: 15, y: 12, width: 10, height: 10 };
    expect(overlaps(a, b)).toBe(true);
  });

  it("resolvePlatformCollision puts entity on platform", () => {
    const entity = { x: 0, y: 90, width: 10, height: 20, vy: 100, onGround: false };
    const platform = { x: 0, y: 100, width: 120, height: 20 };
    const collided = resolvePlatformCollision(entity, platform, 70);
    expect(collided).toBe(true);
    expect(entity.y).toBe(80);
    expect(entity.vy).toBe(0);
    expect(entity.onGround).toBe(true);
  });
});
