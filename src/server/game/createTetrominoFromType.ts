import TetrominoType from "./TetrominoType";
import TwoRotationTetromino from "./TwoRotationTetromino";
import NoRotationTetromino from "./NoRotationTetromino";
import TetrominoLogic from "./TetrominoLogic";
import FourRotationTetromino from "./FourRotationTetromino";

export function createTetrominoFromType(type: TetrominoType): TetrominoLogic {
	switch (type) {
		case TetrominoType.O:
			return new NoRotationTetromino(type);
		case TetrominoType.I:
		case TetrominoType.S:
		case TetrominoType.Z:
			return new TwoRotationTetromino(type);
		case TetrominoType.L:
		case TetrominoType.T:
		case TetrominoType.J:
			return new FourRotationTetromino(type);
	}
}
