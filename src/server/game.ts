import Vector2 from "newton/2d/Vector2";

export default class Game {
	/**
	 * Actual height is the board height, plus the yOffset which is offscreen
	 */
	private actualHeight: number;
	private board: boolean[][];
	private height: number;
	private width: number;
	private yOffset: number;

	public constructor() {
		this.width = 10;
		this.height = 20;
		this.yOffset = 5;
		this.actualHeight = this.height + this.yOffset;

		this.board = new Array(this.actualHeight)
			.fill(false)
			.map(() => new Array(this.width).fill(false));

		for (let x = 0; x < this.width; x++) {
			this.setBlock(new Vector2(x, this.height - 1), true);
		}
	}

	public getBoard(): boolean[][] {
		return this.board.filter((_, i) => i > this.yOffset);
	}
	public move(/* tetromino: Vector2[], dir: Dir */): boolean {
		throw new Error("Not implemented");
		// // Move the tetromino in the desired direction. Then check if
		// // we're out of bounds or colliding with anything. If yes, simply move
		// // the tetromino back.
		// tetromino.move(dir);
		// if (this.isOutOfBounds(tetromino) || this.isColliding(tetromino)) {
		// 	tetromino.move(Dir.opposite(dir));
		// 	// Check if we hit bottom, if yes, return that information
		// 	if (dir === Dir.DOWN) return false;
		// }
		// return true;
	}
	public projectToBottom(/* tetromino: Vector2[] */): void {
		throw new Error("Not implemented");
		// for (let i = 0; i < this.actualHeight; i++) {
		// 	if (!this.move(tetromino, Dir.DOWN)) return;
		// }
		// console.warn(
		// 	"could not project tetromino to bottom, exceeded board height"
		// );
	}
	public removeFullLines(): number {
		throw new Error("Not implemented");
		// let fullLines = 0;
		// for (let y = this.actualHeight - 1; y >= 0; y--) {
		// 	let lineFull = true;
		// 	for (const block of this.board[y]) {
		// 		if (block === null) lineFull = false;
		// 	}

		// 	if (lineFull) {
		// 		fullLines++;
		// 		for (const block of this.board[y]) {
		// 			if (block) {
		// 				// Remove the block from the board and notify it, that it
		// 				// has been removed
		// 				this.clearBlock(block.getPosition());
		// 				block.onDelete();
		// 			}
		// 		}

		// 		for (let something = y - 1; something >= 0; something--) {
		// 			for (const block of this.board[something]) {
		// 				if (block) {
		// 					const position = block.getPosition();
		// 					this.clearBlock(position);
		// 					position.add(new Point2D(0, 1));
		// 					this.addBlock(block);
		// 				}
		// 			}
		// 		}

		// 		y++;
		// 	}
		// }
		// return fullLines;
	}
	public rotate(/* tetromino: Tetromino */): void {
		throw new Error("Not implemented");
		// // Rotate the tetromino. Then check if it's colliding or out of bounds.
		// // If yes, simply rotate it back
		// tetromino.rotate();
		// if (this.isOutOfBounds(tetromino) || this.isColliding(tetromino)) {
		// 	tetromino.rotate(-1);
		// }
	}

	private setBlock(pos: Vector2, block: boolean) {
		const { x } = pos;
		let { y } = pos;

		y += this.yOffset;

		this.board[y][x] = block;
	}

	/**
	 * Clears a block from the game board. This method also does
	 * offset removal and checks if the position is actually valid.
	 * @param position position where to clear the block
	 */
	private clearBlock(/* position: Point2D */): void {
		throw new Error("Not implemented");
		// const realPosition = position.clone();
		// if (!this.isPositionValid(position)) {
		// 	console.warn(
		// 		`Could not clear block at invalid position ${position.toString()}`
		// 	);
		// } else {
		// 	this.removeOffset(realPosition);
		// 	this.board[realPosition.getY()][realPosition.getX()] = null;
		// }
	}
	/**
	 * Get a block form the game game board. This method also does
	 * offset removal and checks if the position is actually valid.
	 * @param position position of where to get the block
	 */
	private getBlock(/* position: Point2D */): null {
		throw new Error("Not implemented");
		// if (!this.isPositionValid(position)) {
		// 	console.warn(
		// 		`Could not get block at invalid position ${position.toString()}`
		// 	);
		// 	return null;
		// }
		// const actualPosition = this.removeOffset(position.clone());
		// return this.board[actualPosition.getY()][actualPosition.getX()];
	}
	/**
	 * Checks if a tetromino is colliding with blocks in the game board
	 * @param tetromino tetromino which should be checked
	 */
	private isColliding(/* tetromino: Tetromino */): boolean {
		throw new Error("Not implemented");
		// for (const block of tetromino.getBlocks()) {
		// 	if (this.getBlock(block.getPosition()) !== null) return true;
		// }
		// return false;
	}
	/**
	 * Checks if a tetromino is out of bounds
	 * @param tetromino tetromino which should be checked
	 */
	private isOutOfBounds(/* tetromino: Tetromino */): boolean {
		throw new Error("Not implemented");
		// for (const block of tetromino.getBlocks()) {
		// 	if (!this.isPositionValid(block.getPosition())) return true;
		// }
		// return false;
	}
	/**
	 * Validates a 2d position (checks if it is inside the game board)
	 * @param position position which should be validated
	 */
	private isPositionValid(/* position: Point2D */): boolean {
		throw new Error("Not implemented");
		// const realPosition = this.removeOffset(position.clone());
		// const X = realPosition.getX();
		// const Y = realPosition.getY();

		// return X >= 0 && X < this.width && Y >= 0 && Y < this.actualHeight;
	}
	/**
	 * Removed a **new** point without the game board offset
	 * @param point starting point
	 */
	private removeOffset(/* point: Point2D */): undefined {
		throw new Error("Not implemented");
		// return point.add(new Point2D(0, this.yOffset));
	}
}
