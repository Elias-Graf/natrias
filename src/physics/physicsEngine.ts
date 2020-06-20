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
		tetromino.rotate();

		if (this.outOfBounds(tetromino) || this.isColliding(tetromino)) {
			tetromino.rotate(-1);
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
		tetromino.move(dir);

		if (this.outOfBounds(tetromino) || this.isColliding(tetromino)) {
			tetromino.move(Dir.opposite(dir));
			if (dir === Dir.DOWN) {
				return {
					hitBottom: true,
				};
			}
		}

		return { hitBottom: false };
	}

	public removeFullLines(): number {
		let count = 0;
		let startingLine = -1;
		for (let y = PhysicsEngine.HEIGHT - 1; y >= 0; y--) {
			let lineFull = true;
			for (let x = 0; x < PhysicsEngine.WIDTH - 1; x++) {
				if (this.getBlock(x, y) === null) lineFull = false;
			}
			if (lineFull) {
				count++;
				if (y > startingLine) startingLine = y;
				const line = this.board[y];

				for (let i = 0; i < line.length; i++) {
					const block = line[i];
					if (block !== null) {
						block.onDelete();
						line[i] = null;
					}
				}
			}
		}

		if (startingLine !== -1) {
			for (let y = startingLine - 1; y >= 0; y--) {
				for (let x = 0; x < PhysicsEngine.WIDTH; x++) {
					const block = this.getBlock(x, y);
					if (block !== null) {
						const position = block.getPosition();
						position.setY(y + count);
						// Move the block
						this.setBlock(position.getX(), position.getY(), block);
						// Clear the old location
						this.setBlock(x, y, null);
					}
				}
			}
		}

		return count;
	}

	public setBlocks(blocks: Block[]): void {
		blocks.forEach((block) => {
			const position = block.getPosition();
			this.setBlock(position.getX(), position.getY(), block);
		});
	}

	/**
	 * Method that checks collision of tetromino with other blocks when moving
	 */
	private isColliding(newTetromino: Tetromino): boolean {
		for (const block of newTetromino.getBlocks()) {
			const position = block.getPosition();
			if (this.getBlock(position.getX(), position.getY()) !== null) return true;
		}
		return false;
	}

	/**
	 * Method that checks if coordinates are out of bounds
	 */
	private outOfBounds(tetromino: Tetromino): boolean {
		for (const block of tetromino.getBlocks()) {
			const position = block.getPosition();
			if (
				position.getX() > PhysicsEngine.WIDTH - 1 ||
				position.getX() < 0 ||
				position.getY() > PhysicsEngine.HEIGHT - 1 ||
				position.getY() < 0
			) {
				return true;
			}
		}
		return false;
	}

	private setBlock(x: number, y: number, block: Block | null): void {
		if (block) block.getPosition().setXY(x, y);
		this.board[y][x] = block;
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
