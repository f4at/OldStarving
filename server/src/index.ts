import WebSocket, { AddressInfo } from 'ws';

class Player {
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  let player;

  ws.on('message', function incoming(message) {
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