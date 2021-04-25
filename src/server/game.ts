import Vector2 from "newton/2d/Vector2";
import ReadonlyVector2 from "newton/2d/ReadonlyVector2";
import { EventEmitter } from "events";
import Dir from "shared/Dir";
import { random } from "newton/utils/random";

const TEMPLATE_I: ReadonlyVector2[] = [
	new Vector2(0, 2),
	new Vector2(0, 1),
	new Vector2(0, 0),
	new Vector2(0, -1),
];
const TEMPLATE_L: ReadonlyVector2[] = [
	new Vector2(0, -2),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TEMPLATE_O: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(1, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TEMPLATE_S: ReadonlyVector2[] = [
	new Vector2(1, -1),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(-1, 0),
];
const TEMPLATE_T: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(-1, 0),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TEMPLATE_Z: ReadonlyVector2[] = [
	new Vector2(-1, -1),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TEMPLATES = [
	TEMPLATE_I,
	TEMPLATE_L,
	TEMPLATE_O,
	TEMPLATE_S,
	TEMPLATE_T,
	TEMPLATE_Z,
];

enum TetrominoType {
	I,
	L,
	O,
	S,
	T,
	Z,
}
interface Tetromino {
	pos: Vector2;
	rotation: number;
	template: ReadonlyVector2[];
	type: TetrominoType;
}

export default class Game extends EventEmitter {
	/**
	 * Actual height is the board height, plus the yOffset which is offscreen
	 */
	private actualHeight: number;
	private board: boolean[][];
	private height: number;
	private width: number;
	private yOffset: number;
	private activeTetromino: Tetromino;

	public constructor() {
		super();

		this.width = 10;
		this.height = 20;
		this.yOffset = 5;
		this.actualHeight = this.height + this.yOffset;

		this.board = new Array(this.actualHeight)
			.fill(false)
			.map(() => new Array(this.width).fill(false));

		this.activeTetromino = this.createRandomTetromino();

		setInterval(() => {
			this.moveActiveTetromino(Dir.Down);
			this.emit("change");
		}, 500);
	}

	public getBoard(): boolean[][] {
		return this.board.filter((_, i) => i > this.yOffset);
	}
	public addListener(type: "change", cb: () => void): this {
		return super.addListener(type, cb);
	}
	public removeListener(type: "change", cb: () => void): this {
		return super.addListener(type, cb);
	}

	public emit(type: "change"): boolean {
		return super.emit(type);
	}

	private cloneTetromino(t: Tetromino): Tetromino {
		return {
			type: t.type,
			rotation: t.rotation,
			pos: t.pos.clone,
			template: t.template,
		};
	}
	public moveActiveTetromino(direction: Dir): void {
		const newActiveTetromino = this.cloneTetromino(this.activeTetromino);

		switch (direction) {
			case Dir.Down:
				newActiveTetromino.pos.y += 1;
				break;
			case Dir.Left:
				newActiveTetromino.pos.x -= 1;
				break;
			case Dir.Right:
				newActiveTetromino.pos.x += 1;
				break;
			case Dir.Up:
				console.warn("Cannot move active tetromino up [NOOP]");
				return;
		}

		if (
			this.tetrominoIsInBounds(newActiveTetromino) &&
			this.isTetrominoClearOfOthers(newActiveTetromino)
		) {
			this.setTetromino(this.activeTetromino, false);

			this.activeTetromino = newActiveTetromino;

			this.setTetromino(this.activeTetromino, true);
		} else if (
			this.tetrominoReachedBottom(newActiveTetromino) ||
			this.tetrominoReachTopOfOther()
		) {
			this.removeFullLines();
			this.spawnNextTetromino();
		}
	}
	private tetrominoIsInBounds(t: Tetromino): boolean {
		const { template, pos } = t;

		for (const relative of template) {
			const absolute = relative.clone.add(pos);
			const { x } = absolute;
			let { y } = absolute;

			y += this.yOffset;

			const isInBounds =
				x >= 0 && x < this.width && y >= 0 && y < this.actualHeight;

			if (!isInBounds) return false;
		}

		return true;
	}
	private setTetromino(t: Tetromino, val: boolean) {
		const { template, pos } = t;

		for (const block of template) {
			this.setPosition(block.clone.add(pos), val);
		}
	}
	public rotateActiveTetromino(amount = 1): void {
		const newActiveTetromino = this.cloneTetromino(this.activeTetromino);

		newActiveTetromino.rotation += amount;
		// We don't want to rotate the O shape
		if (newActiveTetromino.type === TetrominoType.O) return;

		switch (newActiveTetromino.type) {
			// Some shapes only need two rotations
			case TetrominoType.I:
			case TetrominoType.S:
			case TetrominoType.Z:
				if (newActiveTetromino.rotation > 1) newActiveTetromino.rotation = 0;
				if (newActiveTetromino.rotation < 0) newActiveTetromino.rotation = 1;
				break;
			default:
				if (newActiveTetromino.rotation > 3) newActiveTetromino.rotation = 0;
				if (newActiveTetromino.rotation < 0) newActiveTetromino.rotation = 3;
		}
		newActiveTetromino.template = newActiveTetromino.template.map((block) => {
			const newBlock = block.clone;

			switch (newActiveTetromino.rotation) {
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
					console.error(
						`Rotation not in limit: ${newActiveTetromino.rotation}`
					);
					break;
			}

			return newBlock;
		});

		if (
			this.isTetrominoClearOfOthers(newActiveTetromino) &&
			this.tetrominoIsInBounds(newActiveTetromino)
		) {
			this.setTetromino(this.activeTetromino, false);

			this.activeTetromino = newActiveTetromino;

			this.setTetromino(this.activeTetromino, true);
		}
	}
	private createRandomTetromino(): Tetromino {
		const type = Math.floor(random(0, TEMPLATES.length - 1));
		return {
			type,
			rotation: 0,
			pos: new Vector2(5, 5),
			template: TEMPLATES[type],
		};
	}
	private setPosition(pos: ReadonlyVector2, block: boolean) {
		const { x } = pos;
		let { y } = pos;

		y += this.yOffset;

		try {
			this.board[y][x] = block;
		} catch (e) {
			throw new Error(`Failed to set position ${pos} ${e}`);
		}
	}
	private tetrominoReachedBottom(t: Tetromino) {
		return t.pos.y + this.yOffset >= this.actualHeight;
	}
	private tetrominoReachTopOfOther(): boolean {
		for (const relative of this.activeTetromino.template) {
			const absolute = relative.clone.add(this.activeTetromino.pos);
			const { x } = absolute;
			const y = absolute.y + this.yOffset + 1;

			let isOld = false;
			for (const old of this.activeTetromino.template) {
				const absolute2 = old.clone.add(this.activeTetromino.pos);
				const { x: x2 } = absolute2;
				const y2 = absolute2.y + this.yOffset;

				if (x === x2 && y === y2) {
					isOld = true;
					break;
				}
			}

			if (!isOld && this.board[y][x]) return true;
		}
		return false;
	}
	private isTetrominoClearOfOthers(t: Tetromino): boolean {
		const { pos, template } = t;

		for (const relative of template) {
			const absolute1 = relative.clone.add(pos);
			const { x: x1 } = absolute1;
			const y1 = absolute1.y + this.yOffset;

			let isOld = false;
			for (const old of this.activeTetromino.template) {
				const absolute2 = old.clone.add(this.activeTetromino.pos);
				const { x: x2 } = absolute2;
				const y2 = absolute2.y + this.yOffset;

				if (x1 === x2 && y1 === y2) {
					isOld = true;
					break;
				}
			}

			if (!isOld && this.board[y1][x1]) return false;
		}

		return true;
	}
	private spawnNextTetromino() {
		this.activeTetromino = this.createRandomTetromino();
	}
	private removeFullLines() {
		let fullLines = 0;

		for (let y = this.height - 1; y >= 0; y--) {
			let isFull = true;

			for (let x = 0; x < this.width; x++) {
				if (!this.getPosition(new Vector2(x, y))) {
					isFull = false;
					break;
				}
			}

			if (isFull) fullLines++;
		}

		if (fullLines > 0) {
			for (let y = this.height - 1 - fullLines; y >= 0; y--) {
				console.log(this.height, -1, -fullLines);
				for (let x = 0; x < this.width; x++) {
					const o = new Vector2(x, y);
					const n = o.clone.setY(o.y + 2);

					this.setPosition(n, this.getPosition(o));
				}
			}
		}
	}

	private getPosition(pos: ReadonlyVector2): boolean {
		const { x } = pos;
		const y = pos.y + this.yOffset;

		try {
			return this.board[y][x];
		} catch (e) {
			throw new Error(`Failed to get position ${pos} ${e}`);
		}
	}
}
