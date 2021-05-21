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
	new Vector2(0, 0),
	new Vector2(0, 1),
	new Vector2(1, 1),
	new Vector2(1, 2),
];
const TEMPLATE_L: ReadonlyVector2[] = [
	new Vector2(0, -2),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
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
