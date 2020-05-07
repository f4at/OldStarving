import WebSocket from "ws";
import Item, { Clothes, Tool, Items, DamageType, Usable, Recipe, ItemStack, Pickaxe, EntityItem } from './Item';
import { Vector, Utils } from '.';
import world from "./World";
import Entity, { Collider, EntityState, EntityItemType, EntityTypes } from "./Entity";
import { MapEntity } from './World';
import config from "../config";
import { ConsoleSender } from "./Command";
import { workerData } from "worker_threads";

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
        this.player.send([26, this.size = size]);
    }

    remove(item: Item, amount: number = 0, slot: ItemStack = null) {
        if (!slot) {
            slot = this.items.find(e => e.item === item);
        }
        if (slot) {
            if (slot.item == this.player.tool) {
                this.player.tool = Items.HAND;
                this.player.updating = true;
            } else if (slot.item == this.player.clothes) {
                this.player.clothes = Items.AIR;
                this.player.updating = true;
            }
            if (amount === 0 || slot.amount <= amount) {
                this.items.splice(this.items.indexOf(slot), 1);
            } else {
                slot.amount -= amount;
            }
        }
    }

    findStack(item: Item, amount: number = 0): ItemStack {
        if (item == Items.HAND || item == Items.AIR) {
            return new ItemStack(item, 1);
        }
        let stack = this.items.find(e => e.item == item && e.amount >= amount);
        if (!stack && amount == 0) {
            if (this.items.length < this.size) {
                stack = new ItemStack(undefined, 0);
                return stack;
            }
        }
        return stack;
    }

    add(item: Item, amount: number = 1, slot: ItemStack = null) {
        if (amount > 0) {
            if (!slot) {
                slot = this.findStack(item);
            }
            if (slot) {
                if (slot.item === undefined) {
                    this.items.push(slot);
                }
                slot.item = item;
                slot.amount = slot.amount ? slot.amount + amount : amount;
            }
        }
    }
}

export default class Player extends Entity implements ConsoleSender {
    spectator: boolean = false;
    accountId: string;
    ws: WebSocket;
    type: EntityItemType = EntityItemType.PLAYER;
    sid: number;
    pid: number;
    id: number;
    online: boolean;
    connected: boolean;
    error: string;
    color: number = 0;
    colors: Array<String> = ["4", "c", "6", "e", "2", "a", "b", "3", "1", "9", "d", "5", "f", "7", "8", "0"];//.reverse();

    //INFOS
    nick: string;
    displayName: string;
    pos: Vector;
    angle: number;
    chunk: Vector;
    speed: number = 210;
    tool: Tool = Items.HAND;
    clothes: Clothes = Items.AIR;

    private _bag: boolean;

    get bag() {
        return this._bag;
    }

    set bag(bag) {
        if (bag != this.bag) {
            this.inventory.updateSize(bag ? 12 : 9);
            this._bag = bag;
        }
    }

    score: number = 0;
    inventory = new PlayerInventory(this);
    workbench: boolean = false;
    fire: boolean = false;
    counter: number = 0;
    biome: any;

    radius: number = 23;
    dmgradius: number = 23;
    XtoYFac: number = 1;
    numberOfSides: number = 0;
    physical: boolean = false;
    eangle: number = 0;

    //UPDATING
    moving: boolean;
    attacking: boolean;
    update: boolean;
    updating: boolean;
    updateLoop: any;
    attackLoop: any;
    displayLoop: any;
    craftTimeout: NodeJS.Timeout;
    emptyTimeout: NodeJS.Timeout;
    harvestTimeout: NodeJS.Timeout;
    weaponizeTimeout: NodeJS.Timeout;
    movVector: Vector = { "x": 0, "y": 0 };
    burn: boolean = false;

    //BARS
    maxHealth: number = 200;
    health: number = this.maxHealth;
    temperature: number = 100;
    food: number = 100;
    regen: number = 5;
    regenMin: number = 2;

    days: number = 0;
    kills: number = 0;

    webed: boolean = false;
    isalive: boolean = true;
    chathistory: number[] = [new Date().getTime()];
    get isOp() {
        return config.idiots.includes(this.accountId);
    }

