import ReadonlyVector2 from "newton/2d/ReadonlyVector2";

/**
 * Calculates the dimensions of a tetromino template.
 * @param template Template to calculate the dimensions of.
 */
export default function getDimensionsOfTemplate(
	template: ReadonlyVector2[]
): {
	height: number;
	width: number;
	xMax: number;
	xMin: number;
	yMax: number;
	yMin: number;
} {
	let xMax = 0;
	let xMin = 0;
	let yMax = 0;
	let yMin = 0;

	for (const { x, y } of template) {
		if (x > xMax) xMax = x;
		if (x < xMin) xMin = x;
		if (y > yMax) yMax = y;
		if (y < yMin) yMin = y;
	}

	// 0 is also a block, so plus 1
	const height = yMax - yMin + 1;
	const width = xMax - xMin + 1;

	return { height, width, xMin, yMin, xMax, yMax };
}
