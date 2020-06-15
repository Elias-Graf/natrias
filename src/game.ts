import { RendererInterface } from './render';
import { KeyHandlerInterface } from './keyHandler';
import { Dir, Point2D } from './globals';
import { Tetromino } from './physics/tetromino';
import { DrawableTetromino } from './drawables/drawableTetromino';
import { getTemplate } from './tetrominoes';
import { TemplateType } from './tetrominoes/type';
import { DrawableBlock } from './drawables/drawableBlock';

interface PhysicsInterface {
	move(tetromino: Tetromino, direction: Dir): void;
	rotate(tetromino: Tetromino): void;
}

export class Natrias {
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

		this.spawnNextTetromino();
	}
	/**
	 * Is called when the key handler reports a move (in a direction)
	 * @param direction which direction was requested
	 */
	private onMove(direction: Dir): void {
		if (this.activeTetromino === undefined) {
			console.warn("couldn't move active tetromino, is was undefined");
		} else this.physics.move(this.activeTetromino, direction);
		console.log('should have moved');.
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
		const rdm = Math.floor(Math.random() * 6);

		let template: Point2D[] | undefined;
		switch (rdm) {
			case 0:
				template = getTemplate(TemplateType.I);
				// this.activeTetromino = new DrawableTetromino(
				// 	origin,
				// 	getTemplate(TemplateType.I)
				// );
				break;
			case 1:
				template = getTemplate(TemplateType.L);
				// this.activeTetromino = new DrawableTetromino(
				// 	origin,
				// 	getTemplate(TemplateType.L)
				// );
				break;
			case 2:
				template = getTemplate(TemplateType.O);
				// this.activeTetromino = new DrawableTetromino(
				// 	origin,
				// 	getTemplate(TemplateType.O)
				// );
				break;
			case 3:
				template = getTemplate(TemplateType.S);
				// this.activeTetromino = new DrawableTetromino(
				// 	origin,
				// 	getTemplate(TemplateType.S)
				// );
				break;
			case 4:
				template = getTemplate(TemplateType.T);
				// this.activeTetromino = new DrawableTetromino(
				// 	origin,
				// 	getTemplate(TemplateType.T)
				// );
				break;
			case 5:
				template = getTemplate(TemplateType.Z);
				// this.activeTetromino = new DrawableTetromino(
				// 	origin,
				// 	getTemplate(TemplateType.Z)
				// );
				break;
		}
		if (template === undefined) {
			console.error(
				`[FATAL]: tried to spawn tetromino with index ${rdm}. no matching template was found`
			);
		} else {
			const newActive = new DrawableTetromino(new Point2D(5, 3), template);
			this.renderer.registerDrawable(newActive);
			this.activeTetromino = newActive;
		}
	}
}
