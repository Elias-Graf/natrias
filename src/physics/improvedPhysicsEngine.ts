import { Dir } from '../globals/direction';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';
import { PhysicsInterface } from './interface';
import { Block } from './block';
import { Point2D } from '../globals';

/**
 * Class with the physics of the game
 */
export class ImprovedPhysicsEngine implements PhysicsInterface {
	/**
	 * Actual height is the board height, plus the yOffset which is offscreen
	 */
	private actualHeight: number;
	private board: (Block | null)[][];
	private height: number;
	private width: number;
	private yOffset: number;

	public constructor(width: number, height: number, yOffset: number) {
		this.width = width;
		this.height = height;
		this.yOffset = yOffset;

		this.actualHeight = height + yOffset;

		this.board = new Array(this.actualHeight)
			.fill(null)
			.map(() => new Array(width).fill(null));
	}

	public addBlock(block: Block): void {
		const position = block.getPosition().clone();
		if (!this.isPositionValid(position)) {
			console.warn(
				`Could not add block at invalid position ${position.toString()}`
			);
		} else {
			this.removeOffset(position);
			this.board[position.getY()][position.getX()] = block;
		}
	}
	public addBlocks(blocks: Block[]): void {
		blocks.forEach((_) => this.addBlock(_));
	}
	public clearBlock(position: Point2D): void {
		const realPosition = position.clone();
		if (!this.isPositionValid(position)) {
			console.warn(
				`Could not clear block at invalid position ${position.toString()}`
			);
		} else {
			this.removeOffset(realPosition);
			this.board[realPosition.getY()][realPosition.getX()] = null;
		}
	}
	public clearBlocks(positions: Point2D[]): void {
		positions.forEach((_) => this.clearBlock(_));
	}
	public getBlock(position: Point2D): Block | null {
		if (!this.isPositionValid(position)) {
			console.warn(
				`Could not get block at invalid position ${position.toString()}`
			);
			return null;
		}
		const actualPosition = this.removeOffset(position.clone());
		return this.board[actualPosition.getY()][actualPosition.getX()];
	}
	public move(tetromino: Tetromino, dir: Dir): MoveResponse {
		// Move the tetromino in the desired direction. Then check if
		// we're out of bounds or colliding with anything. If yes, simply move
		// the tetromino back.
		tetromino.move(dir);
		if (this.isOutOfBounds(tetromino) || this.isColliding(tetromino)) {
			tetromino.move(Dir.opposite(dir));
			// Check if we hit bottom and return it
			if (dir === Dir.DOWN) {
				return { hitBottom: true };
			}
		}
		return { hitBottom: false };
	}
	public removeFullLines(): number {
		let fullLines = 0;
		for (let y = this.actualHeight - 1; y >= 0; y--) {
			let lineFull = true;
			for (const block of this.board[y]) {
				if (block === null) lineFull = false;
			}

			if (lineFull) {
				fullLines++;
				for (const block of this.board[y]) {
					if (block) {
						// Remove the block from the board and notify it, that it
						// has been removed
						this.clearBlock(block.getPosition());
						block.onDelete();
					}
				}

				for (let something = y - 1; something >= 0; something--) {
					for (const block of this.board[something]) {
						if (block) {
							const position = block.getPosition();
							this.clearBlock(position);
							position.add(new Point2D(0, 1));
							this.addBlock(block);
						}
					}
				}

				y++;
			}
		}
		return fullLines;
	}
	public rotate(tetromino: Tetromino): void {
		// Rotate the tetromino. Then check if it's colliding or out of bounds.
		// If yes, simply rotate it back
		tetromino.rotate();
		if (this.isOutOfBounds(tetromino) || this.isColliding(tetromino)) {
			tetromino.rotate(-1);
		}
	}
	/**
	 * TODO: this should be removed (addBlocks is a much more sensible name
	 * for this function. Currently we still have other implementation of this interface
	 * so no renaming that [JUST YET!])
	 */
	public setBlocks(blocks: Block[]): void {
		console.warn('set blocks should not be called, use "addBlocks"');
		this.addBlocks(blocks);
	}
	/**
	 * Checks if a tetromino is colliding with blocks in the game board
	 * @param tetromino tetromino which should be checked
	 */
	private isColliding(tetromino: Tetromino): boolean {
		for (const block of tetromino.getBlocks()) {
			if (this.getBlock(block.getPosition()) !== null) return true;
		}
		return false;
	}
	/**
	 * Checks if a tetromino is out of bounds
	 * @param tetromino tetromino which should be checked
	 */
	private isOutOfBounds(tetromino: Tetromino): boolean {
		for (const block of tetromino.getBlocks()) {
			if (!this.isPositionValid(block.getPosition())) return true;
		}
		return false;
	}
	private isPositionValid(position: Point2D): boolean {
		const realPosition = this.removeOffset(position.clone());
		const X = realPosition.getX();
		const Y = realPosition.getY();

		return X >= 0 && X < this.width && Y >= 0 && Y < this.actualHeight;
	}
	private removeOffset(point: Point2D): Point2D {
		return point.add(new Point2D(0, this.yOffset));
	}
}
