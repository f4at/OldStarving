import { EntityType, EntityItem, Pickaxe, Items } from "./Item";
import { Vector, Utils } from ".";
import Player, { EntityState } from "./Player";
import world from "./World";
import Item from './Item';

export default class Entity {
    type: EntityType;
    entityType: EntityItem;
    owner: Player;
    id: number;
    item: Item;
    mapId: number;
    physical: boolean;
    tier: number;
    miningTier: number;
    error: string;
    entityItem: EntityItem;
    info: number = 0;

    pos: Vector;
    angle: number;
    eangle: number;
    action: number = EntityState.None;
    chunk: Vector;
    speed: number;
    counter: number;
    inv: any;
    hitDamage: number;
    score: number; //score given when player destroy it
    regen: number = 0;

    numberOfSides: number;
    radius: number;
    XtoYfac: any;

    offensive: boolean;
    dmg: 0;
    dmgRange: 0;

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
        this.entityItem = entityItem;
        this.type = entityItem.type; //enitity type
        this.entityType = entityItem; //entity id
        this.item = Items.get(entityItem.id); //item id
        this.owner = owner;
        for (let i = 1; i < 256**2; i++) {
            if (![].concat(...world.entities).find(e => e.id == i)) {
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
        this.inv = special.inv;
        this.lifespan = special.Lifespan;
        this.hitDamage = special.hitdmg ? special.hitdmg : 0;
        this.miningTier = special.ftier ? special.ftier : 0;
        this.moveDelay = special.moveDelay ? special.moveDelay : 1;
        this.regen = special.regen ? special.regen : 0;
        this.mapId = special.mapid;
        this.stime = new Date().getTime();

        if (this.getEntitiesInRange(1, 1, false, true).find(e => Utils.distance({ x: pos.x - e.pos.x, y: pos.y - e.pos.y }) < this.radius + e.radius)) {
            this.error = "Can't place entity in top of other Entities";
            return;
        }

        world.entities[this.entityType.sid].push(this);
        world.echunks[this.chunk.x][this.chunk.y][this.entityType.sid].push(this);

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
                this.updateLoop = setInterval(() => {
                    this.inv.amount = Math.min(this.inv.max, this.inv.amount + this.inv.respawn);
                }, this.inv.delay);
                break;
            case EntityType.MOB:
                this.updateLoop = setInterval(() => {
                    this.counter += 1;
                    let mov = (this.counter % (this.moveDelay / 200)) < 1;
                    if ((this.counter % (this.moveDelay / 200)) < 1) { // TODO change this to attackDelay
                        let players = this.getEntitiesInRange(1, 1, true).filter(e => Utils.distance({ x: e.x - this.pos.x, y: e.y - this.pos.y }) < e.radius + this.dmgRange);
                        for (let player of players) {
                            player.damage(this.hitDamage);
                        }
                    }
                    if (this.action || mov) {
                        if (mov) { this.moveAI(); };//ai
                        this.sendInfos();
                    }
                }, 200);
                break;
            case EntityType.SPIKE:
                this.updateLoop = setInterval(() => {
                    this.counter += 1;
                    if ((this.counter % (this.moveDelay / 200)) < 1) { // TODO change this to attackDelay
                        let players = this.getEntitiesInRange(1, 1, true).filter(e => Utils.distance({ x: e.x - this.pos.x, y: e.y - this.pos.y }) < e.radius + this.dmgRange);
                        for (let player of players) {
                            player.damage(this.hitDamage);
                        }
                    }
                    if (this.action) { this.sendInfos(); };
                }, 200);
                break;
            default:
                this.updateLoop = setInterval(() => {
                    if (this.action) { this.sendInfos(); };
                }, 200);
                break;

        }
        this.sendInfos();
    }

    damage(dmg: number, attacker: Player = null) { // use negative values to increase hp
        if (this.maxHealth > 0) {
            let fac = 1;
            if (attacker) {
                let tier = attacker.tool.tier ? attacker.tool.tier : 0;
                fac = (this.tier > tier ? 0.5 ** (this.tier - tier) : 1);
                if (this.hitDamage) { attacker.damage(this.hitDamage); };
            }
            this.health = Math.min(this.maxHealth, this.health - Math.floor(dmg / fac));
            if (this.health <= 0) {
                return this.die(attacker ? attacker : null);
            }
        }
        if (attacker) {
            switch (this.type) {
                case EntityType.HARVESTABLE:
                    if (attacker.tool instanceof Pickaxe) {
                        if (this.miningTier <= attacker.tool.miningTier + 1) {
                            let amount = Math.max(this.inv.add, this.inv.amounts + this);
                            attacker.inventory.add(this.inv.id, amount);
                            this.inv.amount -= amount;
                        }
                    }
                    break;
                case EntityType.MOB:
                    this.action |= EntityState.Hurt;
                    break;
                case EntityType.SPIKE:
                    if (this.hitDamage) { attacker.damage(this.hitDamage); };
                    break;

            }
            let angle;
            switch (this.type) {
                case EntityType.HARVESTABLE:
                    angle = Math.round(Utils.coordsToAngle({ x: this.pos.y - attacker.pos.y, y: this.pos.x - attacker.pos.x }));
                    this.sendToRange(new Uint16Array([9, Math.floor(this.pos.x / 100), Math.floor(this.pos.y), angle, this.mapId]));
                    break;
                case EntityType.DOOR:
                    this.info = this.info ? 0 : 1;
                    this.physical = !this.physical;
                    this.sendInfos();
                default:
                    let id = Utils.toHex(this.id);
                    angle = Math.round(Utils.coordsToAngle({ x: this.pos.y - attacker.pos.y, y: this.pos.x - attacker.pos.x }));
                    this.sendToRange(new Uint8Array([22, 0, id[0], id[1], this.entityType.sid, angle]));
                    break;
            }
        }
    }

    moveAI() {
    }

    die(attacker: Player = null) {
        if (this.updateLoop) {
            clearInterval(this.updateLoop);
        }
        if (this.lifeLoop) {
            clearInterval(this.lifeLoop);
        }
        if (attacker) {
            attacker.score += 10 + this.score;
            if (this.inv) { //give what in inv.
                if (this.inv.amount) {
                    attacker.inventory.add(this.inv.id, this.inv.amount);
                }
            }
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

    infoPacket(visible = true,uint8:boolean = true) {
        const ownerId =  this.owner === null ? 0 : this.owner.pid;
        let arr;
        if (visible) {
            let pos = { "x": Utils.toHex(this.pos.x*2), "y": Utils.toHex(this.pos.y*2) };
            let id = Utils.toHex(this.id);
            let info = Utils.toHex(this.info);
            arr = [0, 0, ownerId, this.action, this.entityType.sid, this.angle, pos.x[0], pos.x[1], pos.y[0], pos.y[1], id[0], id[1], info[0], info[1]];
        } else {
            arr = [0, 0, ownerId, 1, this.entityType.sid, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (uint8) {
            return new Uint8Array(arr);
        } else {
            return arr;
        }
    }

    sendToRange(packet) {
        let players = this.getEntitiesInRange(2,2,true,false);
        for (let player of players) {player.send(packet)};
    }

    getEntitiesInRange(x: number, y: number, player: boolean = true, entity: boolean = true) {
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
}