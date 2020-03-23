import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";
import { types } from "util";

enum EntityState {
    None = 0,
    Delete = 1,
    Hurt = 2,
    Cold = 4,
    Hunger = 8,
    Attack = 16,
    Walk = 32,
    Idle = 64,
    Heal = 128,
    Web = 132
}

enum EntityType {
    PICKAXE,
    SWORD,
    HAMMER,
    HAT,
    WALL,
    SPIKE,
    DOOR,
    FOOD,
    MOB //etc..
}

class createWorld {
    items = {STONE_SWORD:{id:0, range: 75, range2:25 , damage:19, odamage:2, itype:EntityType.SWORD },
        HAND:{id:14, range: 50, range2: 25, damage: 5, odamge:1, itype:EntityType.PICKAXE },
        WOOD_WALL:{id:16, sid: 0/* ah id is useless only for crafting needs spirite id atleast in modern version*/ hp: 1500, tier:0, itype:EntityType.WALL },
        AME_SWORD:{id:50, range:80 ,range2:25, damage:30, odamage:10, itype:EntityType.SWORD},
        DIA_HELMET:{id:45, coldProt:0, dmgProt:5, itype:EntityType.HAT},
        };
    players = [];
    mapSize = {x: 10, y: 10 };
    chunks = new Array(this.mapSize.x);
    tickRate:number=64;
    
    constructor() {
        for (let i = 0; i < this.mapSize.x; i++) {
            this.chunks[i] = new Array(this.mapSize.y);
            for (let y = 0; y < this.mapSize.y; y++) {
                this.chunks[i][y] = [];
            }
        }
    }
    
}

class Unity {

}

class getUtils {
    broadcastPacket(packet) {
        for (let player of world.players) {
            if (player.online) { player.ws.send(packet); };
        }
    } sendToplayers(list, packet) {
        for (let player of list) {
            if (player.online) { player.ws.send(packet); };
        }
    } getLeaderboard() {
        let list = [];
        for (let player of world.players) {
            list.push({ i: player.pid, n: player.nick, p: player.score });
        }
        return list;
    } toHex(data) {
        return [data%256,Math.floor(data/ 256)];
    } angleToRad(ag) {
        return ag / 128 * Math.PI;
    } angleToCoords(ag) {
        ag = utils.angleToRad(ag);
        return { "x": Math.cos(ag), "y": Math.sin(ag) };
    } distance(vector) {
        return (vector.x ** 2 + vector.y ** 2) ** 0.5;
    } Uint8concat(arr1,arr2) {
        let res = new Uint8Array(arr1.length+arr2.length);
        res.set(arr1);
        res.set(arr2,arr1.length);
        return res
    }
}

interface Vector {
    x: number;
    y: number;
}

class Player {
    token: string;
    ws: WebSocket;
    type: number;
    pid: number;
    id: number;
    online: boolean = true;

    //INFOS
    nick: string;
    pos: Vector;
    angle: number; 
    action: number = EntityState.None;
    chunk: Vector;
    speed: number=300;
    tool = world.items.HAND;
    hat = world.items.DIA_HELMET;
    bag: boolean;
    score: number = 0;

    //UPDATING
    moving: boolean;
    attacking: boolean;
    update: boolean;
    updating: boolean;
    updateLoop: NodeJS.Timeout;
    attackLoop: NodeJS.Timeout;
    movVector: Vector;

    //BARS
    health: number = 100;
    temperature: number = 100;
    food: number = 100;
    
