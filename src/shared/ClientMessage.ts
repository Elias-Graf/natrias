import ClientMessageType from "./ClientMessageType";
import Dir from "./Dir";

interface Move {
	dir: Dir;
	type: ClientMessageType.Move;
}
interface Rotate {
	type: ClientMessageType.Rotate;
}
interface Restart {
	type: ClientMessageType.Restart;
}

type ClientMessage = Move | Restart | Rotate;

export default ClientMessage;
