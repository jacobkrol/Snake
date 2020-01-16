window.onload = function() {
	canv = document.getElementById("gc");
	ctx = canv.getContext('2d');
	setup();
	const fps = 50;
	setInterval(main, 1000/fps);
}

class Snake {
	constructor() {
		this.pos = {x:10,y:12};
		this.dir = 1; // 0 up, 1 right, 2 down, 3 left
		this.moveDelay = 10000;
		this.lastMove = performance.now();
		this.body = [[9,12],[8,12],[7,12],[6,12]];
		this.size = 4;
	}
	move() {
		if(performance.now() - this.lastMove >= this.moveDelay) {
			//update body
			this.body.unshift([this.pos.x,this.pos.y]);
			this.body.pop();

			//move head
			switch(this.dir) {
				case 0:
				 this.pos.y--;
				 break;
				case 1:
				 this.pos.x++;
				 break;
				case 2:
				 this.pos.y++;
				 break;
				case 3:
				 this.pos.x--;
				 break;
				default:
				 console.log("Invalid movement direction");
				 break;
			}
			if(this.pos.y >= board.height) this.pos.y -= board.height;
			if(this.pos.y < 0) this.pos.y += board.height;
			if(this.pos.x >= board.width) this.pos.x -= board.width;
			if(this.pos.x < 0) this.pos.x += board.width;

		}
	}

	show() {
		ctx.fillStyle = "lime";
		ctx.arc((this.pos.x+Math.ceil(board.scale/2))*board.scale,(this.pos.y+Math.ceil(board.scale/2))*board.scale,Math.floor(0.9*board.scale/2),0,2*Math.PI);
		ctx.fill();

		ctx.fillStyle = "white";
		for(let pt of this.body) {
			ctx.arc(board.scale*(this.body[0]+Math.ceil(board.scale/2)),board.scale*(this.body[1]+Math.ceil(board.scale/2)),Math.floor(0.9*board.scale/2),0,2*Math.PI);
			ctx.fill();
		}
	}
}

class Board {
	constructor() {
		this.width = 24;
		this.height = 32;
		this.food = {x:5,y:5};
		this.scale = 25;
	}

	show() {
		//clear background
		ctx.fillStyle = "darkgray";
		ctx.fillRect(0,0,canv.width,canv.height);

		//draw food
		ctx.fillStyle = "red";
		ctx.arc(board.scale*(this.food.x+Math.ceil(this.scale/2)),board.scale*(this.food.y+Math.ceil(this.scale/2)),Math.floor(0.7*board.scale/2),0,2*Math.PI);
		ctx.fill();

	}
}

function setup() {
	document.addEventListener('keydown', handle_keydown);
	snake = new Snake();
	board = new Board();
}

function compute() {
	snake.move();
}

function draw() {
	board.show();
	snake.show();
}

function handle_keydown(evt) {
	switch(evt.keyCode) {
		case 37:
		 //left
		 snake.dir = 3;
		 break;
		case 38:
		 //up
		 snake.dir = 0;
		 break;
		case 39:
		 //right
		 snake.dir = 1;
		 break;
		case 40:
		 //down
		 snake.dir = 2;
		 break;
		default:
		 console.log("Invalid keypress");
		 break;
	}
}

function main() {
	console.log("main");
	compute();
	draw();
}

