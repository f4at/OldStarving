import Player from "./Player";
import Entity from "./Entity";
import { EntityType, ItemStack, Items, EntityItem } from './Item';
import { Vector, Utils } from ".";
import * as fs from "fs";

export class MapEntityDrop extends ItemStack {
    delay: number = 3600;
    respawn?: number = 1;
    minimum?: number = 0;
    maximum?: number = 0;
}

export class MapEntityType extends EntityItem {
    id: number;
    type = EntityType.HARVESTABLE;
    mType: string;
    physical: boolean;
    sizes: number[];
    eangle: number;
    drop: MapEntityDrop;
    miningTier: number;

    constructor(id: number, type: string, physical: boolean = false, numberOfSides: number = 0, radius: number = 0, XtoYfactor: number = 1, sizes: number[] = [1], angle = 0, drop: MapEntityDrop = new MapEntityDrop(undefined), miningTier: number = -1) {
        super(id, -1, numberOfSides, radius, XtoYfactor, -1, EntityType.HARVESTABLE, null);
        this.mType = type;
        this.physical = physical;
        this.sizes = sizes;
        this.eangle = angle;
        this.drop = drop;
        this.miningTier = miningTier;
    }
}

export class MapEntityTypes {
    static HERB = new MapEntityType(null, "h", false);

    static BUSH = new MapEntityType(0, "p", true, 0, 50, 1, [1], 0, { item: Items.PLANT, amount: 0, maximum: 0, delay: 10, respawn: 0 }, -1);
    static STONES = new MapEntityType(1, "s", true, 7, 57, 1, [1.78, 1.43, 1], 21, { item: Items.STONE, amount: 10, maximum: 20, delay: 4, respawn: 2 }, 1);
    static TREE = new MapEntityType(4, "t", true, 4, 80, 1.1, [1.5, 1.5, 1.25, 1.25, 1, 1], 0, { item: Items.WOOD, amount: 15, maximum: 30, delay: 3, respawn: 2 }, 0);
    static GOLD = new MapEntityType(10, "g", true, 8, 64, 1, [1.35, 1.18, 1], 27, { item: Items.GOLD, amount: 10, maximum: 20, delay: 5, respawn: 1 }, 2);
    static DIAMOND = new MapEntityType(13, "d", true, 3, 65, 1, [1.55, 1.25, 1], 53, { item: Items.DIAMOND, amount: 7, maximum: 15, delay: 6, respawn: 1 }, 3);
    static TREE_BRANCH = new MapEntityType(16, "b", true, 4, 80, 1.1, [1.5, 1.5, 1.25, 1.25], 0, { item: Items.WOOD, amount: 20, maximum: 40, delay: 3, respawn: 1 }, 0);
    static FIR = new MapEntityType(20, "f", true, 7, 80, 1, [1, 1, 1], 0, { item: Items.WOOD, amount: 15, maximum: 30, delay: 3, respawn: 1 }, 0);
    static STONES_WINTER = new MapEntityType(23, "sw", true, 7, 57, 1,[1.78, 1.43, 1], 21, { item: Items.STONE, amount: 10, maximum: 20, delay: 4, respawn: 1 }, 1);
    static GOLD_WINTER = new MapEntityType(26, "gw", true, 8, 64, 1, [1.35, 1.18, 1], 27, { item: Items.GOLD, amount: 10, maximum: 20, delay: 5, respawn: 1 }, 2);
    static DIAMOND_WINTER = new MapEntityType(29, "dw", true, 3, 65, 1, [1.55, 1.25, 1], 53, { item: Items.DIAMOND, amount: 7, maximum: 15, delay: 6, respawn: 1 }, 3);
    static AMETHYST = new MapEntityType(32, "a", true, 0, 30, 1, [1, 1, 1], 0, { item: Items.AMETHYST, amount: 5, maximum: 10, delay: 7, respawn: 1 }, 4);

    static DRAGON_GROUND = new MapEntityType(null, "dg", false, 4, 72, 1, [1,], 0);
    static SNOW = new MapEntityType(null, "so", false, 4, 72, 1, [1,], 0);
    static HERB_WINTER = new MapEntityType(null, "hw", false);

    static TYPES: Map<string, MapEntityType> = new Map();

