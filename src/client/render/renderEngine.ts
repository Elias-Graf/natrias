import { Drawable } from './drawable';

export class RenderEngine {
	public static readonly RENDER_INTERVAL = 1;

	private canvas: HTMLCanvasElement;
	private canvasContainer: HTMLElement;
	private canvasContext: CanvasRenderingContext2D;
	private drawables: Drawable[] = [];
	private intervalId: number | undefined;
	private FPSMax = -1;
	private FPSPrevious = 0;
	private FPSCurrent = 0;
	private startedAt: number | undefined;

	public constructor(container: HTMLElement, width: number, height: number) {
		// Create the canvas and add it to the provided container
		this.canvasContainer = container;
		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		container.appendChild(this.canvas);
		// Get the canvas context
		const CANVAS_CONTEXT = this.canvas.getContext('2d');
		if (CANVAS_CONTEXT === null) {
			throw new Error(
				'"canvas.getContext" returned null (FATAL - UNRECOVERABLE)'
			);
		}
		this.canvasContext = CANVAS_CONTEXT;
		// Bind methods which are called from a different context
		this.render = this.render.bind(this);
	}
	/**
	 * Register a drawable to the renderer
	 * @param drawable what should be added
	 */
	public registerDrawable(drawable: Drawable): void {
		// Check if we already know this drawable
		if (this.drawables.indexOf(drawable) !== -1) {
			console.warn('trying to register already registered drawable');
		} else {
			drawable.setRenderer(this);
			this.drawables.push(drawable);
		}
	}
	/**
	 * Unregister a drawable from the renderer
	 * @param drawable what should be removed
	 */
	public unregisterDrawable(drawable: Drawable): void {
		// Check if we actually know this drawable
		const DRAWABLE_INDEX = this.drawables.indexOf(drawable);
		if (DRAWABLE_INDEX === -1) {
			console.warn(
				'trying to unregister a drawable which has not yet been registered'
			);
		} else this.drawables.splice(DRAWABLE_INDEX, 1);
	}
	/**
	 * Starts the renderer
	 */
	public start(): void {
		// Check if we're not already running
		if (this.intervalId !== undefined) {
			console.warn(
				'trying to start the render engine but it is already running'
			);
		} else {
			// Start the intervale
			this.intervalId = window.setInterval(
				this.render,
				RenderEngine.RENDER_INTERVAL
			);
			// Save the time we started at
			this.startedAt = Date.now();
		}
	}
	/**
	 * Stops the renderer
	 */
	public stop(): void {
		if (this.intervalId === undefined) {
			console.warn(
				'trying to stop the render engine but it was not running in the first place'
			);
		} else window.clearInterval(this.intervalId);
	}
	public getFPS(): number {
		if (this.startedAt === undefined) {
			throw new Error(
				'tried to get frames per second but the render is not running (startedAt === undefined)'
			);
		}
		return (
			this.FPSPrevious * 0.99 +
			(this.FPSCurrent / ((Date.now() - this.startedAt) / 1000)) * 0.01
		);
	}
	/**
	 * Function which is called every interval and dispatches render calls
	 * to the registered drawables
	 */
	private render(): void {
		const FPS = this.getFPS();
		// Do not proceed if we have hit our frame target (-1 = unlimited)
		if (this.FPSMax !== -1 && FPS >= this.FPSMax) return;
		// Update previous PFS
		this.FPSPrevious = FPS;
		// Increase FPS
		this.FPSCurrent++;
		// Clear the previous frame
		this.temp_background('black');
		// Render all registered drawables
		this.drawables.forEach((_) => _.render(this.canvasContext));
	}

	// TODO: create a dedicated utility for stuff like this
	// eslint-disable-next-line @typescript-eslint/camelcase
	private temp_background(color: string): void {
		const { canvas, canvasContext } = this;
		const previous = canvasContext.fillStyle;
		canvasContext.fillStyle = color;
		canvasContext.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
		canvasContext.fillStyle = previous;
	}
}
