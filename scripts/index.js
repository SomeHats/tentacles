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
    var cat = new Cat('cats/1.png', true);

    cat.scale.set(height / (Cat.CAT_LENGTH * rand(0.9, 1.3)));
    cat.x = width / 4 + Math.random() * width * 0.5;
    cat.y = height * 1.2;

    if (cat.debug) cat.debug._size = 1 / cat.scale.x;

    catContainer.addChild(cat);
    cats.push(cat);
  }

  for (var i = 0; i < 1; i++) {
    addCat();
  }

  stage.addChild(catContainer);

  var knifeTrail = new KnifeTrail(10, 150);
  stage.addChild(knifeTrail);

  // document.body.addEventListener('click', addCat, false);

  var dragging = false;
  document.body.addEventListener('mousedown', function() { dragging = true; });
  document.body.addEventListener('mouseup', function() { dragging = false; });
  document.body.addEventListener('mousemove', function(e) {
    if (dragging) knifeTrail.addPoint(e.clientX, e.clientY);
  }, false);

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

    renderer.render(stage);
    lastT = t;
  }

  render();
})(window);
