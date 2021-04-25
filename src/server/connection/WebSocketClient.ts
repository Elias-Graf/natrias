import ServerMessage from "shared/ServerMessage";
import WebSocket from "ws";
import Client from "./Client";

export default class WebSocketClient implements Client {
	public constructor(private socket: WebSocket, public readonly ip: string) {}

	public send(m: ServerMessage): void {
		this.socket.send(JSON.stringify(m));
	}
}
