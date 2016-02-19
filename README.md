# TetraSolver
**A "Tetromino" puzzle solver written in Javascript.**

A Teromino puzzle is a grid which you solve by fitting Tetris pieces with no gaps.


    ──┬── ║ 
    ║ ╵ ╔═╝ 
    ║ ║ ║ ┃ 
    ║ ║ ━━┫ 
    ║ ╚══ ┃ 
    
## Usage

Short answer: check out [problem.js](https://github.com/aaaidan/TetraSolver/blob/master/problem.js) for a working example. 

Longer answer:

1. Create a `Board`

        var b = new Tetra.Board(4,7);

2. Create a `Solver`, passing the `Board` and an `Array` of the available `Pieces`.

        var solver = new Tetra.Solver(b, [
        	Tetra.pieces.stick,
        	Tetra.pieces.tee,
        	Tetra.pieces.square,
        	Tetra.pieces.zigR,
        	Tetra.pieces.tee,
        	Tetra.pieces.bentL,
        	Tetra.pieces.stick,
        	Tetra.pieces.square,
        ]);

3. Solve it...

        solver.solve();

## But why!?
I wrote this because I thought it would be faster and more fun than actually solving the mandatory puzzles in that game that time. One of those predictions came true.
