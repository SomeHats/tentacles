(function(exports) {
  'use strict';

  function rand(min, max) {
    return lerp(min, max, Math.random());
  }

  function lerp(a, b, n) {
    return a + n * (b - a);
  }

  function lerpVec(a, b, n) {
    a.x = a.x + n * (b.x - a.x);
    a.y = a.y + n * (b.y - a.y);
    return a;
  }

  function distSq(a, b) {
    var dx = b.x - a.x,
      dy = b.y - a.y;

    return dx*dx + dy*dy;
  }

  // Do two line segments intersect?
  function intersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x = p1_x - p0_x,
      s1_y = p1_y - p0_y,
      s2_x = p3_x - p2_x,
      s2_y = p3_y - p2_y,
      s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y),
      t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return new PIXI.Point(p0_x + (t * s1_x), p0_y + (t * s1_y));
    } else {
      return false;
    }
  }

  exports.rand = rand;
  exports.lerp = lerp;
  exports.lerpVec = lerpVec;
  exports.distSq = distSq;
  exports.intersect = intersect;
}(window));
