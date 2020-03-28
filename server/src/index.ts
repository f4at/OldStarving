import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";
import {EntityType, Entityitem, Clothes, Tool, Pickaxe, Items, DamageType, Usable} from './Item';
import { emit, listenerCount } from "cluster";
import { clearInterval } from "timers";
import { findSourceMap } from "module";
import { isDeepStrictEqual } from "util";
import { getPackedSettings } from "http2";
import { throws } from "assert";

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
    players: Array<Player> = new Array();
    entities: Entity[][] = new Array(128);
    mapSize: Vector = { x: 30, y: 10 };
    chunks: Player[][][] = new Array(this.mapSize.x);
    echunks: Entity[][][][] = new Array(this.mapSize.x);
    tickRate: number = 32;
    stime: number = new Date().getTime();
    mode: number = 0; //id of mode, probably useless for the moment.
    constructor() {
        for (let i = 0; i < this.mapSize.x; i++) {
            this.chunks[i] = new Array(this.mapSize.y);
            this.echunks[i] = new Array(this.mapSize.y);
            for (let y = 0; y < this.mapSize.y; y++) {
                this.chunks[i][y] = [];
                this.echunks[i][y] = new Array(128);
                for (let z = 0; z < 128; z++) {
                    this.echunks[i][y][z] = [];
                    this.entities[z] = [];
                }
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
        return this.players.map(player => ({ id: player.pid, nickname: player.nick, displayName: player.displayName, score: player.score }));
    }

}

abstract class Utils {
    static ids: Array<String> = [];

    static broadcastPacket(packet) {
        Utils.sendToPlayers(world.players, packet);
    }

    static sendToPlayers(list: Player[], packet) {
        for (let player of list) {
            player.send(packet);
        }
    }

    static toHex(data: number) {
        return [data % 256, Math.floor(data / 256)];
    }

    static toRadians(angle: number) {
        return angle / 128 * Math.PI;
    }

    static toBinary(angle: number) {
        return angle * 128 / Math.PI;
    }

    static angleToCoords(angle: number) {
        angle = Utils.toRadians(angle);
        return { "x": Math.cos(angle), "y": Math.sin(angle) };
    }

    static coordsToAngle(coords: any) {
        let angle = Math.atan2(coords.y,coords.x)/Math.PI*128;
        return  angle < 0 ? angle+256 : angle;

    }

    static distance(vector: Vector) {
        return (vector.x ** 2 + vector.y ** 2) ** 0.5;
    }

    static randomID(n: number) {
        let dict = '0123456789abcedfghejklmnopqrstuvwyzABCDEFGHEJKLMNEPQRSTUVWYZ';
        let id;
        while (true) {
            id = '';
            for (let i=0;i<16;i++) {
                id += dict.charAt(Math.floor(Math.random() * dict.length));
            } 
            if (!this.ids.find(e=>e==id)) {
                this.ids.push(id);
                break;
            }
        }
        return id;
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

class Entity {
    type: EntityType;
    sid: number;
    pid: number;
    id: number;
    iid: number;
    mapid: number;
    physical: number;
    tier: number;
    ftier: number;
    error: string;
    Entityitem: Entityitem;

    pos: Vector;
    angle: number;
    eangle: number;
    action: number = EntityState.None;
    chunk: Vector;
    speed: number;
    counter: number;
    inv: any;
    hitdmg: number;
    score: number; //score given when player destroy it
    regen: number = 0;
   
    numberOfSides: number;
    raduis: number;
    XtoYfac: any;


    updateLoop: any;
    updating: number;
    moveDelay: number;
    moveFunc: Function;

    maxHealth: number;
    health: number;
    stime: number;

    Lifespan: number;
    Lifeupdate: number;
    LifeLoop: any;

    constructor(pos,angle,owner,Entityitem) {
        this.Entityitem = Entityitem;
        this.type = Entityitem.type; //enitity type
        this.sid = Entityitem.sid; //entity id
        this.iid = Entityitem.id; //item id
        this.pid = owner;
        for (let i=1;i<1024;i++) {
            if (!world.entities[this.sid].find(e=>e.id==i)) {
                this.id = i;
                break;
            }
        }
        if (!this.id) {
            this.error = "The limit of possible placed entities of this type exceeded";
            return
        }
        this.pos = pos;
        this.angle = angle;
        this.maxHealth = Entityitem.hp;
        this.health = this.maxHealth;

        this.numberOfSides = Entityitem.numberOfSides;
        this.raduis = Entityitem.raduis;
        this.XtoYfac = Entityitem.XtoYfac;

        let special = Entityitem.special;
        this.physical = special.physical;
        this.eangle = special.eangle ? special.eangle : 0;
        this.tier = special.tier ? special.tier : 0;
        this.speed = special.speed ? special.speed : 0;
        this.inv = special.inv;
        this.Lifespan = special.Lifespan;
        this.hitdmg = special.hitdmg ? special.hitdmg : 0;
        this.ftier = special.ftier ? special.ftier : 0;
        this.moveDelay = special.moveDelay ? special.moveDelay : 1;
        this.moveFunc = special.moveFunc ? special.moveFunc : ()=>{};
        this.regen = special.regen ? special.regen : 0;
        this.mapid = special.mapid;
        this.stime = new Date().getTime();

        world.entities[this.sid].push(this);
        this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
        world.echunks[this.chunk.x][this.chunk.y][this.sid].push(this);

        if (this.Lifespan) {
            if (this.type == EntityType.MOB) {
                this.LifeLoop = setInterval(()=>{
                    if (new Date().getTime() - this.stime > this.Lifeupdate*60000) {
                        this.die()
                    } else {
                        this.damage(-this.regen);
                    }
                },this.Lifeupdate)
            } else { 
                this.LifeLoop = setInterval(()=>{
                    this.damage(this.maxHealth*this.Lifespan/this.Lifeupdate);
                },this.Lifeupdate)
            }
        }
        switch (this.type) {
            case EntityType.MINE:
                this.updateLoop = setInterval(()=>{
                    this.inv.amount = Math.min(this.inv.max,this.inv.amount+this.inv.respawn);
                } ,this.inv.delay);
                break;
            case EntityType.MOB:
                this.updateLoop = setInterval(()=>{
                    let mov = this.counter%this.moveDelay === 0;
                    if (this.action || mov) {
                        if (mov) {this.moveFunc()};//ai
                        this.sendInfos();
                    } 
                } ,200);
                break;

        }
        this.sendInfos();
    }

    damage(dmg:number, attacker: Player = null) { // use negative values to increase hp
        if (this.maxHealth > 0) {
            let fac = 1;
            if (attacker) {
                let tier = attacker.tool.tier ? attacker.tool.tier : 0;
                fac = (this.tier>tier ? 0.5**(this.tier-tier) : 1);
            }
            this.health = Math.min(this.maxHealth,this.health-Math.floor(dmg/fac));
            if (this.health <= 0) {
                return this.die(attacker?attacker:null);
            }
        }
        if (attacker) {
            switch (this.type) {
                case EntityType.MINE:
                    if (attacker.tool instanceof Pickaxe) {
                        if (this.ftier<=attacker.tool.ftier+1) {
                            let amount = Math.max(this.inv.add,this.inv.amounts+this);
                            attacker.invADD(this.inv.id,amount);
                            this.inv.amount -= amount;
                        }
                    }
                    break;
                case EntityType.MOB:
                    this.action |= EntityState.Hurt;
                    break;
                case EntityType.SPIKE:
                    if (this.hitdmg) {attacker.damage(this.hitdmg)};
                    break;
            }
            let angle;
            switch (this.type) {
                case EntityType.MINE:
                    angle = Math.round(Utils.coordsToAngle({x:this.pos.y-attacker.pos.y,y:this.pos.x-attacker.pos.x}));
                    this.sendToRange(new Uint16Array([9,Math.floor(this.pos.x/100),Math.floor(this.pos.y),angle,this.mapid]));
                    break;
                default:
                    let id = Utils.toHex(this.id);
                    angle = Math.round(Utils.coordsToAngle({x:this.pos.y-attacker.pos.y,y:this.pos.x-attacker.pos.x}));
                    this.sendToRange(new Uint8Array([22,id[0],id[1],this.sid,angle]));
                    break;
            }
        } 
    }

    die(attacker: Player = null) {
        if (this.updateLoop) {
            clearInterval(this.updateLoop);
        }
        if (this.LifeLoop) {
            clearInterval(this.LifeLoop);
        }
        if (attacker) {
            attacker.score += 10+this.score;
            if (this.inv) { //give what in inv.
                if (this.inv.amount) { 
                    attacker.invADD(this.inv.id,this.inv.amount);
                }
            }
            //give part of its recipe
        };
        
    }

    sendInfos(visible = true, to: Player[] = null) {
        let packet = this.infoPacket(visible);
        if (to !== null) {
            for (let player of to) {
                player.send(packet);
            }
        } else {
            this.sendToRange(packet);
        }
    }

    infoPacket(visible = true) {
        if (visible) {
            let pos = { "x": Utils.toHex(this.pos.x), "y": Utils.toHex(this.pos.y) };
            let id = Utils.toHex(this.id);
            return new Uint8Array([0, 0, this.pid, this.action, this.sid, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], id[0], id[1], 0, 0]); // change 1 to this.sid
        } else {
            return new Uint8Array([0, 0, this.pid, 1, this.sid, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }

    sendToRange(packet) {
        let xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x),
            ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y);
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                for (let player of world.chunks[x][y]) {
                    player.send(packet);
                }
            }
        }
    }
}

class Player {
    token: string;
    token_id: string;
    ws: WebSocket;
    type: EntityType = EntityType.PLAYER;
    sid: number;
    pid: number;
    id: number;
    online: boolean;
    connected: boolean;
    error: string;
    color: number = 0;
    colors: Array<String> = ["4", "c", "6", "e", "2", "a", "b", "3", "1", "9", "d", "5", "f", "7", "8", "0"].reverse();

    //INFOS
    nick: string;
    displayName: string;
    pos: Vector;
    angle: number;
    action: number = EntityState.None;
    chunk: Vector;
    speed: number = 200;
    tool: Tool = Items.HAND;
    clothes: Clothes = Items.Null;
    bag: boolean;
    score: number = 0;
    inv = new Array(10);
    workbench: boolean = false;
    fire: boolean = false;
    counter: number = 0;
    biome: any;

    raduis: number =24;
    XtoYFac: number = 1;
    numberOfSides: number = 0;

    //UPDATING
    moving: boolean;
    attacking: boolean;
    update: boolean;
    updating: boolean;
    updateLoop: NodeJS.Timeout;
    attackLoop: NodeJS.Timeout;
    craftTimeout: NodeJS.Timeout;
    movVector: Vector = { "x": 0, "y": 0 };

    //BARS
    maxHealth: number = 200;
    health: number = this.maxHealth;
    temperature: number = 100;
    food: number = 100;
    regen: number = 50;
    regenMin: number = 2;

    constructor(nick: string, version:number, token: string, token_id: string, ws: WebSocket) {
        this.token_id = Utils.randomID(16); 
        this.nick = nick;
        this.displayName = nick;
        this.token = token;
        //this.pos = { "x": 1 + Math.random() * world.mapSize.x * 1000, "y": 1 + Math.random() * world.mapSize.y *1000 };
        this.pos = {x: 5000, y: 5000};
        for (let i = 1; i < 128; i++) {
            if (world.players.find(e => e.pid == i) === undefined) {
                this.pid = i;
                break;
            }
        }
        if (!this.pid) {
            this.error = 'Full Server';
            this.send(new Uint8Array([5]));
            this.ws.close();
            return
        }     
        for (let slot=0;slot<this.inv.length;slot++) { this.inv[slot] = {} };
        this.invADD(Items.STONE_WALL.id,10);
        this.invADD(Items.BANDAGE.id,10);
        this.invADD(Items.WOOD.id,100);
        this.invADD(Items.STONE_SWORD.id,100);
        this.invADD(Items.PICK_STONE.id,100);
        this.invADD(Items.SWORD_GOLD.id,100);
        world.players.push(this);
        this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        this.join(ws);
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
                let regen = Math.min(8,this.regen);
                this.regen = Math.max(this.regenMin,this.regen-regen);
                this.damage(-regen,null,false,false);
                this.food = food;
                this.temperature = temperature;
                this.updateBars();
            }
            if (this.counter%(world.tickRate*1) == 0) {
                this.updateCrafting();
            }
            if (this.moving || this.updating || this.action) {
                if (this.moving) {
                    this.pos.x += this.movVector.x / world.tickRate;
                    this.pos.y += this.movVector.y / world.tickRate;
                    this.collision();
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
        setInterval(() => {
            this.changeDisplayNick();
        }, 150);
    }

    getEntitiesinRange(x:number, y:number, player:boolean=true, entity:boolean=true) {
        let ymin = Math.max(-x + this.chunk.y, 0), ymax = Math.min(x + 1 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-y + this.chunk.x, 0), xmax = Math.min(y + 1 + this.chunk.x, world.mapSize.x);
        let list = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (player) {
                    list = list.concat(world.chunks[x][y]);
                }
                if (entity) {
                    for (let i=0;i<128;i++) {
                        list = list.concat(world.echunks[x][y][i]);
                    }
                }
            }
        }
        return list;
    }

    collision() {
        //collision version 1(not real collision just simulation to save time and ressources will make real one later)
        // VERY HARD
        let entities = this.getEntitiesinRange(1,1,false);
        let dis,vec,angle,collide;
        while (true) {
            collide = false;
            for (let entity of entities) {
                vec = {x:this.pos.x-entity.pos.x,y:this.pos.y-entity.pos.y};
                if (entity.numberOfSides === 0) {
                    dis = entity.raduis+this.raduis-Utils.distance(vec);
                } else {
                    angle = Utils.toRadians(Utils.coordsToAngle(vec)-entity.angle-entity.eangle);
                    dis = Utils.distance({x:Math.cos(Math.PI/entity.numberOfSides),y:Math.sin(angle%(Math.PI/entity.numberOfSides))})*entity.raduis+this.raduis-Utils.distance(vec);
                }
                if (dis > 1e-4) {
                    vec = Utils.angleToCoords(entity.numberOfSides === 0 ? Utils.coordsToAngle(vec) : Utils.toBinary(Math.round(angle*entity.numberOfSides/2/Math.PI)*2*Math.PI/entity.numberOfSides)+entity.angle+entity.eangle);
                    this.pos.x += vec.x*dis;
                    this.pos.y += vec.y*dis;
                    collide = true;
                    break;
                }
            }
            if (!collide) {break};
        }
    }

    join(ws) {
        this.ws = ws;
        this.ws.send(JSON.stringify([3, this.pid, 1024, world.getPlayers(), this.pos.x, this.pos.y, 256, world.mode, world.isDay()?0:1, this.token_id]));
        this.online = true;
        this.getInfos();
        this.sendInfos();
        this.gatherAll();
    }

    changeDisplayNick() {
        this.displayName = "";
        for (var i = 0; i < this.nick.length; i++) {
            const currentColor = this.color + i;
            this.displayName += '\u00a7' + this.colors[currentColor > this.colors.length - 1 ? currentColor - this.colors.length : currentColor] + this.nick.charAt(i);
        }
        Utils.broadcastPacket(JSON.stringify([2, this.pid, this.nick, this.displayName]));
        this.color = (this.color+1)%(this.colors.length+1);
    }

    send(packet) {
        if (this.online) {this.ws.send(packet)};
    }
    
    getInfos(visible:boolean= true,to: Player[] = null) {
        let list = new Uint8Array([0, 0]);
        let added = false;
        if (to) {
            for ( let player of to) {
                list = Utils.concatUint8(list,player.infoPacket(visible));
                added = true;
            }
        } else {
            let xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x),
                ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y);
            for (let x = xmin; x < xmax; x++) {
                for (let y = ymin; y < ymax; y++) {
                    for (let player of world.chunks[x][y]) {
                        list = Utils.concatUint8(list,player.infoPacket(visible));
                        added = true;
                    }
                    for (let i=0;i<128;i++) {
                        for (let entity of world.echunks[x][y][y]) {
                            if (entity.type != EntityType.MINE) {
                                list = Utils.concatUint8(list,entity.infoPacket(visible).slice(2));
                                added = true;
                            }
                        }
                    }
                }
            }
        }
        if (added) {this.send(list)};
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
                let players = world.chunks[x][y].filter(e => Utils.distance({ x: center.x - e.pos.x, y: center.y - e.pos.y }) < this.tool.range+e.raduis);
                for (let player of players) { if (player != this) {player.damage(this.tool.damage.pvp, this)} };
                for (let i=0;i<128;i++) {
                    let entities = world.echunks[x][y][i].filter(e => Utils.distance({ x: center.x - e.pos.x, y: center.y - e.pos.y }) < this.tool.range+e.raduis);
                    for (let entity of entities) {entity.damage(this.tool.damage.pve, this)};
                }
            }
        }
    }

    stopHitting() {
        this.attacking = false;
    }

    damage(dmg: number, attacker: Player = null, report: Boolean = true, protection: Boolean = true) {
        this.health = Math.max(0,Math.min(this.maxHealth,this.health-dmg+(protection ? this.clothes.damageProtection[Player ? DamageType.PvP : DamageType.PvE] : 0) ));       
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

    updateBars() {
        this.send(new Uint8Array([11,Math.ceil(this.health*100/this.maxHealth),Math.ceil(this.food),Math.ceil(this.temperature)]));
    }

    die() {
        //send death packet Eidt: no need lol client disconnect when player gets "dissapear" state, and thats not good.
        clearInterval(this.updateLoop);
        clearInterval(this.attackLoop);
        world.players = world.players.filter(e => e == this);
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e == this);
        this.send(new Uint8Array([2]));
        this.sendInfos(false);
        
        this.ws.close();
    }

    updateChunk(chunk: Vector) {
        let ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x);
        let list = [],elist = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (Math.abs(chunk.x - x) > 2 || Math.abs(chunk.y - y) > 2) {
                    list = list.concat(world.chunks[x][y]);
                    for (let i=0;i<128;i++) {
                        elist = list.concat(world.echunks[x][y][i]);
                    } 
                }
            }
        }
        this.sendInfos(false, list);
        this.getInfos(false, list.concat(elist))
        ymin = Math.max(-2 + chunk.y, 0), ymax = Math.min(3 + chunk.y, world.mapSize.y),
            xmin = Math.max(-2 + chunk.x, 0), xmax = Math.min(3 + chunk.x, world.mapSize.x);
        list = [],elist=[];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (Math.abs(this.chunk.x - x) > 2 || Math.abs(this.chunk.y - y) > 2) {
                    list = list.concat(world.chunks[x][y]);
                    for (let i=0;i<128;i++) {
                        list = elist.concat(world.echunks[x][y][i]);
                    } 
                }
            }
        }
        this.getInfos(true,list.concat(elist));
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e != this);
        this.chunk = chunk;
        world.chunks[this.chunk.x][this.chunk.y].push(this);

    }

    sendInfos(visible:boolean = true, to: Player[] = null) {
        let packet = this.infoPacket(visible);
        if (to !== null) {
            for (let player of to) {
                player.send(packet);
            }
        } else {
            this.sendToRange(packet);
        }
    }

    infoPacket(visible = true) {
        if (visible) {
            let pos = { "x": Utils.toHex(this.pos.x), "y": Utils.toHex(this.pos.y) };
            //let id = Utils.toHex(this.id);
            let infos = Utils.toHex(this.tool.id + this.clothes.id * 128 + (this.bag ? 1 : 0) * 16384);
            return new Uint8Array([0, 0, this.pid, this.action, this.sid, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], 0, 0, infos[0], infos[1]]);
        } else {
            return new Uint8Array([0, 0, this.pid, 1, this.sid, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }

    sendToRange(packet) {
        let xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x),
            ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y);
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                for (let player of world.chunks[x][y]) {
                    player.send(packet);
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
                this.allowCrafting(id);
                this.craftTimeout = setTimeout(() => {
                    this.invADD(id,1,slot);
                    this.finishedCrafting();
                    this.craftTimeout = null;
                }, recipe.time * 25000);
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
            this.send(new Uint8Array([19,workbench?1:0]))
        }
        if (fire != this.fire) {
            this.fire = fire;
            this.send(new Uint8Array([20,fire?1:0]));
        } 
    }

    finishedCrafting() {
        this.ws.send([17]);
    }

    allowCrafting(id: number) {
        this.send(new Uint8Array([16,id]));
    }

    cancelCrafting() {
        if (this.craftTimeout) {
            clearTimeout(this.craftTimeout);
            this.craftTimeout = null;
            this.send(new Uint8Array([25]));
        }
    }

    invDEL(id: number, amount:number) {
        let slot = this.inv.find(e=> e.id == id);
        if (slot) {
            if (slot.id == this.tool.id) {
                this.tool = Items.HAND;
                this.updating = true;
            } else if (slot.id == this.clothes.id) {
                this.clothes == Items.Null;
                this.updating = true;
            }
            if (!amount || slot.amount <= amount) { //amount = 0 then delete all
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
        if (slot) {
            slot.id = id;
            slot.amount = slot.amount ? slot.amount + amount : amount;
        }
    }

    use(id: number) {
        let item = Items.find(e=> e.id == id);
        if (this.invFindSlot(id,1)) {
            switch (item.constructor) {
                case Clothes:
                    this.updating = true;
                    this.clothes = item==this.clothes ? Items.Null : item;
                    break;
                case Pickaxe:
                case Tool:
                    this.updating = true;
                    this.tool = item;
                    break;
                case Usable:
                    this.food = Math.min(100,Math.max(0,this.food+item.food));
                    this.health += Math.min(this.maxHealth,Math.max(0,item.hp));
                    this.temperature += Math.min(100,Math.max(0,item.temp));
                    this.regen += Math.max(0,item.regd);
                    this.invDEL(id,1);
                    this.acceptUsing(id);
                    break;
                case Entityitem:
                    let coords = Utils.angleToCoords(this.angle);
                    let pos = {x:this.pos.x+coords.x*120,y:this.pos.y+coords.y*120};
                    let entity = new Entity(pos,this.angle,this.pid,item);
                    if (!entity.error) {
                        this.invDEL(id,1);
                        this.acceptUsing(id);
                    }
                    break;
            }
        }
    }

    acceptUsing(id: number) {
        this.send(new Uint8Array([18,id]));
    }

    chat(message: string) {
        this.sendToRange([0,message]);
    }

    gatherAll() {
        this.send(new Uint8Array([14].concat(...this.inv.filter(e=>e.amount).map(e=> [e.id,e.amount]))));
    }

    gather(id:number,amount:number=1) {

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
                    player = world.players.find(e => e.token == data[2] && e.token_id == data[3]);
                    if (!player) {
                        console.log("session token = " + data[2]);
                        console.log("session id = " + data[3]);
                        player = new Player(data[0], data[1], data[2], data[3], ws);
                    } else {
                        player.join(ws);
                    }
  
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
        if (player) { player.online = false};
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