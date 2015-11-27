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

  exports.rand = rand;
  exports.lerp = lerp;
  exports.lerpVec = lerpVec;
  exports.distSq = distSq;
}(window));
