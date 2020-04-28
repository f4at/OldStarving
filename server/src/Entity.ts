import { Vector, Utils } from ".";
import Player from './Player';
import world, { MapEntityDrop, MapEntity } from "./World";
import Item, { Items, Pickaxe } from "./Item";
import { runInThisContext } from "vm";
import { openSync } from "fs";

export enum EntityItemType {
    WALL = 0,
    DOOR = 1,
    SPIKE = 2,
    FIRE = 3,
    WORKBENCH = 4,
    HARVESTABLE = 5,
    MOB = 6,
    CHEST = 7,
    PLAYER = 8
}

export class EntityType {
    name: string;
    id: number;
    numberOfSides: number; // special cases: 0 for circle,  1 for line,  2 for 2 parrallel lines eg: '| |'
    radius: number; //distance between center and middle of sides.
    XtoYfactor: number; //important to make rectanges(instead of squares only) + other shapes
    hp: number; //
    type: EntityItemType;
    special: any;

    constructor(id: number, numberOfSides: number = -1, radius: number, XtoYfactor: number, hp: number, type: EntityItemType, special: any) {
        this.id = id;
        this.numberOfSides = numberOfSides;
        this.radius = radius;
        this.XtoYfactor = XtoYfactor;
        this.hp = hp;
        this.type = type;
        this.special = special;
    }
}

export class EntityTypes {
    static FIRE = Items.FIRE.entityType = new EntityType(1, 0, 40, 1, 500, EntityItemType.FIRE, { physical: false, Lifespan: 2, dmg: 10, dmgDelay: 4000, dmgRange: 35 });
    static WORKBENCH = Items.WORKBENCH.entityType = new EntityType(2, 4, 50, 1.25, 500, EntityItemType.WORKBENCH, { physical: true });
    static SEED = Items.SEED.entityType = new EntityType(3, 0, 40, 1, 500, EntityItemType.HARVESTABLE, { physical: false, inv: { item: Items.PLANT, amount: 0, max: 3, delay: 15, respawn: 1 }, Lifespan: 60, LifeDelay: 1 / 6 });
    static WOOD_WALL = Items.WOOD_WALL.entityType = new EntityType(4, 0, 50, 1, 1000, EntityItemType.WALL, { physical: true });
    static WOOD_SPIKE = Items.WOOD_SPIKE.entityType = new EntityType(5, 0, 50, 1, 150, EntityItemType.SPIKE, { physical: true, hitdmg: 2, dmg: 5 });
    static BIG_FIRE = Items.BIG_FIRE.entityType = new EntityType(6, 0, 35, 1, 700, EntityItemType.FIRE, { physical: false, Lifespan: 5, dmg: 20, dmgDelay: 4000, dmgRange: 40 });
    static STONE_WALL = Items.STONE_WALL.entityType = new EntityType(7, 7, 50, 1, 1500, EntityItemType.WALL, { physical: true, tier: 1 });
    static GOLD_WALL = Items.GOLD_WALL.entityType = new EntityType(8, 7, 50, 1, 2000, EntityItemType.WALL, { physical: true, tier: 2 });
    static DIAMOND_WALL = Items.DIAMOND_WALL.entityType = new EntityType(9, 7, 50, 1, 2500, EntityItemType.WALL, { physical: true, tier: 3 });
    static WOOD_DOOR = Items.WOOD_DOOR.entityType = new EntityType(10, 0, 50, 1, 3500, EntityItemType.DOOR, { physical: true });
    static CHEST = Items.CHEST.entityType = new EntityType(11, 4, 25, 1.3, 300, EntityItemType.CHEST, { physical: true, inv: { item: null, amount: 0 } });
    static STONE_SPIKE = Items.STONE_SPIKE.entityType = new EntityType(12, 7, 50, 1, 300, EntityItemType.SPIKE, { physical: true, tier: 1, hitdmg: 5, dmg: 20, dmgDelay: 1500, dmgRange: 70 });
    static GOLD_SPIKE = Items.GOLD_SPIKE.entityType = new EntityType(13, 7, 50, 1, 600, EntityItemType.SPIKE, { physical: true, tier: 2, hitdmg: 10, dmg: 30, dmgDelay: 1500, dmgRange: 70 });
    static DIAMOND_SPIKE = Items.DIAMOND_SPIKE.entityType = new EntityType(14, 7, 50, 1, 900, EntityItemType.SPIKE, { physical: true, tier: 3, hitdmg: 15, dmg: 40, dmgDelay: 1500, dmgRange: 70 });
    static STONE_DOOR = Items.STONE_DOOR.entityType = new EntityType(15, 7, 50, 1, 1500, EntityItemType.DOOR, { physical: true, tier: 1 });
    static GOLD_DOOR = Items.GOLD_DOOR.entityType = new EntityType(16, 7, 50, 1, 2000, EntityItemType.DOOR, { physical: true, tier: 2 });
    static DIAMOND_DOOR = Items.DIAMOND_DOOR.entityType = new EntityType(17, 7, 50, 1, 2500, EntityItemType.DOOR, { physical: true, tier: 3 });
    static FURNACE = Items.FURNACE.entityType = new EntityType(18, 0, 60, 1, 700, EntityItemType.FIRE, { physical: true, dmg: 25, dmgDelay: 6000, dmgRange: 30, inv: { item: Items.WOOD, amount: 0 } });
    static AMETHYST_WALL = Items.AMETHYST_WALL.entityType = new EntityType(19, 7, 50, 1, 3500, EntityItemType.WALL, { physical: true, tier: 4 });
    static AMETHYST_SPIKE = Items.AMETHYST_SPIKE.entityType = new EntityType(20, 7, 50, 1, 1200, EntityItemType.SPIKE, { physical: true, tier: 4, hitdmg: 20, dmg: 50, dmgDelay: 1500, dmgRange: 70 });
    static AMETHYST_DOOR = Items.AMETHYST_DOOR.entityType = new EntityType(21, 7, 50, 1, 3500, EntityItemType.DOOR, { physical: true, tier: 4 });

