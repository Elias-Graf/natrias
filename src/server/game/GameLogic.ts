import { EventEmitter } from "events";
import Dir from "shared/Dir";
import { random } from "newton/utils/random";
import TEMPLATES from "./templates";
import TetrominoType from "./TetrominoType";
import Board from "shared/Board";
import TetrominoLogic from "./TetrominoLogic";
import { createTetrominoFromType } from "./createTetrominoFromType";

export default class GameLogic extends EventEmitter {
	private _board: Board;
	private _nextUp: TetrominoType[] = [];
	private activeTetromino: TetrominoLogic;
	/**
	 * Actual height is the board height, plus the yOffset which is offscreen.
	 */
	private actualHeight: number;
	private forceMoveDelta = 700;
	private gameTickInterval: NodeJS.Timer | undefined;
	private height: number;
	private lastForceMove = Date.now();
	private width: number;
	private yOffset: number;

	public constructor() {
		super();

		this.width = 10;
		this.height = 20;
		this.yOffset = 5;
		this.actualHeight = this.height + this.yOffset;
		this.activeTetromino = createTetrominoFromType(
			this.getRandomTetrominoType()
		);
		this._board = new Array(this.actualHeight)
			.fill(false)
			.map(() => new Array(this.width).fill(false));

		this.populateNextUp();
	}

	public addListener(type: "change", cb: () => void): this {
		return super.addListener(type, cb);
	}
	public emit(type: "change"): boolean {
		return super.emit(type);
	}
	/**
	 * @deprecated use the `board` property instead.
	 */
	public getBoard(): boolean[][] {
		return this._board.filter((_, i) => i >= this.yOffset);
	}
	public moveActiveTetromino(direction: Dir): void {
		const next = this.activeTetromino.clone;

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
		const nextIsClearOfOthers =
			nextIsInBounds &&
			// This check throws an error if we are out of bounds. So check if we are
			// in bounds first.
			this.tetrominoIsClearOfOthers(next, this.activeTetromino);
		const nextHitTopOfOther = direction === Dir.Down && !nextIsClearOfOthers;
		const nextHitBottom = direction === Dir.Down && !nextIsInBounds;

		if (nextIsInBounds && nextIsClearOfOthers) {
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
	public rotateActiveTetromino(): void {
		const next = this.activeTetromino.clone;

		next.rotate();

		if (
			this.tetrominoIsClearOfOthers(next, this.activeTetromino) &&
			this.tetrominoIsInBounds(next)
		) {
			this.setTetromino(this.activeTetromino, false);

			this.activeTetromino = next;

			this.setTetromino(this.activeTetromino, true);
		}
	}
	public start(): void {
		this.gameTickInterval = setInterval(this.gameTick, 50);
	}
	public stop(): void {
		if (!this.gameTickInterval) throw new Error("Game not started");

		clearInterval(this.gameTickInterval);
	}

	public get board(): Board {
		return this._board.filter((_, i) => i >= this.yOffset);
	}
	public get nextUp(): TetrominoType[] {
		return this._nextUp;
	}

	private gameTick = () => {
		const now = Date.now();

		if (now - this.lastForceMove > this.forceMoveDelta) {
			this.moveActiveTetromino(Dir.Down);
			this.emit("change");

			this.lastForceMove = now;
		}
	};
	private getPosition(x: number, y: number): boolean {
		try {
			return this._board[y + this.yOffset][x];
		} catch (e) {
			throw new Error(`Failed to get position [${x}/${y}] ${e}`);
		}
	}
	private getRandomTetrominoType() {
		return Math.floor(
			random(0, Object.keys(TEMPLATES).length - 1)
		) as TetrominoType;
	}
	private populateNextUp() {
		this._nextUp = new Array(8)
			.fill(null)
			.map(() => this.getRandomTetrominoType());
	}
	private setPosition(x: number, y: number, block: boolean) {
		try {
			this._board[y + this.yOffset][x] = block;
		} catch (e) {
			throw new Error(`Failed to set position [${x}/${y}] ${e}`);
		}
	}
	private setTetromino({ blocks }: TetrominoLogic, val: boolean) {
		for (const block of blocks) {
			const { x, y } = block;
			this.setPosition(x, y, val);
		}
	}
	private spawnNextTetromino() {
		this.activeTetromino = createTetrominoFromType(
			this._nextUp.splice(0, 1)[0]
		);
		this._nextUp.push(this.getRandomTetrominoType());
	}
	private tetrominoIsInBounds(t: TetrominoLogic): boolean {
		for (const { x, y } of t.blocks) {
			const isInBounds =
				x >= 0 && x < this.width && y > -this.yOffset && y < this.height;

			if (!isInBounds) return false;
		}

		return true;
	}
	private tetrominoIsClearOfOthers(
		t: TetrominoLogic,
		prev: TetrominoLogic
	): boolean {
		const blocks = t.blocks;
		const prevBlocks = prev.blocks;

		for (const block of blocks) {
			// We don't need to check further of it was a previous block.
			if (prevBlocks.find((b) => b.equals(block))) continue;

			const { x, y } = block;

			if (this.getPosition(x, y)) return false;
		}

		return true;
	}
	private removeFullLines() {
		for (let checkY = this.height - 1; checkY >= 0; checkY--) {
			let lineIsFull = true;

			for (let checkX = 0; checkX < this.width; checkX++) {
				if (!this.getPosition(checkX, checkY)) {
					lineIsFull = false;
					break;
				}
			}

			if (lineIsFull) {
				// We start moving lines down one above the full line.
				for (let moveY = checkY - 1; moveY >= 0; moveY--) {
					for (let moveX = 0; moveX < this.width; moveX++) {
						const val = this.getPosition(moveX, moveY);

						this.setPosition(moveX, moveY + 1, val);
					}
				}

				// As the line that was moved down could also be full, we need to check
				// again.
				checkY++;
			}
		}
	}
}
