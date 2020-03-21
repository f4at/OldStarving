import WebSocket, { AddressInfo } from "ws";
import * as http from "http";

class Player {
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}

const server = http.createServer((req, res) => {
  if (req.url == "/info") {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify([{ "name": "Test Server", "players": { "online": 0, "max": 0 } }]));
  }
}).listen(8080);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  let player;

  ws.on("message", function incoming(message) {
    const packet = JSON.parse(message.toString());
    console.log(packet);

    if (typeof packet[0] == "string") {
      player = new Player(packet[0]);
      ws.send(JSON.stringify([3, 0, 256, [], 100, 150, 256, 0, 0, null, [], 0]));
    }
  });
});

wss.on("listening", () => {
  let address = wss.address();
  if (typeof address === "object") {
    address = address as AddressInfo;
    address = address.address + ":" + address.port;
  }

  console.log("Listening on " + address);
});