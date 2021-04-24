import { Point2D } from '../globals';

export interface Block {
	/**
	 * Get the position of the block
	 */
	getPosition(): Point2D;
	/**
	 * Notify the block that it is being removed
	 */
	onDelete(): void;
	/**
	 * Set the position of the block
	 * @param position new position
	 */
	setPosition(position: Point2D): void;
}
