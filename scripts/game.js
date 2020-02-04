window.onload = function() {
	canv = document.getElementById("gc");
	ctx = canv.getContext('2d');
	canv.height = window.innerHeight - 21;
	canv.width = window.innerWidth - 21;
	setup();
}

class Snake {
	constructor() {
		this.pos = {x:10,y:12};
		this.dir = 1; // 0 up, 1 right, 2 down, 3 left
		this.moveDelay = 100;
		this.lastMove = performance.now();
		this.body = [[9,12],[8,12],[7,12],[6,12]];
		this.size = 4;
		this.dead = false;
	}
	move() {
		if(performance.now() - this.lastMove >= this.moveDelay) {
			//reset lastMove
            this.lastMove = performance.now();

            //update body
			this.body.unshift([this.pos.x,this.pos.y]);
			while(this.body.length > this.size) this.body.pop();

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

			if(this.pos.y >= board.height-1 ||
				this.pos.y < 1 ||
		   		this.pos.x >= board.width-1 ||
				this.pos.x < 1) game_over();


			//check for food
			if(this.pos.x === board.food.x && this.pos.y === board.food.y) {
				this.size++;
				let valid;
				do {
					board.food.x = Math.floor(Math.random()*(board.width-2))+1;
					board.food.y = Math.floor(Math.random()*(board.height-2))+1;
					valid = true;
					for(let b of this.body) {
						if(b[0] === board.food.x && b[1] === board.food.y) {
							console.log("on snake");
							valid = false;
							break;
						}
					}
					console.log(valid);
				} while(!valid);
			}

			//check for self-collisions
			for(let pt of this.body) {
				if(this.pos.x === pt[0] && this.pos.y === pt[1]) {
					game_over();
				}
			}

		}
	}

	show() {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(board.scale*(this.pos.x+0.5),board.scale*(this.pos.y+0.5),board.scale*0.45,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();

		ctx.fillStyle = "white";
		for(let pt of this.body) {
			ctx.beginPath();
			ctx.arc(board.scale*(pt[0]+0.5),board.scale*(pt[1]+0.5),board.scale*0.45,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}
}

class Board {
	constructor() {
		this.width = canv.height > canv.width ? 17 : Math.floor(17*canv.width/canv.height);
		this.height = canv.height > canv.width ? Math.floor(17*canv.height/canv.width) : 17;
		this.food = {x:5,y:5};
		this.scale = canv.height > canv.width ? canv.width/17 : canv.height/17;
	}

	show() {
		//clear background
		ctx.fillStyle = "darkgray";
		ctx.fillRect(0,0,canv.width,canv.height);

		//add border
		ctx.strokeStyle = "white";
		ctx.lineWidth = this.scale/3;
		ctx.strokeRect((2/3)*this.scale,(2/3)*this.scale,board.width*board.scale-(4/3)*this.scale,board.height*board.scale-(4/3)*this.scale);

		//draw score
		ctx.fillStyle = "black";
		ctx.font = "40pt Arial";
		ctx.fillText(String(snake.size-4),this.scale,this.scale*2-10);

		//draw food
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(board.scale*(this.food.x+0.5),board.scale*(this.food.y+0.5),board.scale*0.3,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();



	}
}

function setup() {
	document.addEventListener('keydown', handle_keydown);
	snake = new Snake();
	board = new Board();
	const fps = 50;
	runtime = setInterval(main, 1000/fps);
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
		 if(snake.dir !== 1) snake.dir = 3;
		 break;
		case 38:
		 //up
		 if(snake.dir !== 2) snake.dir = 0;
		 break;
		case 39:
		 //right
		 if(snake.dir !== 3) snake.dir = 1;
		 break;
		case 40:
		 //down
		 if(snake.dir !== 0) snake.dir = 2;
		 break;
		case 32:
		 //Space
		 if(snake.dead) setup();
		 console.log("restarting...");
		 break;
		default:
		 console.log("Invalid keypress:",evt.keyCode);
		 break;
	}
}

function game_over() {
	clearInterval(runtime);
	alert("Game Over!\nScore: "+String(snake.size-4));
	snake.dead = true;
}

function main() {
	compute();
	draw();
}
