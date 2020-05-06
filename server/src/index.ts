import WebSocket from "ws";
import * as https from "https";
import * as http from "http";
import world from "./World";
import Player from "./Player";
import { Items, EntityItem } from "./Item";
import express from 'express';
import Entity, { EntityState, EntityTypes, EntityType } from "./Entity";
import fetch from 'node-fetch';
import config from "../config";
import { AddressInfo } from "net";
import * as fs from "fs";
import { Commands, ConsoleSender } from './Command';
import * as readline from 'readline';

export interface Vector {
    x: number;
    y: number;
}

export abstract class Utils {
    static ids: Array<String> = [];

    static broadcastPacket(packet) {
        Utils.sendToPlayers(world.players, packet);
    }

    static sendToPlayers(list: Player[], packet) {
        for (let player of list) {
            player.send(packet);
        }
    }

    static toHex(data: number) {
        data = Math.round(data);
        return [data % 256, Math.floor(data / 256)];
    }

    static toRadians(angle: number) {
        return (angle / 128 * Math.PI) % (Math.PI * 2);
    }

    static toBinary(angle: number) {
        return (angle * 128 / Math.PI) % 256;
    }

    static angleToCoords(angle: number) {
        angle = Utils.toRadians(angle);
        return { "x": Math.cos(angle), "y": Math.sin(angle) };
    }

    static coordsToAngle(coords: any) {
        if (coords.x || coords.y) {
            return Utils.Mod(Math.atan2(coords.y, coords.x) / Math.PI * 128, 256);
        } else {
            return 0;
        }
    }

    static distance(vector: Vector) {
        return (vector.x ** 2 + vector.y ** 2) ** 0.5;
    }

