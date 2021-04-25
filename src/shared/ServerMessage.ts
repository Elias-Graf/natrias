import ServerMessageType from "./ServerMessageType";

interface SendBoard {
	board: boolean[][];
	type: ServerMessageType.Board;
}
interface StartGame {
	type: ServerMessageType.Start;
}
interface StopGame {
	type: ServerMessageType.Stop;
}

type ServerMessage = SendBoard | StartGame | StopGame;

export default ServerMessage;
