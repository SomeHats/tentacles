(function (exports) {
  'use strict';

  Cat.CAT_LENGTH = 1500;
  Cat.POINTS = 15;
  Cat.HEAD_POINTS = 0;
  Cat.INTERVAL = Cat.CAT_LENGTH / Cat.POINTS;

  Cat.prototype = Object.create(PIXI.Container.prototype);
  Cat.prototype.constructor = Cat;

  function Cat(url, debug) {
    if (!(this instanceof Cat)) return new Cat(url, debug);
    PIXI.Container.call(this);

    // setup points to start off with
    this.points = [];
    for (var i = 0; i < Cat.POINTS; i++) {
      this.points.push(new PIXI.Point(i * Cat.INTERVAL, 0));
    }

    // Create rope
    this.texture = PIXI.Texture.fromImage(url);
    this.rope = new PIXI.mesh.Rope(this.texture, this.points);
    this.addChild(this.rope);

    // debug
    if (debug) {
      this.debug = new RopeDebug(this.points);
      this.addChild(this.debug);
      this.rope.alpha = 0.3;
    }

    // controls
    this._t = rand(10000, 1000000);
    this.speedMultiplier = rand(1.1, 1.3);
    this.speed = rand(0.0005, 0.0015);
    this.wiggleRange = rand(0.15, 0.3);
    this.moveUpSpeed = rand(0.01, 0.05);

    this.yOffset = Cat.CAT_LENGTH;
  };

  Cat.prototype.update = function(dt) {
    var t = this._t = this._t + dt;

    var speed = this.speed;
    var angle = -Math.PI / 2;
    this.yOffset = lerp(this.yOffset, 0, this.moveUpSpeed);

    var lastX, lastY;

    for (var i = 0; i < Cat.POINTS; i++) {
      var point = this.points[i];
      var localAngle = angle + this.wiggleRange * Math.sin(t * speed);

      if (lastX != null) {
        point.x = lastX + Cat.INTERVAL * Math.cos(angle);
        point.y = lastY + Cat.INTERVAL * Math.sin(angle) + this.yOffset;
      }

      lastX = point.x;
      lastY = point.y;
      angle = localAngle;
      speed = speed * this.speedMultiplier;
    }

    if (this.debug) this.debug.update(dt);
  };

  exports.Cat = Cat;
}(window));
