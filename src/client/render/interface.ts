import { Drawable } from "./drawable";

/**
 * Describes what a renderer should be capable of
 */
export interface RendererInterface {
	getDrawables(): Drawable[];
	/**
	 * Register a drawable.
	 */
	registerDrawable: (drawable: Drawable) => void;
	/**
	 * Start the renderer
	 */
	start: () => void;
	/**
	 * Stop the renderer
	 */
	stop: () => void;
	/**
	 * Unregister a drawable
	 */
	unregisterDrawable: (drawable: Drawable) => void;
}
