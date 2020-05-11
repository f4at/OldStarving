import { Vector, Utils } from ".";
import Player from './Player';
import world, { MapEntityDrop, MapEntity } from "./World";
import Item, { Items, Pickaxe, EntityItem } from "./Item";
import config from "../config";

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
    dmgradius: number;
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
        this.dmgradius = (this.special && this.special.dmgradius !== undefined) ? this.special.dmgradius : radius;
    }
}

export class EntityTypes {
    static FIRE = Items.FIRE.entityType = new EntityType(1, 0, 40, 1, 500, EntityItemType.FIRE, { physical: false, Lifespan: 2, dmg: 40, dmgDelay: 2500, dmgRange: 30 });
    static WORKBENCH = Items.WORKBENCH.entityType = new EntityType(2, 4, 50, 1.25, 500, EntityItemType.WORKBENCH, { physical: true });
    static SEED = Items.SEED.entityType = new EntityType(3, 0, 40, 1, 500, EntityItemType.HARVESTABLE, { fscore: 3, physical: false, inv: { item: Items.PLANT, amount: 0, maximum: 3, delay: 30, respawn: 1 }, Lifespan: 60 });
    static WOOD_WALL = Items.WOOD_WALL.entityType = new EntityType(4, 0, 50, 1, 1000, EntityItemType.WALL, { physical: true });
    static WOOD_SPIKE = Items.WOOD_SPIKE.entityType = new EntityType(5, 0, 50, 1, 150, EntityItemType.SPIKE, { physical: true, hitdmg: 2, dmg: 5, dmgDelay: 1000, dmgRange: 95 });
    static BIG_FIRE = Items.BIG_FIRE.entityType = new EntityType(6, 0, 35, 1, 700, EntityItemType.FIRE, { physical: false, Lifespan: 5, dmg: 50, dmgDelay: 2500, dmgRange: 35 });
    static STONE_WALL = Items.STONE_WALL.entityType = new EntityType(7, 7, 50, 1, 1500, EntityItemType.WALL, { physical: true, tier: 1 });
    static GOLD_WALL = Items.GOLD_WALL.entityType = new EntityType(8, 7, 50, 1, 2000, EntityItemType.WALL, { physical: true, tier: 2 });
    static DIAMOND_WALL = Items.DIAMOND_WALL.entityType = new EntityType(9, 7, 50, 1, 2500, EntityItemType.WALL, { physical: true, tier: 3 });
    static WOOD_DOOR = Items.WOOD_DOOR.entityType = new EntityType(10, 0, 50, 1, 3500, EntityItemType.DOOR, { physical: true });
    static CHEST = Items.CHEST.entityType = new EntityType(11, 4, 25, 1.3, 300, EntityItemType.CHEST, { physical: true, inv: { item: null, amount: 0 } });
    static STONE_SPIKE = Items.STONE_SPIKE.entityType = new EntityType(12, 7, 50, 1, 300, EntityItemType.SPIKE, { physical: true, tier: 1, hitdmg: 5, dmg: 20, dmgDelay: 1000, dmgRange: 95 });
    static GOLD_SPIKE = Items.GOLD_SPIKE.entityType = new EntityType(13, 7, 50, 1, 600, EntityItemType.SPIKE, { physical: true, tier: 2, hitdmg: 10, dmg: 30, dmgDelay: 1000, dmgRange: 95 });
    static DIAMOND_SPIKE = Items.DIAMOND_SPIKE.entityType = new EntityType(14, 7, 50, 1, 900, EntityItemType.SPIKE, { physical: true, tier: 3, hitdmg: 15, dmg: 40, dmgDelay: 1000, dmgRange: 95 });
    static STONE_DOOR = Items.STONE_DOOR.entityType = new EntityType(15, 7, 50, 1, 1500, EntityItemType.DOOR, { physical: true, tier: 1 });
    static GOLD_DOOR = Items.GOLD_DOOR.entityType = new EntityType(16, 7, 50, 1, 2000, EntityItemType.DOOR, { physical: true, tier: 2 });
    static DIAMOND_DOOR = Items.DIAMOND_DOOR.entityType = new EntityType(17, 7, 50, 1, 2500, EntityItemType.DOOR, { physical: true, tier: 3 });
    static FURNACE = Items.FURNACE.entityType = new EntityType(18, 0, 60, 1, 700, EntityItemType.FIRE, { physical: true, dmg: 25, dmgDelay: 6000, dmgRange: 30, inv: { item: Items.WOOD, amount: 0 } });
    static AMETHYST_WALL = Items.AMETHYST_WALL.entityType = new EntityType(19, 7, 50, 1, 3500, EntityItemType.WALL, { physical: true, tier: 4 });
    static AMETHYST_SPIKE = Items.AMETHYST_SPIKE.entityType = new EntityType(20, 7, 50, 1, 1200, EntityItemType.SPIKE, { physical: true, tier: 4, hitdmg: 25, dmg: 50, dmgDelay: 1000, dmgRange: 95 });
    static AMETHYST_DOOR = Items.AMETHYST_DOOR.entityType = new EntityType(21, 7, 50, 1, 3500, EntityItemType.DOOR, { physical: true, tier: 4 });

