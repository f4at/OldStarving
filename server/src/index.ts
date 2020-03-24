import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";

export class World {
    static instance: World;

    players: Player[] = [];
    mapSize: Vector = { x: 10, y: 10 };
    chunks: Player[][][] = new Array(this.mapSize.x);
    tickRate: number = 64;
    stime: number = new Date().getTime();
    mode: 0; //id of mode, probably useless for the moment.
    constructor() {
        if (World.instance) {
            throw new Error("Multi world is not supported! (yet)")
        }
        World.instance = this;

        for (let i = 0; i < this.mapSize.x; i++) {
            this.chunks[i] = new Array(this.mapSize.y);
            for (let y = 0; y < this.mapSize.y; y++) {
                this.chunks[i][y] = [];
            }
        }
    }
    getTime() {
        return (new Date().getTime() - this.stime) % 480000;
    }
    isDay() {
        return this.getTime() < 240000 ? true : false;
    }
}

const world = new World();

import Player from "./Player";

export abstract class Utils {
    static broadcastPacket(packet) {
        Utils.sendToPlayers(world.players, packet);
    }

    static sendToPlayers(list: Player[], packet) {
        for (let player of list) {
            if (player.online) { player.ws.send(packet); };
        }
    }

    static getLeaderboard() {
        return world.players.map(player => ({ id: player.pid, nickname: player.nick, score: player.score, displayName: player.displayName }));
    }

    static toHex(data: number) {
        return [data % 256, Math.floor(data / 256)];
    }

    static toRadians(angle: number) {
        return angle / 128 * Math.PI;
    }

    static angleToCoords(angle: number) {
        angle = Utils.toRadians(angle);
        return { "x": Math.cos(angle), "y": Math.sin(angle) };
    }

    static distance(vector: Vector) {
        return (vector.x ** 2 + vector.y ** 2) ** 0.5;
    }

    static concatUint8(array1: Uint8Array, array2: Uint8Array) {
        let array = new Uint8Array(array1.length + array2.length);
        array.set(array1);
        array.set(array2, array1.length);
        return array;
    }
}

export interface Vector {
    x: number;
    y: number;
}

const server = https.createServer({
    key: fs.readFileSync("data/ssl/key.pem"),
    cert: fs.readFileSync("data/ssl/cert.pem")
}).listen(8080);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    let player: Player;

    ws.binaryType = "arraybuffer";
    ws.on("message", (message) => {
        try {
            if (message instanceof ArrayBuffer) {
                //nothing
            } else {
                let data = JSON.parse(message.toString());
                if (!player) {
                    player = world.players.find(e => e.token == data[2]);
                    if (!player) {
                        // TODO for zero 
                        console.log("session token = " + data[2]);
                        console.log("session id = " + data[3]);
                        player = new Player(data[0], data[2], ws);
                    }
                    player.online = true;
                    // TODO for zero
                    ws.send(JSON.stringify([3, player.pid, 256, Utils.getLeaderboard(), player.pos.x, player.pos.y, 256, world.isDay() ? 0 : 1, world.mode]));
                    player.sendInfos();

                    // TODO to be removed (maybe moved to moddedstarving + moddedstarving for server?)
                    const colors = ["4", "c", "6", "e", "2", "a", "b", "3", "1", "9", "d", "5", "f", "7", "8", "0"].reverse();
                    let color = 0;
                    setInterval(() => {
                        player.displayName = "";
                        for (var i = 0; i < player.nick.length; i++) {
                            const currentColor = color + i;
                            player.displayName += '\u00a7' + colors[currentColor > colors.length - 1 ? currentColor - colors.length : currentColor] + player.nick.charAt(i);
                        }
                        Utils.broadcastPacket(JSON.stringify([2, player.pid, player.nick, player.displayName]));
                        color++;
                        if (color >= colors.length)
                            color = 0;
                    }, 150);
                } else {
                    switch (data[0]) {
                        case 0:
                            player.chat();
                            break;
                        case 2:
                            player.move(data[1]);
                            break;
                        case 3:
                            player.rotate(data[1]);
                            break;
                        case 4:
                            player.hit(data[1]);
                            break;
                        case 5:
                            player.use(data[1]);
                            break;
                        case 6:
                            player.inventory.remove(data[1], data[2]);
                        case 7:
                            player.craft(data[1]);
                            break;
                        case 8:
                            // TODO put in chest
                            break;
                        case 9:
                            // TODO take from chest
                            break;
                        case 10:
                            player.cancelCrafting(); // lose items
                            break;
                        case 12:
                            // TODO Add wood to furnace
                            break;
                        case 7:
                            player.craft(data[1]);
                            break;
                        case 14:
                            player.stopHitting();
                            break;

                    }
                }
            }
        } catch (e) {
            console.error(e, message);
        }
    });

    ws.on("close", () => {
        if (player) { player.online = false; };
        ws.close();
    });
});

wss.on("listening", () => {
    console.log("Started WebSocket server");
});

// TODO server should post info to master
// server.on("request", (req, res) => {
//     if (req.url == "/info.txt") {
//         res.setHeader("access-control-allow-origin", "*");
//         res.setHeader("content-type", "application/json");
//         res.end(JSON.stringify([{ name: "Test Server", players: { online: 0, max: 0 }, "ip": "localhost" }]));
//     }
// });