import { RendererInterface } from './render';
import { KeyHandlerInterface } from './keyHandler';
import { Dir, Point2D } from './globals';
import { DrawableTetromino, DrawableBlock } from './drawables';
import { TemplateType } from './tetrominoes';
import { PhysicsInterface } from './physics';

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
		} else {
			const moveResponse = this.physics.move(this.activeTetromino, direction);
			if (moveResponse.hitBottom) {
				this.renderer.unregisterDrawable(this.activeTetromino);
				const blocks = this.activeTetromino
					.calculateAbsoluteBlocks()
					.map((absoluteBlock) => new DrawableBlock(absoluteBlock));

				blocks.forEach((block) => this.renderer.registerDrawable(block));
				this.physics.setBlocks(blocks);

				this.physics.removeFullLines();
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
}
