import Vector2 from "newton/2d/Vector2";
import ReadonlyVector2 from "newton/2d/ReadonlyVector2";
import TetrominoType from "./TetrominoType";

const TEMPLATE_I: ReadonlyVector2[] = [
	new Vector2(0, 2),
	new Vector2(0, 1),
	new Vector2(0, 0),
	new Vector2(0, -1),
];
const TEMPLATE_J: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(0, 1),
	new Vector2(-1, 1),
];
const TEMPLATE_L: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(0, 1),
	new Vector2(1, 1),
];
const TEMPLATE_O: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(1, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TEMPLATE_S: ReadonlyVector2[] = [
	new Vector2(1, -1),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(-1, 0),
];
const TEMPLATE_T: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(-1, 0),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TEMPLATE_Z: ReadonlyVector2[] = [
	new Vector2(-1, -1),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];

const TEMPLATES: Record<TetrominoType, ReadonlyVector2[]> = {
	[TetrominoType.I]: TEMPLATE_I,
	[TetrominoType.J]: TEMPLATE_J,
	[TetrominoType.L]: TEMPLATE_L,
	[TetrominoType.O]: TEMPLATE_O,
	[TetrominoType.S]: TEMPLATE_S,
	[TetrominoType.T]: TEMPLATE_T,
	[TetrominoType.Z]: TEMPLATE_Z,
};

export default TEMPLATES;

/**
 * Prints the template to the console, allowing one to easily debug it.
 * @param template template array.
 * @param type Optionally provide the tetromino/template type with will be
 * added to the log, providing more information.
 */
export function debugTemplate(
	template: ReadonlyVector2[],
	type?: TetrominoType
): void {
	let maxX = 0;
	let maxY = 0;
	let minX = 0;
	let minY = 0;

	for (const { x, y } of template) {
		if (x > maxX) maxX = x;
		if (y > maxY) maxY = y;
		if (x < minX) minX = x;
		if (y < minY) minY = y;
	}

	// The "0" block is also a block, thus + 1.
	// TODO: Use function `shared/getDimensionsOfTemplate`
	const width = maxX - minX + 1;
	const height = maxY - minY + 1;
	const offset = new Vector2(minX, minY);
	const board = new Array(height)
		.fill(null)
		.map(() => new Array(width).fill(null).map(() => "o"));

	for (const block of template) {
		const { x, y } = block.clone.sub(offset);

		try {
			board[y][x] = "x";
		} catch (e) {
			console.log(x, y, e);
		}
	}

	print([
		`Type: \t\t${type === undefined ? "<not provided>" : TetrominoType[type]}`,
		`Width: \t\t${width}`,
		`Height: \t${height}`,
		`Visualized template: \n\t${board.map((row) => row.join("")).join("\n\t")}`,
	]);

	function print(lines: string[]) {
		let longest = 0;

		for (const line of lines) {
			if (line.length > longest) longest = line.length;
		}

		separator(longest);
		console.log(lines.join("\n"));
		separator(longest);

		function separator(length: number) {
			console.log("*".repeat(length));
		}
	}
}