    static RABBIT = new EntityType(60, 0, 20, 1, 60, EntityItemType.MOB, { physical: false, speed: 200, genes: [0.05, 0, 150, 210, -200, 200, 2, 0.5, 0.2, 1, 0, 0.9, 0.99, 8, 2, 30, 0.1] });
    static WOLF = new EntityType(61, 0, 30, 1, 300, EntityItemType.MOB, { physical: false, offensive: true, dmg: 40, speed: 190, genes: [0.05, 2, 300, 300, -200, 200, 3, 0.5, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 20, 0.1] });
    static SPIDER = new EntityType(62, 0, 32, 1, 120, EntityItemType.MOB, { physical: false, offensive: true, dmg: 20, speed: 180, genes: [0.05, 3, 250, 150, -200, 200, 2, 0.5, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 5, 0.1] });
    static FOX = new EntityType(63, 0, 30, 1, 300, EntityItemType.MOB, { physical: false, offensive: true, dmg: 25, speed: 160, genes: [0.05, 2.5, 300, 300, -200, 200, 3, 0.5, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 15, 0.1] });
    static BEAR = new EntityType(64, 0, 35, 1, 900, EntityItemType.MOB, { physical: false, offensive: true, dmg: 60, speed: 160, genes: [0.1, 2, 300, 200, -200, 200, 3, 0.5, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 20, 0.1] });
    static DRAGON = new EntityType(65, 0, 50, 1, 1500, EntityItemType.MOB, { physical: false, offensive: true, dmg: 90, speed: 190, genes: [0.05, 1.5, 350, 350, -200, 200, 3, 0.5, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 5, 0.1] });

    static FRUIT = new EntityType(100, 0, 55, 1, 0, EntityItemType.HARVESTABLE, { physical: false, inv: { item: Items.PLANT, amount: 3, maximum: 5, delay: 10, respawn: 1 } });

    static TYPES: Map<string, EntityType> = new Map();

    static get(key: number | string): EntityType {
        if (typeof key === "string")
            return this.TYPES.get(key);
        return Array.from(this.TYPES.values()).find(item => item.id === key);
    }
}

for (let name in EntityTypes) {
    const item = EntityTypes[name];

    if (item) {
        item.name = name;
        EntityTypes.TYPES.set(name, item);
    }
}

export interface Collider {
    physical: boolean;
    numberOfSides: number;
    angle: number;
    eangle: number;
    radius: number;
    pos: Vector;
}

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

export default class Entity implements Collider {
    type: EntityItemType;
    entityType: EntityType;
    owner: Player = null;
    ownerId: number;
    id: number;
    mapID: number;
    item: Item;
    physical: boolean;
    tier: number;
    miningTier: number;
    error: string;
    info: number = 0;

