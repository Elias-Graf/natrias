import { Drawable } from './drawable';
import { RendererInterface } from './interface';

/**
 * This is the default implementation of the interface Drawable
 */
export abstract class DefaultDrawable implements Drawable {
	/**
	 * When registered to a renderer, a reference is kept here.
	 */
	private renderer: RendererInterface | null = null;

	/**
	 * This is the method where the behavior of the drawable is defined.
	 * @param context context of the canvas
	 */
	public abstract render(context: CanvasRenderingContext2D): void;

	/**
	 * Sets the renderer in which the drawable is registered.
	 * @param renderer the renderer in which the drawable is registered
	 */
	public setRenderer(renderer: RendererInterface): void {
		this.renderer = renderer;
	}
	/**
	 * This method is dangerous as it may return null when the drawable
	 * is not registered yet
	 */
	protected dangerousGetRenderer(): RendererInterface | null {
		return this.renderer;
	}
}
