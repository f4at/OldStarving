import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";

function toHex(data) {
  return Math.floor(data % 256 / 256);
}

function angleToRad(ag) {
  return ag / 180 * Math.PI;
}

function angleToCoords(ag) {
  ag = angleToRad(ag);
  return { "x": Math.sin(ag), "y": Math.cos(ag) };
}

function distance(vector) {
  return (vector.x ** 2 + vector.y ** 2) ** 0.5;
}

const server = https.createServer({
  key: fs.readFileSync("data/ssl/key.pem"),
  cert: fs.readFileSync("data/ssl/cert.pem")
}).listen(8080);

const wss = new WebSocket.Server({ server });
const mapSize = { x: 10, y: 10 };

var tools = [{ "n": "hand", "range": 0, range2: 0, "damage": 5 }];
var players = [];
var chunks = new Array(mapSize.x);
for (var i = 0; i < mapSize.x; i++) {
  chunks[i] = new Array(mapSize.y);
  for (let y = 0; y < mapSize.y; y++) {
    chunks[i][y] = [];
  }
}

function broadcastPacket(packet) {
  for (let player of players) {
    if (player.online) { player.ws.send(packet); };
  }
}

function sendToPlayers(list, packet) {
  for (let player of list) {
    if (player.online) { player.ws.send(packet); };
  }
}

function getLeaderboard() {
  let list = [];
  for (let player of players) {
    list.push({ i: player.pid, n: player.nickname, p: player.score });
  }
  return list;
}

interface Vector {
  x: number;
  y: number;
}

class Player {
  nick: string;
  token: string;
  ws: WebSocket;
  health: number = 100;
  food: number = 100;
  temp: number = 100;
  pos: Vector;
  angle: number;
  type: number;
  tool: number;
  helmet: number;
  score: number;
  moving: boolean;
  attacking: boolean;
  attack2: boolean;
  dmg: number;
  healing: boolean = true;
  movVector: Vector;
  online: boolean = true;
  id: number;
  pid: number;
  chunk: Vector;
  updating: boolean;
  updateLoop: NodeJS.Timeout;
  attackLoop: NodeJS.Timeout;
  speed: number;
  update: boolean;

  constructor(nick: string, token: string, ws: WebSocket) {
    this.nick = nick;
    this.token = token;
    this.ws = ws;
    this.pos = { "x": Math.random() * 10000, "y": Math.random() * 10000 };
    this.movVector = { "x": 0, "y": 0 };
    for (let i = 1; i < 128; i++) {
      if (!players.find(e => e.pid == i)) {
        this.pid = i;
        break;
      }
    }
    this.ws.send(JSON.stringify([3, this.pid, 256, getLeaderboard(), this.pos.x, this.pos.y, 256, 0, 0, "null", [], 0]));
    players.push(this);
    broadcastPacket(JSON.stringify([2, this.pid, this.nick]));
    this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
    chunks[this.chunk.x][this.chunk.y].push(this);
    this.sendInfos();
    this.getInfos();
    this.updateLoop = setInterval(() => {
      if (this.moving || this.updating) {
        if (this.moving) {
          this.pos.x += this.movVector.x;
          this.pos.y += this.movVector.y;
          // TODO physics here
          this.pos.x = Math.min(Math.max(0, this.pos.x), mapSize.x * 1000);
          this.pos.y = Math.min(Math.max(0, this.pos.y), mapSize.y * 1000);
          this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
          if (this.chunk.x != this.chunk.x || this.chunk.y != this.chunk.y) {
            this.updateChunk(this.chunk);
          }
        }
        this.sendInfos();
      }
    }, 1 / 64);
    this.attackLoop = null;

  }

