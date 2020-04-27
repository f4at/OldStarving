import { EntityType, EntityItem, Pickaxe, Items, ItemStack } from "./Item";
import { Vector, Utils } from ".";
//import Player from "./Player";
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
    owner: any = null;
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

    memory: any;
    genes: any;

    constructor(pos: Vector, angle: number, owner: any, entityItem: EntityItem, genes = null) {
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
            this.inv = Object.assign({}, special.inv);
            this.lifespan = special.Lifespan;
            this.hitDamage = special.hitdmg ? special.hitdmg : 0;
            this.miningTier = special.ftier ? special.ftier : -1;
            this.moveDelay = special.moveDelay ? special.moveDelay : 1000;
            this.dmgDelay = special.dmgDelay ? special.dmgDelay : 1000;
            this.regen = special.regen ? special.regen : 0;
            this.stime = new Date().getTime();

            this.genes = genes ? genes : special.genes ? special.defaultGenes : null;

            if (this.genes) {
                for (let i=0;i<this.genes.length;i++) {
                    let fac = Utils.remap(Math.random(),0,1,this.genes[11],this.genes[12]);
                    this.genes[i] *= Math.random() > 0.5 ? 1/fac : fac;
                    this.genes[i] += Utils.remap(Math.random()**this.genes[13]*this.genes[14],0,1,-1,1) ;
                }
            }

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
            if (this.type === EntityType.MOB) {
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
                this.info = this.inv.amount;
                if (this.inv.respawn > 0) {
                    this.updateLoop = setInterval(() => {
                        this.inv.amount = Math.min(this.inv.maximum, this.inv.amount + this.inv.respawn);
                        if (this.entityType === Items.FRUIT) {
                            this.info = this.inv.amount;
                            this.sendInfos();
                        }
                    }, this.inv.delay * 1000);
                }
                break;
            case EntityType.MOB:
                let movement = {vec:{x:0,y:0},time:0.5}
                let loopDuration = (this.moveDelay*world.tickRate/1000);
                this.updateLoop = setInterval(() => {
                    this.counter += 1;
                    let mov = (this.counter % loopDuration);
                    if ((this.counter % (this.dmgDelay / 200)) < 1) {
                        let players = this.getEntitiesInRange(1, 1, true).filter(e => Utils.distance({ x: e.x - this.pos.x, y: e.y - this.pos.y }) < this.dmgRange + e.radius);
                        for (let player of players) {
                            player.damage(this.dmg, null, true, true, true);
                        }
                    }
                    if (mov < 1) { 
                        movement = this.moveAI(); //ai
                    };
                    if (mov < movement.time*loopDuration)  {

                        this.pos.x += movement.vec.x / world.tickRate;
                        this.pos.y += movement.vec.y / world.tickRate;
                        this.collision();
    
                        let chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };
                        if (this.chunk.x != chunk.x || chunk.y != this.chunk.y) {
                            this.updateChunk(chunk);
                        }
                        this.sendInfos();
                        this.action = 0;
                        this.updating = false;
                    }
                }, 1000/world.tickRate);
                break;
            case EntityType.FIRE:
                this.updateLoop = setInterval(() => {
                    let players = this.getEntitiesInRange(1, 1, true, false).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < e.radius + this.dmgRange);
                    for (let player of players) {
                        player.damage(this.dmg, null, true, true, true);
                    }
                    if (this.entityType === Items.FURNACE && this.inv.amount > 0) {
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
            case EntityType.SPIKE:
                this.updateLoop = setInterval(() => {
                    let players = this.getEntitiesInRange(1, 1, true, false).filter(e => Utils.distance({ x: e.pos.x - this.pos.x, y: e.pos.y - this.pos.y }) < e.radius + this.dmgRange && e !== this.owner);
                    for (let player of players) {
                        player.damage(this.dmg, null, true, true, true);
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

    damage(dmg: number, attacker: any = null) { // use negative values to increase hp
        let ownerId = this.owner !== null ? this.owner.pid : 0;
        if (this.type === EntityType.HARVESTABLE) {
            if (attacker) {
                if (this.miningTier < 0) {
                    if (this.inv.item !== null && this.inv.amount > 0) {
                        attacker.score += this.fscore;
                        attacker.gather(this.inv.item, 1);
                        this.inv.amount -= 1;
                        if (this.entityType === Items.FRUIT) {
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
                    case EntityType.MOB:
                        this.action |= EntityState.Hurt;
                        this.sendInfos();
                        break;
                    case EntityType.SPIKE:
                        if (attacker !== this.owner) { attacker.damage(this.hitDamage, null, true, true, true); };
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

    die(attacker: any = null) {
        this.sendInfos(false);
        let ownerId = this.owner === null ? 0 : this.owner.pid;
        world.echunks[this.chunk.x][this.chunk.y][ownerId] = world.echunks[this.chunk.x][this.chunk.y][ownerId].filter(e => e !== e);
        world.entities[ownerId] = world.entities[ownerId].filter(e => e !== e);

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

    sendInfos(visible = true, to: any[] = null) {
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
            //console.log(info);
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

    moveAI() {
        let v = this.genes;
        let scores = [];
        let vectors = [];
        let players = this.getEntitiesInRange(1,1,true,false);
        for (let player of players) {
            let memory = this.memory.find(e=> e.player === player);
            if (!memory) {
                memory = {player:player, score:0, dmg: 0, edmg: 0};
                this.memory.push(memory);
            };
            let s = Utils.remap(v[1]*this.health-player.health-v[9]*memory.dmg/this.maxHealth+v[10]*memory.edmg/200,v[4],v[5],-1,1,true);
            let distance = Utils.distance({x:this.pos.x-player.pos.x,y:this.pos.y-player.pos.y});
            memory.score = (memory.score+s*( 1-Utils.remap(distance,0,Utils.remap(s,-1,1,v[2],v[3]),0,1,true)))/2;
            memory.score = Math.abs(memory.score) > v[0] ? memory.score : 0; 
            scores.push(memory.score);
            let vector = {x:this.pos.y-player.pos.x,y:this.pos.y-player.pos.y};
            let vecDistance = Utils.distance(vector);
            vecDistance = vecDistance == 0 ? 1 : vecDistance;
            vector.x /= vecDistance;
            vector.y /= vecDistance;
            vectors.push(vector);
        }
        this.memory = this.memory.filter(e => players.includes(e.player));
        let min = Math.min(...scores);
        if (Math.max(...scores) > v[0]) {
            scores = scores.map(e=> (e-min*v[7])**v[6]-min*v[8]);
            let fvector = {x:0,y:0};
            for (let i=0;i<scores.length;i++) {
                fvector.x += vectors[i].x*scores[i];
                fvector.y += vectors[i].y*scores[i];
            }
            let fvecDistance = Utils.distance(fvector);
            fvecDistance = fvecDistance == 0 ? 1 : fvecDistance;
            fvector.x /= fvecDistance*this.speed;
            fvector.y /= fvecDistance*this.speed;
            return {vec:fvector,time:1};
        } else {
            let fvector = Utils.angleToCoords(Math.random()*256);
            fvector.x *= this.speed*0.7;
            fvector.y *= this.speed*0.7;
            return {vec:fvector,time:0.8};
        }

    }

    collision() {
        //collision version 1(not real collision just simulation to save time and ressources will make real one later)
        // VERY HARD
        // let entities = this.getEntitiesInRange(1, 1, false, true);
        // let mapEntities = this.getMapEntitiesInRange(3, 3);
        let colliders: Collider[] = (this.getMapEntitiesInRange(3, 3) as Collider[]).concat(this.getEntitiesInRange(1, 1, false, true));
        let dis: number, vec: Vector, angle: number, angle2: number, collide: boolean, counter = 0;
        while (true) {
            collide = false;
            counter += 1;
            for (let collider of colliders.filter(e => e.physical)) {
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
        let list = this.getEntitiesInRange(2, 2, true, false).filter(e => Math.abs(e.chunk.x - chunk.x) > 2 || Math.abs(e.chunk.y - chunk.y) > 2);
        this.sendInfos(false, list);
        world.chunks[this.chunk.x][this.chunk.y] = world.chunks[this.chunk.x][this.chunk.y].filter(e => e != this);
        this.chunk = chunk;
        world.chunks[this.chunk.x][this.chunk.y].push(this);
    }
}