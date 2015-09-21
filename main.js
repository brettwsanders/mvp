var canvas = document.getElementById('frameView');
var context = canvas.getContext("2d");

//information for current frame
var currentFrame = {
  clickX: [],
  clickY: [],
  clickDrag: []
};

// var clickX = [];
// var clickY = [];
// var clickDrag = [];

//information for prior frame
// var previousFrame = {};
// var prevClickX = [];
// var prevClickY = [];
// var prevClickDrag = [];

var paint;
var framesSaved = 0;
var currentFrameID = 1;
var playInterval;

var addClick = function (x, y, dragging) {
  currentFrame.clickX.push(x);
  currentFrame.clickY.push(y);
  currentFrame.clickDrag.push(dragging);
};

var redraw = function (frame) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.lineJoin = "round";
  context.lineWidth = 7;
      
  for(var i=0; i < frame.clickX.length; i++) {    
    context.beginPath();
    if(frame.clickDrag[i] && i){
      context.moveTo(frame.clickX[i-1], frame.clickY[i-1]);
     }else{
       context.moveTo(frame.clickX[i]-1, frame.clickY[i]);
     }
     context.lineTo(frame.clickX[i], frame.clickY[i]);
     context.closePath();
     context.stroke();
  }
};

// var drawPrevFrame = function () {
//   context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

//   context.strokeStyle = '#FF0000';
//   context.lineJoin = "round";
//   context.lineWidth = 7;
      
//   for(var i=0; i < clickX.length; i++) {    
//     context.beginPath();
//     if(clickDrag[i] && i){
//       context.moveTo(clickX[i-1], clickY[i-1]);
//      }else{
//        context.moveTo(clickX[i]-1, clickY[i]);
//      }
//      context.lineTo(clickX[i], clickY[i]);
//      context.closePath();
//      context.stroke();
//   }
// };


var clearCurrentFrame = function() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  currentFrame.clickX = [];
  currentFrame.clickY = [];
  currentFrame.clickDrag = [];
};

var play = function() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  var image = new Image();
  image.onload = function() {
    context.drawImage(image, 0, 0);
  };
  image.src = localStorage.getItem('frame' + currentFrameID);
  currentFrameID++;
  if (currentFrameID > framesSaved) currentFrameID = 1;
};

var setPreviousFrame = function() {
  var prevClickX = currentFrame.clickX.slice();
  var prevClickY = currentFrame.clickY.slice();
  var prevClickDrag = currentFrame.clickDrag.slice();
};

$('#frameView').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw(currentFrame);
});

$('#frameView').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw(currentFrame);
  }
});

$('#frameView').mouseup(function(e){
  paint = false;
});

$('#frameView').mouseleave(function(e){
  paint = false;
});

$('#saveFrame').on('click', function() {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  framesSaved++;
  localStorage.setItem("frame" + framesSaved, image.src);
  $('#view-saved-frames').append('<img src=' + image.src + '>');
  $('#count-saved-frames').text(framesSaved);
  setPreviousFrame();
  clearCurrentFrame();
});

$('#playButton').on('click', function() {
  if (framesSaved <= 0) {
    alert('You haven\'t saved any frames!');
    return;
  }
  var speed = $('#speed').val();
  playInterval = window.setInterval(play, speed);
});

$('#stopButton').on('click', function() {
  clearInterval(playInterval);
  clearCurrentFrame();
  currentFrameID = 1;
  framesSaved = 0;
  $('#count-saved-frames').text(framesSaved);
  $('#view-saved-frames').empty();
});


