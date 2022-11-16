(function (window) {
  "use strict";

  var Cat = window.Cat,
    KnifeTrail = window.KnifeTrail,
    rand = window.util.rand,
    intersect = window.util.intersect;

  var debug = false;
  var button = document.querySelector("button");
  var video = document.querySelector("video");
  var loadingNotice = document.querySelector(".loadingNotice");
  var facePicker = document.querySelector(".facePicker");
  var detectingNotice = document.querySelector(".detectingNotice");
  var tentacleImg;
  var targetFaceWidth = 200;
  var faceImages;

  start();

  function start() {
    tentacleImg = document.createElement("img");
    tentacleImg.onload = function () {
      startFacePicker();
    };
    tentacleImg.onerror = function () {
      alert("cant load tentacles :(");
    };
    tentacleImg.src = "/tentacles/cats/tentacle.png";
  }

  function startFacePicker() {
    loadingNotice.style.display = "none";
    facePicker.style.display = "block";

    var stream;
    var frameImg;

    window.navigator.mediaDevices
      .getUserMedia({ video: true, auto: false })
      .then(function (mediaStream) {
        video.srcObject = mediaStream;
        button.style.display = "";
        stream = mediaStream;
      });

    button.addEventListener("click", function () {
      captureFrame();
      facePicker.style.display = "none";
      detectingNotice.style.display = "block";
    });

    function stopStream() {
      if (stream.stop) {
        stream.stop();
      } else if (stream.getTracks) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    }

    function captureFrame() {
      var canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      setTimeout(function () {
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var tracker = new tracking.ObjectTracker(["face"]);
        tracker.edgesDensity = 0.1;
        tracker.initialScale = 1;
        tracker.stepSize = 1;

        var found = false;
        tracker.on("track", function (event) {
          var faces = event.data;
          if (faces && faces.length) {
            found = true;
            stopStream();

            faceImages = faces.map(function (coords) {
              return extractFace(coords, canvas);
            });

            startTentacles();
          } else {
            alert("No faces found!");
            facePicker.style.display = "block";
            detectingNotice.style.display = "none";
          }
        });

        tracker.track(data.data, data.width, data.height);
      }, 100);
    }

    function extractFace(coords, source) {
      var xOffs = -(coords.width * 0.05);
      var yOffs = coords.height * 0.1;

      var width = coords.width + xOffs * 2;
      var height = coords.height + yOffs * 2;
      var scaleFactor = targetFaceWidth / width;
      var left = coords.x - xOffs;
      var top = coords.y - yOffs;

      var canvas = document.createElement("canvas");
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      var ctx = canvas.getContext("2d");

      // ellipse to crop to:
      ctx.beginPath();
      ctx.ellipse(
        (width * scaleFactor) / 2,
        (height * scaleFactor) / 2,
        (width * scaleFactor) / 2,
        (height * scaleFactor) / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(
        source,
        left,
        top,
        width,
        height,
        0,
        0,
        width * scaleFactor,
        height * scaleFactor
      );

      return canvas;
    }
  }

  function startTentacles() {
    detectingNotice.style.display = "none";

    var width = document.body.clientWidth,
      height = document.body.clientHeight;

    var renderer = PIXI.autoDetectRenderer(width, height);
    window.renderer = renderer;
    document.body.appendChild(renderer.view);

    var stage = new PIXI.Container();
    var tentacles = [];

    var container = new PIXI.Container();
    stage.addChild(container);

    document.body.addEventListener("click", addCat, false);

    for (var i = 0; i < 5; i++) {
      setTimeout(addCat, 1000 * (i + 1));
    }

    render();

    var lastT;
    function render() {
      window.requestAnimationFrame(render);
      if (!lastT) return (lastT = performance.now());
      var t = performance.now(),
        dt = t - lastT;

      for (var i = 0; i < tentacles.length; i++) {
        tentacles[i].update(dt);
      }

      renderer.render(stage);
      lastT = t;
    }

    function addCat(cat) {
      var tentacleImg = createTentacle(sample(faceImages));
      var texture = PIXI.Texture.fromCanvas(tentacleImg);
      var tentacle = new Cat(texture, debug);

      tentacle.scale.set(height / (Cat.CAT_LENGTH * rand(0.9, 1.3)));
      tentacle.x = width / 4 + Math.random() * width * 0.5;
      tentacle.y = height * 1.2;

      if (tentacle.debug) tentacle.debug._size = 1 / tentacle.scale.x;

      container.addChild(tentacle);
      tentacles.push(tentacle);
      window.tentacle = tentacle;
    }
  }

  function createTentacle(face) {
    var canvas = document.createElement("canvas");
    canvas.width = tentacleImg.naturalWidth;
    canvas.height = tentacleImg.naturalHeight;
    var ctx = canvas.getContext("2d");

    // draw image
    ctx.drawImage(tentacleImg, 0, 0);

    // tint
    ctx.globalCompositeOperation = "hue";
    ctx.fillStyle = "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 50%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ensure correct alpha mask:
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(tentacleImg, 0, 0);

    // add face
    ctx.globalCompositeOperation = "source-over";
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(face, (canvas.height - targetFaceWidth) / 2, -canvas.width);

    return canvas;
  }

  function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
})(window);
