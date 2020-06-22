import { Dir } from '../globals';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';
import { Block } from './block';

export interface PhysicsInterface {
	/**
	 * Check if a tetromino can move in a particular direction
	 * @param tetromino tetromino that should be checked
	 * @param dir direction in which the tetromino should be moved
	 */
	move(tetromino: Tetromino, dir: Dir): MoveResponse;
	/**
	 * Remove full lines in the board and return the number removed
	 */
	removeFullLines(): number;
	/**
	 * Check if a tetromino can be rotated
	 * @param tetromino tetromino that should be checked
	 */
	rotate(tetromino: Tetromino): void;
	/**
	 * Add a set of blocks to the board of the physics engine
	 * @param blocks blocks that should be added
	 */
	setBlocks(blocks: Block[]): void;
}
