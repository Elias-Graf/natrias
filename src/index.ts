import { RenderEngine, Drawable } from './render';

class TestD implements Drawable {
	public static SIZE = 50;
	public static BORDER_OFFSET = 12;

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, 50, 50);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(TestD.SIZE, 0);
		ctx.lineTo(TestD.SIZE, TestD.SIZE);
		ctx.lineTo(
			TestD.SIZE - TestD.BORDER_OFFSET,
			TestD.SIZE - TestD.BORDER_OFFSET
		);
		ctx.lineTo(TestD.SIZE - TestD.BORDER_OFFSET, TestD.BORDER_OFFSET);
		ctx.lineTo(TestD.BORDER_OFFSET, TestD.BORDER_OFFSET);
		ctx.fillStyle = 'tomato';
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, TestD.SIZE);
		ctx.lineTo(TestD.SIZE, TestD.SIZE);
		ctx.lineTo(
			TestD.SIZE - TestD.BORDER_OFFSET,
			TestD.SIZE - TestD.BORDER_OFFSET
		);
		ctx.lineTo(TestD.BORDER_OFFSET, TestD.SIZE - TestD.BORDER_OFFSET);
		ctx.lineTo(TestD.BORDER_OFFSET, TestD.BORDER_OFFSET);
		// ctx.beginPath();
		// ctx.moveTo(0, 0);
		// ctx.lineTo(0, 50);
		// ctx.lineTo(50, 50);
		// ctx.lineTo(45, 45);
		// ctx.lineTo(5, 45);
		// ctx.lineTo(5, 5);
		ctx.fillStyle = 'darkred';
		ctx.fill();
	}
}
const r = new RenderEngine(document.body, 500, 500);

r.registerDrawable(new TestD());

r.start();
