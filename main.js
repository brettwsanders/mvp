var canvas = document.getElementById('frameView');
var context = canvas.getContext("2d");

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

var addClick = function (x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
};

var redraw = function () {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.lineJoin = "round";
  context.lineWidth = 7;
      
  for(var i=0; i < clickX.length; i++) {    
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
};

var saveToImage = function () {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  document.body.appendChild(image);
  return image;
}

$('#frameView').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#frameView').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#frameView').mouseup(function(e){
  paint = false;
});

$('#frameView').mouseleave(function(e){
  paint = false;
});

$('#saveFrame').on('click', function() {
  saveToImage();
});

