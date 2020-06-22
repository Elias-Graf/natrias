import { RendererInterface } from './render';
import { KeyHandlerInterface } from './keyHandler';
import { Dir, Point2D } from './globals';
import { DrawableTetromino } from './drawables';
import { TemplateType } from './tetrominoes';
import { PhysicsInterface } from './physics';

// TODO: generate UML

export class Natrias {
	private activeTetromino: DrawableTetromino | undefined;
	private keyHandler: KeyHandlerInterface;
	private physics: PhysicsInterface;
	private renderer: RendererInterface;

	private static FORCE_MOVE_DELTA = 500;
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
		// Get the score displays
		// Setup the score displays
		const divScore = document.getElementById('score');
		const divLevel = document.getElementById('level');
		if (divScore === null) throw new Error('Could not get score HTML-Element');
		if (divLevel === null) throw new Error('Could not get level HTML-Element');
		this.displayScore = divScore;
		this.displayLevel = divLevel;
		// Display the initial score
		this.updateScore(0);
		// Start the renderer
		this.renderer.start();
		// Start the game loop
		window.setInterval(this.gameTick.bind(this), 10);
		// Spawn the first tetromino
		this.spawnNextTetromino();
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
		// Increase counters
		this.deletedLines += lineCount;
		this.levelUpLines += lineCount;
		// Assigning points according to deleted lines
		let points = 0;
		switch (this.deletedLines) {
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
		// Set current deleted lines to 0
		this.deletedLines = 0;
		// Update score according to level
		this.score += (points * this.level);
		// Update level and increase speed
		if (this.levelUpLines >= 8) {
			this.level++;
			if(Natrias.FORCE_MOVE_DELTA > 100) {
				Natrias.FORCE_MOVE_DELTA -=50;
			}
			this.levelUpLines = 0;
		}
		// Display new score and level
		this.displayScore.innerText = this.score.toString();
		this.displayLevel.innerText = this.level.toString();
	}
}
