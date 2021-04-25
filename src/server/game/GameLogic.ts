import Vector2 from "newton/2d/Vector2";
import ReadonlyVector2 from "newton/2d/ReadonlyVector2";
import { EventEmitter } from "events";
import Dir from "shared/Dir";
import { random } from "newton/utils/random";
import templates from "./templates";
import Tetromino from "./Tetromino";
import TetrominoType from "./TetrominoType";

export default class GameLogic extends EventEmitter {
	/**
	 * Actual height is the board height, plus the yOffset which is offscreen
	 */
	private actualHeight: number;
	private board: boolean[][];
	private height: number;
	private width: number;
	private yOffset: number;
	private activeTetromino: Tetromino;
	private gameTickInterval: NodeJS.Timer;
	private forceMoveDelta = 700;
	private lastForceMove = Date.now();

	public constructor() {
		super();

		this.width = 10;
		this.height = 20;
		this.yOffset = 5;
		this.actualHeight = this.height + this.yOffset;
		this.activeTetromino = this.createRandomTetromino();
		this.board = new Array(this.actualHeight)
			.fill(false)
			.map(() => new Array(this.width).fill(false));

		this.gameTickInterval = setInterval(this.gameTick, 50);
	}

	public addListener(type: "change", cb: () => void): this {
		return super.addListener(type, cb);
	}
	public emit(type: "change"): boolean {
		return super.emit(type);
	}
	public getBoard(): boolean[][] {
		return this.board.filter((_, i) => i > this.yOffset);
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

		const nextIsInBounds = this.tetrominoIsInBounds(next);
		const nextIsClear =
			nextIsInBounds &&
			this.tetrominoIsClearOfOthers(next, this.activeTetromino);
		const nextHitTopOfOther = direction === Dir.Down && !nextIsClear;
		const nextHitBottom = direction === Dir.Down && !nextIsInBounds;

		if (nextIsInBounds && nextIsClear) {
			this.setTetromino(this.activeTetromino, false);

			this.activeTetromino = next;

			this.setTetromino(this.activeTetromino, true);
		} else if (nextHitBottom || nextHitTopOfOther) {
			this.removeFullLines();
			this.spawnNextTetromino();
		}
	}
	public removeListener(type: "change", cb: () => void): this {
		return super.addListener(type, cb);
	}
	public rotateActiveTetromino(amount = 1): void {
		const next = this.cloneTetromino(this.activeTetromino);

		next.rotation += amount;

		// We don't want to rotate the O shape
		if (next.type === TetrominoType.O) return;

		switch (next.type) {
			// Some shapes only need two rotations
			case TetrominoType.I:
			case TetrominoType.S:
			case TetrominoType.Z:
				if (next.rotation > 1) next.rotation = 0;
				if (next.rotation < 0) next.rotation = 1;
				break;
			default:
				if (next.rotation > 3) next.rotation = 0;
				if (next.rotation < 0) next.rotation = 3;
		}

		if (
			this.tetrominoIsClearOfOthers(next, this.activeTetromino) &&
			this.tetrominoIsInBounds(next)
		) {
			this.setTetromino(this.activeTetromino, false);

			this.activeTetromino = next;

			this.setTetromino(this.activeTetromino, true);
		}
	}
	public stopGame(): void {
		clearInterval(this.gameTickInterval);
	}

	private cloneTetromino(t: Tetromino): Tetromino {
		return {
			type: t.type,
			rotation: t.rotation,
			template: t.template,
			pos: t.pos.clone,
		};
	}
	private createRandomTetromino(): Tetromino {
		const type = Math.floor(
			random(0, Object.keys(templates).length - 1)
		) as TetrominoType;
		const template = templates[type];

		return { type, rotation: 0, template, pos: new Vector2(5, -2) };
	}
	private gameTick = () => {
		const now = Date.now();

		if (now - this.lastForceMove > this.forceMoveDelta) {
			this.moveActiveTetromino(Dir.Down);
			this.emit("change");

			this.lastForceMove = now;
		}
	};
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
	private getPosition(pos: ReadonlyVector2): boolean {
		const { x } = pos;
		const y = pos.y + this.yOffset;

		try {
			return this.board[y][x];
		} catch (e) {
			throw new Error(`Failed to get position ${pos} ${e}`);
		}
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
	private setTetromino(t: Tetromino, val: boolean) {
		const blocks = this.getAbsoluteBlocksFor(t);

		for (const block of blocks) {
			this.setPosition(block, val);
		}
	}
	private spawnNextTetromino() {
		this.activeTetromino = this.createRandomTetromino();
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
	private tetrominoIsClearOfOthers(t: Tetromino, prev: Tetromino): boolean {
		const blocks = this.getAbsoluteBlocksFor(t);
		const prevBlocks = this.getAbsoluteBlocksFor(prev);

		for (const block of blocks) {
			// We don't need to check further of it was a previous block.
			if (prevBlocks.find((b) => b.equals(block))) continue;

			if (this.getPosition(block)) return false;
		}

		return true;
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
}
