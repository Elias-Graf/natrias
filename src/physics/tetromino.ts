import { Point2D } from '../globals';

export interface TetrominoInterface {
	getOrigin(): Point2D;
	setOrigin(newOrigin: Point2D): void;
	getBlocks(): Point2D[];
	setBlocks(newBlocks: Point2D[]): void;
	getRotation(): number;
	setRotation(newRotation: number): void;
	calculateNextRotation(): number;
	calculateAbsoluteBlocks(): Point2D[];
	clone(): TetrominoInterface;
}
