import { Dir } from '../globals';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';
import { Block } from './block';

export interface PhysicsInterface {
	/**
	 * Add multiple block the the physics board
	 * @param blocks blocks which should be added
	 */
	addBlocks(blocks: Block[]): void;
	/**
	 * Check if a tetromino can move in a particular direction
	 * @param tetromino tetromino that should be checked
	 * @param dir direction in which the tetromino should be moved
	 */
	move(tetromino: Tetromino, dir: Dir): MoveResponse;
	/**
	 * Project a tetromino to the bottom of the board
	 * @param tetromino tetromino which should be projected to the bottom
	 */
	projectToBottom(tetromino: Tetromino): void;
	/**
	 * Check if a tetromino can be rotated
	 * @param tetromino tetromino that should be checked
	 */
	rotate(tetromino: Tetromino): void;
}
