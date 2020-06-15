import { Dir } from '../globals/direction';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';
import { PhysicsInterface } from './interface';

/**
 * TODO: Move piece into the board if rotated outside it. Currently we just don't allow
 *  rotating.
 */

/**
 * Class with the physics of the game
 */
export class PhysicsEngine implements PhysicsInterface {
	private board: boolean[][] = [];
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
			for (let x = 0; x < 10; x++) {
				if (x === 9) this.board[y][x] = true;
				else this.board[y][x] = false;
			}
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
	private setTetromino(tetromino: Tetromino, isActive: boolean): void {
		tetromino.calculateAbsoluteBlocks().forEach((block) => {
			this.board[block.getY()][block.getX()] = isActive;
		});
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
	 * Method that lets tetromino turn
	 */
	public rotate(tetromino: Tetromino): void {
		const newTetromino = tetromino.clone();
		newTetromino.setRotation(newTetromino.calculateNextRotation());

		if (
			!this.outOfBounds(newTetromino) &&
			!this.isColliding(tetromino, newTetromino)
		) {
			// Clear old tetromino
			this.setTetromino(tetromino, false);
			// Sets new rotation
			tetromino.setRotation(newTetromino.getRotation());
			// Update tetromino
			this.setTetromino(tetromino, true);
		}
	}

	private logBoard(board: boolean[][]): void {
		let str = '';
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				str += board[y][x] ? '■' : '□';
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

		if (!this.outOfBounds(newTetromino)) {
			if (!this.isColliding(tetromino, newTetromino)) {
				// Clear old tetromino
				this.setTetromino(tetromino, false);
				// Sets new origin
				tetromino.getOrigin().assign(newOrigin);
				// Update tetromino
				this.setTetromino(tetromino, true);
			} else if (dir === Dir.DOWN) {
				return { hitBottom: true };
			}
		}
		return { hitBottom: false };
	}

	/**
	 * Method that checks collision of tetromino with other blocks when moving
	 */
	private isColliding(
		oldTetromino: Tetromino,
		newTetromino: Tetromino
	): boolean {
		for (const block of newTetromino.calculateAbsoluteBlocks()) {
			if (
				this.board[block.getY()][block.getX()] &&
				oldTetromino
					.calculateAbsoluteBlocks()
					.find(
						(b) => block.getY() === b.getY() && block.getX() === b.getX()
					) === undefined
			) {
				return true;
			}
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
}
