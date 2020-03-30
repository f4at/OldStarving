import * as WebSocket from "ws";
import * as https from "https";
import * as fs from "fs";
import world from "./World";
import Player from "./Player";
import { Items } from "./Item";
import * as express from 'express';

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
        return angle / 128 * Math.PI;
    }

    static toBinary(angle: number) {
        return angle * 128 / Math.PI;
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
    ws.on("message", (message) => {
        try {
            if (message instanceof ArrayBuffer) {
                //nothing
            } else {
                let data = JSON.parse(message.toString());
                if (!player) {
                    player = world.players.find(e => e.session == data[2] && e.sessionId == data[3]);
                    if (!player) {
                        player = new Player(data[0], data[1], data[2], data[3], ws);
                        console.log(player.pid, 'new');
                    } else {
                        player.join(ws);
                        console.log(player.pid, 'old');
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