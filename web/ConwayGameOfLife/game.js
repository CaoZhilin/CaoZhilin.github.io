function CGLife(row, column, livingCells){
	this.livingCells = livingCells;
	this.rows = row;
	this.columns = column;
	this.cells = [];
	this.canvas = new Canvas;
	this.dynamicArray = new Array();
	this.init(row,column,livingCells);
}
//set the start status and get the process start to update
CGLife.prototype.init = function(row,column,livingCells){
	var self = this;
	this.createStartStatus();
	this.draw();
    this.eventHandler();

    this.evolvement = setInterval(function(){
		self.update();
		self.draw();
    },200);
}
//init all the cells and set target alive cells
CGLife.prototype.createStartStatus = function(){
	for (var i = 0; i < this.rows; ++i) {
		this.cells[i] = new Array();
		for (var j = 0; j < this.columns; ++j) {
			this.cells[i].push(new cell({x:i,y:j},0));
		}
	}
	var i = this.livingCells - 1;
	while (i >= 0) {
		var tempn1 = random(0, this.rows - 1);
		var tempn2 = random(0, this.columns - 1);
		if (!this.cells[tempn1][tempn2]["currentStatus"]) {
			this.dynamicArray.push(this.cells[tempn1][tempn2]);
			this.cells[tempn1][tempn2]["currentStatus"] = 1;
		} else{
			i++;
		}
		i--;
	}
}
//update the living status
CGLife.prototype.update = function() {
	k = this.dynamicArray.length - 1;
		while (k >= 0) {//通过存活队列生成邻居存活情况
			tempCell = this.dynamicArray[k];
			i = tempCell.x;
			j = tempCell.y;
			upRow = (i + this.rows - 1) % this.rows;
			downRow = (upRow + 2) % this.rows;
			leftColumn = (j + this.columns - 1) % this.columns;
			rightColumn = (leftColumn + 2) % this.columns;
			position = [[upRow, leftColumn], [upRow, j], [upRow, rightColumn], [i, leftColumn], [i, rightColumn], [downRow, leftColumn], [downRow, j], [downRow, rightColumn]];
			for ( p = 0; p < 8; ++p) {
				this.cells[position[p][0]][position[p][1]]["neighborAlive"] += 1;
			}
			k--;
		}	
	this.dynamicArray = [];	
	//update nextStatus of the cells by the living status of the neighbor
	for (var i = 0; i < this.rows; ++i) {
		for (var j = 0; j < this.columns; ++j) {
			temp = this.cells[i][j];
			if (temp["currentStatus"] === 1) {
				if (temp["neighborAlive"] === 2 || temp["neighborAlive"] === 3) {
					temp["currentStatus"] = 1;
					this.dynamicArray.push(temp);
				}else {
					temp["currentStatus"] = 0;
				}
			}
			else{
				if (temp["neighborAlive"] ===3) {
					temp["currentStatus"] = 1;
					this.dynamicArray.push(temp);
				}else{
					temp["currentStatus"] = 0;
				}
			}
		}
	}
	for (var i = 0; i < this.rows; ++i) {
		for (var j = 0; j < this.columns; ++j) {
			this.cells[i][j]["neighborAlive"] = 0;
		}
	}
	document.getElementById('living').value = this.dynamicArray.length;
};
//set the button event
CGLife.prototype.eventHandler = function(){
    var self = this;
    var snapshotButton = document.getElementById('snapshotButton'),
      	snapshotImageElement = document.getElementById('snapshotImageElement'),
      	newGame = document.getElementById('newGame'),
      	canvas = document.getElementById('canvas');

    snapshotButton.onclick = function(event) {
    	event.preventDefault();
    	console.log("ee");
  	    if (snapshotButton.innerHTML == 'Pause') {
  	      clearInterval(self.evolvement);
  	      var dataUrl = canvas.toDataURL();
  	      snapshotImageElement.src = dataUrl;
  	      snapshotImageElement.style.display = 'inline';
  	      canvas.style.display = 'none';
  	      snapshotButton.innerHTML = 'Continue';
  	    } else {
  	      self.evolvement = setInterval(function() {
  	        self.update();
  	        self.draw();
  	      }, 200);
  	      canvas.style.display = 'inline';
  	      snapshotImageElement.style.display = 'none';
  	      snapshotButton.innerHTML = 'Pause';
  	    }
  	};
  	newGame.onclick = function(event) {
  		start = Number(document.getElementById('start').value); 
		document.getElementById('living').value = start;
  		console.log(start);
  	};
}
//paint the world grid and cells
CGLife.prototype.draw = function(){
	var self = this;
	this.canvas.drawGrid('lightgrey', 5, 5);
	this.dynamicArray.forEach(function(cell){
		self.canvas.drawCell(cell);
	});
}

function cell(position,status){
	this.x = position.x;
	this.y = position.y;

	this.currentStatus = status;
	this.nextStatus = 0;

	this.neighborCell = [];
	this.neighborAlive = 0;
}

//画布
function Canvas() {
  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
}

Canvas.prototype.drawGrid = function(color, gridX, gridY) {
  var canvas = this.canvas;
  var ctx = this.context;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  for (var i = gridX + 0.5; i < ctx.canvas.width; i += gridX) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
    ctx.closePath();
  }

  for (var i = gridY + 0.5; i < ctx.canvas.height; i += gridY) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
    ctx.closePath();
  }
  ctx.restore();
};

Canvas.prototype.drawCell = function(cell) {
  var ctx = this.context;

  var x = 5 * cell.x;
  var y = 5 * cell.y;
  
  ctx.fillStyle = "pink";
  ctx.fillRect(x, y, 5, 5);
  ctx.strokeStyle="lightgrey";
  ctx.strokeRect(x, y, 5, 5);
};
//generation random number 
var random = function(min, max) {
	return Math.round(Math.random() * (max - min )) + min;
}

var game = new CGLife(100,100,2000);
