import { RendererInterface } from './render';
import { KeyHandlerInterface } from './keyHandler';
import { Dir, Point2D } from './globals';
import { Tetromino } from './physics/tetromino';
import { DrawableTetromino } from './drawables/drawableTetromino';
import { getTemplate } from './tetrominoes';

interface PhysicsInterface {
	move(tetromino: Tetromino, direction: Dir): void;
	rotate(tetromino: Tetromino): void;
}

class Netria {
	private renderer: RendererInterface;
	private physics: PhysicsInterface;
	private keyHandler: KeyHandlerInterface;

	private activeTetromino: DrawableTetromino | undefined;

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
	}
	/**
	 * Is called when the key handler reports a move (in a direction)
	 * @param direction which direction was requested
	 */
	private onMove(direction: Dir): void {
		if (this.activeTetromino === undefined) {
			console.warn("couldn't move active tetromino, is was undefined");
		} else this.physics.move(this.activeTetromino, direction);
	}
	/**
	 * Is called when the key handler reports a rotation
	 */
	private onRotate(): void {
		if (this.activeTetromino === undefined) {
			console.warn("couldn't rotate active tetromino, it was undefined");
		} else this.physics.rotate(this.activeTetromino);
	}

	private spawnNextTetromino(): void {
		const origin = new Point2D(5, 3);
		switch (Math.floor(Math.random() * 6)) {
			case 0:
				this.activeTetromino = new DrawableTetromino(origin, getTemplate);
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
		}
	}
}
