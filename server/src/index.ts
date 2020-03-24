import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";
import {EntityType, Entity, Clothes, Tool, Items, DamageType, Usable} from './Item';
import { emit } from "cluster";

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

class World {
    players: Player[];
    mapSize: Vector = { x: 10, y: 10 };
    chunks: Player[][][] = new Array(this.mapSize.x);
    tickRate: number = 64;
    stime: number = new Date().getTime();
    mode: 0; //id of mode, probably useless for the moment.
    constructor() {
        for (let i = 0; i < this.mapSize.x; i++) {
            this.chunks[i] = new Array(this.mapSize.y);
            for (let y = 0; y < this.mapSize.y; y++) {
                this.chunks[i][y] = [];
            }
        }
    }  
    getTime() {
        return (new Date().getTime()-this.stime)%480000;
    }
    isDay() {
        return this.getTime() < 240000 ? true : false;
    }
    getPlayers() {
        return this.players.map(player => ({ i: player.pid, n: player.nick, p: player.score }));
    }

}

abstract class Utils {
    static broadcastPacket(packet) {
        Utils.sendToPlayers(world.players, packet);
    }

    static sendToPlayers(list: Player[], packet) {
        for (let player of list) {
            if (player.online) { player.ws.send(packet); };
        }
    }

<<<<<<< Updated upstream
    static getLeaderboard() {
        return world.players.map(player => ({ id: player.pid, nickname: player.nick, score: player.score, displayName: player.displayName }));
    }

=======
>>>>>>> Stashed changes
    static toHex(data: number) {
        return [data % 256, Math.floor(data / 256)];
    }

    static toRadians(angle: number) {
        return angle / 128 * Math.PI;
    }

    static angleToCoords(angle: number) {
        angle = Utils.toRadians(angle);
        return { "x": Math.cos(angle), "y": Math.sin(angle) };
    }

    static distance(vector: Vector) {
        return (vector.x ** 2 + vector.y ** 2) ** 0.5;
    }

    static concatUint8(array1: Uint8Array, array2: Uint8Array) {
        let array = new Uint8Array(array1.length + array2.length);
        array.set(array1);
        array.set(array2, array1.length);
        return array;
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
    displayName: string;
    pos: Vector;
    angle: number;
    action: number = EntityState.None;
    chunk: Vector;
    speed: number = 300;
    tool: Tool = Items.HAND;
    clothes: Clothes = Items.AMETHYST_HELMET;
    bag: boolean;
    score: number = 0;
    inv = new Array(10);
    workbench: boolean;
    fire: boolean;
    counter: number;
    biome: any;

    //UPDATING
    moving: boolean;
    attacking: boolean;
    update: boolean;
    updating: boolean;
    updateLoop: NodeJS.Timeout;
    attackLoop: NodeJS.Timeout;
    craftTimeout: NodeJS.Timeout;
    movVector: Vector;

    //BARS
    health: number = 100;
    temperature: number = 100;
    food: number = 100;
    regen: number = 10;

<<<<<<< Updated upstream
    constructor(nick: string, token: string, ws: WebSocket) {
        this.nick = this.displayName = nick;
=======
    constructor(nick: string, token: string, ws: WebSocket) { //FRIENDLY reminder add token.
        this.nick = nick;
>>>>>>> Stashed changes
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
        for (let slot=0;slot<this.inv.length;slot++) { this.inv[slot] = {} };
        world.players.push(this);
<<<<<<< Updated upstream
=======
        this.ws.send(JSON.stringify([3, this.pid, 256, world.getPlayers(), this.pos.x, this.pos.y, 256, world.isDay()?0:1, world.mode])); //handshake.
>>>>>>> Stashed changes
        this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        Utils.broadcastPacket(JSON.stringify([2, this.pid, this.nick, this.displayName]));
        this.getInfos();
        this.counter = 0;
        this.updateLoop = setInterval(() => {
            this.counter += 1;
            if (this.counter%(world.tickRate*4) == 0) {
                let temperature = Math.max(0,Math.min(100,this.temperature+(this.moving ? 1 : 0)+(this.attacking ? 1 : 0)+(world.isDay() ? -2 : -10)+(this.fire ? 12 : 0)+this.clothes.coldProtection));
                let food = Math.max(0,this.food+(this.moving ? -3 : -1)+(this.attacking ? -2 : 0));
                if (this.temperature == temperature && temperature == 0) {
                    this.damage(10,null,false,false);
                }
                if (this.food == food && food == 0) {
                    this.damage(15,null,false,false);
                }
                console.log(temperature,food,this.health);
                this.food = food;
                this.temperature = temperature;
                this.ws.send( new Uint8Array([11,this.health,this.food,this.temperature]));
                 //send bars packet
            }
            if (this.counter%(world.tickRate*1) == 0) {
                this.updateCrafting();
            }
            if (this.moving || this.updating || this.action) {
                if (this.moving) {
                    this.pos.x += this.movVector.x / world.tickRate;
                    this.pos.y += this.movVector.y / world.tickRate;
                    // TODO physics here
                    this.pos.x = Math.min(Math.max(0, this.pos.x), world.mapSize.x * 1000 - 1);
                    this.pos.y = Math.min(Math.max(0, this.pos.y), world.mapSize.y * 1000 - 1);
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
        let list = [0, 0];
        let xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x),
            ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y);
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                for (let player of world.chunks[x][y]) {
                    list.push([player.infoPacket]);
                }
            }
        }
        this.ws.send(list);
    }

    move(dir: number) {
        if (dir) {
            this.movVector.x = (dir % 4) == 2 ? 1 : -(dir % 4);
            this.movVector.y = Math.floor(dir / 4) == 2 ? -1 : Math.floor(dir / 4);
            let tot = Utils.distance(this.movVector);
            this.movVector.x *= this.speed / tot;
            this.movVector.y *= this.speed / tot;
            this.moving = true;
        } else {
            this.moving = false;
        }
    }

    rotate(angle: number) {
        this.angle = angle;
        this.updating = true;
    }

    hit(angle: number) {
        this.angle = angle;
        this.attacking = true;
        this.hit2();
        if (!this.attackLoop) {
            this.attackLoop = setInterval(() => {
                if (this.attacking) {
                    this.hit2();
                } else {
                    clearInterval(this.attackLoop);
                    this.attackLoop = null;
                }
            }, 500);
        }
    }

    hit2() {
        this.action |= EntityState.Attack;
        let agCoords = Utils.angleToCoords(this.angle);
        let center = { "x": agCoords.x * (this.tool.range + this.tool.range2) + this.pos.x, "y": agCoords.y * (this.tool.range + this.tool.range2) + this.pos.y };
        let ymin = Math.max(-1 + this.chunk.y, 0), ymax = Math.min(2 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-1 + this.chunk.x, 0), xmax = Math.min(2 + this.chunk.x, world.mapSize.x);
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                let players = world.chunks[x][y].filter(e => Utils.distance({ x: center.x - e.pos.x, y: center.y - e.pos.y }) < this.tool.range);
                for (let player of players) { player.damage(this.tool.damage.pvp, this), player; }
            }
        }
    }