    static get(key: string): MapEntityType {
        return Array.from(this.TYPES.values()).filter(e => e instanceof MapEntityType).find(item => item.mType === key);
    }
}

for (let name in MapEntityTypes) {
    MapEntityTypes.TYPES.set(name, MapEntityTypes[name]);
}

export class MapEntity extends Entity {
    constructor(type: MapEntityType, position: Vector, size: number = 0, id: number = null) {
        super(position, 0, null, null);
        this.type = type.type;
        this.entityType = type;
        this.id = id;
        this.mapID = type.id + size;
        this.eangle = type.eangle;

        this.inv = Object.assign({}, type.drop);
        this.inv.maximum = Math.ceil(this.inv.maximum * type.sizes[size] ** 2/5)*5;
        this.inv.amount = Math.ceil(this.inv.amount * type.sizes[size] ** 2/5)*5;
        this.pos = position;
        this.angle = 0;
        this.chunk = { "x": Math.floor(this.pos.x / 1000), "y": Math.floor(this.pos.y / 1000) };

        this.numberOfSides = type.numberOfSides;
        this.radius = type.radius * type.sizes[size];
        this.XtoYfac = type.XtoYfactor;
        this.stime = new Date().getTime();
        this.miningTier = type.miningTier;
        this.physical = type.physical;

        this.type = EntityType.HARVESTABLE;
        this.init();
    }
}

export class GameMap {
    raw: string;
    height: number;
    width: number;
    chunks: MapEntity[][][] = [];

    loadFromFile(file: fs.PathLike) {
        const map = JSON.parse(fs.readFileSync(file).toString());
        this.height = map.h;
        this.width = map.w;
        let mapEntitiesCounter = 0;

        this.chunks = new Array(Math.floor(this.height / 100));
        let y = 0;
        for (const column of map.tiles) {
            this.chunks[y] = new Array(Math.floor(this.width / 100));
            let x = 0;
            for (const row of column) {
                this.chunks[y][x] = [];
                for (const typeName in row) {
                    let s = 0;
                    if (typeName==='p' && row.p.length) {
                        mapEntitiesCounter++;
                        let type = MapEntityTypes.get(typeName);
                        let fruit = new Entity( {x: row.p[0].x,y: row.p[0].y},0,null,Items.FRUIT);
                        this.chunks[y][x].push(new MapEntity(type ,  {x: row.p[0].x,y: row.p[0].y}, s, mapEntitiesCounter));
                    } else {
                        for (const mapEntity of row[typeName]) {
                            if (mapEntity.length) {
                                mapEntitiesCounter++;
                                let type = MapEntityTypes.get(typeName);
                                if (type.physical === true) { 
                                    this.chunks[y][x].push(new MapEntity(type ,  {x: mapEntity[0].x, y: mapEntity[0].y}, s, mapEntitiesCounter));
                                }
        
                            }
                            s++;
                        }
                    }
                }
                x++;
            }
            y++;
        }
        console.log(`Loaded map ${this.width}x${this.height} (${mapEntitiesCounter} map entities)`);
        this.raw = JSON.stringify(map);
    }
}

export class World {
    private static _instance;
    static get instance(): World {
        return World._instance || (World._instance = new World());
    }

    players: Array<Player> = new Array();
    entities: Entity[][] = new Array(128);
    mapSize: Vector = { x: 30, y: 10 };
    chunks: Entity[][][] = new Array(this.mapSize.x);
    echunks: Entity[][][][] = new Array(this.mapSize.x);
    tickRate: number = 24;
    stime: number = new Date().getTime();
    mode: number = 0; //id of mode, probably useless for the moment.
    map: GameMap = new GameMap();

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
        let otime = this.isDay;
        setInterval(()=>{
            if (this.isDay != otime) {
                otime = this.isDay;
                Utils.broadcastPacket(new Uint8Array([10,this.isDay ? 0 : 1]));
            }
        },100);
    }

    get time() {
        return (new Date().getTime() - this.stime) % 480000; //day = 8 minutes
    }

    get isDay() {
        return this.time < 240000;
    }

    get leaderboard() {
        return this.players.map(player => ({ id: player.pid, nickname: player.nick, displayName: player.displayName, score: player.score }));
    }
}

export default World.instance;