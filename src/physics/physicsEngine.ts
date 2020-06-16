import { Dir } from '../globals/direction';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';
import { PhysicsInterface } from './interface';
import { Block } from './block';

/**
 * TODO: Move piece into the board if rotated outside it. Currently we just don't allow
 *  rotating.
 */

/**
 * Class with the physics of the game
 */
export class PhysicsEngine implements PhysicsInterface {
	private board: (Block | null)[][] = [];
	private static readonly WIDTH = 10;
	private static readonly HEIGHT = 20;
	private debugBoard = document.createElement('div');
	/**
	 * Constructor of the PhysicsEngine class
	 */
	public constructor() {
		// Initialize board
		for (let y = 0; y < 20; y++) {
			this.board.push([]);
			for (let x = 0; x < 10; x++) this.board[y][x] = null;
		}
	}

	/**
	 * Method that creates GameBoard
	 */
	private showDebugInterface(): void {
		document.body.appendChild(this.debugBoard);
		this.drawDebugInterface();
	}

	/**
	 * Method that creates Tetromino
	 */
	// private setTetromino(tetromino: Tetromino): void {
	// 	tetromino.calculateAbsoluteBlocks().forEach((block) => {
	// 		this.board[block.getY()][block.getX()] = isActive;
	// 	});
	// 	this.drawDebugInterface();
	// }

	/**
	 * Method that fills the board according to boolean
	 */
	private drawDebugInterface(): void {
		while (this.debugBoard.firstChild)
			this.debugBoard.removeChild(this.debugBoard.firstChild);
		for (let y = 0; y < PhysicsEngine.HEIGHT; y++) {
			for (let x = 0; x < PhysicsEngine.WIDTH; x++) {
				if (this.board[y][x]) this.debugBoard.innerHTML += '&#9632';
				else this.debugBoard.innerHTML += '&#9633';
			}
			this.debugBoard.append(document.createElement('br'));
		}
	}

	/**
	 * Method that rotates the tetromino
	 */
	public rotate(tetromino: Tetromino): void {
		const newTetromino = tetromino.clone();
		newTetromino.setRotation(newTetromino.calculateNextRotation());

		if (!this.outOfBounds(newTetromino) && !this.isColliding(newTetromino)) {
			// Clear old tetromino
			// this.setTetromino(tetromino, false);
			// Sets new rotation
			tetromino.setRotation(newTetromino.getRotation());
			// Update tetromino
			// this.setTetromino(tetromino, true);
		}
	}

	private logBoard(board: (Block | null)[][]): void {
		let str = '';
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				str += board[y][x] !== null ? '■' : '□';
			}
			str += '\n';
		}
		console.log(str);
	}

	/**
	 * Method that lets tetromino move
	 */
	public move(tetromino: Tetromino, dir: Dir): MoveResponse {
		const newTetromino = tetromino.clone();
		const newOrigin = newTetromino.getOrigin();

		if (dir === Dir.RIGHT) newOrigin.setX(newOrigin.getX() + 1);
		else if (dir === Dir.DOWN) newOrigin.setY(newOrigin.getY() + 1);
		else if (dir === Dir.LEFT) newOrigin.setX(newOrigin.getX() - 1);
		else console.warn(`Unknown direction ${dir}`);

		if (!this.outOfBounds(newTetromino) && !this.isColliding(newTetromino)) {
			tetromino.getOrigin().assign(newOrigin);
		} else if (dir === Dir.DOWN) {
			tetromino.dissolve().map((block) => {
				const p = block.getPosition();
				this.board[p.getY()][p.getX()] = block;
			});

			// // TODO: do cleanup stuff yay
			// let linesToRemove = 0;
			// for (let y = PhysicsEngine.HEIGHT - 1; y >= 0; y--) {
			// 	let lineFull = true;
			// 	for (let x = 0; x < PhysicsEngine.WIDTH - 1; x++) {
			// 		if (this.getBlock(x, y) === null) lineFull = false;
			// 	}
			// 	if (lineFull) {
			// 		linesToRemove++;

			// 		const line = this.board[y];

			// 		for (let i = 0; i < line.length; i++) {
			// 			const block = line[i];
			// 			if (block !== null) {
			// 				block.onDelete();
			// 				line[i] = null;
			// 			}
			// 		}
			// 	}
			// }
			return { hitBottom: true };
		}
		return { hitBottom: false };
	}

	/**
	 * Method that checks collision of tetromino with other blocks when moving
	 */
	private isColliding(newTetromino: Tetromino): boolean {
		this.logBoard(this.board);
		for (const position of newTetromino.calculateAbsoluteBlocks()) {
			if (this.getBlock(position.getX(), position.getY()) !== null) return true;
		}
		return false;
	}

	/**
	 * Method that checks if coordinates are out of bounds
	 */
	private outOfBounds(tetromino: Tetromino): boolean {
		for (const block of tetromino.calculateAbsoluteBlocks()) {
			if (
				block.getX() > PhysicsEngine.WIDTH - 1 ||
				block.getX() < 0 ||
				block.getY() > PhysicsEngine.HEIGHT - 1 ||
				block.getY() < 0
			) {
				return true;
			}
		}
		return false;
	}

	private setBlock(block: Block): void {
		const position = block.getPosition();
		this.board[position.getY()][position.getX()] = block;
	}

	private getBlock(x: number, y: number): Block | null {
		if (!this.isInBound(x, y)) {
			console.warn(`Position (${x}, ${y}) is out of bounds`);
		} else return this.board[y][x];
		return null;
	}

	private isInBound(x: number, y: number): boolean {
		return (
			x >= 0 && x < PhysicsEngine.WIDTH && y >= 0 && y < PhysicsEngine.HEIGHT
		);
	}
}
