window.Cat = (function (window) {
  'use strict';

  var RopeDebug = window.RopeDebug,
      rand = window.util.rand,
      lerp = window.util.lerp;

  Cat.CAT_LENGTH = 1500;
  Cat.POINTS = 15;
  Cat.HEAD_POINTS = 0;
  Cat.INTERVAL = Cat.CAT_LENGTH / Cat.POINTS;

  Cat.prototype = Object.create(PIXI.Container.prototype);
  Cat.prototype.constructor = Cat;

  function Cat(texture, debug) {
    if (!(this instanceof Cat)) return new Cat(texture, debug);
    PIXI.Container.call(this);

    // setup points to start off with
    this.points = [];
    for (var i = 0; i < Cat.POINTS; i++) {
      this.points.push(new PIXI.Point(i * Cat.INTERVAL, 0));
    }

    // Create rope
    this.texture = texture;
    this.rope = new PIXI.mesh.Rope(this.texture, this.points);
    this.addChild(this.rope);

    // debug
    if (debug) {
      this.debug = new RopeDebug(this.points);
      this.addChild(this.debug);
      this.rope.alpha = 0.0;
    }

    // controls
    this._t = rand(10000, 1000000);
    this.wiggle = rand(0.0005, 0.0015);
    this.wiggleMultiplier = rand(1.1, 1.3);
    this.wiggleRange = rand(0.15, 0.3);
    this.stretch = rand(0.0005, 0.0015);
    this.stretchMultiplier = rand(1.05, 1.2);
    this.stretchRange = rand(0.15, 0.4);
    this.moveUpSpeed = rand(0.01, 0.05);

    this.yOffset = Cat.CAT_LENGTH;
  }

  Cat.prototype.update = function(dt) {
    var t = this._t = this._t + dt;

    var wiggle = this.wiggle;
    var angle = -Math.PI / 2;
    var stretch = this.stretch;
    this.yOffset = lerp(this.yOffset, 0, this.moveUpSpeed);

    var lastX, lastY;

    for (var i = 0; i < Cat.POINTS; i++) {
      var point = this.points[i];
      var localAngle = angle + this.wiggleRange * Math.sin(t * wiggle);
      var localStretch = 1 + this.stretchRange * Math.sin(t * stretch);

      if (lastX != null) {
        point.x = lastX + Cat.INTERVAL * localStretch * Math.cos(angle);
        point.y = lastY + Cat.INTERVAL * localStretch * Math.sin(angle) + this.yOffset;
      }

      lastX = point.x;
      lastY = point.y;
      angle = localAngle;
      wiggle = wiggle * this.wiggleMultiplier;
      stretch = stretch * this.stretchMultiplier;
    }

    if (this.debug) this.debug.update(dt);
  };

  return Cat;
}(window));
