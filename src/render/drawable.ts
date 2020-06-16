import { RendererInterface } from './interface';

export interface Drawable {
	render(context: CanvasRenderingContext2D): void;
	setRenderer(renderer: RendererInterface): void;
}
