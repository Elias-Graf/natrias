import ClientMessageType from "./ClientMessageType";
import Dir from "./Dir";

interface Move {
	dir: Dir;
	type: ClientMessageType.Move;
}
interface Rotate {
	type: ClientMessageType.Rotate;
}

type ClientMessage = Move | Rotate;

export default ClientMessage;