    stopHitting() {
        this.attacking = false;
    }

    damage(dmg: number, attacker: Player = null, report: Boolean = true, protection: Boolean = true) {
        this.health = Math.max(0,this.health-dmg+(protection ? this.clothes.damageProtection[Player ? DamageType.PvP : DamageType.PvE] : 0) );       
        if (this.health <= 0) {
            if (attacker) {
                attacker.score += Math.floor(this.score / 3);
            }
            this.die();
        }
        if (report) {
            this.action |= EntityState.Hurt;
        }
    }

    die() {
        //send death packet Eidt: no need lol client disconnect when player gets "dissapear" state, and thats not good.
        clearInterval(this.updateLoop);
        clearInterval(this.attackLoop);
        this.sendInfos(false);
        world.players = world.players.filter(e => e == this);
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e == this);
        this.ws.close();
    }

    updateChunk(chunk: Vector) {
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
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e != this);
        this.chunk = chunk;
        world.chunks[this.chunk.x][this.chunk.y].push(this);

    }

    sendInfos(visible = true, to: Player[] = null) {
        if (to !== null) {
            let arr = new Uint8Array([0, 0]);
            for (let player of to) {
                arr = Utils.concatUint8(arr, player.infoPacket(visible));
                player.ws.send(this.infoPacket(visible));
            }
            this.ws.send(arr);
        } else {
            this.sendToRange(this.infoPacket(visible));
        }
    }

    infoPacket(visible = true) {
        if (visible) {
            let pos = { "x": Utils.toHex(this.pos.x), "y": Utils.toHex(this.pos.y) };
            let id = Utils.toHex(this.id);
            let infos = Utils.toHex(this.tool.id + this.clothes.id * 128 + (this.bag ? 1 : 0) * 16384);
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

    craft(id: number) {
        if (!this.craftTimeout) {
            let infos = this.canCraft(id);
            if (infos) {
                let slot = infos[0],recipe = infos[1];
                for (let element of recipe.r) {
                    this.invDEL(element[0],element[1]);
                }
                this.craftTimeout = setTimeout(() => {
                    this.invADD(id,1,slot);
                    this.craftTimeout = null;
                }, recipe.time * 60000);
            }
        }
    }

    canCraft(id: number) {
        if (!this.craftTimeout) {
            let recipe = Items.find(e => e.id == id).recipe;
            recipe = recipe ? recipe : { r: [], w: 0, f: 0, time: 0 };
            if ( (this.workbench || !recipe.w) && (this.fire || !recipe.f) ) {
                let Slot = this.invFindSlot(id);
                if (Slot) {
                    let haveCraftingItems = true;
                    for (let element of recipe.r) {
                        if (!this.invFindSlot(element[0],element[1])) {
                            haveCraftingItems = false;
                            break;
                        }
                    } 
                    if (haveCraftingItems) {
                        return [Slot,recipe]; 
                    }
                }
            }
            
        }
    }

    updateCrafting() {
        let fire = false; // TODO Check if player next to fire or workbench, needs building/structures first.
        let workbench = false;
        if (workbench != this.workbench) {
            this.workbench = workbench;
            this.ws.send(new Uint8Array([19,workbench?1:0]))
        }
        if (fire != this.fire) {
            this.fire = fire;
            this.ws.send(new Uint8Array([20,fire?1:0]));
        } 
    }

    cancelCrafting() {
        if (this.craftTimeout) {
            clearTimeout(this.craftTimeout);
            this.craftTimeout = null;
        }
    }

    invDEL(id: number, amount:number) {
        let slot = this.inv.find(e=> e.id == id);
        if (slot) {
            if (!amount || slot.amount >= amount) { //amount = 0 then delete all
                delete slot.id;
                delete slot.amount;
            } else {
                slot.amount -= amount;
            }
        }
    }

    invFindSlot(id:number,amount:number=0) {
        let Slot = this.inv.slice(0,this.bag ? 10 : 8).find(e => e.id == id && e.amount >= amount); //use max
        if (!Slot && amount == 0) {Slot = this.inv.find(e => e.id === undefined)};
        return Slot;
    }

    invADD(id: number, amount: number = 1, slot: any = null) {
        if (!slot) {
            slot = this.invFindSlot(id); 
        }
        slot.id = id;
        slot.amount = slot.amount ? slot.amount + amount : amount;
    }

    use(id: number) {
        let item = Items.find(e=> e.id == id)
        switch (item.constructor) {
            case Clothes:
                this.clothes = item;
                break;
            case Tool:
                this.tool = item;
                break;
            case Usable:
                this.food += item.food;
                this.health += item.hp;
                this.temperature += item.temp;
                this.regen += item.regd;
                this.invDEL(id,1);
                break;
            case Structure:
                buildStructure(item);
                break;
        }
    }

    chat(message: string) {
        // TODO send message
    }
}

const server = https.createServer({
    key: fs.readFileSync("data/ssl/key.pem"),
    cert: fs.readFileSync("data/ssl/cert.pem")
}).listen(8080);

const wss = new WebSocket.Server({ server });

const world = new World();

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
                    player = world.players.find(e => e.token == data[2]);
                    if (!player) {
                        // TODO for zero 
                        console.log("session token = " + data[2]);
                        console.log("session id = " + data[3]);
                        player = new Player(data[0], data[2], ws);
                    }
                    player.online = true;
                    // TODO for zero
                    ws.send(JSON.stringify([3, player.pid, 256, Utils.getLeaderboard(), player.pos.x, player.pos.y, 256, 0, 0, "id123", [], 0]));
                    player.sendInfos();


                    // TODO to be removed (maybe moved to moddedstarving + moddedstarving for server?)
                    const colors = ["4", "c", "6", "e", "2", "a", "b", "3", "1", "9", "d", "5", "f", "7", "8", "0"].reverse();
                    let color = 0;
                    setInterval(() => {
                        player.displayName = "";
                        for (var i = 0; i < player.nick.length; i++) {
                            const currentColor = color + i;
                            player.displayName += '\u00a7' + colors[currentColor > colors.length - 1 ? currentColor - colors.length : currentColor] + player.nick.charAt(i);
                        }
                        Utils.broadcastPacket(JSON.stringify([2, player.pid, player.nick, player.displayName]));
                        color++;
                        if (color >= colors.length)
                            color = 0;
                    }, 150);
                } else {
                    switch (data[0]) {
                        case 0:
                            player.chat(data[1]);
                            break;
                        case 2:
                            player.move(data[1]);
                            break;
                        case 3:
                            player.rotate(data[1]);
                            break;
                        case 4:
                            player.hit(data[1]);
                            break;
                        case 5:
                            player.use(data[1]);
                            break;
                        case 6:
                            player.invDEL(data[1],data[2]);
                        case 7:
                            player.craft(data[1]);
                            break;
                        case 8:
                            // TODO put in chest
                            break;
                        case 9:
                            // TODO take from chest
                            break;
                        case 10:
                            player.cancelCrafting(); // lose items
                            break;
                        case 12:
                            // TODO AddwoodToFurnance
                            break;
                        case 7:
                            player.craft(data[1]);
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
        if (player) { player.online = false; };
        ws.close();
    });
});


server.on("request", (req, res) => {
    if (req.url == "/info.txt") {
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify([{ name: "Test Server", players: { online: 0, max: 0 }, "ip": "localhost", "port": 8080, ssl: true }]));
    }
});