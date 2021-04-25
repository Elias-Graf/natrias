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
	readonly template: ReadonlyVector2[];
	readonly type: TetrominoType;
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
			template: t.template,
			pos: t.pos.clone,
		};
	}
	public moveActiveTetromino(direction: Dir): void {
		const next = this.cloneTetromino(this.activeTetromino);

		switch (direction) {
			case Dir.Down:
				next.pos.y += 1;
				break;
			case Dir.Left:
				next.pos.x -= 1;
				break;
			case Dir.Right:
				next.pos.x += 1;
				break;
			case Dir.Up:
				console.warn("Cannot move active tetromino up [NOOP]");
				return;
		}

		const nextTetrominoIsInBounds = this.tetrominoIsInBounds(next);
		const nextTetrominoIsClear =
			nextTetrominoIsInBounds &&
			this.isTetrominoClearOfOthers(next, this.activeTetromino);
		const nextTetrominoHitTopOfOther =
			direction === Dir.Down && !nextTetrominoIsClear;

		if (nextTetrominoIsInBounds && nextTetrominoIsClear) {
			this.setTetromino(this.activeTetromino, false);

			this.activeTetromino = next;

			this.setTetromino(this.activeTetromino, true);
		} else if (
			this.tetrominoReachedBottom(next) ||
			nextTetrominoHitTopOfOther
		) {
			this.removeFullLines();
			this.spawnNextTetromino();
		}
	}
	private tetrominoIsInBounds(t: Tetromino): boolean {
		const blocks = this.getAbsoluteBlocksFor(t);

		for (const { x, y } of blocks) {
			const isInBounds =
				x >= 0 && x < this.width && y > -this.yOffset && y < this.height;

			if (!isInBounds) return false;
		}

		return true;
	}
	private setTetromino(t: Tetromino, val: boolean) {
		const blocks = this.getAbsoluteBlocksFor(t);

		for (const block of blocks) {
			this.setPosition(block, val);
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

		if (
			this.isTetrominoClearOfOthers(newActiveTetromino, this.activeTetromino) &&
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
			template: TEMPLATES[type],
			pos: new Vector2(5, -2),
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
	private isTetrominoClearOfOthers(t: Tetromino, prev: Tetromino): boolean {
		const blocks = this.getAbsoluteBlocksFor(t);
		const prevBlocks = this.getAbsoluteBlocksFor(prev);

		for (const block of blocks) {
			// We don't need to check further of it was a previous block.
			if (prevBlocks.find((b) => b.equals(block))) continue;

			if (this.getPosition(block)) return false;
		}

		return true;
	}
	private spawnNextTetromino() {
		this.activeTetromino = this.createRandomTetromino();
	}
	private getAbsoluteBlocksFor({
		pos,
		template,
		rotation,
	}: Tetromino): Vector2[] {
		return template.map((block) => {
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
		}) as Vector2[];
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
				for (let x = 0; x < this.width; x++) {
					const o = new Vector2(x, y);
					const n = o.clone.setY(o.y + fullLines);

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
