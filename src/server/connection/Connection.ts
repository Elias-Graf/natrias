import { EventEmitter } from "events";
import ClientMessage from "shared/ClientMessage";
import Client from "./Client";

export default interface Connection extends EventEmitter {
	addListener(type: "connect", cb: (c: Client) => void): this;
	addListener(type: "disconnect", cb: (c: Client) => void): this;
	addListener(type: "message", cb: (c: Client, m: ClientMessage) => void): this;
	emit(type: "connect", c: Client): boolean;
	emit(type: "disconnect", c: Client): boolean;
	emit(type: "message", c: Client, message: ClientMessage): boolean;
	removeListener(type: "connect", cb: (c: Client) => void): this;
	removeListener(type: "disconnect", cb: (c: Client) => void): this;
	removeListener(
		type: "message",
		cb: (c: Client, message: ClientMessage) => void
	): this;
}