    pos: Vector;
    angle: number;
    eangle: number;
    action: number = EntityState.None;
    chunk: Vector;
    speed: number;
    counter: number = 0;
    inv: MapEntityDrop;
    hitDamage: number;
    regen: number = 0;

    numberOfSides: number;
    radius: number;
    XtoYfac: any;

    offensive: boolean;
    dmg: number = 0;
    dmgDelay: number = 0;
    dmgRange: number = 0;
    sid: number = 0;

    updateLoop: any;
    updating: boolean;
    moveDelay: number;

    maxHealth: number;
    health: number;
    stime: number;

    lifespan: number;
    lifeUpdate: number;
    lifeLoop: any;

    fscore: number = 0; // TODO SET fscore/kscore for entites/mapentities
    kscore: number = 0;

    memory: any = [];
    genes: any;

    constructor(pos: Vector, angle: number, owner: Player, entityItem: EntityType, genes = null) {
        if (entityItem !== null) {
            this.type = entityItem.type; //enitity type
            this.entityType = entityItem; //entity id
            this.item = Items.get(entityItem.id); //item id
            this.owner = owner;
            this.ownerId = this.owner === null ? 0 : this.owner.pid;
            for (let i = 1; i < 256 ** 2; i++) {
                if (!world.entities[this.ownerId].find(e => e.id == i)) {
                    this.id = i;
                    break;
                }
            }

            if (!this.id) {
                this.error = "The limit of possible placed entities of this type exceeded";
                return;
            }

            this.pos = pos;
            this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };

            this.angle = angle;
            this.maxHealth = entityItem.hp;
            this.health = this.maxHealth;

            this.numberOfSides = entityItem.numberOfSides;
            this.radius = entityItem.radius;
            this.XtoYfac = entityItem.XtoYfactor;

            let special = entityItem.special;
            this.physical = special.physical === undefined ? true : special.physical;
            this.offensive = special.offensive ? true : false;
            this.dmg = special.dmg ? special.dmg : 0;
            this.dmgRange = special.dmgRange ? special.dmgRange : 0;
            this.eangle = special.eangle ? special.eangle : 0;
            this.tier = special.tier ? special.tier : 0;
            this.speed = special.speed ? special.speed : 0;
            this.inv = Object.assign({}, special.inv);
            this.lifespan = special.Lifespan;
            this.hitDamage = special.hitdmg ? special.hitdmg : 0;
            this.miningTier = special.ftier ? special.ftier : -1;
            this.moveDelay = special.moveDelay ? special.moveDelay : 250;
            this.dmgDelay = special.dmgDelay ? special.dmgDelay : 1000;
            this.regen = special.regen ? special.regen : 0;
            this.stime = new Date().getTime();

            this.genes = Object.assign({}, genes === null ? (special.genes ? special.genes : null) : genes);

            if (this.genes) {
                for (let i = 0; i < this.genes.length; i++) {
                    let fac = Utils.remap(Math.random(), 0, 1, this.genes[11], this.genes[12]);
                    this.genes[i] *= Math.random() > 0.5 ? 1 / fac : fac;
                    this.genes[i] += Utils.remap(Math.random() ** this.genes[13] * this.genes[14], 0, 1, -1, 1);
                }
            }

            if (this.getEntitiesInRange(1, 1, false, true).concat(this.getMapEntitiesInRange(5, 5)).find(e => Utils.distance({ x: pos.x - e.pos.x, y: pos.y - e.pos.y }) < this.radius + e.radius)) {
                this.error = "Can't place entity in top of other Entities";
                return;
            }
            world.entities[this.ownerId].push(this);
            world.echunks[this.chunk.x][this.chunk.y][this.ownerId].push(this);
            this.sendInfos();
            this.init();
        }
    }

    init() {
        if (this.lifespan) {
            if (this.type === EntityItemType.MOB) {
                this.lifeLoop = setInterval(() => {
                    if (new Date().getTime() - this.stime > this.lifeUpdate * 60000) {
                        this.die();
                    } else {
                        this.damage(-this.regen);
                    }
                }, this.lifeUpdate);
            } else {
                this.lifeLoop = setInterval(() => {
                    this.damage(this.maxHealth * this.lifespan / this.lifeUpdate);
                }, this.lifeUpdate);
            }
        }
        switch (this.type) {
            case EntityItemType.HARVESTABLE:
                this.info = this.inv.amount;
                if (this.inv.respawn > 0) {
                    this.updateLoop = setInterval(() => {
                        this.inv.amount = Math.min(this.inv.maximum, this.inv.amount + this.inv.respawn);
                        if (this.entityType === EntityTypes.FRUIT) {
                            this.info = this.inv.amount;
                            this.sendInfos();
                        }
                    }, this.inv.delay * 1000);
                }
                break;
            case EntityItemType.MOB:
                let movement = { vec: { x: 0, y: 0 }, time: 0.5 ,active: false};
                let loopDuration = (this.moveDelay * world.tickRate / 1000);
                let dmgDuration = (this.dmgDelay * world.tickRate / 1000);
                this.updateLoop = setInterval(() => {
                    this.counter += 1;
                    let fac = movement.active ? 1 : 6;
                    let mov = (this.counter % (loopDuration*fac) );
                    if (this.counter % dmgDuration < 1) {
                        let players = this.getPlayersInRange(1, 1).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < this.dmgRange + e.radius);
                        for (let player of players) {
                            player.damage(this.dmg, null);
                        }
                    }
                    if (mov < 1) {
                        movement = this.moveAI(loopDuration); //ai
                    };
                    if (mov < movement.time * (loopDuration*fac)) {

                        let opos = {x:this.pos.x,y:this.pos.y};
                        this.pos.x += movement.vec.x / world.tickRate;
                        this.pos.y += movement.vec.y / world.tickRate;
                        this.collision();
                        opos = {x: this.pos.x-opos.x, y: this.pos.y-opos.y}
                        let chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
                        if (this.chunk.x != chunk.x || chunk.y != this.chunk.y) {
                            this.updateChunk(chunk);
                        }
                        if (Utils.distance(opos) > 1) {
                            let angle = Math.floor(Utils.coordsToAngle(opos)-64);
                            this.angle = angle < 0 ? angle + 256 : angle;
                            this.sendInfos();
                            this.action = 0;
                        }
                    }
                }, 1000 / world.tickRate);
                break;
            case EntityItemType.FIRE:
                this.updateLoop = setInterval(() => {
                    let players = this.getEntitiesInRange(1, 1).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < e.radius + this.dmgRange);
                    for (let player of players) {
                        player.damage(this.dmg, null);
                    }
                    if (this.entityType === EntityTypes.FURNACE && this.inv.amount > 0) {
                        this.inv.amount -= 1;
                        this.info = this.inv.amount;
                        if (this.inv.amount > 0) {
                            this.action = EntityState.Hurt;
                        } else {
                            this.action = EntityState.None;
                        }
                        this.sendInfos();
                    }
                }, this.dmgDelay);
                break;
            case EntityItemType.SPIKE:
                this.updateLoop = setInterval(() => {
                    let players = this.getPlayersInRange(1, 1).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < e.radius + this.dmgRange && e !== this.owner);
                    for (let player of players) {
                        player.damage(this.dmg, null);
                    }
                }, this.dmgDelay);
                break;
            default:
                this.updateLoop = setInterval(() => {
                    if (this.action) { this.sendInfos(); };
                }, 200);
                break;
        }
    }

    damage(dmg: number, attacker: Player = null) { // use negative values to increase hp
        if (this.type === EntityItemType.HARVESTABLE) {
            if (attacker) {
                if (this.miningTier < 0) {
                    if (this.inv.item !== null && this.inv.amount > 0) {
                        attacker.score += this.fscore;
                        attacker.gather(this.inv.item, 1);
                        this.inv.amount -= 1;
                        if (this.entityType === EntityTypes.FRUIT) {
                            this.info = this.inv.amount;
                            this.sendInfos();
                        }
                    }
                } else if (attacker.tool instanceof Pickaxe && this.miningTier <= attacker.tool.miningTier) {
                    let amount = Math.min(this.inv.amount, attacker.tool.miningTier - this.miningTier + 1);
                    attacker.score += amount * this.fscore;
                    attacker.gather(this.inv.item, amount);
                    this.inv.amount -= amount;
                }
                if (this instanceof MapEntity) {
                    let angle = Math.round(Utils.coordsToAngle({ x: this.pos.x - attacker.pos.x, y: this.pos.y - attacker.pos.y })) % 256;
                    this.sendToRange(new Uint16Array([9, Math.floor(this.pos.x / 100), Math.floor(this.pos.y / 100), angle, this.mapID]));
                }
            }
        }

        if (!(this instanceof MapEntity)) {
            if (this.maxHealth > 0) {
                let fac = 1;
                if (attacker) {
                    let tier = attacker.tool.tier ? attacker.tool.tier : 0;
                    fac = (this.tier > tier ? 0.5 ** (this.tier - tier) : 1);
                }
                this.health = Math.min(this.maxHealth, this.health - dmg * fac);
                if (this.health <= 0) {
                    return this.die(attacker ? attacker : null);
                }
            }
            if (attacker) {
                switch (this.type) {
                    case EntityItemType.MOB:
                        //this.action |= EntityState.Hurt;
                        break;
                    case EntityItemType.SPIKE:
                        if (attacker !== this.owner) { attacker.damage(this.hitDamage, null); };
                        break;
                }
                let angle;
                switch (this.type) {
                    case EntityItemType.DOOR:
                        if (this.owner === attacker) {
                            this.info = this.info ? 0 : 1;
                            this.physical = !this.physical;
                            this.sendInfos();
                            break;
                        }
                    default:
                        let id = Utils.toHex(this.id);
                        angle = Math.round(Utils.coordsToAngle({ x: this.pos.x - attacker.pos.x, y: this.pos.y - attacker.pos.y }));
                        this.sendToRange(new Uint8Array([22, 0, id[0], id[1], this.ownerId, angle]));
                        break;
                }
            }

        }

    }

    die(attacker: Player = null) {
        this.sendInfos(false);
        world.echunks[this.chunk.x][this.chunk.y][this.ownerId] = world.echunks[this.chunk.x][this.chunk.y][this.ownerId].filter(e => e !== e);
        world.entities[this.ownerId] = world.entities[this.ownerId].filter(e => e !== e);

        if (this.updateLoop) {
            clearInterval(this.updateLoop);
        }
        if (this.lifeLoop) {
            clearInterval(this.lifeLoop);
        }
        if (attacker) {
            attacker.score += 10 + this.kscore;
            if (this.inv) {
                if (this.inv.amount) {
                    attacker.inventory.add(this.inv.item, this.inv.amount);
                }
            }
        }
    }

    sendInfos(visible = true, to: Player[] = null) {
        if (!(this instanceof MapEntity)) {
            let packet = this.infoPacket(visible);
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
            let pos = { "x": Utils.toHex(this.pos.x * 2), "y": Utils.toHex(this.pos.y * 2) };
            let id = Utils.toHex(this.id);
            let info = Utils.toHex(this.info);
            arr = [0, 0, this.ownerId, this.action, this.entityType.id, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], id[0], id[1], info[0], info[1]];
        } else {
            let id = Utils.toHex(this.id);
            arr = [0, 0, this.ownerId, 1, 0, 0, 0, 0, 0, 0, id[0], id[1], 0, 0];
        }
        if (uint8) {
            return new Uint8Array(arr);
        } else {
            return arr;
        }
    }

    sendToRange(packet) {
        let players = this.getPlayersInRange(2, 2);
        for (let player of players) { player.send(packet); };
    }

    getPlayersInRange(x: number, y: number): Player[] {
        return this.getEntitiesInRange(x, y, true, false) as Player[]; // .filter(x => x instanceof Player) as Player[];
    }

    getEntitiesInRange(x: number, y: number, player: boolean = true, entity: boolean = true): Entity[] {
        let ymin = Math.max(-y + this.chunk.y, 0), ymax = Math.min(y + 1 + this.chunk.y, world.mapSize.y),
            xmin = Math.max(-x + this.chunk.x, 0), xmax = Math.min(x + 1 + this.chunk.x, world.mapSize.x);
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

    getMapEntitiesInRange(x: number, y: number) {
        try {
            let ymin = Math.max(-y + Math.floor(this.pos.y / 100), 0), ymax = Math.min(y + 1 + Math.floor(this.pos.y / 100), world.map.height),
                xmin = Math.max(-x + Math.floor(this.pos.x / 100), 0), xmax = Math.min(x + 1 + Math.floor(this.pos.x / 100), world.map.width);
            let list = [];
            for (let x = xmin; x < xmax; x++) {
                for (let y = ymin; y < ymax; y++) {
                    list = list.concat(world.map.chunks[y][x]);
                }
            }
            return list;
        } catch {
            // bc entity loading before map :3 ignoring this = no harm
            return [];
        }
    }

    moveAI(loopDuration: number) {
        let v = this.genes;
        let scores = [];
        let vectors = [];
        let players = this.getPlayersInRange(1, 1);
        let active = false;
        for (let player of players) {
            let memory = this.memory.find(e => e.player === player);
            if (!memory) {
                memory = { player: player, score: 0, dmg: 0, edmg: 0 };
                this.memory.push(memory);
            };
            let s = Utils.remap(v[1] * this.health - player.health - v[9] * memory.dmg / this.maxHealth + v[10] * memory.edmg / 200, v[4], v[5], -1, 1, true);
            let distance = Utils.distance({ x: this.pos.x - player.pos.x, y: this.pos.y - player.pos.y });
            memory.score = (memory.score + s * (1 - Utils.remap(distance, 0, Utils.remap(s, -1, 1, v[2], v[3]), 0, 1, true))) / 2;
            memory.score = Math.abs(memory.score) > v[0] ? memory.score : 0;
            scores.push(memory.score);
            vectors.push({ x: this.pos.x - player.pos.x + Utils.remap(Math.random(),0,1,-v[15],v[15]), y: this.pos.y - player.pos.y + Utils.remap(Math.random(),0,1,-v[15],v[15])});
        }
        this.memory = this.memory.filter(e => players.includes(e.player));
        let fvector = { x: 0, y: 0 };
        let time = 0;
        if (players.length && Math.max(...scores.map(e=> Math.abs(e)))) {
            let min = Math.min(...scores);
            scores = scores.map(e => (e - min * v[7]) ** v[6] - min * v[8]);
           
            let tdistance = 0;
            for (let i = 0; i < scores.length; i++) {
                let distance = Utils.distance(vectors[i]);
                tdistance += Math.abs(scores[i]) * (scores[i] > 0 ? 1 : Math.min(distance/this.speed, 1)**v[16] );  
                if (distance != 0) { 
                    fvector.x += vectors[i].x/distance * scores[i];
                    fvector.y += vectors[i].y/distance * scores[i];
                }
            }
            let fvecDistance = Utils.distance(fvector);
            if (fvecDistance === 0) {
                fvector.x = 0;
                fvector.y = 0;
            } else {
                fvector.x *= this.speed/fvecDistance;
                fvector.y *= this.speed/fvecDistance;
            }
            time = tdistance/scores.reduce((pv, cv) => pv + Math.abs(cv) , 0);
            active = true;
        } else {
            fvector = Utils.angleToCoords(Math.random() * 256);
            fvector.x *= this.speed * 0.8;
            fvector.y *= this.speed * 0.8;
            time = 0.75;      
        }
        return { vec: fvector, time: time, active: active};
    }

    collision() {
        //collision version 1(not real collision just simulation to save time and ressources will make real one later)
        // VERY HARD
        // let entities = this.getEntitiesInRange(1, 1, false, true);
        // let mapEntities = this.getMapEntitiesInRange(3, 3);
        let colliders: Collider[] = (this.getMapEntitiesInRange(3, 3) as Collider[]).concat(this.getEntitiesInRange(1, 1, false, true)).filter(e=> e.physical && e != this);
        let dis: number, vec: Vector, angle: number, angle2: number, collide: boolean, counter = 0;
        while (true) {
            collide = false;
            counter += 1;
            for (let collider of colliders) {
                vec = { x: this.pos.x - collider.pos.x, y: this.pos.y - collider.pos.y };
                if (collider.numberOfSides === 0) {
                    dis = collider.radius + this.radius - Utils.distance(vec);
                } else {
                    angle = Utils.toRadians(Utils.coordsToAngle(vec) - collider.angle - collider.eangle);
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
            this.pos.x = Math.min(Math.max(0, this.pos.x), world.mapSize.x * 1000 - 1);
            this.pos.y = Math.min(Math.max(0, this.pos.y), world.mapSize.y * 1000 - 1);
            if (pos.x != this.pos.x || pos.y != this.pos.y) {
                collide = true;
            }
            if (!collide || counter == 32) { break; };
        }
    }

    updateChunk(chunk: Vector) {
        let list = this.getPlayersInRange(2, 2).filter(e => Math.abs(e.chunk.x - chunk.x) > 2 || Math.abs(e.chunk.y - chunk.y) > 2);
        this.sendInfos(false, list);
        world.echunks[this.chunk.x][this.chunk.y][this.ownerId] = world.echunks[this.chunk.x][this.chunk.y][this.ownerId].filter(e => e != this);
        this.chunk = chunk;
        world.echunks[this.chunk.x][this.chunk.y][this.ownerId].push(this);
    }
}