    static RABBIT = new EntityType(60, 0, 23, 1, 60, EntityItemType.MOB, { dmgradius: 23, regen: 15, drops: [{ item: Items.FUR, amount: 1 }, { item: Items.MEAT, amount: 2 }], kscore: 60, physical: false, speed: 260, dmg: 0, genes: [0.05, 0, 300, 400, -200, 200, 3, 0.1, 0.2, 1, 0, 0.9, 0.99, 8, 2, 30, 0.1, 0.2, 0.01, 0.5, 300, 0.4, 1.5] });
    static WOLF = new EntityType(61, 0, 35, 1, 300, EntityItemType.MOB, { dmgradius: 50, regen: 40, drops: [{ item: Items.FUR_WOLF, amount: 1 }, { item: Items.MEAT, amount: 2 }], kscore: 60, physical: false, offensive: true, dmg: 40, dmgRange: 27, speed: 155, genes: [0.05, 5, 200, 300, -200, 200, 3, 0.1, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 20, 0.1, 0.05, 0.01, 0.5, 300, 0.2, 2] });
    static SPIDER = new EntityType(62, 0, 40, 1, 150, EntityItemType.MOB, { dmgradius: 65, rgen: 40, drops: [{ item: Items.CORD, amount: 2 }], kscore: 100, physical: false, offensive: true, dmg: 30, speed: 150, dmgRange: 46, genes: [0.05, 10, 200, 300, -200, 200, 3, 0.1, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 5, 0.1, 0.05, 0.01, 0.5, 300, 0.2, 2] });
    static FOX = new EntityType(63, 0, 35, 1, 300, EntityItemType.MOB, { dmgradius: 50, regen: 40, drops: [{ item: Items.FUR_WINTER, amount: 1 }, { item: Items.MEAT, amount: 2 }], kscore: 90, physical: false, offensive: true, dmg: 40, speed: 140, dmgRange: 30, genes: [0.05, 6, 200, 300, -200, 200, 3, 0.1, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 20, 0.1, 0.05, 0.01, 0.5, 300, 0.2, 2] });
    static BEAR = new EntityType(64, 0, 35, 1, 900, EntityItemType.MOB, { dmgradius: 50, regen: 40, drops: [{ item: Items.FUR_WINTER, amount: 2 }, { item: Items.MEAT, amount: 3 }], kscore: 120, physical: false, offensive: true, dmg: 70, speed: 135, dmgRange: 34, genes: [0.05, 5, 150, 300, -200, 200, 3, 0.1, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 15, 0.1, 0.06, 0.01, 0.5, 300, 0.2, 2] });
    static DRAGON = new EntityType(65, 0, 45, 1, 1500, EntityItemType.MOB, { dmgradius: 80, regen: 50, drops: [{ item: Items.MEAT, amount: 5 }], kscore: 1000, physical: false, offensive: true, dmg: 70, speed: 155, dmgRange: 75, genes: [0.05, 5, 200, 350, -200, 200, 3, 0.1, 0.2, 1, 0.5, 0.9, 0.99, 8, 2, 5, 0.1, 0.1, 0.01, 0.5, 300, 0.2, 2] });

    static FRUIT = new EntityType(100, 0, 50, 1, 0, EntityItemType.HARVESTABLE, { fscore: 3, physical: false, inv: { item: Items.PLANT, amount: 3, maximum: 5, delay: 10, respawn: 1 } });

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
    dmgradius: number;
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
    lifeUpdate: number = 10000;
    lifeLoop: any;

    fscore: number = 0;
    kscore: number = 0;