    static remap(oldValue, oldMin, oldMax, newMin, newMax, scale = false) {
        let newValue = (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
        return scale ? Math.max(newMin, Math.min(newMax, newValue)) : newValue;
    }

    static randomString(length: number) {
        let dict = '0123456789abcedfghejklmnopqrstuvwyzABCDEFGHEJKLMNEPQRSTUVWYZ';
        let id;
        while (true) {
            id = '';
            for (let i = 0; i < 16; i++) {
                id += dict.charAt(Math.floor(Math.random() * dict.length));
            }
            if (!this.ids.find(e => e == id)) {
                this.ids.push(id);
                break;
            }
        }
        return id;
    }

    static setIntervalAsync(fn, ms, cancellation = { cancel: false }) {
        if (!cancellation.cancel) {
            fn().then(() => {
                setTimeout(() => Utils.setIntervalAsync(fn, ms, cancellation), ms);
            });
        }
        return cancellation;
    };

    static clearIntervalAsync(interval) {
        if (interval && interval.cancel === false) {
            interval.cancel = true;
        }
    }

    static Mod(x, y) {
        let r = x % y;
        return r < 0 ? r + y : r;
    }
}

world.map.loadFromFile("./map.json");

const app = express();

let [hostname, port] = config.address.split(":");

const server = (config.ssl ? https.createServer({
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
}, app) : http.createServer(app)).listen(Number.parseInt(port), hostname, () => {
    let address = server.address() as AddressInfo;
    console.log(`Listening on ${address.address}:${address.port}`);
});

const wss = new WebSocket.Server({ server });

Utils.setIntervalAsync(async () => {
    const leaderboard = world.players.sort(function (a, b) { return b.compressedScore - a.compressedScore; }).slice(0, 10);
    const list = leaderboard.flatMap(player => [player.pid, player.compressedScore]);
    for (let player of world.players) {
        player.send(new Uint16Array([6, player.compressedScore].concat(list)));
    }
    if (world.mode === world.modes.hunger && new Date().getTime() - world.stime > world.hungerClose) {
        for (let player of world.players) {
            let rplayers = [27];
            for (let playa of world.players.filter(e => e !== player && !e.spectator)) {
                rplayers = rplayers.concat([playa.pos.x * 256 / world.map.width, playa.pos.y * 256 / world.map.height]);
            }
            player.send(new Uint8Array(rplayers));
        }
    }
}, 2177);

Utils.setIntervalAsync(async () => {
    let entities = [{ e: EntityTypes.WOLF, m: 25, p: 0.2 }, { e: EntityTypes.RABBIT, m: 10, p: 0.2 }, { e: EntityTypes.SPIDER, m: 20, p: 0.2 }, { e: EntityTypes.FOX, m: 40, p: 0.2 }, { e: EntityTypes.BEAR, m: 25, p: 0.2 }, { e: EntityTypes.DRAGON, m: 4, p: 0.04 }];
    for (let entity of entities) {
        (function (entity: any) {
            let r = world.entities[0].filter(e => e.entityType == entity.e).length;
            let c = Math.ceil(Math.min(4, (entity.m + entity.p * world.players.length - r) / 2));
            for (let i = 0; i < c; i++) {
                setTimeout(() => {
                    new Entity(null, 0, null, entity.e, false);
                }, Math.random() * 15000);
            }
        })(entity);
    }
}, 15570);


console.log('version Number', 1);

wss.on("connection", (ws, req) => {
    let player: Player;
    ws.binaryType = "arraybuffer";
    ws.on("message", async (message) => {
        try {
            if (message instanceof ArrayBuffer) {
                //nothing
            } else {
                let data = JSON.parse(message.toString());
                if (!player) {
                    if (typeof data[0] === "string") {

                        const response = await fetch(config.api + "/api/verify", {
                            method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountId: data[2], server: 0 })
                        });
                        if (response.status !== 200) {
                            ws.send(JSON.stringify([1, "Authentication failed"]));
                            return;
                        }
                        player = world.players.find(e => e.accountId == data[2]);

                        let rejoin = player !== undefined;
                        if (!rejoin) {
                            while (data[0].indexOf('  ') != -1) {
                                data[0] = data[0].replace('  ', ' ');
                            }
                            while (data[0]) {
                                if (data[0][0] === ' ') {
                                    data[0] = data[0].slice(1);
                                } else if (data[0][data[0].length - 1] === ' ') {
                                    data[0] = data[0].slice(0, data[0].length - 1);
                                } else {
                                    break;
                                }
                            }
                            player = new Player(world.mode === world.modes.hunger && new Date().getTime() - world.stime > world.hungerClose ? "spectator" : (data[0] == "spectator" ? "notSpectator" : data[0]), data[2], ws);
                        } else {
                            player.join(ws);
                        }
                        console.log(`Player ${player.nick} (${player.pid}) ${rejoin ? "rejoined" : "joined"} server from ${req.connection.remoteAddress}`);
                    }
                } else {
                    switch (data[0]) {
                        case 0:
                            player.chat(data[1]);
                            break;
                        case 1:
                            Commands.process(player, data[1]);
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
                            player.inventory.remove(Items.get(data[1]));
                            break;
                        case 7:
                            player.craft(Items.get(data[1]));
                            break;
                        case 8:
                            if (!this.craftTimeout) {
                                let item = Items.get(data[1]);
                                let stack = player.inventory.findStack(item, 1);
                                if (stack) {
                                    let entity = world.entities[data[3]].find(e => e.id === data[4]);
                                    if (entity && (entity.inv.item === item || entity.inv.item === null) && Utils.distance({ x: entity.pos.x - player.pos.x, y: entity.pos.y - player.pos.y }) < 200) {
                                        entity.inv.item = item;
                                        let amount = Math.min(stack.amount, data[2]);
                                        player.decreaseItem(item, amount);
                                        entity.inv.amount += amount;
                                        entity.info = entity.inv.amount;
                                        entity.action = (data[1] + 1) * 2;
                                        entity.sendInfos();
                                    }
                                }
                            }
                            break;
                        case 9:
                            if (!this.craftTimeout) {
                                let entity = world.entities[data[1]].find(e => e.id === data[2]);
                                if (entity && entity.inv.item && Utils.distance({ x: entity.pos.x - player.pos.x, y: entity.pos.y - player.pos.y }) < 200) {
                                    if (player.gather(entity.inv.item, entity.inv.amount)) {
                                        entity.inv.item = null;
                                        entity.inv.amount = 0;
                                        entity.info = 0;
                                        entity.action = 0;
                                        entity.sendInfos();
                                    }
                                }
                            }
                            break;
                        case 10:
                            player.cancelCrafting();
                            break;
                        case 12:
                            if (!this.craftTimeout) {
                                let stack3 = player.inventory.findStack(Items.WOOD, 1);
                                if (stack3) {
                                    let entity = world.entities[data[2]].find(e => e.id === data[3]);
                                    if (entity && Utils.distance({ x: entity.pos.x - player.pos.x, y: entity.pos.y - player.pos.y }) < 250) {
                                        let amount = Math.min(stack3.amount, data[1]);
                                        player.decreaseItem(Items.WOOD, amount);
                                        entity.inv.amount += amount;
                                        entity.info = entity.inv.amount;
                                        entity.action = EntityState.Hurt;
                                        entity.sendInfos();
                                    }
                                }
                            }
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

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    (async function () {
        process.stdout.write("> ");
        for await (const line of rl) {
            Commands.process(ConsoleSender.instance, line);
            process.stdout.write("> ");
        }
        rl.close();
    })();
});