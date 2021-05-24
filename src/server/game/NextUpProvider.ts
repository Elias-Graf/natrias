import { random } from "newton/utils/random";
import TEMPLATES from "shared/templates";
import TetrominoType from "shared/TetrominoType";

export default class NextUpProvider {
	private _nextUpList: TetrominoType[] = [];

	public constructor(private initialSize: number) {
		this.generateInitialNextUpList(initialSize);
	}

	public get(index: number): TetrominoType {
		const { _nextUpList: nextUpList } = this;
		const { length } = nextUpList;

		if (index + this.initialSize + 1 > length) {
			if (index > length + 1) {
				throw new Error(
					`Should only ever ${NextUpProvider.prototype.get.name} ` +
						`"1" bigger than length. Length: ${length}, requested: ${index}`
				);
			}

			nextUpList.push(this.getRandomTetrominoType());
		}

		return nextUpList[index];
	}

	public get nextUpList(): TetrominoType[] {
		return [...this._nextUpList];
	}

	private generateInitialNextUpList(initialSize: number) {
		for (let i = 0; i < initialSize; i++) this.get(i);
	}
	private getRandomTetrominoType() {
		return Math.floor(
			random(0, Object.keys(TEMPLATES).length - 1)
		) as TetrominoType;
	}
}
