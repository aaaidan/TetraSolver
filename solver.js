var assert = require('assert');

const UNOCCUPIED = ".";

var Board = function(width, height) {
	this.width = width;
	this.height = height;
	this.data = [];
	for (var i=0; i<width; i++) {
		var q = [];
		for (var j=0; j<height; j++) {
			q.push(UNOCCUPIED);
		}
		this.data.push(q);
	}
}
Board.prototype.occupied = function(x,y) {
	if (x < 0 || x > this.width-1) return true;
	if (y < 0 || y > this.height-1) return true;
	if (this.data[x][y] !== UNOCCUPIED) {
		return true;
	}
	return false;
}
Board.prototype.toString = function() {
	var str = "";
	for (var y=0;y<this.height;y++) {
		for (var x=0;x<this.width;x++) {
			str += this.data[x][y] + " ";
		}
		str += "\n";
	}
	return str;
};
Board.prototype.isSolved = function() {
	var board = this;
	return this.data.every(function(col,x) {
		return col.every(function(cell, y) {
			return board.occupied(x,y);
		});
	});
};

var Direction = function(x,y,name) {
	this.x = x;
	this.y = y;
	this.name = name;
};
var UP = new Direction(0,-1, "up");
var DOWN = new Direction(0,1, "down");
var LEFT = new Direction(-1,0, "left");
var RIGHT = new Direction(1,0, "right");

UP.cw = RIGHT;
UP.ccw = LEFT;

RIGHT.cw = DOWN;
RIGHT.ccw = UP;

DOWN.cw = LEFT;
DOWN.ccw = RIGHT;

LEFT.cw = UP;
LEFT.ccw = DOWN;

var Piece = function(name, data, numDirections) {
	this.name = name;
	this.data = data.split('');

	if (typeof numDirections == "undefined") {
		numDirections = 4;
	}
	if (numDirections == 4) {
		this.directions = [UP,DOWN,LEFT,RIGHT];
	} else if (numDirections == 2) {
		this.directions = [UP,LEFT];
	} else if (numDirections == 1) {
		this.directions = [UP];
	} else {
		throw new Error("Unsupported number of directions", numDirections);
	}
}
Piece.prototype.tryPlaceAt = function(_char, _x,_y,rot,board) {
	if (this.canPlaceAt(_x,_y,rot,board)) {
		this.printAt(_char, _x,_y,rot,board);
		return true;
	} else {
		return false;
	}
};
Piece.prototype.canPlaceAt = function(_x,_y,rot,board) {
	var direction = rot;
	var cursor = [_x,_y];

	if ( board.occupied( cursor[0], cursor[1] ) ) return false;

	cursor[0] += direction.x;
	cursor[1] += direction.y;
	
	if ( board.occupied( cursor[0], cursor[1] ) ) return false;

	var allNotOccupied = this.data.every(function(instruction) {
		if (instruction == "L") {
			direction = direction.ccw;
		} else if (instruction == "R") { 
			direction = direction.cw;
		} else if (instruction == "B") { 
			// move back
			cursor[0] -= direction.x;
			cursor[1] -= direction.y;
			return true; // succeeds because no check required
		} else if (instruction == "F") {
			// stay the course, captain
		} else {
			throw new Error("Unknown instruction ", instruction);
		}

		cursor[0] += direction.x;
		cursor[1] += direction.y;

		var result = !board.occupied( cursor[0], cursor[1] );
		return result;
	});

	return allNotOccupied;
}
Piece.prototype.printAt = function(_char, _x,_y,rot,board) {
	var direction = rot;
	var cursor = [_x,_y];

	board.data[cursor[0]][cursor[1]] = _char;
	cursor[0] += direction.x;
	cursor[1] += direction.y;
	board.data[cursor[0]][cursor[1]] = _char;

	this.data.forEach(function(instruction) {
		if (instruction == "L") {
			direction = direction.ccw;
		} else if (instruction == "R") { 
			direction = direction.cw;
		} else if (instruction == "B") { 
			// move back
			cursor[0] -= direction.x;
			cursor[1] -= direction.y;
			return true; // succeeds because no check required
		} else if (instruction == "F") {
			// stay the course, captain
		} else {
			throw new Error("Unknown instruction ", instruction);
		}
		cursor[0] += direction.x;
		cursor[1] += direction.y;

		board.data[cursor[0]][cursor[1]] = _char;
	});
};
Piece.prototype.erase = function(_x,_y,rot,board) {
	this.printAt(UNOCCUPIED, _x,_y,rot,board);
};

