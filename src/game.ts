import { RendererInterface } from './render';
import { KeyHandlerInterface } from './keyHandler';
import { Dir } from './globals';

class Netria {
	private renderer: RendererInterface;
	private keyHandler: KeyHandlerInterface;

	public constructor(
		renderer: RendererInterface,
		keyHandler: KeyHandlerInterface
	) {
		this.renderer = renderer;
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
		throw new Error('Unimplemented' + direction);
	}
	/**
	 * Is called when the key handler reports a rotation
	 */
	private onRotate(): void {
		throw new Error('Unimplemented');
	}
}
