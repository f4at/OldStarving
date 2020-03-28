import * as WebSocket from "ws";
import Item, { Clothes, Tool, Items, DamageType, Usable, Recipe, ItemStack, EntityType, Pickaxe, EntityItem } from './Item';
import { Vector, Utils } from '.';
import world from "./World";
import Entity from "./Entity";

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

// TODO Move to Entity.ts
export abstract class Inventory {
    // abstract owner: Entity; TODO
    abstract items: ItemStack[];
    abstract size: number;
}

export class PlayerInventory extends Inventory {
    player: Player;
    items: ItemStack[] = [];
    size: number = 8;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    updateSize(size: number = this.size) {
        this.player.ws.send([26, this.size = size]);
    }

    remove(id: Item, amount: number) {
        let slot = this.items.find(e => e && e.item == id);
        if (slot) {
            if (slot.item == this.player.tool) {
                this.player.tool = Items.HAND;
                this.player.updating = true;
            } else if (slot.item == this.player.clothes) {
                this.player.clothes == Items.AIR;
                this.player.updating = true;
            }
            if (!amount || slot.amount <= amount) { //amount = 0 then delete all   
                this.items.splice(this.items.indexOf(slot), 1);
            } else {
                slot.amount -= amount;
            }
        }
    }

    findStack(item: Item, amount: number = 0): ItemStack {
        if (item == Items.HAND)
            return new ItemStack(item, 1);
        let stack = this.items.slice(0, this.size).find(e => e && e.item == item && e.amount >= amount); //use max
        if (!stack && amount == 0) {
            stack = this.items.find(e => e === undefined || e.item === undefined);
            if (!stack && this.items.length < this.size) {
                stack = new ItemStack(undefined, 0);
                this.items.push(stack);
            }
        };
        return stack;
    }

    add(item: Item, amount: number = 1, slot: ItemStack = null) {
        if (!slot) {
            slot = this.findStack(item);
        }
        if (slot) {
            slot.item = item;
            slot.amount = slot.amount ? slot.amount + amount : amount;
        }
    }
}

export default class Player {
    session: string;
    sessionId: string;
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
    clothes: Clothes = Items.AIR;

    private _bag: boolean;

    get bag() {
        return this._bag;
    }

    set bag(bag) {
        if (bag != this.bag) {
            this.inventory.updateSize(bag ? 10 : 8);
            this._bag = bag;
        }
    }

    score: number = 0;
    inventory = new PlayerInventory(this);
    workbench: boolean = false;
    fire: boolean = false;
    counter: number = 0;
    biome: any;

    radius: number = 24;
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

