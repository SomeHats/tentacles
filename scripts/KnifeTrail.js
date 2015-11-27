(function(exports) {
  'use strict';

  KnifeTrail.prototype = Object.create(PIXI.Graphics.prototype);
  KnifeTrail.prototype.constructor = KnifeTrail;

  function KnifeTrail(trailWidth, maxAge) {
    if (!(this instanceof KnifeTrail)) return new KnifeTrail(trailWidth, maxAge);
    PIXI.Graphics.call(this);
    this.trailWidth = trailWidth;
    this.maxAge = maxAge;
    this.points = [];

    this._t = 0;
  }

  KnifeTrail.prototype.addPoint = function(x, y) {
    var lastP = this.points[this.points.length - 1];
    var point = new PIXI.Point(x, y);
    if (!lastP || distSq(lastP, point) > 20) {
      point.birth = this._t;
      this.points.push(point);
    }
  };

  KnifeTrail.prototype.update = function(dt) {
    var t = this._t = this._t + dt;

    this.clear();

    for (var i = 0, l = this.points.length; i < l; i++) {
      var point = this.points[i];
      point.age = t - point.birth;
      if (point.age > this.maxAge) {
        this.points.splice(i, 1);
        i--;
        l--;
        continue;
      }

      if (i+1 < l) lerpVec(point, this.points[i+1], 0.3);

      this.lineStyle(lerp(1, 10, i/l), 0xFFFFFF, lerp(0.01, 0.3, i/l));
      if (i === 0) {
        this.moveTo(point.x, point.y);
      } else {
        this.lineTo(point.x, point.y);
      }
    }
  };

  exports.KnifeTrail = KnifeTrail;

}(window));
