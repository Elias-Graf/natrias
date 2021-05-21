import TetrominoLogic from "./TetrominoLogic";

export default class FourRotationTetromino extends TetrominoLogic {
	public rotate(): void {
		this._rotation = (this._rotation + 1) % 4;
	}

	public get clone(): FourRotationTetromino {
		const clone = new FourRotationTetromino(this.type);
		clone.pos = this.pos.clone;
		clone._rotation = this.rotation;

		return clone;
	}
}
