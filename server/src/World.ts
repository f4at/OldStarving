import Player from "./Player";
import Entity from "./Entity";
import { Vector } from ".";
import * as fs from "fs";

export enum MapEntityType {
    HERB = "h",
    PLANT = "p",
    STONES = "s",
    TREE = "t",
    GOLD = "g",
    DIAMOND = "d",
    TREE_BRANCH = "b",
    FIR = "f",
    STONES_WINTER = "sw",
    GOLD_WINTER = "gw",
    DIAMOND_WINTER = "dw",
    AMETHYST = "a",
    DRAGON_GROUND = "dg",
    SNOW = "so",
    HERB_WINTER = "hw",
}

for (const key in MapEntityType) {
    const value = MapEntityType[key];
    MapEntityType[value] = key;
}

export class MapEntity {
    type: MapEntityType;
    position: Vector;
}

export class Map {
    raw: string;
    height: number;
    width: number;
    chunks: MapEntity[][][] = [];

    loadFromFile(file: fs.PathLike) {
        const map = JSON.parse(fs.readFileSync(file).toString());
        this.height = map.h;
        this.width = map.w;
        let mapEntities = 0;

        let y = 0;
        for (const column of map.tiles) {
            this.chunks[y] = [];

            let x = 0;
            for (const row of column) {
                this.chunks[y][x] = [];
                for (const type in row) {
                    let chunk = this.chunks[y][x] = this.chunks[y][x] || [];
                    for (const mapEntity of row[type]) {
                        mapEntities++;
                        chunk.push({ type: MapEntityType[type], position: mapEntity[0] || { x: x * 100, y: y * 100 } });
                    }
                }
                x++;
            }
            y++;
        }
        console.log(`Loaded map ${this.width}x${this.height} (${mapEntities} map entities)`);
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
    tickRate: number = 32;
    stime: number = new Date().getTime();
    mode: number = 0; //id of mode, probably useless for the moment.
    map: Map = new Map();

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