import Connection from "./Connection";
import { EventEmitter } from "events";
import WebSocket from "ws";
import * as http from "http";
import WebSocketClient from "./WebSocketClient";

export default class WebSocketConnection
	extends EventEmitter
	implements Connection {
	private socket;

	public constructor() {
		super();

		this.socket = new WebSocket.Server({ port: 4001 });

		this.socket.addListener("connection", this.handleConnect);
	}

	private handleConnect = (
		clientSocket: WebSocket,
		request: http.IncomingMessage
	) => {
		const ip = request.connection.remoteAddress;

		if (!ip) throw new Error("Connection had no ip");

		const client = new WebSocketClient(clientSocket, ip);

		this.emit("connect", client);

		clientSocket.addListener("close", () => this.handleClose(client));
		clientSocket.addListener("message", (m) => this.handleMessage(client, m));
	};
	private handleClose = (client: WebSocketClient) => {
		this.emit("disconnect", client);
	};
	private handleMessage = (client: WebSocketClient, data: WebSocket.Data) => {
		this.emit("message", client, JSON.parse(data.toString()));
	};
}