    constructor(nick: string, version: number, session: string, sessionId: string, ws: WebSocket) {
        this.sessionId = Utils.randomID(16);
        this.nick = nick;
        this.displayName = nick;
        this.session = session;
        for (let i = 1; i < 128; i++) {
            if (world.players.find(e => e.pid == i) === undefined) {
                this.pid = i;
                break;
            }
        }
        if (!this.pid) {
            this.error = 'Full Server';
            ws.send(new Uint8Array([5]));
            ws.close();
            return;
        }
        let found = false, counter = 0;
        while (counter < 64 && !found) {
            this.pos = { "x": 1 + Math.random() * 5000, "y": 1 + Math.random() * 5000 }; //spawn in forest biome
            this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
            if (this.getEntitiesInRange(1, 1, false, true).find(e => Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < this.radius + e.radius + (e.type == EntityType.WALL || e.type == EntityType.SPIKE || e.type == EntityType.DOOR ? 500 : 0))) {
                counter += 1;
            } else {
                found = true;
            }
        }
        if (!found) {
            this.error = "Can't find spawning location.";
            ws.send(new Uint8Array([5]));
            ws.close();
            return;
        }

        world.players.push(this);
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        this.join(ws);
        this.updateLoop = setInterval(() => {
            this.counter += 1;
            if (this.counter % (world.tickRate * 4) == 0) {
                let temperature = Math.max(0, Math.min(100, this.temperature + (this.moving ? 1 : 0) + (this.attacking ? 1 : 0) + (world.isDay ? -2 : -10) + (this.fire ? 12 : 0) + this.clothes.coldProtection));
                let food = Math.max(0, this.food + (this.moving ? -3 : -1) + (this.attacking ? -2 : 0));
                if (this.temperature == temperature && temperature == 0) {
                    this.damage(10, null, false, false);
                }
                if (this.food == food && food == 0) {
                    this.damage(15, null, false, false);
                }
                let regen = Math.min(8, this.regen);
                this.regen = Math.max(this.regenMin, this.regen - regen);
                this.damage(-regen, null, false, false);
                this.food = food;
                this.temperature = temperature;
                this.updateBars();
            }
            if (this.counter % (world.tickRate * 1) == 0) {
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

        // TODO remove
        this.bag = true;
        this.inventory.add(Items.STONE_WALL, 10);
        this.inventory.add(Items.BANDAGE, 10);
        this.inventory.add(Items.WOOD, 100);
        this.inventory.add(Items.STONE_SWORD, 100);
        this.inventory.add(Items.PICK_STONE, 100);
        this.inventory.add(Items.SWORD_GOLD, 100);
        this.gatherAll();
    }

    getEntitiesInRange(x: number, y: number, player: boolean = true, entity: boolean = true): Entity[] {
        let ymin = Math.max(-x + this.chunk.y, 0), ymax = Math.min(x + 1 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-y + this.chunk.x, 0), xmax = Math.min(y + 1 + this.chunk.x, world.mapSize.x);
        let list = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (player) {
                    list = list.concat(world.chunks[x][y]);
                }
                if (entity) {
                    for (let i = 0; i < 128; i++) {
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
        let entities = this.getEntitiesInRange(1, 1, false);
        let dis, vec, angle, collide;
        while (true) {
            collide = false;
            for (let entity of entities) {
                vec = { x: this.pos.x - entity.pos.x, y: this.pos.y - entity.pos.y };
                if (entity.numberOfSides === 0) {
                    dis = entity.radius + this.radius - Utils.distance(vec);
                } else {
                    angle = Utils.toRadians(Utils.coordsToAngle(vec) - entity.angle - entity.eangle);
                    dis = Utils.distance({ x: Math.cos(Math.PI / entity.numberOfSides), y: Math.sin(angle % (Math.PI / entity.numberOfSides)) }) * entity.radius + this.radius - Utils.distance(vec);
                }
                if (dis > 1e-4) {
                    vec = Utils.angleToCoords(entity.numberOfSides === 0 ? Utils.coordsToAngle(vec) : Utils.toBinary(Math.round(angle * entity.numberOfSides / 2 / Math.PI) * 2 * Math.PI / entity.numberOfSides) + entity.angle + entity.eangle);
                    this.pos.x += vec.x * dis;
                    this.pos.y += vec.y * dis;
                    collide = true;
                    break;
                }
            }
            if (!collide) { break; };
        }
    }

    join(ws) {
        this.ws = ws;
        this.ws.send(JSON.stringify([3, this.pid, 1024, world.leaderboard, this.pos.x, this.pos.y, 256, world.mode, world.isDay ? 0 : 1, this.sessionId]));
        this.online = true;
        this.getInfos();
        this.sendInfos();
        this.inventory.updateSize();
        this.gatherAll();
    }

    changeDisplayNick() {
        this.displayName = "";
        for (var i = 0; i < this.nick.length; i++) {
            const currentColor = this.color + i;
            this.displayName += '\u00a7' + this.colors[currentColor > this.colors.length - 1 ? currentColor - this.colors.length : currentColor] + this.nick.charAt(i);
        }
        Utils.broadcastPacket(JSON.stringify([2, this.pid, this.nick, this.displayName]));
        this.color = (this.color + 1) % (this.colors.length + 1);
    }

    send(packet) {
        if (this.online) { this.ws.send(packet); };
    }

    getInfos(visible: boolean = true, to: Player[] = null) {
        let list = new Uint8Array([0, 0]);
        let added = false;
        if (to) {
            for (let player of to) {
                list = Utils.concatUint8(list, player.infoPacket(visible));
                added = true;
            }
        } else {
            let xmin = Math.max(-2 + this.chunk.x, 0), xmax = Math.min(3 + this.chunk.x, world.mapSize.x),
                ymin = Math.max(-2 + this.chunk.y, 0), ymax = Math.min(3 + this.chunk.y, world.mapSize.y);
            for (let x = xmin; x < xmax; x++) {
                for (let y = ymin; y < ymax; y++) {
                    for (let player of world.chunks[x][y]) {
                        list = Utils.concatUint8(list, player.infoPacket(visible));
                        added = true;
                    }
                    for (let i = 0; i < 128; i++) {
                        for (let entity of world.echunks[x][y][y]) {
                            if (entity.type != EntityType.HARVESTABLE) {
                                list = Utils.concatUint8(list, entity.infoPacket(visible).slice(2));
                                added = true;
                            }
                        }
                    }
                }
            }
        }
        if (added) { this.send(list); };
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
                let players = world.chunks[x][y].filter(e => Utils.distance({ x: center.x - e.pos.x, y: center.y - e.pos.y }) < this.tool.range + e.radius);
                for (let player of players) { if (player != this) { player.damage(this.tool.damage.pvp, this); } };
                for (let i = 0; i < 128; i++) {
                    let entities = world.echunks[x][y][i].filter(e => Utils.distance({ x: center.x - e.pos.x, y: center.y - e.pos.y }) < this.tool.range + e.radius);
                    for (let entity of entities) { entity.damage(this.tool.damage.pve, this); };
                }
            }
        }
    }

    stopHitting() {
        this.attacking = false;
    }

    damage(dmg: number, attacker: Player = null, report: Boolean = true, protection: Boolean = true) {
        this.health = Math.max(0, Math.min(this.maxHealth, this.health - dmg + (protection ? this.clothes.damageProtection[Player ? DamageType.PvP : DamageType.PvE] : 0)));
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
        this.send(new Uint8Array([11, Math.ceil(this.health * 100 / this.maxHealth), Math.ceil(this.food), Math.ceil(this.temperature)]));
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
        let list = [], elist = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (Math.abs(chunk.x - x) > 2 || Math.abs(chunk.y - y) > 2) {
                    list = list.concat(world.chunks[x][y]);
                    for (let i = 0; i < 128; i++) {
                        elist = list.concat(world.echunks[x][y][i]);
                    }
                }
            }
        }
        this.sendInfos(false, list);
        this.getInfos(false, list.concat(elist));
        ymin = Math.max(-2 + chunk.y, 0), ymax = Math.min(3 + chunk.y, world.mapSize.y),
            xmin = Math.max(-2 + chunk.x, 0), xmax = Math.min(3 + chunk.x, world.mapSize.x);
        list = [], elist = [];
        for (let x = xmin; x < xmax; x++) {
            for (let y = ymin; y < ymax; y++) {
                if (Math.abs(this.chunk.x - x) > 2 || Math.abs(this.chunk.y - y) > 2) {
                    list = list.concat(world.chunks[x][y]);
                    for (let i = 0; i < 128; i++) {
                        list = elist.concat(world.echunks[x][y][i]);
                    }
                }
            }
        }
        this.getInfos(true, list.concat(elist));
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e != this);
        this.chunk = chunk;
        world.chunks[this.chunk.x][this.chunk.y].push(this);

    }

