(function (window) {
  var width = document.body.clientWidth,
    height = document.body.clientHeight;

  var renderer = PIXI.autoDetectRenderer(width, height);
  document.body.appendChild(renderer.view);

  var stage = new PIXI.Container();

  var ropeLength = 1500,
    ropePoints = 10,
    headPoints = 0,
    ropeInterval = ropeLength / ropePoints;
  var points = [];
  for (var i = 0; i < ropePoints; i++) {
    points.push(new PIXI.Point(i * ropeInterval, 0));
  }

  var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('cats/' + (window.location.search.replace('?', '') || 1) + '.png'), points);
  strip.x = -ropeLength / 2;

  var stripContainer = new PIXI.Container();
  stripContainer.rotation = -Math.PI / 2;
  stripContainer.x = width / 2;
  stripContainer.y = height / 2;
  stripContainer.scale.set(height / (ropeLength - 200));

  stage.addChild(stripContainer);
  stripContainer.addChild(strip);

  function render() {
    var t = performance.now();
    for (var i = 0; i < ropePoints - headPoints; i++) {
      var point = points[i];
      point.y = 30 * Math.sin(t/100 + i);
      point.x = i * ropeInterval + 40 * Math.cos(t/200 + i);
    }

    if (headPoints) {
      var neckBase = points[ropePoints - headPoints - 1],
        neckTop = points[ropePoints - headPoints],
        dx = neckTop.x - neckBase.x,
        dy = neckTop.y - neckBase.y,
        l = Math.sqrt(dx*dx + dy*dy);

      dx *= ropeInterval / l;
      dy *= ropeInterval / l;

      for (var i = 0; i < headPoints; i++) {
        var point = points[ropePoints - headPoints + i];
        point.x = neckTop.x + dx*i;
        point.y = neckTop.y + dy*i;
      }
    }

    // stripContainer.x = (width / 2) + Math.sin(t / 250) * 30;
    // stripContainer.y = (height / 2) + Math.cos(t / 250) * 20 + 70;

    renderer.render(stage);
    window.requestAnimationFrame(render);
  }

  render();
})(window);
