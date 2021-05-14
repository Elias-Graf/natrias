import TetrominoType from "server/game/TetrominoType";
import Board from "./Board";
import ServerMessageType from "./ServerMessageType";
import UUID from "./UUID";

interface SendOpponentBoard {
	board: Board;
	nextUp: TetrominoType[];
	opponentId: UUID;
	type: ServerMessageType.OpponentBoard;
}
interface StartGame {
	opponentBoard: Board;
	opponentNextUp: TetrominoType[];
	type: ServerMessageType.Start;
	yourBoard: Board;
	yourNextUp: TetrominoType[];
}
interface StopGame {
	type: ServerMessageType.Stop;
}
interface SendYourBoard {
	board: Board;
	nextUp: TetrominoType[];
	type: ServerMessageType.YourBoard;
}

type ServerMessage = SendOpponentBoard | StartGame | StopGame | SendYourBoard;

export default ServerMessage;
