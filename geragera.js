'use strict';

var cnt = 0;
var mPoem = [
  "GREVE (Gioconda Belli)",
  "Quero uma greve onde vamos todos.",
  "Uma greve de braços, pernas, cabelos.",
  "Uma greve nascendo em cada corpo.",
  "Quero uma greve",
  "De operários, de pombas, De chofres, de flores",
  "De técnicos, de crianças, De médicos, de mulheres",
  "Quero uma greve grande,",
  "Que até o amor alcance.",
  "Uma greve onde tudo se detenha:",
  "O relógio das fábricas O seminário, os colégios",
  "O ônibus, os hospitais A estrada, os portos.",
  "Uma greve de olhos, de mão e de beijo.",
  "Uma greve onde respirar não seja permitido,",
  "Uma greve onde nasça o silêncio",
  "Para ouvir os passos do tirano que marcha."
];

var mPhrase = mPoem[cnt];

var PAGE_PROPORTION = 1.3;
var pageHeight = 680;

var MAX_FONT_SIZE = 500;

var BORDER_WIDTH = 18;
var borderPadding = BORDER_WIDTH;
var textPadding = borderPadding + 0.5*BORDER_WIDTH;

var mFont;
var textArea;
var textCanvas, tempTextcanvas, backgroundCanvas;

function preload() {
  mFont = loadFont("MyFont-Bold.otf");
}

function setup() {
  var dW = document.body.offsetWidth;
  var dH = document.body.offsetHeight;
  var canvasW = Math.min(dW, PAGE_PROPORTION * dH);
  var canvasH = canvasW / PAGE_PROPORTION;

  document.getElementById("myCanvas").style.width = canvasW + "px";
  document.getElementById("myCanvas").style.height = canvasH + "px";

  var myCanvas = createCanvas(canvasW, canvasH);
  myCanvas.parent('myCanvas');
  smooth();

  textArea = createVector(width-2*textPadding, height-2*textPadding);
  textCanvas = createGraphics(width, int(2*height));
  tempTextcanvas = createGraphics(textCanvas.width, textCanvas.height);
  backgroundCanvas = createGraphics(width, height);

  drawFrame(backgroundCanvas);
  drawSubtitle(backgroundCanvas, "GREVE GERAL - 28/04");
  drawText(textCanvas, breakText(mPhrase, 4));
}

function draw() {
  background(255);
  image(textCanvas, 0, 0);
  image(backgroundCanvas, 0, 0);
}

function mousePressed() {
  cnt = (cnt+1)%mPoem.length;
  mPhrase = mPoem[cnt];
  drawText(textCanvas, breakText(mPhrase, 4));
}

function breakText(line, numLines) {
  line = line.trim();
  line = line.replace(/ +/g, ' ');
  var spaceCount = (line.match(/ /g) || []).length;


  if(spaceCount < numLines) {
    line = line.replace(/ /g, '\n');
  } else if(spaceCount < numLines+1) {
    line = breakStringIntoLines(line, numLines-1);
  } else {
    line = breakStringIntoLines(line, numLines);
  }
  return line;
}

function breakStringIntoLines(str, numLines) {
  var spaceIndexes = getCharIndexes(str, ' ');
  var desiredSplits = [];
  var currentSplits = [];

  for(var i=1; i<numLines; i++) {
    desiredSplits.push(i/numLines * str.length);
    currentSplits.push(spaceIndexes[0]);
  }

  for(var i=0; i<spaceIndexes.length; i++) {
    for(var j=0; j<desiredSplits.length; j++) {
      var newDistance = Math.abs(spaceIndexes[i] - desiredSplits[j]);
      var currentDistance = Math.abs(currentSplits[j] - desiredSplits[j]);
      currentSplits[j] = (newDistance < currentDistance)?spaceIndexes[i]:currentSplits[j];
    }
  }

  for(var j=0; j<currentSplits.length; j++) {
    str = replaceAt(str, currentSplits[j], '\n');
  }
  return str;
}

function getCharIndexes(str, char) {
  var indexes = str.split('').reduce(function(acc, el, ind) {
    return (el == char)?acc.concat(ind):acc;
  }, []);
  return indexes;
}

function replaceAt(str, ind, char) {
  return str.substr(0, ind) + char + str.substr(ind+char.length);
}

function drawText(canvas, line) {
  var mTextSize = MAX_FONT_SIZE;

  tempTextcanvas.smooth();
  tempTextcanvas.background(255);
  tempTextcanvas.textFont(mFont);
  tempTextcanvas.textAlign(CENTER, CENTER);

  var words = line.split("\n");
  var yPos = textPadding;
  for(var i=0; i<words.length; i++) {
    words[i] = words[i].toUpperCase();
    mTextSize = MAX_FONT_SIZE;
    textSize(mTextSize);
    while(textWidth(words[i]) > width-2*textPadding) {
      mTextSize -= 2;
      textSize(mTextSize);
    }

    tempTextcanvas.fill(0);
    tempTextcanvas.textSize(mTextSize);
    tempTextcanvas.text(words[i], textPadding, yPos, width-2*textPadding, 1.02*mTextSize);
    yPos += mTextSize;
  }
  yPos += textPadding;

  var heightScaleRatio = (6.0 * height / 7.0) / yPos;

  canvas.smooth();
  canvas.background(0,0);
  canvas.push();
  canvas.scale(1, heightScaleRatio);
  canvas.image(tempTextcanvas, 0, 0);
  canvas.pop();
}

function drawFrame(canvas) {
  var RECT_POS = createVector(width/2, height/2);
  var RECT_SIZE = createVector(width-2*borderPadding, height-2*borderPadding);

  canvas.smooth();
  canvas.noFill();
  canvas.stroke(0);
  canvas.rectMode(CENTER);
  canvas.strokeWeight(BORDER_WIDTH);

  canvas.rect(RECT_POS.x, RECT_POS.y, RECT_SIZE.x, RECT_SIZE.y);
}

function drawSubtitle(canvas, subtitle) {
  var RECT_POS = createVector(width/2, textPadding+6.5*textArea.y/7.0);
  var RECT_SIZE = createVector(width-2*textPadding-8, textArea.y/7.0-8);
  var mTextSize = MAX_FONT_SIZE;

  canvas.smooth();
  canvas.fill(0);
  canvas.noStroke();
  canvas.rectMode(CENTER);
  canvas.textFont(mFont);
  canvas.textAlign(CENTER, CENTER);

  textSize(mTextSize);
  while (textWidth(subtitle) > RECT_SIZE.x-8) {
    mTextSize -= 2;
    textSize(mTextSize);
  }
  canvas.textSize(mTextSize);

  canvas.push();
  canvas.translate(RECT_POS.x, RECT_POS.y);
  canvas.rect(0, 0, RECT_SIZE.x, RECT_SIZE.y);
  canvas.fill(255);
  canvas.text(subtitle, 0, 0, RECT_SIZE.x, RECT_SIZE.y+8);
  canvas.pop();
}
