export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resolvePlatformCollision(entity, platform, previousY) {
  const fallingIntoTop = previousY + entity.height <= platform.y;
  if (fallingIntoTop && entity.y + entity.height >= platform.y) {
    entity.y = platform.y - entity.height;
    entity.vy = 0;
    entity.onGround = true;
    return true;
  }
  return false;
}
