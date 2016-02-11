(function (window) {
  var width = document.body.clientWidth,
    height = document.body.clientHeight;

  var renderer = PIXI.autoDetectRenderer(width, height);
  window.renderer = renderer;
  document.body.appendChild(renderer.view);

  var stage = new PIXI.Container();

  var catContainer = new PIXI.Container();
  var cats = [];

  function addCat() {
    // var r = Math.random();
    // var name = r < 0.333 ? '1' : r < 0.667 ? 'craig' : 'daniel';
    // var cat = new Cat('cats/'+name+'.png', true);
    var cat = new Cat(Math.random() < 0.5 ? 'cats/1.png' : 'cats/2.png', false);

    cat.scale.set(height / (Cat.CAT_LENGTH * rand(0.9, 1.3)));
    cat.x = width / 4 + Math.random() * width * 0.5;
    cat.y = height * 1.2;

    if (cat.debug) cat.debug._size = 1 / cat.scale.x;

    catContainer.addChild(cat);
    cats.push(cat);
    window.cat = cat;
  }

  for (var i = 0; i < 10; i++) {
    setTimeout(addCat, i * 1000);
  }

  stage.addChild(catContainer);

  var knifeTrail = new KnifeTrail(10, 150);
  stage.addChild(knifeTrail);

  document.body.addEventListener('click', addCat, false);

  var dragging = false;
  document.body.addEventListener('mousedown', function() { dragging = true; });
  document.body.addEventListener('mouseup', function() { dragging = false; });
  document.body.addEventListener('mousemove', function(e) {
    if (dragging) {
      knifeTrail.addPoint(e.clientX, e.clientY);
      requestHeadCut(e.clientX, e.clientY);
    }
  }, false);

  // Head-cut-off-ing
  var headCutRequested = false,
    cutX, cutY, lastX, lastY;

  function requestHeadCut(x, y) {
    headCutRequested = true;
    cutX = x;
    cutY = y;
  }

  function headCut() {
    headCutRequested = false;
    if (lastX == null) {
      lastX = cutX;
      lastY = cutY;
      return;
    }

    var point = new PIXI.Point(),
      nextPoint = new PIXI.Point();

    for (var i = 0, l1 = cats.length; i < l1; i++) {
      var cat = cats[i];
      for (var j = 0, l2 = cat.points.length - 1; j < l2; j++) {
        cat.worldTransform.apply(cat.points[j], point);
        cat.worldTransform.apply(cat.points[j+1], nextPoint);

        var intersectPoint = intersect(cutX, cutY, lastX, lastY, point.x, point.y, nextPoint.x, nextPoint.y);

        // if (j === l2 - 1) {
        //   console.log({
        //     intersectPoint: intersectPoint,
        //     cutX: cutX,
        //     cutY: cutY,
        //     lastX
        //   });
        // }

        // console.log(intersectPoint);
        // if (intersectPoint) {
          // cat.debug.cut(j);
        // }
      }
    }

    lastX = cutX;
    lastY = cutY;
  }

  var lastT;
  function render() {
    window.requestAnimationFrame(render);
    if (!lastT) return lastT = performance.now();
    var t = performance.now(),
      dt = t - lastT;

    for (var i = 0; i < cats.length; i++) {
      cats[i].update(dt);
    }

    knifeTrail.update(dt);
    if (headCutRequested) headCut();

    renderer.render(stage);
    lastT = t;
  }

  render();
})(window);
