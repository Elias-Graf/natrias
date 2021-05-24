import { EventEmitter } from "events";
import Dir from "shared/Dir";
import Board from "shared/Board";
import TetrominoLogic from "./TetrominoLogic";
import { createTetrominoFromType } from "./createTetrominoFromType";
import NextUpProvider from "./NextUpProvider";
import TetrominoType from "shared/TetrominoType";

export default class GameLogic extends EventEmitter {
	private _board: Board;
	private _nextUpIndex = 0;
	private _holdingPiece: TetrominoType | undefined;
	private activeTetromino: TetrominoLogic;
	/**
	 * Actual height is the board height, plus the yOffset which is offscreen.
	 */
	private actualHeight: number;
	private forceMoveDelta = 700;
	private gameTickInterval: NodeJS.Timer | undefined;
	private height: number;
	private lastForceMove = Date.now();
	private switchedThisTurn = false;
	private width: number;
	private yOffset: number;

	public constructor(private nextUpProvider: NextUpProvider) {
		super();

		this.width = 10;
		this.height = 20;
		this.yOffset = 5;
		this.actualHeight = this.height + this.yOffset;
		this._board = new Array(this.actualHeight)
			.fill(false)
			.map(() => new Array(this.width).fill(false));

		// We sadly need this assignment event though we already assigned
		// "activeTetromino" inside "spawnNextTetromino". Typescript is not
		// capable of detecting this.
		this.activeTetromino = this.spawnNextTetromino();
	}

	public addListener(type: "change", cb: () => void): this {
		return super.addListener(type, cb);
	}
	/**
	 * @deprecated use the `board` property instead.
	 */
	public getBoard(): boolean[][] {
		return this._board.filter((_, i) => i >= this.yOffset);
	}
	public moveActiveTetromino(dir: Dir): void {
		const { activeTetromino } = this;

		const next = activeTetromino.clone;
		next.move(dir);

		const newPositionIsValid =
			this.tetrominoIsInBounds(next) &&
			this.tetrominoIsClearOfOthers(next, activeTetromino);
		const newPositionIsBottomOrTopOfOther =
			dir === Dir.Down && !newPositionIsValid;

		if (newPositionIsValid) {
			this.activeTetromino = next;
			this.setTetromino(activeTetromino, false);
			this.setTetromino(this.activeTetromino, true);
			this.emitChange();
		} else if (newPositionIsBottomOrTopOfOther) {
			this.removeFullLines();
			this.spawnNextTetromino();
			this.emitChange();
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

			this.emitChange();
		}
	}
	public start(): void {
		this.gameTickInterval = setInterval(this.gameTick, 50);
	}
	public stop(): void {
		if (!this.gameTickInterval) throw new Error("Game not started");

		clearInterval(this.gameTickInterval);
	}
	/**
	 * Switches the active tetromino with the holding piece.
	 */
	public switchWithHoldingPiece(): void {
		const { _holdingPiece, activeTetromino } = this;

		if (this.switchedThisTurn) return;

		this.setTetromino(activeTetromino, false);
		this._holdingPiece = activeTetromino.type;

		if (_holdingPiece !== undefined)
			this.activeTetromino = createTetrominoFromType(_holdingPiece);
		else this.spawnNextTetromino();

		this.switchedThisTurn = true;
		this.emitChange();
	}

	public get board(): Board {
		return this._board.filter((_, i) => i >= this.yOffset);
	}
	public get nextUpIndex(): number {
		return this._nextUpIndex;
	}
	public get holdingPiece(): TetrominoType | undefined {
		return this._holdingPiece;
	}

	private emitChange() {
		this.emit("change");
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
		const { nextUpProvider, _nextUpIndex } = this;
		const next = nextUpProvider.get(_nextUpIndex);

		this._nextUpIndex++;

		// Next tetromino means new turn, so reset that flag.
		this.switchedThisTurn = false;

		return (this.activeTetromino = createTetrominoFromType(next));
	}
	private tetrominoIsInBounds({ blocks }: TetrominoLogic): boolean {
		for (const { x, y } of blocks) {
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
}
