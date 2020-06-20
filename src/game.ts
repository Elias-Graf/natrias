import { RendererInterface } from './render';
import { KeyHandlerInterface } from './keyHandler';
import { Dir, Point2D } from './globals';
import { DrawableTetromino, DrawableBlock } from './drawables';
import { TemplateType } from './tetrominoes';
import { PhysicsInterface, PhysicsEngine, MoveResponse } from './physics';

// TODO: generate UML

export class Natrias {
	private activeTetromino: DrawableTetromino | undefined;
	private keyHandler: KeyHandlerInterface;
	private physics: PhysicsInterface;
	private renderer: RendererInterface;

	private static readonly FORCE_MOVE_DELTA = 500;
	private previousForcedMove = Date.now();

	private deletedLines = 0;
	private displayScore: HTMLElement;
	private displayLevel: HTMLElement;
	private level = 1;
	private levelUpLines = 7;
	private score = 0;

	public constructor(
		renderer: RendererInterface,
		physics: PhysicsInterface,
		keyHandler: KeyHandlerInterface
	) {
		this.renderer = renderer;
		this.physics = physics;
		this.keyHandler = keyHandler;
		// Set the key handler callbacks
		this.keyHandler.setMoveListener(this.onMove.bind(this));
		this.keyHandler.setRotateListener(this.onRotate.bind(this));
		// Start the renderer
		this.renderer.start();
		// Start the game loop
		window.setInterval(this.gameTick.bind(this), 10);
		this.spawnNextTetromino();
		// Display the score
		const divScore = document.getElementById('score');
		if (divScore === null) {
			console.error('Could not display score, element is null.');
		} else {
			this.displayScore = divScore;
			this.displayScore.innerText = this.score.toString();
		}
		// Display the level
		const divLevel = document.getElementById('level');
		if (divLevel === null) {
			console.error('Could not display score, element is null.');
		} else {
			this.displayLevel = divLevel;
			this.displayLevel.innerText = this.level.toString();
		}
	}
	/**
	 * Is called every 10ms when the game loop is active
	 */
	private gameTick(): void {
		const current = Date.now();
		// Subtracts previous saved time with current time and compares it to time limit
		if (current - this.previousForcedMove >= Natrias.FORCE_MOVE_DELTA) {
			this.onMove(Dir.DOWN);
			this.previousForcedMove = current;
		}
	}
	/**
	 * Is called when the key handler reports a move (in a direction)
	 * @param direction which direction was requested
	 */
	private onMove(direction: Dir): void {
		if (this.activeTetromino === undefined) {
			console.warn("couldn't move active tetromino, is was undefined");
		} else {
			const moveResponse = this.physics.move(this.activeTetromino, direction);
			if (moveResponse.hitBottom) {
				// Unregister the tetromino as a whole
				this.renderer.unregisterDrawable(this.activeTetromino);
				// Get it's blocks and give those to the physics- and renderer engine
				const blocks = this.activeTetromino.getBlocks();
				this.physics.setBlocks(blocks);
				blocks.forEach((block) => this.renderer.registerDrawable(block));
				// If the tetromino hit the bottom, we may need to remove some lines
				this.updateScore(this.physics.removeFullLines());
				// Spawn the next tetromino
				this.spawnNextTetromino();
			}
		}
	}
	/**
	 * Is called when the key handler reports a rotation
	 */
	private onRotate(): void {
		if (this.activeTetromino === undefined) {
			console.warn("couldn't rotate active tetromino, it was undefined");
		} else this.physics.rotate(this.activeTetromino);
	}
	/**
	 * Spawns the next tetromino at the start location
	 */
	private spawnNextTetromino(): void {
		const rdm = Math.floor(Math.random() * 6);

		let type: TemplateType | undefined = undefined;
		switch (rdm) {
			case 0:
				type = TemplateType.I;
				break;
			case 1:
				type = TemplateType.L;
				break;
			case 2:
				type = TemplateType.O;
				break;
			case 3:
				type = TemplateType.S;
				break;
			case 4:
				type = TemplateType.T;
				break;
			case 5:
				type = TemplateType.Z;
				break;
		}
		if (type === undefined) {
			console.error(
				`[FATAL]: tried to spawn tetromino with index ${rdm}. no matching template was found`
			);
		} else {
			const newActive = new DrawableTetromino(new Point2D(5, 3), type);
			this.renderer.registerDrawable(newActive);
			this.activeTetromino = newActive;
		}
	}
	/**
	 * Is called when tetromino hits bottom in case lines got deleted
	 */
	private updateScore(lineCount: number): void {
		// Update variables
		this.deletedLines += lineCount;
		this.levelUpLines += lineCount;
		// Update level
		if (this.levelUpLines >= 8) {
			this.level++;
			this.levelUpLines = 0;
		}
		// Assining points according to deleted lines
		let points = 0;
		switch (lineCount) {
			case 1:
				points = 40;
				break;
			case 2:
				points = 100;
				break;
			case 3:
				points = 300;
				break;
			case 4:
				points = 1200;
				break;
			default:
				console.error(
					'Score could not update, deleted lines are more than four.'
				);
		}
		// Update score according to level
		this.score += points * this.level;
		this.displayScore.innerText = this.score.toString();
		this.displayLevel.innerText = this.level.toString();
	}
}
