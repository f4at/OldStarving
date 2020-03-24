import * as WebSocket from "ws";
import { Clothes, Tool, Items, DamageType, Usable, Recipe } from './Item';
import { Vector, World, Utils } from '.';
import { ItemStack } from '../../.history/server/src/Item_20200324224733';

export enum EntityState {
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

const world = World.instance;

// TODO Move to Entity.ts
export abstract class Inventory {
    // abstract owner: Entity; TODO
    abstract items: ItemStack[];
    abstract size: number;
}

export class PlayerInventory extends Inventory {
    player: Player;
    items: ItemStack[] = [];

    get size() {
        return this.player.bag ? 10 : 8;
    }

    constructor(player: Player) {
        super();
        this.player = player;
    }

    remove(id: number, amount: number) {
        let slot = this.findStack(id, amount)
        if (slot) {
            if (!amount || slot.amount >= amount) { //amount = 0 then delete all
                this.items[id] = null;
            } else {
                slot.amount -= amount;
            }
        }
    }

    findStack(id: number, amount: number = 0): ItemStack {
        let slot = this.items.slice(0, this.size).find(e => e.item.id == id && e.amount >= amount); // use max
        if (!slot && amount == 0) {
            slot = this.items.find(e => e.item.id === undefined);
        };
        return slot;
    }

    add(id: number, amount: number = 1, slot: any = null) {
        if (!slot) {
            slot = this.findStack(id);
        }
        slot.id = id;
        slot.amount = slot.amount ? slot.amount + amount : amount;
    }
}

export default class Player {
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
    inventory: PlayerInventory = new PlayerInventory(this);
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

    constructor(nick: string, token: string, ws: WebSocket) {
        this.nick = this.displayName = nick;
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
        this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        Utils.broadcastPacket(JSON.stringify([2, this.pid, this.nick, this.displayName]));
        this.getInfos();
        this.counter = 0;
        this.updateLoop = setInterval(() => {
            this.counter += 1;
            if (this.counter % (world.tickRate * 4) == 0) {
                let temperature = Math.max(0, Math.min(100, this.temperature + (this.moving ? 1 : 0) + (this.attacking ? 1 : 0) + (world.isDay() ? -2 : -10) + (this.fire ? 12 : 0) + this.clothes.coldProtection));
                let food = Math.max(0, this.food + (this.moving ? -3 : -1) + (this.attacking ? -2 : 0));
                if (this.temperature == temperature && temperature == 0) {
                    this.damage(10, null, false, false);
                }
                if (this.food == food && food == 0) {
                    this.damage(15, null, false, false);
                }
                console.log(temperature, food, this.health);
                this.food = food;
                this.temperature = temperature;
                this.ws.send(new Uint8Array([11, this.health, this.food, this.temperature]));
                //send bars packet
            }
            if (this.counter % (world.tickRate * 1) == 0) {
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
        let list: any = [0, 0];
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
        this.health = Math.max(0, this.health - dmg + (protection ? this.clothes.damageProtection[Player ? DamageType.PvP : DamageType.PvE] : 0));
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
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e !== this);
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
                let slot = infos[0], recipe = infos[1];
                for (let element of recipe.ingredients) {
                    this.inventory.remove(element[0], element[1]);
                }
                this.craftTimeout = setTimeout(() => {
                    this.inventory.add(id, 1, slot);
                    this.craftTimeout = null;
                }, recipe.time * 60000);
            }
        }
    }

    canCraft(id: number): [ItemStack, Recipe] {
        if (!this.craftTimeout) {
            let recipe = Items.get(id).recipe;
            recipe = recipe ? recipe : { ingredients: [], requireWorkbench: false, requireFire: false, time: 0 };
            if ((this.workbench || !recipe.requireWorkbench) && (this.fire || !recipe.requireFire)) {
                let itemStack = this.inventory.findStack(id);
                if (itemStack) {
                    let haveCraftingItems = true;
                    for (let element of recipe.ingredients) {
                        if (!this.inventory.findStack(element[0], element[1])) {
                            haveCraftingItems = false;
                            break;
                        }
                    }
                    if (haveCraftingItems) {
                        return [itemStack, recipe];
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
            this.ws.send(new Uint8Array([19, workbench ? 1 : 0]));
        }
        if (fire != this.fire) {
            this.fire = fire;
            this.ws.send(new Uint8Array([20, fire ? 1 : 0]));
        }
    }

    cancelCrafting() {
        if (this.craftTimeout) {
            clearTimeout(this.craftTimeout);
            this.craftTimeout = null;
        }
    }

    use(id: number) {
        let item = Items.get(id);
        switch (item.constructor) {
            case Clothes:
                this.clothes = item as Clothes;
                break;
            case Tool:
                this.tool = item as Tool;
                break;
            case Usable:
                const usable = item as Usable;
                this.food += usable.food;
                this.health += usable.hp;
                this.temperature += usable.temp;
                this.regen += usable.regen;
                this.inventory.remove(id, 1);
                break;
            // case Structure:
            //     buildStructure(item);
            //     break;
        }
    }

    chat() {
        // TODO send message
    }
}