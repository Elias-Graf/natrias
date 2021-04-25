import ServerMessage from "shared/ServerMessage";

export default interface Client {
	readonly ip: string;
	send(m: ServerMessage): void;
}
