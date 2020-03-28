import Player from "./Player";
import Entity from "./Entity";
import { Vector } from ".";

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