    memory: any = [];
    genes: any;
    drops: any;

    isalive: boolean = true;

    constructor(pos: Vector = null, angle: number, owner: Player, entityItem: EntityType, forceSpawn: boolean = false) {
        if (entityItem !== null) {
            this.type = entityItem.type;
            this.entityType = entityItem;
            this.item = Items.get(entityItem.id);
            this.owner = owner;
            this.ownerId = this.owner === null ? 0 : this.owner.pid;
            for (let i = 1; i < this.ownerId ? config.maxEntities : 256 ** 2; i++) {
                if (!world.entities[this.ownerId].find(e => e.id == i)) {
                    this.id = i;
                    break;
                }
            }

            if (!this.id) {
                this.error = "The limit of possible placed entities of this type exceeded";
                return;
            }

            this.numberOfSides = entityItem.numberOfSides;
            this.radius = entityItem.radius;
            this.dmgradius = entityItem.dmgradius;
            this.XtoYfac = entityItem.XtoYfactor;

            if (pos === null) {
                let co = 0;
                while (true) {
                    co += 1;
                    switch (entityItem) {
                        case EntityTypes.WOLF:
                        case EntityTypes.SPIDER:
                        case EntityTypes.RABBIT:
                            this.pos = { x: Math.random() * 10400, y: Math.random() * 9999 };
                            break;
                        case EntityTypes.FOX:
                        case EntityTypes.BEAR:
                            this.pos = { x: 10400 + Math.random() * 19599, y: Math.random() * 9999 };
                            break;
                        case EntityTypes.DRAGON:
                            this.pos = { x: 28500 + Math.random() * 1499, y: 4500 + Math.random() * 1200 };
                            break;
                    }
                    this.chunk = this.getChunk();
                    if (!this.getEntitiesInRange(1, 1, true, true).filter(e => e.physical || e.type === EntityItemType.PLAYER).concat(this.getMapEntitiesInRange(3, 3)).find(e => Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < this.radius + e.radius)) {
                        break;
                    } else if (co == 32) {
                        this.error = "Can't place entity in top of other Entities";
                        return;
                    }
                }
            } else {
                this.pos = pos;
                this.chunk = this.getChunk();
                if (!forceSpawn) {
                    if (this.getEntitiesInRange(1, 1, false, true).concat(this.getPlayersInRange(1, 1).filter(e => !e.spectator)).concat(this.getMapEntitiesInRange(3, 3)).find(e => Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < this.radius + e.radius)) {
                        this.error = "Can't place entity in top of other Entities";
                        return;
                    }
                }
            }

            this.angle = angle;
            this.maxHealth = entityItem.hp;
            this.health = this.maxHealth;

            let special = entityItem.special;
            this.physical = special.physical === undefined ? true : special.physical;
            this.offensive = special.offensive !== undefined ? special.offensive : false;
            this.dmg = special.dmg !== undefined ? special.dmg : 0;
            this.dmgRange = special.dmgRange !== undefined ? special.dmgRange : 0;
            this.eangle = special.eangle !== undefined ? special.eangle : 0;
            this.tier = special.tier !== undefined ? special.tier : 0;
            this.speed = special.speed !== undefined ? special.speed : 0;
            this.inv = Object.assign({}, special.inv);
            this.lifespan = special.Lifespan;
            this.hitDamage = special.hitdmg !== undefined ? special.hitdmg : 0;
            this.miningTier = special.ftier !== undefined ? special.ftier : -1;
            this.moveDelay = special.moveDelay !== undefined ? special.moveDelay : 1000 * 4 / 8;
            this.dmgDelay = special.dmgDelay !== undefined ? special.dmgDelay : 1000;
            this.regen = special.regen !== undefined ? special.regen : 0;
            this.fscore = special.fscore !== undefined ? special.fscore : 0;
            this.kscore = special.kscore !== undefined ? special.kscore : 0;
            this.drops = special.drops !== undefined ? special.drops : [];
            this.stime = new Date().getTime();

            this.genes = Object.assign({}, special.genes ? special.genes : null);

            if (this.genes) {
                for (let i = 0; i < this.genes.length; i++) {
                    let fac = Utils.remap(Math.random(), 0, 1, this.genes[11], this.genes[12]);
                    this.genes[i] *= Math.random() > 0.5 ? 1 / fac : fac;
                    this.genes[i] += Utils.remap(Math.random() ** this.genes[13] * this.genes[14], 0, 1, -1, 1);
                }
            }

            world.entities[this.ownerId].push(this);
            world.echunks[this.chunk.x][this.chunk.y][this.ownerId].push(this);

            switch (this.type) {
                case EntityItemType.HARVESTABLE:
                    if (this.entityType === EntityTypes.SEED) {
                        this.info = 16;
                    } else {
                        this.info = this.inv.amount;
                    }
                    break;
            }
            if (!(this instanceof MapEntity)) this.sendInfos();
            this.init();
        }
    }

