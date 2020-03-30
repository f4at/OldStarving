import Player from "./Player";
import Entity from "./Entity";
import {EntityType} from "./Item";
import { Vector } from ".";
import * as fs from "fs";

export class MapEntityType {
    id: number;
    type = EntityType.HARVESTABLE;
    mType: string;
    physical: boolean;
    numberofsides: number;
    raduis: number;
    XtoYfactor: number;
    sizes: number[];
    eangle: number;
    inv: any;
    miningTier: number;
    constructor(id:number, type: string, physical: boolean=false, numberofsides:number=0, radius: number = 0, XtoYfactor: number=1, sizes:number[] = [1] ,angle=0,inv:any = {id:null,amount:0,maximum:0,delay:3600,respawn:1},miningTier:number=-1) {
        this.id = id;
        this.mType = type;
        this.physical = physical;
        this.numberofsides = numberofsides;
        this.raduis = radius;
        this.XtoYfactor = XtoYfactor;
        this.sizes = sizes;
        this.eangle = angle;
        this.inv = inv;
        this.miningTier = miningTier;
    }
}

export class MapEntityTypes {
    static HERB = new MapEntityType(null,"h",false);

    static PLANT = new MapEntityType(0,"p",true,0,50,1,[1],0,{id:4,amount:4,max:4,delay:10,respawn:1},-1);
    static STONES = new MapEntityType(1,"s",true,7,40,1,[1,1.5,1.82],21,{id:2,amount:20,max:20,delay:4,respawn:1},1);
    static TREE = new MapEntityType(4,"t",true,4,80,1.1,[1.5,1.5,1.25,1.25,1,1],0,{id:3,amount:30,max:30,delay:3,respawn:1},0);
    static GOLD = new MapEntityType(10,"g",true,7,40,1,[1,1,1],0,{id:5,amount:20,max:20,delay:5,respawn:1},2);
    static DIAMOND = new MapEntityType(13,"d",true,3,40,1,[1,1,1],0,{id:6,amount:15,max:15,delay:6,respawn:1},3);
    static TREE_BRANCH = new MapEntityType(16,"b",true,4,80,1.1,[1.5,1.5,1.25,1.25],27,{id:3,amount:40,max:40,delay:3,respawn:1},0);
    static FIR = new MapEntityType(20,"f",true,7,80,1,[1,1,1],0,{id:3,amount:30,max:30,delay:3,respawn:1},0);
    static STONES_WINTER = new MapEntityType(23,"sw",true,7,40,1,[1,1.5,1.82],0,{id:2,amount:20,max:20,delay:4,respawn:1},1);
    static GOLD_WINTER = new MapEntityType(26,"gw",true,7,40,1,[1,1,1],0,{id:5,amount:20,max:20,delay:5,respawn:1},2);
    static DIAMOND_WINTER = new MapEntityType(29,"dw",true,3,40,1,[1,1,1],0,{id:6,amount:15,max:15,delay:6,respawn:1},3);
    static AMETHYST = new MapEntityType(32,"a",true,0,30,1,[1,1,1],0,{id:3,amount:10,max:10,delay:7,respawn:1},4);

    static DRAGON_GROUND = new MapEntityType(null,"dg",false,4,72,1,[1,],0);
    static SNOW = new MapEntityType(null,"so",false,4,72,1,[1,],0);
    static HERB_WINTER = new MapEntityType(null,"hw",false);

    static TYPES: Map<string, MapEntityType> = new Map();

    static get(key): MapEntityType {
        return Array.from(this.TYPES.values()).filter(e=> e instanceof MapEntityType).find(item => item.mType === key);
    }
}

for (let name in MapEntityTypes) {
    MapEntityTypes.TYPES.set(name, MapEntityTypes[name]);
}


export class MapEntity {
    type: MapEntityType;
    position: Vector;
    constructor(type: MapEntityType, position:Vector) {
        this.type = type;
        this.position = position;
    }
}

export class GameMap {
    raw: string;
    height: number;
    width: number;
    chunks: any[][][] = [];
    mapEntities: MapEntity[] = [];

    loadFromFile(file: fs.PathLike) {
        const map = JSON.parse(fs.readFileSync(file).toString());
        this.height = map.h;
        this.width = map.w;
        let mapEntitiesCounter = 0;

        this.chunks = new Array(Math.floor(this.height/100));
        let y = 0;
        for (const column of map.tiles) {
            this.chunks[y] = new Array(Math.floor(this.width/100));
            let x = 0;
            for (const row of column) {
                this.chunks[y][x] = [];
                for (const type in row) {
                    let s = 0;
                    for (const mapEntity of row[type]) {
                        if (mapEntity.length) {
                            mapEntitiesCounter++;
                            let mEntity = MapEntityTypes.get(type);
                            if (mEntity.physical === true) {
                                this.chunks[y][x].push(new Entity({x:mapEntity[0].x,y:mapEntity[0].y},0,null,mEntity,s));
                            }
                        }
                        s++;
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
    chunks: Player[][][] = new Array(this.mapSize.x);
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
    }

    get time() {
        return (new Date().getTime() - this.stime) % 480000;
    }

    get isDay() {
        return this.time < 240000;
    }

    get leaderboard() {
        return this.players.map(player => ({ id: player.pid, nickname: player.nick, displayName: player.displayName, score: player.score }));
    }
}

export default World.instance;