    sendInfos(visible: boolean = true, to: Player[] = null) {
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

    craft(item: Item) {
        if (!this.craftTimeout) {
            let infos = this.canCraft(item);
            if (infos) {
                let slot = infos[0], recipe = infos[1];
                for (let element of recipe.ingredients) {
                    this.inventory.remove(element[0], element[1]);
                }
                this.allowCrafting(item);
                this.craftTimeout = setTimeout(() => {
                    this.inventory.add(item, 1/*, slot*/);
                    this.finishedCrafting();
                    this.craftTimeout = null;
                }, recipe.time * 25000);
            }
        }
    }

    canCraft(item: Item): [ItemStack, Recipe] {
        if (!this.craftTimeout) {
            let recipe = item.recipe;
            recipe = recipe ? recipe : { ingredients: [], requireFire: false, requireWorkbench: false, time: 0 };
            if ((this.workbench || !recipe.requireWorkbench) && (this.fire || !recipe.requireFire)) {
                let slot = this.inventory.findStack(item);
                if (slot) {
                    let haveCraftingItems = true;
                    for (let element of recipe.ingredients) {
                        if (!this.inventory.findStack(element[0], element[1])) {
                            haveCraftingItems = false;
                            break;
                        }
                    }
                    if (haveCraftingItems) {
                        return [slot, recipe];
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
            this.send(new Uint8Array([19, workbench ? 1 : 0]));
        }
        if (fire != this.fire) {
            this.fire = fire;
            this.send(new Uint8Array([20, fire ? 1 : 0]));
        }
    }

    finishedCrafting() {
        this.send([17]);
    }

    allowCrafting(item: Item) {
        this.send(new Uint8Array([16, item.id]));
    }

    cancelCrafting() {
        if (this.craftTimeout) {
            clearTimeout(this.craftTimeout);
            this.craftTimeout = null;
            this.send(new Uint8Array([25]));
        }
    }

    use(id: number) {
        let item = Items.get(id);
        if (this.inventory.findStack(item, 1)) {
            switch (item.constructor) {
                case Clothes:
                    this.updating = true;
                    this.clothes = item == this.clothes ? Items.AIR : item as Clothes;
                    break;
                case Pickaxe:
                case Tool:
                    this.updating = true;
                    this.tool = item as Tool;
                    break;
                case Usable:
                    const usable = item as Usable;
                    this.food = Math.min(100, Math.max(0, this.food + usable.food));
                    this.health += Math.min(this.maxHealth, Math.max(0, usable.hp));
                    this.temperature += Math.min(100, Math.max(0, usable.temp));
                    this.regen += Math.max(0, usable.regeneration);
                    this.inventory.remove(item, 1);
                    this.acceptUsing(id);
                    break;
                case EntityItem:
                    let coords = Utils.angleToCoords(this.angle);
                    let pos = { x: this.pos.x + coords.x * 120, y: this.pos.y + coords.y * 120 };
                    let entity = new Entity(pos, this.angle, this, item as EntityItem);
                    if (!entity.error) {
                        this.inventory.remove(item, 1);
                        this.acceptUsing(id);
                    }
                    break;
            }
        }
    }

    acceptUsing(id: number) {
        this.send(new Uint8Array([18, id]));
    }

    chat(message: string) {
        this.sendToRange([0, message]);
    }

    gatherAll() {
        this.send(new Uint8Array([14].concat(...this.inventory.items.filter(e => e.amount).map(e => [e.item.id, e.amount]))));
    }

    gather(id: number, amount: number = 1) {

    }
}