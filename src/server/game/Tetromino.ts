import Vector2 from "newton/2d/Vector2";
import ReadonlyVector2 from "newton/2d/ReadonlyVector2";
import TetrominoType from "./TetrominoType";

export default interface Tetromino {
	pos: Vector2;
	rotation: number;
	readonly template: ReadonlyVector2[];
	readonly type: TetrominoType;
}
