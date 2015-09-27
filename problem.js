var Tet = require('./solver');

var b = new Tet.Board(4,7);
console.log(b.toString());

var solver = new Tet.Solver(b, [
	Tet.pieces.stick,
	Tet.pieces.tee,
	Tet.pieces.square,
	Tet.pieces.zigR,
	Tet.pieces.tee,
	Tet.pieces.bentL,
	Tet.pieces.stick,
	Tet.pieces.square,
]);
solver.solve();

console.log("Work done: " + solver.work/1000);