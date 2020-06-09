import { Dir } from '../globals/direction';
import { TetrominoInterface } from './tetromino';
import { Point2D } from '../globals';
import { MoveResponse } from './moveResponse';

/*
 TODO: Tetromino -> getRotation() or getAbsolute() and implement calculation
 TODO: Rotation if on the bottom, still rotate if not added to rows
 TODO: Also on sides
*/

class Tetromino implements TetrominoInterface {
	private origin: Point2D;
	private blocks: Point2D[];
	private rotation = 0;

	public constructor(origin: Point2D, blocks: Point2D[]) {
		this.origin = origin;
		this.blocks = blocks;
	}

	public static clone(tetromino: Tetromino): Tetromino {
		return new Tetromino(
			tetromino.getOrigin().clone(),
			tetromino.getBlocks().map(Point2D.clone)
		);
	}

	public clone(): Tetromino {
		return Tetromino.clone(this);
	}

	public getOrigin(): Point2D {
		return this.origin;
	}

	public setOrigin(newOrigin: Point2D): void {
		this.origin = newOrigin;
	}

	public getBlocks(): Point2D[] {
		const newBlocks: Point2D[] = [];
		this.blocks.forEach((block) => {
			newBlocks.push(new Point2D(block.getX(), block.getY()));
		});
		return newBlocks;
	}

	public setBlocks(newBlocks: Point2D[]): void {
		this.blocks = newBlocks;
	}

	public getRotation(): number {
		return this.rotation;
	}

	public setRotation(newRotation: number): void {
		this.rotation = newRotation;
	}

	public calculateNextRotation(): number {
		let nextRotation = this.rotation;
		if (++nextRotation === 4) {
			nextRotation = 0;
		}
		return nextRotation;
	}

	public calculateAbsoluteBlocks(): Point2D[] {
		const originX = this.origin.getX();
		const originY = this.origin.getY();

		return this.blocks.map((block) => {
			const blockX = block.getX();
			const blockY = block.getY();
			const newBlock = new Point2D(blockX, blockY);

			switch (this.getRotation()) {
				case 0:
					break;
				case 1:
					newBlock.setX(blockY * -1);
					newBlock.setY(blockX);
					break;
				case 2:
					newBlock.setX(blockX * -1);
					newBlock.setY(blockY * -1);
					break;
				case 3:
					newBlock.setX(blockY);
					newBlock.setY(blockX * -1);
					break;
				default:
					console.error(`Rotation not in limit: ${this.getRotation()}`);
					break;
			}
			newBlock.setX(newBlock.getX() + originX);
			newBlock.setY(newBlock.getY() + originY);
			return newBlock;
		});
	}
}

const t = new Tetromino(new Point2D(2, 2), [
	new Point2D(1, -1),
	new Point2D(0, -1),
	new Point2D(0, 0),
	new Point2D(-1, 0),
]);

/**
 * Class with the physics of the game
 */
export class PhysicsEngine {
	private board: boolean[][] = [];
	private static readonly WIDTH = 10;
	private static readonly HEIGHT = 20;
	private debugBoard = document.createElement('div');
	/**
	 * Constructor of the PhysicsEngine class
	 */
	public constructor() {
		document.addEventListener('keyup', (event) => {
			switch (event.key) {
				case 'ArrowUp':
					this.rotate(t);
					break;
				case 'ArrowRight':
					this.move(t, Dir.RIGHT);
					break;
				case 'ArrowDown':
					this.move(t, Dir.DOWN);
					break;
				case 'ArrowLeft':
					this.move(t, Dir.LEFT);
					break;
			}
		});

		for (let y = 0; y < 20; y++) {
			this.board.push([]);
			for (let x = 0; x < 10; x++) {
				if (x === 9) this.board[y][x] = true;
				else this.board[y][x] = false;
			}
		}

		this.showDebugInterface();
		this.setTetromino(t, true);
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
	private setTetromino(tetromino: TetrominoInterface, isActive: boolean): void {
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
	private rotate(tetromino: TetrominoInterface): void {
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
	public move(tetromino: TetrominoInterface, dir: Dir): MoveResponse {
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
		oldTetromino: TetrominoInterface,
		newTetromino: TetrominoInterface
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
	private outOfBounds(tetromino: TetrominoInterface): boolean {
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
