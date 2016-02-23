var Tet = require('./solver');

var b = new Tet.Board(5,4);

var solver = new Tet.Solver(b, [
	// Tet.pieces.stick,
	// Tet.pieces.stick,
	// Tet.pieces.stick,
	// Tet.pieces.stick,
	Tet.pieces.tee,
	Tet.pieces.zigR,
	Tet.pieces.tee,
	Tet.pieces.bentL,
	Tet.pieces.stick,
	// Tet.pieces.square,
	// Tet.pieces.square,
	// Tet.pieces.square,
	Tet.pieces.square
]);

var solutionFound = solver.solve();

if (solutionFound) {
	console.log("Solved!");
	console.log(solver.moves);
} else {
	console.log("No solution");
}

console.log(b.toString());
console.log(b.toPrettyString());
console.log(b.toReallyPrettyString());

if (solver.pieces.length > 0) {
	console.log(
		"Leftovers:",
		solver.pieces.map(function(x) { return x.name; }).join(', ')
	);
} else {
	console.log("No Leftovers.")
}

console.log("\nWork done: " + solver.work/1000);