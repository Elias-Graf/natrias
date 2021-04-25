import ServerMessage from "shared/ServerMessage";
import UUID from "shared/UUID";
import WebSocket from "ws";
import uuid from "uuid";
import Client from "./Client";

export default class WebSocketClient implements Client {
	public readonly uuid: UUID;

	public constructor(private socket: WebSocket, public readonly ip: string) {
		this.uuid = uuid.v4();
	}

	public send(m: ServerMessage): void {
		this.socket.send(JSON.stringify(m));
	}
}
