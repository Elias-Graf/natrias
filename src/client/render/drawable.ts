import { RendererInterface } from './interface';

export interface Drawable {
	/**
	 * Is called when the renderer renders the given drawable
	 * @param context context of the canvas
	 */
	render(context: CanvasRenderingContext2D): void;
	/**
	 * The renderer in the register process. This should generally not
	 * be used manually
	 * @param renderer The render in which the drawable is
	 */
	setRenderer(renderer: RendererInterface): void;
}
