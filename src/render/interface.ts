import { Drawable } from './drawable';

/**
 * Describes what a renderer should be capable of
 */
export interface RendererInterface {
	/**
	 * Start the renderer
	 */
	start: () => void;
	/**
	 * Stop the renderer
	 */
	stop: () => void;
	/**
	 * Register a drawable.
	 */
	registerDrawable: (drawable: Drawable) => void;
	/**
	 * Unregister a drawable
	 */
	unregisterDrawable: (drawable: Drawable) => void;
}
