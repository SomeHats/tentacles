(function (exports) {
  'use strict';

  RopeDebug.prototype = Object.create(PIXI.Graphics.prototype);
  RopeDebug.prototype.constructor = RopeDebug;

  function RopeDebug(points, lineSize) {
    if (!(this instanceof RopeDebug)) return new RopeDebug(points);
    PIXI.Graphics.call(this);

    this.points = points;
    this.lineSize = lineSize || 1;
  }

  RopeDebug.prototype.update = function() {
    this.clear();
    this.drawPoints();
    this.drawSpine();
  };

  RopeDebug.prototype.drawPoints = function() {
    this.lineStyle(this._size, 0xFFFF00, 1);
    for (var i = 0, l = this.points.length; i < l; i++) {
      this.drawCircle(this.points[i].x, this.points[i].y, 5 * this._size);
    }
  };

  RopeDebug.prototype.drawSpine = function() {
    var size = 50 * this._size;
    for (var i = 0, l = this.points.length - 1; i < l; i++) {
      var point = this.points[i],
        nextPoint = this.points[i+1];

      // Join points:
      this.lineStyle(this._size, 0x00FFFF, 1);
      this.moveTo(point.x, point.y);
      this.lineTo(nextPoint.x, nextPoint.y);

      // Spines:
      var angle = Math.atan2(point.y - nextPoint.y, nextPoint.x - point.x);
      this.lineStyle(this._size, 0xFF00FF, 1);
      this.moveTo(point.x + size * Math.sin(angle), point.y + size * Math.cos(angle));
      this.lineTo(point.x - size * Math.sin(angle), point.y - size * Math.cos(angle));
    }
  };

  exports.RopeDebug = RopeDebug;
}(window));
