import { KeyHandlerInterface, MoveListener, RotateListener } from './interface';
import { Dir } from '../globals';

export class KeyHandler implements KeyHandlerInterface {
	private moveListener: MoveListener | undefined;
	private rotateListener: RotateListener | undefined;

	public constructor() {
		// Bind method to the class "this"
		this.onKeyPress = this.onKeyPress.bind(this);
		// Register the document key press listener
		document.addEventListener('keyup', this.onKeyPress);
	}
	/**
	 * Sets the "move" callback
	 * @param cb Callback which is called when a "move" key stroke is detected
	 */
	public setMoveListener(cb: MoveListener): void {
		this.moveListener = cb;
	}
	/**
	 * Sets the "rotate" callback
	 * @param cb Callback which is called when a "rotate" key stroke is detected
	 */
	public setRotateListener(cb: RotateListener): void {
		this.rotateListener = cb;
	}
	/**
	 * Call the registered "rotate" callback
	 */
	private dispatchRotate(): void {
		if (this.rotateListener === undefined) {
			console.warn('tried to dispatch rotate but the listener was undefined');
		} else this.rotateListener();
	}
	/**
	 * Call the registered "move" callback
	 * @param direction What direction to move
	 */
	private dispatchMove(direction: Dir): void {
		if (this.moveListener === undefined) {
			console.warn('tried to dispatch ');
		} else this.moveListener(direction);
	}
	/**
	 * Callback for the event listener (is registered in the constructor)
	 * @param event event (from the event listener)
	 */
	private onKeyPress(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowUp':
				this.dispatchRotate();
				break;
			case 'ArrowRight':
				this.dispatchMove(Dir.RIGHT);
				break;
			case 'ArrowDown':
				this.dispatchMove(Dir.DOWN);
				break;
			case 'ArrowLeft':
				this.dispatchMove(Dir.LEFT);
				break;
		}
	}
}
