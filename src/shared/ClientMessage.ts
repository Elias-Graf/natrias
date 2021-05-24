import ClientMessageType from "./ClientMessageType";
import Dir from "./Dir";

interface Move {
	dir: Dir;
	type: ClientMessageType.Move;
}
interface Restart {
	type: ClientMessageType.Restart;
}
interface Rotate {
	type: ClientMessageType.Rotate;
}
interface SwitchWithHoldingPiece {
	type: ClientMessageType.SwitchWithHoldingPiece;
}

type ClientMessage = Move | Restart | Rotate | SwitchWithHoldingPiece;

export default ClientMessage;
