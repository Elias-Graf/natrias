import { Dir } from '../globals/direction';
import { Tetromino } from './tetromino';
import { Point2D } from '../globals';

/*
 TODO: Tetromino -> getRotation()
 TODO: Rotation if on the bottom, still rotate if not added to rows
 TODO: Also on sides
*/

const gameBoard = document.createElement('div');

const t = new (class implements Tetromino {
	private origin: Point2D;
	private blocks: Point2D[];

	public constructor() {
		this.origin = new Point2D(5, 5);
		this.blocks = [
			new Point2D(2, 0),
			new Point2D(1, 0),
			new Point2D(0, 0),
			new Point2D(-1, 0),
		];
	}

	public getOrigin(): Point2D {
		return new Point2D(this.origin.getX(), this.origin.getY());
	}

	public setOrigin(newOrigin: Point2D): void {
		this.origin = newOrigin;
	}

	public getBlocks(): Point2D[] {
		const arr: Point2D[] = [];
		this.blocks.forEach((block) => {
			arr.push(new Point2D(block.getX(), block.getY()));
		});
		return arr;
	}

	public setBlocks(newBlocks: Point2D[]): void {
		this.blocks = newBlocks;
	}
})();

/**
 * Class with the physics of the game
 */
export class PhysicsEngine {
	private board: boolean[][] = [];
	private static readonly WIDTH = 10;
	private static readonly HEIGHT = 20;

	/**
	 * Constructor of the PhysicsEngine class
	 */
	public constructor() {
		document.addEventListener('keyup', (event) => {
			console.log(event.key);
			switch (event.key) {
				case 'ArrowUp':
					this.onRotate(t);
					break;
				case 'ArrowRight':
					this.onMove(t, Dir.RIGHT);
					break;
				case 'ArrowDown':
					this.onMove(t, Dir.DOWN);
					break;
				case 'ArrowLeft':
					this.onMove(t, Dir.LEFT);
					break;
			}
		});

		this.createBoard();
		this.setTetromino(t, true);
	}

	/**
	 * Method that creates GameBoard
	 */
	private createBoard(): void {
		for (let i = 0; i < 20; i++) this.board.push([]);
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				if (x === 9 || y === 17) this.board[y][x] = true;
				else this.board[y][x] = false;
			}
		}
		document.body.appendChild(gameBoard);
		this.drawDebugInterface();
	}

	/**
	 * Method that creates Tetromino
	 */
	private setTetromino(tetromino: Tetromino, isActive: boolean): void {
		const originX = tetromino.getOrigin().getX();
		const originY = tetromino.getOrigin().getY();

		tetromino.getBlocks().forEach((block) => {
			const blockX = originX + block.getX();
			const blockY = originY + block.getY();
			this.board[blockY][blockX] = isActive;
		});
		this.drawDebugInterface();
	}

	/**
	 * Method that fills the board according to boolean
	 */
	private drawDebugInterface(): void {
		while (gameBoard.firstChild) gameBoard.removeChild(gameBoard.firstChild);
		for (let y = 0; y < PhysicsEngine.HEIGHT; y++) {
			for (let x = 0; x < PhysicsEngine.WIDTH; x++) {
				if (this.board[y][x]) gameBoard.append('█');
				else gameBoard.append('░');
			}
			gameBoard.append(document.createElement('br'));
		}
	}

	/**
	 * Method that lets tetromino turn
	 */
	private onRotate(tetromino: Tetromino): void {
		const newBlocks = tetromino.getBlocks();
		newBlocks.forEach((block) => {
			const blockX = block.getX();
			const blockY = block.getY();

			if (blockY != 0) block.setX(blockY * -1);
			else block.setX(blockY);
			block.setY(blockX);
		});
		if (
			!this.outOfBounds(
				tetromino.getOrigin().getX(),
				tetromino.getOrigin().getY(),
				newBlocks
			) &&
			!this.checkCollision(tetromino, tetromino.getOrigin(), newBlocks)
		) {
			// Clear old tetromino
			this.setTetromino(tetromino, false);
			// Sets new origin
			tetromino.setBlocks(newBlocks);
			// Update tetromino
			this.setTetromino(tetromino, true);
		}
	}

	/**
	 * Method that lets tetromino move
	 */
	public onMove(tetromino: Tetromino, dir: Dir): void {
		const newOrigin = tetromino.getOrigin();
		if (dir === Dir.RIGHT) newOrigin.setX(tetromino.getOrigin().getX() + 1);
		else if (dir === Dir.DOWN) newOrigin.setY(tetromino.getOrigin().getY() + 1);
		else if (dir === Dir.LEFT) newOrigin.setX(tetromino.getOrigin().getX() - 1);
		else console.warn(`Unknown direction ${dir}`);

		if (
			!this.outOfBounds(
				newOrigin.getX(),
				newOrigin.getY(),
				tetromino.getBlocks()
			) &&
			!this.checkCollision(tetromino, newOrigin, tetromino.getBlocks())
		) {
			// Clear old tetromino
			this.setTetromino(tetromino, false);
			// Sets new origin
			tetromino.setOrigin(newOrigin);
			// Update tetromino
			this.setTetromino(tetromino, true);
		}
	}

	/**
	 * Method that checks collision of tetromino with other blocks when moving
	 */
	public checkCollision(
		tetromino: Tetromino,
		origin: Point2D,
		blocks: Point2D[]
	): boolean {
		const copyBoard = this.board;
		for (const block of tetromino.getBlocks()) {
			copyBoard[tetromino.getOrigin().getY() + block.getY()][
				tetromino.getOrigin().getX() + block.getX()
			] = false;
		}
		for (const block of blocks) {
			if (
				copyBoard[origin.getY() + block.getY()][
					origin.getX() + block.getX()
				] === true
			) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Method that checks if coordinates are out of bounds
	 */
	private outOfBounds(x: number, y: number, blocks: Point2D[]): boolean {
		for (const block of blocks) {
			if (
				x + block.getX() > PhysicsEngine.WIDTH - 1 ||
				x + block.getX() < 0 ||
				y + block.getY() > PhysicsEngine.HEIGHT - 1 ||
				y + block.getY() < 0
			) {
				return true;
			}
		}
		return false;
	}
}