    constructor(nick: string, accountId: string, ws: WebSocket) {
        super(null, null, null, null, null);
        this.nick = nick;
        this.spectator = this.nick == "spectator";
        if (this.spectator) this.speed = 350;
        this.displayName = nick;
        this.accountId = accountId;
        for (let i = 1; i < 128; i++) {
            if (world.players.find(e => e.pid == i) === undefined) {
                this.pid = i;
                break;
            }
        }
        if (!this.pid) {
            this.error = 'Full Server';
            console.log(this.error);
            ws.send(new Uint8Array([5]));
            ws.close();
            return;
        }
        let found = false, counter = 0;
        while (counter < 64 && !found) {
            this.pos = { "x": Math.random() * 9999, "y": 1 + Math.random() * 9999 }; //spawn in forest biome
            this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
            if (!this.spectator && this.getEntitiesInRange(2, 2, true, true).concat(this.getMapEntitiesInRange(3, 3)).find(e => Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < this.radius + e.radius + (e.type == EntityItemType.WALL || e.type == EntityItemType.SPIKE || e.type == EntityItemType.DOOR ? 400 : 0))) {
                counter += 1;
            } else {
                found = true;
            }
        }
        if (!found) {
            this.error = "Can't find spawning location.";
            console.log(this.error);
            ws.send(new Uint8Array([5]));
            ws.close();
            return;
        }
        this.bag = false;

        if (!this.spectator) {
            let luck = Math.random();
            this.inventory.add(Items.FIRE, luck > 0.98 ? 2 : 1);
            let random = Math.max(0.001, Math.random());
            luck = (luck % random) / random;
            this.inventory.add(Items.PLANT, 2 + Math.round(luck ** 5 * 8));
            random = Math.max(0.001, Math.random());
            luck = (luck % random) / random;
            this.inventory.add(Items.WOOD, Math.round(luck ** 3 * 50));
            random = Math.max(0.001, Math.random());
            luck = (luck % random) / random;
            this.inventory.add(Items.STONE, Math.round(luck ** 9 * 40));
            random = Math.max(0.001, Math.random());
            luck = (luck % random) / random;
            this.inventory.add(Items.GOLD, Math.round(luck ** 27 * 30));
            random = Math.max(0.001, Math.random());
            luck = (luck % random) / random;


            if (luck > 0.99) {
                this.inventory.add(Items.PICK_STONE, 1);
            } else if (luck > 0.96) {
                this.inventory.add(Items.PICK_WOOD, 1);
            } else if (luck > 0.93) {
                this.inventory.add(Items.BANDAGE, 1);
            } else if (luck > 0.9) {
                this.inventory.add(Items.FIRE, 1);
            }
        }

        world.players.push(this);
        world.chunks[this.chunk.x][this.chunk.y].push(this);
        this.join(ws);

        this.updateLoop = Utils.setIntervalAsync(async () => {
            this.counter += 1;
            if (this.counter % (world.tickRate * 2.5) == 0) {
                let firelevel = this.fireLevel();
                let fire = firelevel[0], firedmg = firelevel[1];
                let temperature = this.temperature;

                let burn = this.burn;
                if (fire === 2) {
                    if (burn) {
                        this.damage(firedmg, null, false, false);
                        this.action |= EntityState.Hurt;
                        temperature += 10;
                    }
                    this.burn = true;
                } else {
                    this.burn = false;
                }

                if (this.counter % (world.tickRate * 5) == 0) {
                    if (this.counter % (world.tickRate * 10) == 0) {
                        if (this.food > 34 && this.temperature > 34) {
                            if (this.regen > 0 && this.health < 190) {
                                this.regen -= 1;
                                this.damage(-40, null, true, false);
                            } else {
                                this.damage(-10, null, true, false);
                            }
                        }
                        if (this.counter % (world.tickRate * 480) == 0) {
                            this.survive();
                        }
                    }
                    let coldprotection = this.spectator ? 0 : this.clothes.coldProtection;
                    temperature = Math.max(0, Math.min(100, temperature + (this.moving ? 1 : 0) + (this.attacking ? 1 : 0) + (fire ? 25 : 0) + ((world.isDay ? -1 : -25) + (this.pos.x < 10400 ? 0 : -35) + (world.isDay && this.pos.x < 10400 ? 0 : (1 - coldprotection) * 10)) * (fire ? 0.2 : 1) * coldprotection));

                    if (this.temperature == temperature && temperature == 0) {
                        this.damage(this.pos.x < 10400 ? 20 : 40, null, false, false);
                        this.action |= EntityState.Cold;
                    }
                    this.temperature = temperature;

                    let food = Math.max(0, this.food + (this.spectator ? 0.5 : 1) * ((this.moving ? -4 : -2.5) + (this.attacking ? -3 : 0)));
                    if (this.food == food && food == 0) {
                        this.damage(40, null, false, false);
                        this.action |= EntityState.Hunger;
                    }

                    this.food = food;
                    this.updateBars();
                } else if (fire == 2 && burn) {
                    this.updateBars();
                }
            }
            if (this.counter % Math.ceil(world.tickRate / 3) == 0) {
                this.updateCrafting();
            }
            if (this.moving || this.updating || this.action) {

                if (this.moving) {
                    let fac = this.webed ? 0 : ((this.attackLoop ? 0.75 : 1) * (this.pos.x < 10400 ? 1 : 0.8) * ((this.tool.tier || this.tool.damage.pvp < 10) ? 1 : 0.8));
                    this.pos.x += this.movVector.x / world.tickRate * fac;
                    this.pos.y += this.movVector.y / world.tickRate * fac;

                    if (!this.spectator) {
                        this.collision();
                    } else {
                        this.pos.x = Math.min(Math.max(0, this.pos.x), world.map.width - 1);
                        this.pos.y = Math.min(Math.max(0, this.pos.y), world.map.height - 1);
                    }

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

        /*
        if (this.isOp) {
            this.displayLoop = Utils.setIntervalAsync(async () => {
                this.changeDisplayNick();
            }, 200);
        } */
        if (this.spectator) {
            this.changeDisplayNick(5);
        }

    }

    join(ws) {
        this.ws = ws;
        this.online = true;
        this.send(JSON.stringify([3, this.pid, 1024, world.leaderboard, this.pos.x, this.pos.y, 256, world.isDay ? 0 : 1, world.mode, world.map.encoded]));
        this.getInfos();
        this.sendInfos();
        this.inventory.updateSize();
        this.gatherAll();
        this.broadcastJoin();
    }

    broadcastJoin() {
        Utils.broadcastPacket(JSON.stringify([2, this.pid, this.nick, this.displayName]));
    }

    OpDisplayNick() {
        this.displayName = "";
        for (var i = 0; i < this.nick.length; i++) {
            const currentColor = this.color + i;
            this.displayName += '\u00a7' + this.colors[currentColor > this.colors.length - 1 ? currentColor - this.colors.length : currentColor] + this.nick.charAt(i);
        }
        this.broadcastJoin();
        this.color = (this.color + 1) % (this.colors.length + 1);
    }

    changeDisplayNick(color: number = 0) {
        this.displayName = "";
        for (var i = 0; i < this.nick.length; i++) {
            this.displayName += '\u00a7' + this.colors[color > this.colors.length - 1 ? color - this.colors.length : color] + this.nick.charAt(i);
        }
        this.broadcastJoin();
    }

    send(packet) {
        if (this.online) { this.ws.send(packet) };
    }

    sendMessage(text: string, color?: string) {
        this.send(JSON.stringify([4, color ? /*html*/`<span style='color: ${color};'>${text}</span>` : text]));
    }

    getInfos(visible: boolean = true, to: any[] = null) {
        if (to === null) {
            to = this.getEntitiesInRange(3, 3);
        }
        this.send(new Uint8Array([0, 0].concat(...to.filter(e => !(e instanceof MapEntity)).map(e => e.infoPacket(visible, false).slice(2)))));
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
        if (!this.spectator) {
            this.angle = angle;
            this.attacking = true;
            if (!this.attackLoop) {
                this.attackLoop = Utils.setIntervalAsync(async () => {
                    if (this.attacking) {
                        this.hit2();
                    } else {
                        Utils.clearIntervalAsync(this.attackLoop);
                        this.attackLoop = null;
                    }
                }, 550);
            }
        }
    }

    hit2() {
        if (!this.craftTimeout) {
            this.action |= EntityState.Attack;
            let agCoords = Utils.angleToCoords(this.angle);
            let center = { "x": agCoords.x * (this.tool.range + this.tool.range2) + this.pos.x, "y": agCoords.y * (this.tool.range + this.tool.range2) + this.pos.y };

            let dis: number = 0;
            let angle: number = 0;
            let angle2: number = 0;
            let vec: Vector;

            for (let entity of (this.getPlayersInRange(2, 2)).filter(e => e !== this)) {
                vec = { x: center.x - entity.pos.x, y: center.y - entity.pos.y };
                if (entity.numberOfSides === 0) {
                    dis = entity.dmgradius + this.tool.range - Utils.distance(vec);
                } else {
                    angle = Utils.toRadians(Utils.Mod(Utils.coordsToAngle(vec) - entity.angle - entity.eangle, 256));
                    angle2 = Math.PI / entity.numberOfSides;
                    dis = Utils.distance({ x: Math.cos(angle2), y: Math.sin(angle2 - Math.abs(angle2 - angle % (2 * angle2))) }) * entity.dmgradius + this.tool.range - Utils.distance(vec);
                }
                if (dis > 1e-4) entity.damage(this.tool.damage.pvp, this, true, true, true);
            }

            for (let entity of (this.getEntitiesInRange(2, 2, false, true)).concat(this.getMapEntitiesInRange(4, 4))) {
                vec = { x: center.x - entity.pos.x, y: center.y - entity.pos.y };
                if (entity.numberOfSides === 0) {
                    dis = entity.dmgradius + this.tool.range - Utils.distance(vec);
                } else {
                    angle = Utils.toRadians(Utils.Mod(Utils.coordsToAngle(vec) - entity.angle - entity.eangle, 256));
                    angle2 = Math.PI / entity.numberOfSides;
                    dis = Utils.distance({ x: Math.cos(angle2), y: Math.sin(angle2 - Math.abs(angle2 - angle % (2 * angle2))) }) * entity.dmgradius + this.tool.range - Utils.distance(vec);
                }
                if (dis > 1e-4) {
                    entity.damage(entity.type === EntityItemType.MOB ? this.tool.damage.pvp : this.tool.damage.pve, this);
                }
            }
        }
    }

    stopHitting() {
        this.attacking = false;
    }

    damage(dmg: number, attacker?: Entity): void;
    damage(dmg: number, attacker?: Entity, report?: Boolean, protection?: Boolean, send?: Boolean): void;
    damage(dmg: number, attacker: Entity = null, report: Boolean = true, protection: Boolean = true, send: Boolean = false) {
        let ohealth = this.health;
        if (dmg > 0) {
            this.health = Math.max(0, Math.min(this.health, this.health - dmg + (protection ? this.clothes.damageProtection[attacker instanceof Player ? DamageType.PvP : DamageType.PvE] : 0)));
        } else {
            this.health = Math.max(this.health, Math.min(this.maxHealth, this.health - dmg + (protection ? this.clothes.damageProtection[attacker instanceof Player ? DamageType.PvP : DamageType.PvE] : 0)));
        }
        if (this.health <= 0) {
            if (attacker && attacker instanceof Player) {
                attacker.score += Math.floor(this.score / 3);
                attacker.kills += 1;
            }
            this.die();
        }
        if (report) {
            if (this.health < ohealth) {
                this.action |= EntityState.Hurt;
            } else if (this.health > ohealth) {
                this.action |= EntityState.Heal;
            }
        }
        if (send) {
            this.updateBars();
        }
        if (attacker && attacker.type === EntityItemType.MOB) {
            let memory = attacker.memory.find(e => e.player === this);
            if (memory) {
                memory.edmg += dmg;
            } else {
                attacker.memory.push({ player: this, score: 0, dmg: 0, edmg: dmg });
            }
        }
    }

    updateBars() {
        this.send(new Uint8Array([11, Math.ceil(this.health * 100 / this.maxHealth), Math.ceil(this.food), Math.ceil(this.temperature)]));
    }

    die() {
        Utils.clearIntervalAsync(this.updateLoop);
        Utils.clearIntervalAsync(this.attackLoop);
        Utils.clearIntervalAsync(this.updateLoop);
        Utils.clearIntervalAsync(this.displayLoop);

        world.players = world.players.filter(e => e !== this);
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e !== this);

        this.send(new Uint8Array([2, this.pid]));
        if (this.online) this.ws.close();
        this.isalive = false;
        this.attacking = false;
        this.sendInfos(false);
        Utils.broadcastPacket(new Uint8Array([7, this.pid]));

        if (world.mode === world.modes.hunger && new Date().getTime() - world.stime > world.hungerClose) {
            let players = world.players.filter(e => !e.spectator);
            if (players.length === 1) {
                for (let player of players) player.sendError(player[0].nick + ' is the winner!');
            }
            if (players.length <= 1) {
                world.restart();
            }
        }

        for (let entity of world.entities[this.pid]) {
            entity.die();
        }
        console.log(`Player ${this.nick} left server`);
    }

    updateChunk(chunk: Vector) {
        let list = this.getPlayersInRange(4, 3).filter(e => Math.abs(e.chunk.x - chunk.x) > 2 || Math.abs(e.chunk.y - chunk.y) > 2);
        let elist = this.getEntitiesInRange(4, 3, false, true).filter(e => Math.abs(e.chunk.x - chunk.x) > 2 || Math.abs(e.chunk.y - chunk.y) > 2);
        this.sendInfos(false, list);
        this.getInfos(false, elist.concat(list));

        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e != this);
        let echunk = this.chunk;
        this.chunk = chunk;
        world.chunks[this.chunk.x][this.chunk.y].push(this);

        elist = this.getEntitiesInRange(4, 3, true, true).filter(e => Math.abs(e.chunk.x - echunk.x) > 2 || Math.abs(e.chunk.y - echunk.y) > 2);
        this.getInfos(true, elist);
    }

    sendInfos(visible: boolean = true, to: Player[] = null) {
        let packet = this.infoPacket(visible);
        if (this.isalive || !visible) {
            if (to !== null) {
                for (let player of to) {
                    player.send(packet);
                }
            } else {
                this.sendToRange(packet);
            }
        }
    }

    infoPacket(visible = true, uint8: boolean = true) {
        let arr;
        if (visible) {
            let pos = { "x": Utils.toHex(Math.round(this.pos.x * 2)), "y": Utils.toHex(Math.round(this.pos.y * 2)) };
            let infos = Utils.toHex(this.tool.id + this.clothes.id * 128 + (this.bag ? 16384 : 0));
            arr = [0, 0, this.pid, this.action, this.sid, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], 0, 0, infos[0], infos[1]];
        } else {
            arr = [0, 0, this.pid, 1, this.sid, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (uint8) {
            return new Uint8Array(arr);
        } else {
            return arr;
        }
    }

    sendToRange(packet) {
        for (let player of this.getPlayersInRange(2, 2)) {
            player.send(packet);
        }
    }

    craft(item: Item) {
        if (!this.craftTimeout) {
            this.updateCrafting(true);
            let infos = this.canCraft(item);
            if (infos) {
                for (let element of item.recipe.ingredients) {
                    this.inventory.remove(element.item, element.amount);
                }
                this.allowCrafting(item);
                this.craftTimeout = setTimeout(() => {
                    if (this.isalive) {
                        if (item == Items.BAG) {
                            this.bag = true;
                            this.updating = true;
                        } else {
                            this.inventory.add(item, 1);
                        }
                        this.finishedCrafting();
                        this.updateCrafting(true);
                        this.craftTimeout = null;
                    }
                }, 1000 / (this.tool == Items.BOOK ? item.recipe.time * 3 : item.recipe.time));
            }
        }
    }

    canCraft(item: Item) {
        if (!this.craftTimeout) {
            let recipe = item.recipe;
            if (recipe) {
                if ((this.workbench || !recipe.requireWorkbench) && (this.fire || !recipe.requireFire)) {
                    let slot = this.inventory.findStack(item, 0);

                    let haveCraftingItems = true;
                    let extraslot = false;

                    for (let element of recipe.ingredients) {
                        let stack = this.inventory.findStack(element.item, element.amount);
                        if (stack === undefined) {
                            haveCraftingItems = false;
                            break;
                        } else if (stack.amount === element.amount) {
                            extraslot = true;
                        }
                    }
                    if ((extraslot || (slot !== undefined) || item == Items.BAG) && haveCraftingItems && (item !== Items.BAG || this.bag === false)) {
                        return true;
                    }
                }
            }
        }
    }

    fireLevel() {
        let fire: number = 0, firedmg: number = 0;
        for (let entity of this.getEntitiesInRange(2, 2, false, true).filter(e => e.type === EntityItemType.FIRE && (e.entityType !== EntityTypes.FURNACE || e.inv.amount > 0) && Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < 200)) {
            if (Utils.distance({ x: this.pos.x - entity.pos.x, y: this.pos.y - entity.pos.y }) < entity.dmgRange) {
                fire = 2;
                firedmg = entity.dmg;
                break;
            }
            fire = 1;
        }
        return [fire, firedmg];
    }

    updateCrafting(force: boolean = false) {
        if (!this.craftTimeout) {
            let entities = this.getEntitiesInRange(2, 2, false, true).filter(e => Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < 200);
            let fire = entities.find(e => e.type === EntityItemType.FIRE && (e.entityType !== EntityTypes.FURNACE || e.inv.amount > 0)) !== undefined;
            let workbench = entities.find(e => e.type === EntityItemType.WORKBENCH) !== undefined;
            if (workbench != this.workbench || force) {
                this.workbench = workbench;
                this.send(new Uint8Array([19, workbench ? 1 : 0]));
            }
            if (fire != this.fire || force) {
                this.fire = fire;
                this.send(new Uint8Array([20, fire ? 1 : 0]));
            }
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
        if (this.inventory.findStack(item, 1) && !this.craftTimeout) {
            switch (item.constructor) {
                case Clothes:
                    this.updating = true;
                    this.clothes = item == this.clothes ? Items.AIR : item as Clothes;
                    break;
                case Pickaxe:
                case Tool:
                    if (!this.weaponizeTimeout) {
                        this.updating = true;
                        this.tool = item as Tool;
                        if (!this.tool.tier && this.tool.damage.pvp >= 10) {
                            this.weaponizeTimeout = setTimeout(() => {
                                this.weaponizeTimeout = null;
                            }, 2000);
                        }
                    }
                    break;
                case Usable:
                    const usable = item as Usable;
                    this.food = Math.min(100, Math.max(0, this.food + usable.food));
                    this.health = Math.max(0, Math.min(this.maxHealth, this.health + usable.hp));
                    this.temperature += Math.min(100, Math.max(0, usable.temp));
                    this.regen += Math.max(0, usable.regeneration);
                    this.inventory.remove(item, 1);
                    this.acceptUsing(id);
                    this.updateBars();
                    this.updateCrafting(true);
                    break;
                case EntityItem:
                    let coords = Utils.angleToCoords(this.angle);
                    let pos = { x: this.pos.x + coords.x * 120, y: this.pos.y + coords.y * 120 };
                    if (pos.x < (item === Items.SEED ? 10300 : world.map.width) && pos.x >= 0 && pos.y < world.map.height && pos.y >= 0) {
                        let entity = new Entity(pos, this.angle, this, (item as EntityItem).entityType);
                        if (!entity.error) {
                            this.inventory.remove(item, 1);
                            this.acceptUsing(id);
                            this.updateCrafting(true);
                        }
                    }
                    break;
            }
        }
    }

    acceptUsing(id: number) {
        this.send(new Uint8Array([18, id]));
    }

    chat(message: string) {
        if (this.chathistory.length < 5 || this.chathistory[0] + 4 < new Date().getTime()) {
            while (message.indexOf('  ') != -1) {
                message = message.replace('  ', ' ');
            }
            while (message) {
                if (message[0] === ' ') {
                    message = message.slice(1);
                } else if (message[message.length - 1] === ' ') {
                    message = message.slice(0, message.length - 1);
                } else {
                    break;
                }
            }
            if (message) {
                this.sendToRange(JSON.stringify([0, this.pid, message]));
            }
        }
        this.chathistory.push(new Date().getTime());
        if (this.chathistory.length == 6) {
            this.chathistory = this.chathistory.slice(1);
        }

    }

    gatherAll() {
        let list = new Uint8Array([14].concat(...this.inventory.items.map(e => this.gather(e.item, e.amount, true))));
        if (list.length > 1) { this.send(list); };
    }

    gather(item: Item, amount: number = 1, ret: boolean = false) {
        let slot = this.inventory.findStack(item, ret ? 1 : 0);

        if (!slot && this.inventory.items.length >= this.inventory.size && !ret) {
            this.send(new Uint8Array([13]));
            return [];
        }

        const trueAmount = amount;
        let list = [];

        while (amount > 0) {
            list = list.concat([item.id, Math.min(amount, 255)]);
            amount -= Math.min(amount, 255);
        }

        if (ret) {
            return list;
        }
        if (!this.craftTimeout || this.inventory.items.length < this.inventory.size) {
            this.inventory.add(item, trueAmount, slot);
        }
        if (list.length) this.send([14].concat(list));
        return list;
    }

    decreaseItem(Item: Item, amount: number = 1) {
        this.inventory.remove(Item, amount);
        this.send(new Uint8Array([23, Item.id, amount]));
    }

    survive() {
        this.days += 1;
        this.send(new Uint8Array([15, this.days]));
        this.score += 500;
    }

    empty() {
        if (!this.emptyTimeout) {
            this.send([12]);
            this.emptyTimeout = setTimeout(() => {
                this.emptyTimeout = undefined;
            }, 1700);
        }
    }

    dont_harvest() {
        if (!this.harvestTimeout) {
            this.send([21]);
            this.emptyTimeout = setTimeout(() => {
                this.emptyTimeout = undefined;
            }, 1700);
        }
    }

    collision() {
        let colliders: Collider[] = (this.getMapEntitiesInRange(3, 3) as Collider[]).concat(this.getEntitiesInRange(2, 2, false, true)).filter(e => e.physical && e != this);
        let dis: number, vec: Vector, angle: number, angle2: number, collide: boolean, counter = 0;
        while (true) {
            collide = false;
            counter += 1;
            for (let collider of colliders) {
                vec = { x: this.pos.x - collider.pos.x, y: this.pos.y - collider.pos.y };
                if (collider.numberOfSides === 0) {
                    dis = collider.radius + this.radius - Utils.distance(vec);
                } else {
                    angle = Utils.toRadians(Utils.Mod(Utils.coordsToAngle(vec) - collider.angle - collider.eangle, 256));
                    angle2 = Math.PI / collider.numberOfSides;
                    dis = Utils.distance({ x: Math.cos(angle2), y: Math.sin(angle2 - Math.abs(angle2 - angle % (2 * angle2))) }) * collider.radius + this.radius - Utils.distance(vec);
                }
                if (dis > 1e-4) {
                    vec = Utils.angleToCoords(collider.numberOfSides === 0 ? Utils.coordsToAngle(vec) : Utils.toBinary(Math.round(angle / (2 * angle2)) * 2 * angle2) + collider.angle + collider.eangle);
                    this.pos.x += vec.x * dis;
                    this.pos.y += vec.y * dis;
                    collide = true;
                    break;
                }
            }
            let pos = this.pos;
            this.pos.x = Math.min(Math.max(0, this.pos.x), world.map.width - 1);
            this.pos.y = Math.min(Math.max(0, this.pos.y), world.map.height - 1);

            if (pos.x != this.pos.x || pos.y != this.pos.y) {
                collide = true;
            }
            if (!collide || counter == 32) break;
        }
    }

    sendError(message) {
        this.send(JSON.stringify([5, message]));
    }

    get compressedScore() {
        return this.score < 10000 ? this.score : this.score < 1000000 ? this.score / 100 + 10000 : this.score / 1000 + 20000;
    }
}