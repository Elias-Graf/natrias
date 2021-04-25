import ServerMessage from "@/shared/ServerMessage";
import ServerMessageType from "@/shared/ServerMessageType";

const socket = new WebSocket("ws://localhost:4001");

socket.addEventListener("message", (sockMsg) => {
	const msg: ServerMessage = JSON.parse(sockMsg.data);

	switch (msg.type) {
		case ServerMessageType.Board:
			document.body.innerText = msg.board
				.map((row) => row.map((block) => (block ? "o" : "x")).join(""))
				.join("\n");
			break;
		case ServerMessageType.Start:
			console.log("Game started");
			break;
		case ServerMessageType.Stop:
			console.log("Game stopped");
			break;
	}
});
