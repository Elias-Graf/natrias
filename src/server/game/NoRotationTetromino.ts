import TetrominoLogic from "./TetrominoLogic";

export default class NoRotationTetromino extends TetrominoLogic {
	public rotate(): void {
		return;
	}

	public get clone(): NoRotationTetromino {
		const clone = new NoRotationTetromino(this.type);
		clone.pos = this.pos.clone;
		clone._rotation = this.rotation;

		return clone;
	}
}
