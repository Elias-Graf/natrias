import Board from "./Board";
import ServerMessageType from "./ServerMessageType";
import UUID from "./UUID";

interface SendOpponentBoard {
	board: Board;
	opponentId: UUID;
	type: ServerMessageType.OpponentBoard;
}
interface StartGame {
	type: ServerMessageType.Start;
}
interface StopGame {
	type: ServerMessageType.Stop;
}
interface SendYourBoard {
	board: Board;
	type: ServerMessageType.YourBoard;
}

type ServerMessage = SendOpponentBoard | StartGame | StopGame | SendYourBoard;

export default ServerMessage;
