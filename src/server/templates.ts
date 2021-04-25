import Vector2 from "newton/2d/Vector2";
import ReadonlyVector2 from "newton/2d/ReadonlyVector2";
import TetrominoType from "./TetrominoType";

const TemplateI: ReadonlyVector2[] = [
	new Vector2(0, 2),
	new Vector2(0, 1),
	new Vector2(0, 0),
	new Vector2(0, -1),
];
const TemplateL: ReadonlyVector2[] = [
	new Vector2(0, -2),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TemplateO: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(1, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TemplateS: ReadonlyVector2[] = [
	new Vector2(1, -1),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(-1, 0),
];
const TemplateT: ReadonlyVector2[] = [
	new Vector2(0, -1),
	new Vector2(-1, 0),
	new Vector2(0, 0),
	new Vector2(1, 0),
];
const TemplateZ: ReadonlyVector2[] = [
	new Vector2(-1, -1),
	new Vector2(0, -1),
	new Vector2(0, 0),
	new Vector2(1, 0),
];

const templates: Record<TetrominoType, ReadonlyVector2[]> = {
	[TetrominoType.I]: TemplateI,
	[TetrominoType.L]: TemplateL,
	[TetrominoType.O]: TemplateO,
	[TetrominoType.S]: TemplateS,
	[TetrominoType.T]: TemplateT,
	[TetrominoType.Z]: TemplateZ,
};

export default templates;
