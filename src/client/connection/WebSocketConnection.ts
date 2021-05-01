import Connection from "./connection";
import { EventEmitter } from "events";
import ClientMessage from "shared/ClientMessage";

export default class WebSocketConnection
	extends EventEmitter
	implements Connection {
	private socket;

	public constructor(url: string) {
		super();

		this.socket = new WebSocket(url);
		this.socket.addEventListener("message", this.handleMessage);
	}

	public send(m: ClientMessage): void {
		this.socket.send(JSON.stringify(m));
	}

	private handleMessage = (sockMsg: MessageEvent) => {
		this.emit("message", JSON.parse(sockMsg.data));
	};
}