  getInfos() {
    let list: any = [0, 0];
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        for (let player of chunks[x + this.chunk.x][y + this.chunk.y]) {
          list.push([player.infoPacket]);
        }
      }
    }
    this.ws.send(list);
  }

  move(dir) {
    if (dir) {
      this.movVector.x = dir % 4 * 2 - 3;
      this.movVector.y = Math.floor(dir / 4) * 2 - 3;
      let tot = distance(this.movVector);
      this.movVector.x *= this.speed / tot;
      this.movVector.x *= this.speed / tot;
      this.moving = true;
    } else {
      this.moving = false;
    }
  }

  rotate(ag) {
    this.angle = ag;
    this.update = true;
  }

  attack(ag) {
    this.angle = ag;
    this.attacking = true;
    this.attack2 = true;
    this.updating = true;
    if (!this.attackLoop) {
      this.attackLoop = setInterval(() => {
        if (this.attacking) {
          this.attack2 = true;
          this.updating = true;
          let tool = tools[this.tool];
          let agCoords = angleToCoords(this.angle);
          let center = { "x": agCoords.x * (tool.range + tool.range2) + this.pos.x, "y": agCoords.y * (tool.range + tool.range2) + this.pos.y };
          this.hit(center, tool.range, tool.damage);
          // this.attackingCircle = { "center": { "x": this.pos.x + this.chunk.x, "y"}, "rayon"}; TODO zero dumb?
        } else {
          clearInterval(this.attackLoop);
          this.attackLoop = null;
        }
      }, 0.5);
    }
  }

  hit(center, range, damage, odamage = 0) {
    for (let x = -1; x <= 1; x++) {
      if (this.chunk.x + x >= 0 && this.chunk.x + x < mapSize.x) {
        for (let y = -1; y <= 1; y++) {
          if (this.chunk.y + y >= 0 && this.chunk.y + y < mapSize.y) {
            let players = chunks[x + this.chunk.x][y + this.chunk.y].filter(e => distance({x: center.x - e.pos.x, y: center.y - e.pos.y}) < range);
            for (let player of players) { player.damage(damage); }
          }
        }
      }
    }
  }

  damage(dmg) {
    this.health -= dmg;
    this.dmg = 1;
    if (this.health < 0) {
      this.die();
    }
  }

  die() {
    //send death packet
    clearInterval(this.updateLoop);
    clearInterval(this.attackLoop);
    this.sendInfos(false);
    players = players.filter(e => e == this);
    chunks[this.chunk.x][this.chunk.y] = chunks[this.chunk.x][this.chunk.y].filter(e => e == this);
    this.ws.close();
  }

  stopAttack(ag) {
    this.attacking = false;
  }

  updateChunk(chunk) {
    let ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, mapSize.y),
      xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, mapSize.x);
    let list = [];
    for (let x = xmin; x < xmax; x++) {
      for (let y = ymin; x < ymax; y++) {
        if (Math.abs(chunk.x - x) > 2 || Math.abs(chunk.y - y) > 2) {
          list = list.concat(chunks[x][y]);
        }
      }
    }
    this.sendInfos(false, list);
  }

  sendInfos(visible = true, to: Player[] = null) {
    if (to !== null) {
      for (let player of to) {
        player.ws.send(this.infoPacket(visible));
      }
    } else {
      this.sendToRange(this.infoPacket(visible));
    }
  }

  infoPacket(visible = true) {
    if (visible) {
      let pos = { "x": toHex(this.pos.x), "y": toHex(this.pos.y) };
      let id = toHex(this.id);
      let action = this.dmg * 2;
      return new Uint8Array([0, 0, action, this.pid, this.type, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], id[0], id[1], this.tool, this.helmet]);
    } else {
      let id = toHex(this.id);
      return new Uint8Array([0, 0, 1, this.pid, this.type, 0, 0, 0, 0, 0, id[0], id[1], 0, 0]);
    }
  }

  sendToRange(packet) {
    for (let x = -2; x <= 2; x++) {
      if (this.chunk.x + x >= 0 && this.chunk.x + x < mapSize.x) {
        for (let y = -2; y <= 2; y++) {
          if (this.chunk.y + y >= 0 && this.chunk.y + y < mapSize.y) {
            for (const player of chunks[x + this.chunk.x][y + this.chunk.y]) {
              player.ws.send(packet);
            }
          }
        }
      }
    }
  }
}

wss.on("connection", (ws, req) => {
  let player: Player;

  ws.binaryType = "arraybuffer";
  ws.on("message", (message) => {
    try {
      if (message instanceof ArrayBuffer) {
        let data = new Uint8Array(message);
        switch (data[0]) {
          case 2:
            player.move(data[1]);
            break;
          case 3:
            player.rotate(data[1]);
            break;
        }
      } else {
        let data = JSON.parse(message.toString());
        if (!player) {
          // player = players.find(e => e.token == data[1]);
          // if (!player) {
          //   player = new Player(data[1], data[2], ws);
          // }
          player = new Player(data[0], null, ws);
        } else {
          switch (data[0]) {
            case 3:
              break;
          }
        }
      }
    } catch (e) {
      console.log(e, message);
    }
  });
  ws.on("close", (code, reason) => {
    if (player) {
      player.online = false;
    }
    ws.close();
  });
});

server.on("request", (req, res) => {
  if (req.url == "/info.txt") {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify([{ name: "Test Server", players: { online: 0, max: 0 } }]));
  }
});
