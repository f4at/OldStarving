import { EntityType, EntityItem, Pickaxe, Items } from "./Item";
import { Vector, Utils } from ".";
import Player from "./Player";
import world, { MapEntityDrop, MapEntity } from "./World";
import Item from './Item';

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
    type: EntityType;
    entityType: EntityItem;
    owner: Player = null;
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
    counter: number;
    inv: MapEntityDrop;
    hitDamage: number;
    score: number; //score given when player destroy it
    regen: number = 0;

    numberOfSides: number;
    radius: number;
    XtoYfac: any;

    offensive: boolean;
    dmg: number=0;
    dmgDelay: number=0;
    dmgRange: number=0;
    sid: number=0;

    updateLoop: any;
    updating: boolean;
    moveDelay: number;

    maxHealth: number;
    health: number;
    stime: number;

    lifespan: number;
    lifeUpdate: number;
    lifeLoop: any;

    constructor(pos: Vector, angle: number, owner: Player, entityItem: EntityItem) {
        if (entityItem !== null) {
            this.type = entityItem.type; //enitity type
            this.entityType = entityItem; //entity id
            this.item = Items.get(entityItem.id); //item id
            this.owner = owner;
            let ownerId = this.owner === null ? 0 : this.owner.pid;
            for (let i = 1; i < 256 ** 2; i++) {
                if (!world.entities[ownerId].find(e => e.id == i)) {
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
            this.physical = special.physical;
            this.offensive = special.offensive ? true : false;
            this.dmg = special.dmg ? special.dmg : 0;
            this.dmgRange = special.dmgRange ? special.dmgRange : 0;
            this.eangle = special.eangle ? special.eangle : 0;
            this.tier = special.tier ? special.tier : 0;
            this.speed = special.speed ? special.speed : 0;
            this.inv = Object.assign({},special.inv);
            this.lifespan = special.Lifespan;
            this.hitDamage = special.hitdmg ? special.hitdmg : 0;
            this.miningTier = special.ftier ? special.ftier : -1;
            this.moveDelay = special.moveDelay ? special.moveDelay : 1000;
            this.dmgDelay = special.dmgDelay ? special.dmgDelay : 1000;
            this.regen = special.regen ? special.regen : 0;
            this.stime = new Date().getTime();
            if (this.getEntitiesInRange(1, 1, false, true).concat(this.getMapEntitiesInRange(5, 5)).find(e => Utils.distance({ x: pos.x - e.pos.x, y: pos.y - e.pos.y }) < this.radius + e.radius)) {
                this.error = "Can't place entity in top of other Entities";
                return;
            }
            world.entities[ownerId].push(this);
            world.echunks[this.chunk.x][this.chunk.y][ownerId].push(this);
            this.sendInfos();
            this.init();
        }
    }

    init() {
        if (this.lifespan) {
            if (this.type == EntityType.MOB) {
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
            case EntityType.HARVESTABLE:
                this.info  = this.inv.amount;
                if (this.inv.respawn > 0) {
                    this.updateLoop = setInterval(() => {
                        this.inv.amount = Math.min(this.inv.maximum, this.inv.amount + this.inv.respawn);
                        this.info = this.inv.amount;
                        this.sendInfos();
                    }, this.inv.delay * 1000);
                }
                break;
            case EntityType.MOB:
                this.updateLoop = setInterval(() => {
                    this.counter += 1;
                    let mov = (this.counter % (this.moveDelay / 200)) < 1;
                    if ((this.counter % (this.dmgDelay / 200)) < 1) {
                        let players = this.getEntitiesInRange(1, 1, true).filter(e => Utils.distance({ x: e.x - this.pos.x, y: e.y - this.pos.y }) < this.dmgRange+e.radius);
                        for (let player of players) {
                            player.damage(this.dmg,null,true,true,true);
                        }
                    }
                    if (this.action || mov) {
                        if (mov) { this.moveAI(); };//ai
                        this.sendInfos();
                    }
                }, 200);
                break;
            case EntityType.FIRE:
                this.updateLoop = setInterval(() => {
                    let players = this.getEntitiesInRange(1, 1, true,false).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < e.radius + this.dmgRange);
                    for (let player of players) {
                        player.damage(this.dmg,null,true,true,true);
                    }
                    if (this.action) { this.sendInfos() };
                }, this.dmgDelay);
                break;
            case EntityType.SPIKE:
                this.updateLoop = setInterval(() => {
                    let players = this.getEntitiesInRange(1, 1, true,false).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < e.radius + this.dmgRange && e !== this.owner);
                    for (let player of players) {
                        player.damage(this.dmg,null,true,true,true);
                    }
                    if (this.action) { this.sendInfos() };
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
        let ownerId = this.owner !== null ? this.owner.pid : 0 ;
        if (this.type == EntityType.HARVESTABLE) {
            if (attacker) {
                if (this.miningTier < 0) {
                    let amount = Math.min(this.inv.amount, 1);
                    let item = this.inv.item;
                    attacker.inventory.add(item, amount);
                    attacker.gather(item, amount);
                    this.inv.amount -= amount;
                    this.info = this.inv.amount;
                    this.sendInfos();
                } else if (attacker.tool instanceof Pickaxe && this.miningTier <= attacker.tool.miningTier) {
                    let amount = Math.min(this.inv.amount, attacker.tool.miningTier - this.miningTier + 1);
                    let item = this.inv.item;
                    attacker.inventory.add(item, amount);
                    attacker.gather(item, amount);
                    this.inv.amount -= amount;
                }
                if (this.entityType instanceof MapEntity) {
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
                this.health = Math.min(this.maxHealth, this.health-dmg*fac);
                if (this.health <= 0) {
                    return this.die(attacker ? attacker : null);
                }
            }
            if (attacker) {
                switch (this.type) {
                    case EntityType.MOB:
                        this.action |= EntityState.Hurt;
                        this.sendInfos();
                        break;
                    case EntityType.SPIKE:
                        if (attacker !== this.owner) {attacker.damage(this.hitDamage, null, true, true, true)};
                        break;
                }
                let angle;
                switch (this.type) {
                    case EntityType.DOOR:
                        if (this.owner === attacker) {
                            this.info = this.info ? 0 : 1;
                            this.physical = !this.physical;
                            this.sendInfos();
                            break;
                        }
                    default:
                        let id = Utils.toHex(this.id);
                        angle = Math.round(Utils.coordsToAngle({ x: this.pos.x - attacker.pos.x, y: this.pos.y - attacker.pos.y }));
                        this.sendToRange(new Uint8Array([22, 0, id[0], id[1], ownerId, angle]));
                        break;
                }
            }

        }

    }

    moveAI() {
    }

    die(attacker: Player = null) {
        this.sendInfos(false);
        let ownerId = this.owner === null ? 0 : this.owner.pid;
        world.echunks[this.chunk.x][this.chunk.y][ownerId] = world.echunks[this.chunk.x][this.chunk.y][ownerId].filter(e=> e !== e);
        world.entities[ownerId] = world.entities[ownerId].filter(e=> e !== e);

        if (this.updateLoop) {
            clearInterval(this.updateLoop);
        }
        if (this.lifeLoop) {
            clearInterval(this.lifeLoop);
        }
        if (attacker) {
            attacker.score += 10 + this.score;
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
        const ownerId = this.owner === null ? 0 : this.owner.pid;
        let arr;
        if (visible) {
            let pos = { "x": Utils.toHex(this.pos.x * 2), "y": Utils.toHex(this.pos.y * 2) };
            let id = Utils.toHex(this.id);
            let info = Utils.toHex(this.info);
            arr = [0, 0, ownerId, this.action, this.entityType.sid, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], id[0], id[1], info[0], info[1]];
        } else {
            let id = Utils.toHex(this.id);
            arr = [0, 0, ownerId, 1, 0, 0, 0, 0, 0, 0, id[0], id[1], 0, 0];
        }
        if (uint8) {
            return new Uint8Array(arr);
        } else {
            return arr;
        }
    }

    sendToRange(packet) {
        let players = this.getEntitiesInRange(2, 2, true, false);
        for (let player of players) { player.send(packet); };
    }

    getEntitiesInRange(x: number, y: number, player: boolean = true, entity: boolean = true) {
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
        try{
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
            return []
        }
    }
}