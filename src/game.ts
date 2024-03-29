import { RenderEngine, RendererInterface } from './render';
import { Dir, Point2D } from './globals';
import { DrawableTetromino } from './drawables';
import { TemplateType } from './tetrominoes';
import { PhysicsEngine, PhysicsInterface } from './physics';

// TODO: generate UML
// TODO: different colors
// TODO: rotation into wall possible but pushed back
// TODO: spawning
// TODO: next up display
// TODO: launcher + game over screen
// TODO: move tetromino.move into physics (this also applies for rotate)

export class Natrias {
	private readonly BLOCK_SIZE = 50;
	private readonly HEIGHT = 20;
	private readonly WIDTH = 10;
	private readonly Y_OFFSET = 5;

	private activeTetromino: DrawableTetromino | null = null;
	private activeTetrominoProjection: DrawableTetromino | null = null;
	private deletedLevelLines = 0;
	private deletedLines = 0;
	private forceMoveDelta = 750;
	private gameTickInterval: number | null = null;
	private isPaused = false;
	private level = 10;
	private levelDisplay: HTMLElement;
	private physics: PhysicsInterface = new PhysicsEngine(
		this.WIDTH,
		this.HEIGHT,
		this.Y_OFFSET
	);
	private previousForceMove = Date.now();
	private renderer: RendererInterface = new RenderEngine(
		document.body,
		this.WIDTH * this.BLOCK_SIZE,
		this.HEIGHT * this.BLOCK_SIZE
	);

	private score = 0;
	private scoreDisplay: HTMLElement;

	public constructor() {
		// Get the score and level display elements
		const LEVEL_DISPLAY = document.getElementById('level');
		const SCORE_DISPLAY = document.getElementById('score');
		if (LEVEL_DISPLAY === null)
			throw new Error('could not find level display HTML element');
		if (SCORE_DISPLAY === null)
			throw new Error('could not find score display HTML element');
		this.levelDisplay = LEVEL_DISPLAY;
		this.scoreDisplay = SCORE_DISPLAY;
		// Add the keyboard listener
		document.addEventListener('keydown', this.onKeyPress.bind(this));
		// Start the renderer
		this.renderer.start();
		// Spawn the first tetromino
		this.spawnNextTetromino();
		// Initially display the score by "updating" it
		this.updateScore(0);
		// "Resume" - start the game
		this.resume();
	}

