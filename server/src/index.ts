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
    items = {SWORD:{id:0, range: 75, range2:25 , damage:19, odamage:2, itype:EntityType.SWORD },
        HAND:{id:14, range: 50, range2: 25, damage: 5, odamge:1, itype:EntityType.PICKAXE },
        WALL:{id:16, sid: 0/* ah id is useless only for crafting needs spirite id atleast in modern version*/, hp: 1500, tier:0, itype:EntityType.WALL },
        SWORD_AMETHYST:{id:50, range:80 ,range2:25, damage:30, odamage:10, itype:EntityType.SWORD},
        DIAMOND_HELMET:{id:45, coldProt:0, dmgProt:5, itype:EntityType.HAT},
        };
    //recipes = [{ r: [[3, 30], [2, 5]], w: 0, f: 0, id: this.items.FIRE, time: .1 }, { r: [[3, 40], [2, 20]], w: 0, f: 0, id: this.items.WORKBENCH, time: 1 / 15 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, id: this.items.SWORD, time: 1 / 15 }, { r: [[15, 1], [3, 60], [2, 20]], w: 1, f: 0, id: this.items.PICK, time: 1 / 15 }, { r: [[4, 3], [3, 20]], w: 0, f: 1, id: this.items.SEED, time: .1 }, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, id: this.items.PICK_GOLD, time: .05 }, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, id: this.items.PICK_DIAMOND, time: 1 / 30 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, id: this.items.SWORD_GOLD, time: .05 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, id: this.items.SWORD_DIAMOND, time: 1 / 30 }, { r: [[3, 15]], w: 0, f: 0, id: this.items.PICK_WOOD, time: .2 }, { r: [[3, 20]], w: 1, f: 0, id: this.items.WALL, time: .2 }, { r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, id: this.items.SPIKE, time: .05 }, { r: [[18, 1]], w: 0, f: 1, id: this.items.COOKED_MEAT, time: .1 }, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, id: this.items.BIG_FIRE, time: .1 }, { r: [[22, 3]], w: 1, f: 0, id: this.items.BANDAGE, time: .2 }, { r: [[16, 1], [2, 20]], w: 1, f: 0, id: this.items.STONE_WALL, time: .2 }, { r: [[23, 1], [5, 20]], w: 1, f: 0, id: this.items.GOLD_WALL, time: .2 }, { r: [[24, 1], [6, 20]], w: 1, f: 0, id: this.items.DIAMOND_WALL, time: .2 }, { r: [[3, 60]], w: 1, f: 0, id: this.items.WOOD_DOOR, time: .125 }, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, id: this.items.CHEST, time: .05 }, { r: [[23, 1], [2, 35]], w: 1, f: 0, id: this.items.STONE_SPIKE, time: .05 }, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, id: this.items.GOLD_SPIKE, time: .05 }, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, id: this.items.DIAMOND_SPIKE, time: .05 }, { r: [[26, 1], [2, 60]], w: 1, f: 0, id: this.items.STONE_DOOR, time: .125 }, { r: [[31, 1], [5, 60]], w: 1, f: 0, id: this.items.GOLD_DOOR, time: .125 }, { r: [[32, 1], [6, 60]], w: 1, f: 0, id: this.items.DIAMOND_DOOR, time: .125 }, { r: [[34, 8], [22, 4]], w: 1, f: 0, id: this.items.EARMUFFS, time: 1 / 15 }, { r: [[36, 1], [34, 5], [35, 10], [22, 6]], w: 1, f: 0, id: this.items.COAT, time: .04 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, id: this.items.SPEAR, time: 1 / 15 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, id: this.items.GOLD_SPEAR, time: .05 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, id: this.items.DIAMOND_SPEAR, time: 1 / 30 }, { r: [[3, 150], [2, 100], [5, 50]], w: 1, f: 0, id: this.items.FURNACE, time: .05 }, { r: [[47, 3], [34, 2]], w: 1, f: 0, id: this.items.EXPLORER_HAT, time: 1 / 15 }, { r: [[2, 150], [3, 100]], w: 1, f: 0, id: this.items.STONE_HELMET, time: .05 }, { r: [[2, 180], [3, 120], [5, 100], [43, 1]], w: 1, f: 0, id: this.items.GOLD_HELMET, time: .025 }, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, id: this.items.DIAMOND_HELMET, time: 1 / 60 }, { r: [[47, 5], [22, 5], [35, 5]], w: 1, f: 0, id: this.items.BOOK, time: 1 / 30 }, { r: [[3, 30]], w: 0, f: 1, id: this.items.PAPER, time: 1 / 3 }, { r: [[22, 10], [35, 5]], w: 1, f: 0, id: this.items.BAG, time: .05 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, id: this.items.SWORD_AMETHYST, time: .025 }, { r: [[6, 60], [5, 90], [49, 30], [8, 1]], w: 1, f: 0, id: this.items.PICK_AMETHYST, time: .025 }, { r: [[49, 50], [6, 100], [5, 120], [40, 1]], w: 1, f: 0, id: this.items.AMETHYST_SPEAR, time: .025 }, { r: [[3, 120], [2, 60]], w: 1, f: 0, id: this.items.HAMMER, time: 1 / 15 }, { r: [[3, 160], [2, 120], [5, 80], [53, 1]], w: 1, f: 0, id: this.items.HAMMER_GOLD, time: .05 }, { r: [[6, 80], [2, 200], [5, 150], [54, 1]], w: 1, f: 0, id: this.items.HAMMER_DIAMOND, time: 1 / 30 }, { r: [[6, 160], [49, 60], [5, 250], [55, 1]], w: 1, f: 0, id: this.items.HAMMER_AMETHYST, time: .025 }, { r: [[25, 1], [49, 20]], w: 1, f: 0, id: this.items.AMETHYST_WALL, time: .2 }, { r: [[57, 1], [49, 20], [2, 15]], w: 1, f: 0, id: this.items.AMETHYST_SPIKE, time: .05 }, { r: [[33, 1], [49, 60]], w: 1, f: 0, id: this.items.AMETHYST_DOOR, time: .125 }, { r: [[37, 1], [61, 20], [62, 10]], w: 1, f: 0, id: this.items.CAP_SCARF, time: 1 / 60 }, { r: [[6, 1], [22, 1]], w: 1, f: 0, id: this.items.BLUE_CORD, time: 1 / 3 }];
    recipes = [];
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
    score: number = 0
    inv = new Array(10); // don't know what is max(with bag)
    water: boolean;
    fire: boolean;

    //UPDATING
    moving: boolean;
    attacking: boolean;
    update: boolean;
    updating: boolean;
    updateLoop: NodeJS.Timeout;
    attackLoop: NodeJS.Timeout;
    craftLoop: any;
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
        if (this.health <= 0) {
            player.score += Math.floor(this.score/3)
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
    craft(id) {
        if (!this.craftLoop) {
            let recipe = world.recipes.find(e => e.id==id);
            recipe = recipe ? recipe : {r:[],w:0,f:0,time:0};
            let Slot = this.inv.find(e=> e.id == id);
            if (!Slot) {Slot = this.inv.find(e=> e.id)};
            if (Slot && (this.water || !recipe.w) && (this.fire || !recipe.f)) {
                //check if recipe in INV and remove them.
                this.craftLoop = setTimeout(()=>{
                    Slot.id = id;
                    Slot.am = Slot.am ? Slot.am+1 : 1;
                },recipe.time*1000);
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