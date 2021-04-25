import ServerMessage from "shared/ServerMessage";
import UUID from "shared/UUID";

export default interface Client {
	readonly ip: string;
	send(m: ServerMessage): void;
	readonly uuid: UUID;
}