	/**
	 * Start / resume the game
	 */
	private resume(): void {
		this.gameTickInterval = window.setInterval(this.gameTick.bind(this), 10);
		this.isPaused = false;
	}
	/**
	 * Pause the game
	 */
	private pause(): void {
		if (this.gameTickInterval === null) {
			console.warn(`Tried to pause game but not game tick interval was found`);
		} else {
			window.clearInterval(this.gameTickInterval);
			this.isPaused = true;
		}
	}
	/**
	 * Handles stuff that should happen in the game. For example it checks
	 * if the tetromino should be forcibly moved down
	 */
	private gameTick(): void {
		const current = Date.now();
		// Check if our force move delta elapsed, if yes, move the tetromino
		// down by one
		if (current - this.previousForceMove > this.forceMoveDelta) {
			this.moveActiveTetromino(Dir.DOWN);
			this.previousForceMove = current;
		}
	}
	/**
	 * Move the active tetromino in a direction
	 * @param direction desired direction
	 */
	private moveActiveTetromino(direction: Dir): void {
		if (!this.isPaused) {
			if (this.activeTetromino === null) {
				console.warn('could not move active tetromino, it is null');
			} else {
				// Try to move the tetromino (move returns false when it hit something)
				if (!this.physics.move(this.activeTetromino, direction)) {
					// Unregister the tetromino as a whole
					this.renderer.unregisterDrawable(this.activeTetromino);
					// Get it's blocks and give those to the physics- and renderer engine
					const blocks = this.activeTetromino.getBlocks();
					this.physics.addBlocks(blocks);
					blocks.forEach((block) => this.renderer.registerDrawable(block));
					// Spawn the next tetromino
					this.spawnNextTetromino();
					// Update the score with the amount of removed line
					this.updateScore(this.physics.removeFullLines());
				}

				this.updateProjection();
			}
		}
	}
	/**
	 * Rotate the active tetromino
	 */
	private rotateActiveTetromino(): void {
		if (!this.isPaused) {
			if (this.activeTetromino === null) {
				console.warn('could not rotate active tetromino, it it null');
			} else {
				this.physics.rotate(this.activeTetromino);

				this.updateProjection();
			}
		}
	}
	/**
	 * Is called by the event listener "onKeyDown"
	 * @param event event given by the event listener
	 */
	private onKeyPress(event: KeyboardEvent): void {
		switch (event.key) {
			/**
			 * Directional control (moving)
			 */
			case 'ArrowLeft':
				this.moveActiveTetromino(Dir.LEFT);
				break;
			case 'ArrowDown':
				this.moveActiveTetromino(Dir.DOWN);
				break;
			case 'ArrowRight':
				this.moveActiveTetromino(Dir.RIGHT);
				break;
			/**
			 * Rotating
			 */
			case 'ArrowUp':
				this.rotateActiveTetromino();
				break;
			/**
			 * Other
			 */
			case 'Enter':
				if (this.activeTetromino === null) {
					console.warn(
						'could not project active tetromino to bottom, it was null'
					);
				} else {
					// Project the tetromino to the bottom of the screen
					this.physics.projectToBottom(this.activeTetromino);
					// Move it down once more to trigger the detection
					this.moveActiveTetromino(Dir.DOWN);
				}
				break;
			case 'Escape':
				if (this.isPaused) this.resume();
				else this.pause();
				break;
		}
	}
	/**
	 * Spawns the next tetromino. Tetrominoes are selected randomly.
	 */
	private spawnNextTetromino(): void {
		const num = Math.floor(Math.random() * 6);

		let type: TemplateType | null = null;
		switch (num) {
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
		if (type === null) {
			throw new Error(
				`Tried to spawn next tetromino but random number was out of range. It was "${num}"`
			);
		}
		this.activeTetromino = new DrawableTetromino(new Point2D(5, -3), type);
		this.renderer.registerDrawable(this.activeTetromino);

		// If we don't have a projection already, create it
		if (this.activeTetrominoProjection === null) {
			this.activeTetrominoProjection = new DrawableTetromino(
				new Point2D(5, -3),
				type
			);
			this.activeTetrominoProjection.setColors({
				dark: '#00000032',
				light: '#FFFFFF32',
				normal: '#7F7F7F32',
			});
			this.renderer.registerDrawable(this.activeTetrominoProjection);
		} else {
			// If we already have one, just update it's type
			this.activeTetrominoProjection.setType(type);
		}
		// Update the position of the projection
		this.updateProjection();
	}
	/**
	 * Update the projection of the active tetromino (that tetromino of the bottom of the
	 * screen which indicates where the tetromino will land)
	 */
	private updateProjection(): void {
		const { activeTetromino, activeTetrominoProjection } = this;
		if (activeTetromino !== null && activeTetrominoProjection !== null) {
			activeTetrominoProjection.setOrigin(activeTetromino.getOrigin().clone());
			activeTetrominoProjection.setRotation(activeTetromino.getRotation());
			this.physics.projectToBottom(activeTetrominoProjection);
		}
	}
	/**
	 * Update the score and the displays corresponding to it
	 * @param deletedLines number of lines which were removed
	 */
	private updateScore(deletedLines: number): void {
		// Increase counters
		this.deletedLevelLines += deletedLines;
		this.deletedLines += deletedLines;
		// Increase the score
		let additionalScore = 0;
		switch (deletedLines) {
			case 0:
				break;
			case 1:
				additionalScore += 40;
				break;
			case 2:
				additionalScore += 100;
				break;
			case 3:
				additionalScore += 300;
				break;
			case 4:
				additionalScore += 1200;
				break;
			default:
				console.warn(
					`score should not be updated as deleted lines were not in range.` +
						`\ndeleted lines were ${deletedLines}`
				);
		}
		// Update score according to level
		this.score += additionalScore * this.level;
		// Update level and increase speed
		if (this.deletedLevelLines >= 8) {
			this.level++;
			if (this.forceMoveDelta > 100) {
				this.forceMoveDelta -= 50;
			}
			this.deletedLevelLines = this.deletedLevelLines - 8;
		}
		// Display new score and level
		this.scoreDisplay.innerText = this.score.toString();
		this.levelDisplay.innerText = this.level.toString();
	}
}
