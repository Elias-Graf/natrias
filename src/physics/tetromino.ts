import { Point2D } from '../globals';
import { TemplateType } from '../tetrominoes/type';

/**
 * TODO: Replace calculateRotation function with "rotate" function.
 * As we're only ever rotating a single step, and only in one direction (not the band).
 */
export interface Tetromino {
	getOrigin(): Point2D;
	setOrigin(newOrigin: Point2D): void;
	getBlocks(): Point2D[];
	setBlocks(newBlocks: Point2D[]): void;
	getType(): TemplateType;
	rotate(): void;
	getRotation(): number;
	setRotation(newRotation: number): void;
	calculateAbsoluteBlocks(): Point2D[];
	clone(): Tetromino;
}