    init() {
        if (this.isalive) {
            if (this.lifespan) {
                this.updateLoop = this.lifeUpdate * Utils.remap(Math.random(), 0, 1, 0.9, 1.1);
                if (this.type === EntityItemType.MOB) {
                    this.lifeLoop = Utils.setIntervalAsync(async () => {
                        if (new Date().getTime() - this.stime > this.lifespan * 60000) {
                            this.die();
                        } else {
                            this.damage(-this.regen);
                        }
                    }, this.lifeUpdate);
                } else {
                    this.lifeLoop = Utils.setIntervalAsync(async () => {
                        this.damage(this.maxHealth * this.lifeUpdate / (this.lifespan * 60000));
                    }, this.lifeUpdate);
                }
            }
            switch (this.type) {
                case EntityItemType.HARVESTABLE:
                    if (this.inv.respawn > 0) {
                        setTimeout(() => {
                            if (this.isalive) {
                                this.inv.delay = this.inv.delay * Utils.remap(Math.random(), 0, 1, 0.9, 1.1);
                                this.updateLoop = Utils.setIntervalAsync(async () => {
                                    if (this.inv.amount < this.inv.maximum) {
                                        this.inv.amount = this.info === 16 ? this.inv.amount : Math.min(this.inv.maximum, this.inv.amount + this.inv.respawn);
                                        this.info = this.inv.amount;
                                        this.sendInfos();
                                    } else {
                                        Utils.clearIntervalAsync(this.updateLoop);
                                        this.updateLoop = null;
                                    }
                                }, this.inv.delay * 1000);
                            }
                        }, this.info === 16 ? 60000 : 0);
                    }
                    break;
                case EntityItemType.MOB:
                    let movement = { vec: { x: 0, y: 0 }, time: 0.5, active: 0 };
                    let loopDuration = (this.moveDelay * world.mobtickRate / 1000);
                    let fac = 6;
                    this.counter = 0;
                    let dmgCounter = 0;
                    this.updateLoop = Utils.setIntervalAsync(async () => {
                        this.counter += 1;
                        if (this.counter === 1) {
                            movement = this.moveAI();
                            fac = movement.active === 1 ? 1 : (movement.active === 0 ? 5 : 15);
                        }
                        if (this.counter <= movement.time * loopDuration * fac) {
                            let opos = { x: this.pos.x, y: this.pos.y };
                            this.pos.x += movement.vec.x / world.mobtickRate;
                            this.pos.y += movement.vec.y / world.mobtickRate;
                            this.collision();
                            opos = { x: this.pos.x - opos.x, y: this.pos.y - opos.y };
                            let chunk = this.getChunk();
                            if (this.chunk.x != chunk.x || chunk.y != this.chunk.y) {
                                this.updateChunk(chunk);
                            }
                            if (Utils.distance(opos) > 1) {
                                let angle = Math.floor(Utils.coordsToAngle(opos) - 64);
                                this.angle = angle < 0 ? angle + 256 : angle;
                            }
                            if (Utils.distance(opos) || this.action) {
                                this.sendInfos();
                                this.action = 0;
                            }
                            if (this.offensive && this.counter === movement.time * loopDuration * fac) {
                                if (fac === 1) {
                                    dmgCounter += 1;
                                    if (dmgCounter % 3 == 2) {
                                        let players = this.getPlayersInRange(1, 1);
                                        for (let player of players.filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < this.dmgRange + e.radius)) {
                                            player.damage(this.dmg, this, true, true, true);
                                        }
                                        if (this.entityType === EntityTypes.SPIDER) {
                                            for (let player of players.filter(e => Math.random() < Utils.remap(Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }), 240, 50, 0, 0.4))) {
                                                if (!player.webed) {
                                                    player.webed = true;
                                                    player.action |= EntityState.Web;
                                                    setTimeout(() => {
                                                        player.webed = false;
                                                    }, 1650)
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    dmgCounter = 0;
                                }
                            }
                        } else if (this.action) {
                            this.sendInfos();
                            this.action = 0;
                        }
                        if (this.counter === loopDuration * fac) {
                            this.counter = 0;
                        }
                    }, 1000 / world.mobtickRate);
                    break;
                case EntityItemType.FIRE:
                    if (this.entityType === EntityTypes.FURNACE) {
                        this.updateLoop = Utils.setIntervalAsync(async () => {
                            if (this.inv.amount > 0) {
                                this.inv.amount -= 1;
                                this.info = this.inv.amount;
                                if (this.inv.amount === 0) {
                                    this.action = EntityState.None;
                                }
                                this.sendInfos();
                            }
                        }, this.dmgDelay);
                    }
                    break;
                default:
                    this.updateLoop = Utils.setIntervalAsync(async () => {
                        if (this.action) { this.sendInfos(); };
                    }, 200);
                    break;
            }
        }
    }

    damage(dmg: number, attacker: Player = null) { // use negative values to increase hp
        if (this.type === EntityItemType.HARVESTABLE) {
            if (attacker) {
                if (this.inv.maximum) {
                    if (this instanceof MapEntity) {
                        let time = new Date().getTime();
                        let delay = (time - this.lastupdate);
                        this.inv.amount = Math.min(this.inv.maximum, this.inv.amount + Math.floor(delay / this.inv.delay));
                        this.lastupdate = time - (this.inv.amount == this.inv.maximum ? 0 : delay % this.inv.delay);
                    }
                    if (this.inv.amount) {
                        let amount = 0;
                        if (this.miningTier < 0) {
                            amount = Math.min(1, this.inv.amount);
                        } else if (attacker.tool instanceof Pickaxe) {
                            if (attacker.tool.miningTier - this.miningTier + 1 <= 0) {
                                attacker.dont_harvest();
                            } else {
                                amount = Math.min(this.inv.amount, attacker.tool.miningTier - this.miningTier + 1);
                            }
                        } else {
                            attacker.dont_harvest();
                        }
                        if (amount > 0) {
                            if (attacker.gather(this.inv.item, amount).length) {
                                attacker.score += amount * this.fscore;
                                this.inv.amount -= amount;
                                if (!(this instanceof MapEntity)) {
                                    this.info = this.inv.amount;
                                    this.sendInfos();
                                    if (!this.updateLoop && this.inv.respawn > 0 && this.info != 16) {
                                        let c = false;
                                        this.updateLoop = Utils.setIntervalAsync(async () => {
                                            if (c) {
                                                if (this.inv.amount != this.inv.maximum) {
                                                    this.inv.amount = Math.min(this.inv.maximum, this.inv.amount + this.inv.respawn);
                                                    this.info = this.inv.amount;
                                                    this.sendInfos();
                                                } else {
                                                    Utils.clearIntervalAsync(this.updateLoop);
                                                    this.updateLoop = null;
                                                }
                                            } else {
                                                c = true;
                                            }
                                        }, this.inv.delay * 1000);
                                    }
                                }
                            }
                        }
                    } else if (this instanceof MapEntity) {
                        let angle = Math.round(Utils.coordsToAngle({ x: this.pos.x - attacker.pos.x, y: this.pos.y - attacker.pos.y })) % 256;
                        this.sendToRange(new Uint16Array([9, Math.floor(this.pos.x / 100), Math.floor(this.pos.y / 100), angle, this.mapID]));
                    }
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
                    return this.die(attacker);
                }
            }
            if (attacker) {
                switch (this.type) {
                    case EntityItemType.MOB:
                        this.action |= EntityState.Hurt;
                        let memory = this.memory.find(e => e.player === attacker);
                        if (memory) {
                            memory.dmg += dmg;
                        } else {
                            this.memory.push({ player: attacker, score: 0, dmg: dmg, edmg: 0 });
                        }
                        break;
                    case EntityItemType.SPIKE:
                        if (attacker !== this.owner) attacker.damage(this.hitDamage, null, true, true, true);
                        break;
                }
                let angle;
                switch (this.type) {
                    case EntityItemType.DOOR:
                        if (this.owner === attacker) {
                            if (!this.info || !this.getEntitiesInRange(1, 1).filter(e => e != this && Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < this.radius + e.radius - 1).length) {
                                this.info = this.info ? 0 : 1;
                                this.physical = !this.physical;
                                this.sendInfos();
                                break;
                            }
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
        world.echunks[this.chunk.x][this.chunk.y][this.ownerId].splice(world.echunks[this.chunk.x][this.chunk.y][this.ownerId].indexOf(this), 1);
        world.entities[this.ownerId].splice(world.entities[this.ownerId].indexOf(this), 1);
        Utils.clearIntervalAsync(this.updateLoop);
        Utils.clearIntervalAsync(this.lifeLoop);

        this.sendInfos(false);
        this.isalive = false;
        if (attacker) {
            attacker.score += 10 + this.kscore;
            for (let drop of this.drops) {
                attacker.gather(drop.item, drop.amount);
            }
            if (this.inv) {
                if (this.inv.amount) {
                    attacker.gather(this.inv.item, this.inv.amount);
                }
            }
        }
    }

    async sendInfos(visible = true, to: Player[] = null) {
        let packet = await this.infoPacket(visible);
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

    async infoPacket(visible = true, uint8: boolean = true) {
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

    async sendToRange(packet) {
        for (let player of this.getPlayersInRange(8, 5, true).filter(e => Math.abs(this.chunk.x - e.chunk.x) <= e.viewRange.x && Math.abs(this.chunk.y - e.chunk.y) <= e.viewRange.y)) player.send(packet);
    }

    getPlayersInRange(x: number, y: number, force: boolean = false): Player[] {
        if (world.mode === world.modes.hunger && this.type !== EntityItemType.PLAYER && !force) {
            return (this.getEntitiesInRange(x, y, true, false) as Player[]).filter(e => !e.spectator);
        }
        return this.getEntitiesInRange(x, y, true, false) as Player[];
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
            let ymin = Math.max(-y + Math.floor(this.pos.y / 100), 0), ymax = Math.min(y + 1 + Math.floor(this.pos.y / 100), world.map.height / 100),
                xmin = Math.max(-x + Math.floor(this.pos.x / 100), 0), xmax = Math.min(x + 1 + Math.floor(this.pos.x / 100), world.map.width / 100);
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

    moveAI() {
        let v = this.genes;
        let scores = [];
        let vectors = [];
        let distances = [];
        let players = this.getPlayersInRange(3, 3);
        let rplayers = players.filter(e => Utils.distance({ x: this.pos.x - e.pos.x, y: this.pos.y - e.pos.y }) < 400);
        let active = 0;
        let adistance = 0;
        for (let player of rplayers) {
            let memory = this.memory.find(e => e.player === player);
            if (!memory) {
                memory = { player: player, score: 0, dmg: 0, edmg: 0 };
                this.memory.push(memory);
            };
            if (memory.dmg > 10 || player.clothes != Items.EXPLORER_HAT) {
                let s = Utils.remap(v[1] * this.health - player.health - v[9] * memory.dmg / this.maxHealth + v[10] * memory.edmg / 200, v[4], v[5], -1, 1, true);
                let distance = Utils.distance({ x: this.pos.x - player.pos.x, y: this.pos.y - player.pos.y });
                memory.score = (memory.score + s * (1 - Utils.remap(distance, 0, Utils.remap(s, -1, 1, v[2], v[3]), 0, 1, true))) / 2;
                memory.score = memory.score < 0 ? memory.score : memory.score * v[7];
                adistance += distance * (memory.score < 0 ? memory.score : memory.score * v[19]);
                distances.push(distance);
                scores.push(memory.score);
                vectors.push({ x: this.pos.x - player.pos.x + Utils.remap(Math.random(), 0, 1, -v[15], v[15]), y: this.pos.y - player.pos.y + Utils.remap(Math.random(), 0, 1, -v[15], v[15]) });
                memory.dmg *= 0.7;
                memory.edmg *= 0.7;
            } else {
                scores.push(memory.score / 2);
                memory.dmg *= 0.5;
                memory.edmg *= 0.5;
            }
        }
        adistance /= scores.reduce((pv, cv) => pv + cv, 0);
        this.memory = this.memory.filter(e => rplayers.includes(e.player));
        let fvector = { x: 0, y: 0 };
        let time = 0;

        if (rplayers.length && Math.max(...scores.map(e => Math.abs(e))) && Math.max(...distances.map(e => Math.abs(e))) > v[18]) {
            active = 1;
            if (Math.random() > v[17] + Utils.remap(adistance, 0, v[20], v[21], 0, true) ** v[22]) {
                let min = Math.min(...scores);
                scores = scores.map(e => -1 * (e - min * v[7]) ** v[6]);
                let tdistance = 0;
                for (let i = 0; i < scores.length; i++) {
                    let distance = Utils.distance(vectors[i]);
                    tdistance += Math.abs(scores[i]) * (scores[i] > 0 ? 1 : Math.min(distance / this.speed, 1) ** v[16]);
                    if (distance != 0) {
                        fvector.x += vectors[i].x / distance * scores[i];
                        fvector.y += vectors[i].y / distance * scores[i];
                    }
                }
                let fvecDistance = Utils.distance(fvector);
                let fac = tdistance / scores.reduce((pv, cv) => pv + Math.abs(cv), 0);
                if (fvecDistance === 0) {
                    fvector.x = 0;
                    fvector.y = 0;
                } else {
                    fvector.x *= this.speed / fvecDistance * fac;
                    fvector.y *= this.speed / fvecDistance * fac;
                }
                time = 1;
            } else {
                fvector = Utils.angleToCoords(Math.random() * 256);
                fvector.x *= this.speed;
                fvector.y *= this.speed;
                time = 1;
            }
        } else {
            fvector = Utils.angleToCoords(Math.random() * 256);
            fvector.x *= this.speed;
            fvector.y *= this.speed;
            if (players.length === 0) {
                players = this.getPlayersInRange(8, 5).filter(e => Math.abs(this.chunk.x - e.chunk.x) <= e.viewRange.x && Math.abs(this.chunk.y - e.chunk.y) <= e.viewRange.y);
                if (players.length) {
                    time = 1 / 5;
                } else {
                    active = -1;
                    time = 1 / 60;
                }

            } else {
                if (rplayers.length) {
                    fvector.x *= 0.8;
                    fvector.y *= 0.8;
                    time = 3 / 5;
                } else {
                    time = 2 / 5;
                }

            }
        }

        return { vec: fvector, time: time, active: active };
    }

    collision() {
        let colliders: Collider[] = (this.getMapEntitiesInRange(3, 3) as Collider[]).concat(this.getEntitiesInRange(1, 1, false, true)).filter(e => e.physical && e != this);
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
            switch (this.entityType) {
                case EntityTypes.WOLF:
                case EntityTypes.RABBIT:
                case EntityTypes.SPIDER:
                    this.pos.x = Math.min(Math.max(0, this.pos.x), 10500);
                    this.pos.y = Math.min(Math.max(0, this.pos.y), world.map.height - 1);
                    break;
                case EntityTypes.FOX:
                case EntityTypes.BEAR:
                    this.pos.x = Math.min(Math.max(10300, this.pos.x), world.map.width - 1);
                    this.pos.y = Math.min(Math.max(0, this.pos.y), world.map.height - 1);
                    break;
                case EntityTypes.DRAGON:
                    this.pos.x = Math.min(Math.max(28500, this.pos.x), world.map.width - 1);
                    this.pos.y = Math.min(Math.max(4300, this.pos.y), 5900);
                    break;
                default:
                    this.pos.x = Math.min(Math.max(0, this.pos.x), world.map.width - 1);
                    this.pos.y = Math.min(Math.max(0, this.pos.y), world.map.height - 1);
                    break;
            }

            if (pos.x != this.pos.x || pos.y != this.pos.y) {
                collide = true;
            }
            if (!collide || counter == 32) break;
        }

    }

    updateChunk(chunk: Vector) {
        this.sendInfos(false, this.getPlayersInRange(8, 5).filter(e => Math.abs(e.chunk.x - chunk.x) === e.viewRange.x + 1 || Math.abs(e.chunk.y - chunk.y) === e.viewRange.y + 1));
        world.echunks[this.chunk.x][this.chunk.y][this.ownerId].splice(world.echunks[this.chunk.x][this.chunk.y][this.ownerId].indexOf(this), 1);
        this.chunk = chunk;
        world.echunks[this.chunk.x][this.chunk.y][this.ownerId].push(this);
    }

    getChunk() {
        return { "x": Math.floor(this.pos.x / world.chunkSize.x), "y": Math.floor(this.pos.y / world.chunkSize.y) };
    }
}