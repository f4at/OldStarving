import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";
import world from "./World";
import Player, { Inventory } from "./Player";
import { Items, EntityItem } from "./Item";
import * as express from 'express';
import Entity, { EntityState } from "./Entity";
import fetch from 'node-fetch';
import * as config from "../config.json";
import { cpus } from "os";

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
            let angle = Math.atan2(coords.y, coords.x) / Math.PI * 128;
            return angle < 0 ? angle + 256 : angle;
        } else {
            return 0;
        }

    }

    static distance(vector: Vector) {
        return (vector.x ** 2 + vector.y ** 2) ** 0.5;
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
}

world.map.loadFromFile("./map.json");

const app = express();

const server = https.createServer({
    key: fs.readFileSync("data/ssl/key.pem"),
    cert: fs.readFileSync("data/ssl/cert.pem")
}, app).listen(8080, () => {
    console.log("Listening on port 8080");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
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
                        if (!player) {
                            player = new Player(data[0], data[1], data[2], ws);
                            console.log(player.pid, 'new');
                        } else {
                            player.join(ws);
                            console.log(player.pid, 'old');
                        }
                    }
                } else {
                    switch (data[0]) {
                        case 0:
                            player.chat(data[1]);
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
                            break;
                        case 7:
                            player.craft(Items.get(data[1]));
                            break;
                        case 8:
                            let item = Items.get(data[1]);
                            let stack = player.inventory.findStack(item, 1);
                            if (stack) {
                                let entity = world.entities[data[3]].find(e => e.id === data[4]);
                                if (entity && (entity.inv.item === item || entity.inv.item === null) && Utils.distance({x:entity.pos.x-player.pos.x,y:entity.pos.y-player.pos.y}) < 250) {
                                    entity.inv.item = item;
                                    let amount = Math.min(stack.amount,data[2]);
                                    player.decreaseItem(item, amount);
                                    entity.inv.amount += amount;
                                    entity.info = entity.inv.amount;
                                    entity.action = (data[1]+1)*2;
                                    entity.sendInfos();
                                }
                            }
                            break;
                        case 9:
                            let entity = world.entities[data[1]].find(e => e.id === data[2]);
                            if (entity && entity.inv.item && Utils.distance({x:entity.pos.x-this.pos.x,y:player.pos.y-player.pos.y}) < 250) {
                                if (player.inventory.findStack(item, 0)) {
                                    player.gather(entity.inv.item,entity.inv.amount);
                                    entity.id = null;
                                    entity.inv.amount = 0;
                                    entity.info = 0;
                                    entity.action = 0;
                                    entity.sendInfos();
                                }
                            }
                            break;
                        case 10:
                            player.cancelCrafting();
                            break;
                        case 12:
                            let stack3 = player.inventory.findStack(Items.WOOD, 1);
                            if (stack3) {
                                let entity = world.entities[data[2]].find(e => e.id === data[3]);
                                if (entity && Utils.distance({x:entity.pos.x-player.pos.x,y:entity.pos.y-player.pos.y}) < 250) {
                                    let amount = Math.min(stack3.amount,data[1]);
                                    player.decreaseItem(Items.WOOD, amount);
                                    entity.inv.amount += amount;
                                    entity.info = entity.inv.amount;
                                    entity.action = EntityState.Hurt;
                                    entity.sendInfos();
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
});