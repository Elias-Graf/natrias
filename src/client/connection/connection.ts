import { EventEmitter } from "events";
import ClientMessage from "shared/ClientMessage";
import ServerMessage from "shared/ServerMessage";

export default interface Connection extends EventEmitter {
	addListener(type: "message", cb: (m: ServerMessage) => void): this;
	removeListener(type: "message", cb: (m: ServerMessage) => void): this;
	send(m: ClientMessage): void;
}
