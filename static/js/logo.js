(function(){
  'use strict';

  var logo = document.getElementById('logo');
  var canvas = document.createElement('canvas');
  var width = logo.width;
  var height = logo.height;
  canvas.width = width;
  canvas.height = height;
  canvas.id = 'logo';

  var offset = [40/75 * width, 38/75 * height];
  var radius = 25/75 * height;
  var angleOffset = -Math.PI / 180 * 3.6;
  var animAngle = 0;
  var animAngleSpeed = 0;
  var lineWidth = 2;
  var lineCount = 35;
  var minLineHeight = 1;
  var maxLineHeight = height / 6;
  var minLineSpeed = 1;
  var maxLineSpeed = 10;
  var lineSpeedDiv = 200;
  var backgroundColor = 'transparent';
  var lineColor = '#fff';


  var ctx = canvas.getContext('2d');
  ctx.drawImage(logo, 0, 0);
  ctx.fillStyle = lineColor;

  var parent = logo.parentNode;
  parent.replaceChild(canvas, logo);

  var getRandomMinMax = function(min, max, div) {
    div = div || 1;
    return (min + Math.ceil(Math.random() * (max - min))) / div;
  };

  var setRandom = function(min, max, div){
    var data = [];
    for (var i = 0; i < lineCount; i += 1) {
      data.push(getRandomMinMax(min, max, div));
    }
    return data;
  };
  var lineHeights = setRandom(minLineHeight, maxLineHeight);
  var targetLineHeights = setRandom(minLineHeight, maxLineHeight);
  var lineSpeeds = setRandom(minLineSpeed, maxLineSpeed, lineSpeedDiv);

  var drawAura = function() {

    ctx.clearRect(0, 0, radius * 3, offset[1] - radius*4/5 + 5);
    ctx.clearRect(0, 0, offset[0] - radius*4/5 + 5, radius * 3);
    ctx.clearRect(0, height - radius*4/5, radius * 3, radius*4/5);
    ctx.clearRect(offset[0] + radius*2/3, 0, radius, radius * 3);

    // Go to position of first column
    var angle = Math.PI / 180 * animAngle;
    var delta = Math.PI * 2 / lineCount;

    ctx.translate(offset[0] + radius * Math.cos(angle),
                  offset[1] + radius * Math.sin(angle));

    for (var i = 0; i < 3; i += 1) {
      var lineHeight = lineHeights[i];

      console.log(angle);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.rect(0, 0, lineHeight, lineWidth);
      ctx.fill();
      ctx.rotate(-angle);

      angle += delta;

      ctx.translate(radius * (Math.cos(angle + delta) - Math.cos(angle)),
                    -radius * (Math.sin(angle + delta) + Math.sin(angle)));

                    console.log(radius * (Math.cos(angle + delta) - Math.cos(angle)),
                                -radius * (Math.sin(angle + delta) + Math.sin(angle)));
    }
  };

  var adjust = function(lineHeights, targetLineHeights) {
    for (var i = 0; i < lineCount; i += 1) {
      if ((lineHeights[i] < targetLineHeights[i] && lineHeights[i] + lineSpeeds[i] > targetLineHeights[i]) ||
          (lineHeights[i] > targetLineHeights[i] && lineHeights[i] - lineSpeeds[i] < targetLineHeights[i])) {
        targetLineHeights[i] = getRandomMinMax(minLineHeight, maxLineHeight);
        lineSpeeds[i] = getRandomMinMax(minLineSpeed, maxLineSpeed, lineSpeedDiv);
      } else if (lineHeights[i] < targetLineHeights[i]) {
        lineHeights[i] += lineSpeeds[i];
      } else if (lineHeights[i] > targetLineHeights[i]) {
        lineHeights[i] -= lineSpeeds[i];
      }
    }
  };

  var animate = function(){
    animAngle = (animAngle + animAngleSpeed) % 360;
    adjust(lineHeights, targetLineHeights);
    drawAura();
    //window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);

}());
