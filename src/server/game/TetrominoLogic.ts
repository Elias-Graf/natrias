import Vector2 from "newton/2d/Vector2";
import TEMPLATES from "./templates";
import Tetromino from "./Tetromino";
import TetrominoType from "./TetrominoType";

export default abstract class TetrominoLogic implements Tetromino {
	public pos = new Vector2(0, 0);

	protected _rotation = 0;

	public constructor(public readonly type: TetrominoType) {}

	public abstract rotate(): void;

	public abstract get clone(): TetrominoLogic;

	public get rotation(): number {
		return this._rotation;
	}
	public set rotation(_: number) {
		throw new Error(
			`Do not set rotation on ${TetrominoLogic.name}. Use the "rotate" method`
		);
	}

	public get blocks(): Vector2[] {
		const { rotation, type, pos } = this;

		return TEMPLATES[type].map((block) => {
			const newBlock = block.clone;

			switch (rotation) {
				case 0:
					break;
				case 1:
					newBlock.flip();
					newBlock.x *= -1;
					break;
				case 2:
					newBlock.scale(-1);
					break;
				case 3:
					newBlock.flip();
					newBlock.y *= -1;
					break;
				default:
					console.error(`Rotation not in limit: ${rotation}`);
					break;
			}

			return newBlock.add(pos);
		});
	}
}