    constructor(nick: string, token: string, ws: WebSocket) {
        this.nick = nick;
        this.token = token;
        this.ws = ws;
        this.pos = { "x": 1 + Math.random() * 9998, "y": 1 + Math.random() * 9998 };
        this.movVector = { "x": 0, "y": 0 };
        for (let i = 1; i < 128; i++) {
            if (!world.players.find(e => e.pid == i)) {
                this.pid = i;
                break;
            }
        }
        world.players.push(this);
        this.ws.send(JSON.stringify([3, this.pid, 256, utils.getLeaderboard(), this.pos.x, this.pos.y, 256, 0, 0, null, [], 0]));
        this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
        this.sendInfos();
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        utils.broadcastPacket(JSON.stringify([2, this.pid, this.nick]));
        this.getInfos();
        this.updateLoop = setInterval(() => {
            if (this.moving || this.updating || this.action) {
                if (this.moving) {
                    this.pos.x += this.movVector.x/world.tickRate;
                    this.pos.y += this.movVector.y/world.tickRate;
                    // TODO physics here
                    this.pos.x = Math.min(Math.max(0, this.pos.x), world.mapSize.x * 1000-1);
                    this.pos.y = Math.min(Math.max(0, this.pos.y), world.mapSize.y * 1000-1);
                    let chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
                    if (this.chunk.x != chunk.x || chunk.y != this.chunk.y) {
                        this.updateChunk(chunk);
                    }
                }
                this.sendInfos();
                this.action = 0;
                this.updating = false;
            }
        }, 1000 / world.tickRate);
        this.attackLoop = null;
    }
    getInfos() {
        let list: any = [0, 0];
        let xmin = Math.max(-2+this.chunk.x,0),xmax=Math.min(3+this.chunk.x,world.mapSize.x),
            ymin = Math.max(-2+this.chunk.y,0),ymax=Math.min(3+this.chunk.y,world.mapSize.y);
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                for (let player of world.chunks[x][y]) {
                    list.push([player.infoPacket]);
                }
            }
        }
        this.ws.send(list);
    }
    move(dir) {
        if (dir) {
            this.movVector.x = (dir % 4) == 2 ? 1 : -(dir % 4);
            this.movVector.y = Math.floor(dir / 4) == 2 ? -1 : Math.floor(dir / 4);
            let tot = utils.distance(this.movVector);
            this.movVector.x *= this.speed / tot;
            this.movVector.y *= this.speed / tot;
            this.moving = true;
        } else {
            this.moving = false;
        }
    }
    rotate(ag) {
        this.angle = ag;
        this.updating = true;
    }
    hit(ag) {
        this.angle = ag;
        this.attacking = true;
        this.hit2()
        if (!this.attackLoop) {
            this.attackLoop = setInterval(() => {
                if (this.attacking) {
                    this.hit2()
                } else {
                    clearInterval(this.attackLoop);
                    this.attackLoop = null;
                }
            }, 500);
        }
    }
    hit2() {
        this.action |= EntityState.Attack;
        let agCoords = utils.angleToCoords(this.angle);
        let center = { "x": agCoords.x * (this.tool.range + this.tool.range2) + this.pos.x, "y": agCoords.y * (this.tool.range + this.tool.range2) + this.pos.y };
        let ymin = Math.max(-1 + this.chunk.y, 0), ymax = Math.min(2 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-1 + this.chunk.x, 0), xmax = Math.min(2 + this.chunk.x, world.mapSize.x);
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                let players = world.chunks[x][y].filter(e => utils.distance({ x: center.x - e.pos.x, y: center.y - e.pos.y }) < this.tool.range);
                for (let player of players) {player.damage(this.tool.damage,this),player}
            }
        }
    }
    stopHitting() {
        this.attacking = false;
    }
    damage(dmg,player) {
        this.health -= dmg;
        this.action |= EntityState.Hurt;
        if (this.health < 0) {
            this.die();
        }
    }
    die() {
        //send death packet
        clearInterval(this.updateLoop);
        clearInterval(this.attackLoop);
        this.sendInfos(false);
        world.players = world.players.filter(e => e == this);
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e == this);
        this.ws.close();
    }
    updateChunk(chunk) {
        let ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x);
        let list = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (Math.abs(chunk.x - x) > 2 || Math.abs(chunk.y - y) > 2) {
                    list = list.concat(world.chunks[x][y]);
                }
            }
        }
        this.sendInfos(false, list);
        ymin = Math.max(-2 + chunk.y, 0), ymax = Math.min(3 + chunk.y, world.mapSize.y),
            xmin = Math.max(-2 + chunk.x, 0), xmax = Math.min(3 + chunk.x, world.mapSize.x);
        list = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (Math.abs(this.chunk.x - x) > 2 || Math.abs(this.chunk.y - y) > 2) {
                    list = list.concat(world.chunks[x][y]);
                }
            }
        }
        this.sendInfos(true, list);
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e=> e!= this);
        this.chunk = chunk;
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        
    }
    sendInfos(visible = true, to: Player[] = null) {
        if (to !== null) {
            let arr = new Uint8Array([0,0]);
            for (let player of to) {
                arr = utils.Uint8concat(arr, player.infoPacket(visible));
                player.ws.send(this.infoPacket(visible));
            }
            this.ws.send(arr);
        } else {
            this.sendToRange(this.infoPacket(visible));
        }
    }
    infoPacket(visible = true) {
        if (visible) {
            let pos = { "x": utils.toHex(this.pos.x), "y": utils.toHex(this.pos.y) };
            let id = utils.toHex(this.id);
            let infos = utils.toHex(this.tool.id+this.hat.id*128+(this.bag ? 1 : 0)*16384);
            return new Uint8Array([0, 0, this.pid, this.action, this.type, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], id[0], id[1], infos[0], infos[1]]);
        } else {
            return new Uint8Array([0, 0, this.pid, 1, this.type, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }
    sendToRange(packet) {
        for (let x = -2; x <= 2; x++) {
            if (this.chunk.x + x >= 0 && this.chunk.x + x < world.mapSize.x) {
                for (let y = -2; y <= 2; y++) {
                    if (this.chunk.y + y >= 0 && this.chunk.y + y < world.mapSize.y) {
                        for (const player of world.chunks[x + this.chunk.x][y + this.chunk.y]) {
                            player.ws.send(packet);
                        }
                    }
                }
            }
        }
    }
}

const server = https.createServer({
    key: fs.readFileSync("data/ssl/key.pem"),
    cert: fs.readFileSync("data/ssl/cert.pem")
}).listen(8080);

const wss = new WebSocket.Server({ server });

let world = new createWorld();
let utils = new getUtils();

wss.on("connection", (ws, req) => {
    let player: Player;

    ws.binaryType = "arraybuffer";
    ws.on("message", (message) => {
        try {
            if (message instanceof ArrayBuffer) {
                //nothing
            } else {
                let data = JSON.parse(message.toString());
                if (!player) {
                    // player = world.players.find(e => e.token == data[1]);
                    // if (!player) {
                    //   player = new Player(data[1], data[2], ws);
                    // }
                    player = new Player(data[0], null, ws);
                } else {
                    switch (data[0]) {
                        case 2:
                            player.move(data[1]);
                            break;
                        case 3:
                            player.rotate(data[1]);
                            break;
                        case 4:
                            player.hit(data[1]);
                            break;
                        case 14:
                            player.stopHitting();
                            break;
                    }
                }
            }
        } catch (e) {
            console.log(e, message);
        }
    });
    ws.on("close", (code, reason) => {
        if (player) {player.online = false};
        ws.close();
    });
});


server.on("request", (req, res) => {
    if (req.url == "/info.txt") {
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify([{ name: "Test Server", players: { online: 0, max: 0 }, "ip": "localhost", "port": 8080, ssl: true } ]));
    }
});