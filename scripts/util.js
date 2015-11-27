(function(exports) {
  'use strict';

  function rand(min, max) {
    return lerp(min, max, Math.random());
  }

  function lerp(a, b, x) {
    return a + x * (b - a);
  }

  exports.rand = rand;
  exports.lerp = lerp;
}(window));