// 0 1
// 2 3
// 4 5
//
// 1 3 5
// 0 2 4


var zigL =  new Piece("zigL", "LR", 2); // zigzag lh .:-
var zigR = new Piece("zigR", "RL", 2); // zigzag rh -:_
var tee = new Piece("tee", "BLBBBF"); // Tee piece |-
var stick = new Piece("stick", "FF", 2); // long piece ----
var bentL = new Piece("bentL", "FL"); // hockeystick --^
var bentR = new Piece("bentR", "FR"); // hockeystick --,
var square = new Piece("square", "RR"); // square ::

exports.b = b;
exports.pieces = {
	zigL: zigL,
	zigR: zigR,
	tee: tee,
	stick: stick,
	bentL: bentL,
	bentR: bentR,
	square: square
};
exports.p = Piece;
exports.Board = Board;
exports.UP = UP;
exports.DOWN = DOWN;
exports.LEFT = LEFT;
exports.RIGHT = RIGHT;

console.log("---");

//zigR.printAt("X", 2,0,DOWN,b);

var Solver = function(board, pieces) {
	this.board = board;
	this.pieces = pieces;
	this.moves = [];
	this.colours = ["X", "*", "O", "+", "@", "E", "%"];
	this.work = 0;
	this.lastReported = new Date().getTime();
};
Solver.prototype.solve = function() {

	//console.log("Solving... Pieces left: " + this.pieces.length);

	var piece = this.pieces.pop();

	var directions = piece.directions;

	if ( (new Date().getTime()) - this.lastReported > 1000) {
		console.log("Work done: " + this.work / 1000);
		this.lastReported = new Date().getTime();
	}

	for(var z=0; z<directions.length; z++) {
		var direction = directions[z];
		for (var x=0; x<this.board.width; x++) {
			for (var y=0; y<this.board.height; y++) {

				var colour = this.colours[this.moves.length % this.colours.length];

				this.work++;
				if (piece.tryPlaceAt(colour, x, y, direction, this.board )) {
					//console.log("Placed " + piece.name + " at [" + x + "," + y + "] " + direction.name);
					//console.log(b.toString());

					this.moves.push([ piece.name, x, y, direction.name ]);
					
					if (this.board.isSolved()) {
						console.log("Solved!");
						console.log(this.board.toString());
						if (this.pieces.length > 0) {
							console.log("leftovers:", this.pieces.map(function(x) { return x.name; }));
						}
						return true;
					}

					if (this.pieces.length > 0) {
						if ( this.solve() ) {
							return true;
						} 
					} else {
						console.log("no more pieces");
						console.log(this.moves);
						console.log();
						console.log(this.board.toString());
						throw new Error("Not enough pieces to solve this puzzle.");
					}

					this.work++;
					piece.erase(x,y,direction,this.board);
					var failedMove = this.moves.pop();
					//console.log("--- OOPS, removing " + failedMove[0] + " (" + colour + ") --- ");

					assert( // popped move should match what we put on
						failedMove[0] == piece.name &&
						failedMove[1] == x &&
						failedMove[2] == y &&
						failedMove[3] == direction.name
						);

				}

			}
		}
	}

	this.pieces.push(piece); // should never happen?

};

var b = new Board(4,7);
console.log(b.toString());

var solver = new Solver(b, [
	stick,
	tee,
	square,
	zigR,
	tee,
	bentL,
	stick,
	square,
]);
solver.solve();

console.log("Work done: " + solver.work/1000);