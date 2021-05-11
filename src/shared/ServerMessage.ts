import Tetromino from "server/game/Tetromino";
import Board from "./Board";
import ServerMessageType from "./ServerMessageType";
import UUID from "./UUID";

interface SendOpponentBoard {
	board: Board;
	opponentId: UUID;
	type: ServerMessageType.OpponentBoard;
}
interface StartGame {
	opponentBoard: Board;
	type: ServerMessageType.Start;
	yourBoard: Board;
	yourNextUp: Tetromino[];
}
interface StopGame {
	type: ServerMessageType.Stop;
}
interface SendYourBoard {
	board: Board;
	nextUp: Tetromino[];
	type: ServerMessageType.YourBoard;
}

type ServerMessage = SendOpponentBoard | StartGame | StopGame | SendYourBoard;

export default ServerMessage;
