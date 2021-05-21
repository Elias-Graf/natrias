import TetrominoLogic from "./TetrominoLogic";

export default class TwoRotationTetromino extends TetrominoLogic {
	public rotate(): void {
		this._rotation = (this._rotation + 1) % 2;
	}
	public get clone(): TwoRotationTetromino {
		const { type, pos, rotation } = this;
		const clone = new TwoRotationTetromino(type);
		clone.pos = pos.clone;
		clone._rotation = rotation;

		return clone;
	}
}
