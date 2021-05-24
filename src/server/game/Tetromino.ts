import Vector2 from "newton/2d/Vector2";
import TetrominoType from "shared/TetrominoType";

export default interface Tetromino {
	pos: Vector2;
	rotation: number;
	readonly type: TetrominoType;
}
