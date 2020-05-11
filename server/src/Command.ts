import { Items } from "./Item";
import Player, { KITS } from "./Player";
import world from "./World";
import chalk from "chalk";
import Entity, { EntityTypes } from "./Entity";
import { Vector } from './index';

export interface CommandSender {
    sendMessage(text: string, color?: string): void;
    isOp: boolean;
}

export class ConsoleSender implements CommandSender {
    static instance = new ConsoleSender();

    sendMessage(text: string, color?: string) {
        console.log(color ? chalk.keyword(color)(text) : text);
    }

    get isOp() {
        return true;
    }
}

export abstract class Command {
    abstract invoke(sender: CommandSender, args: string[]): void;

    matchPlayers(value: string, sender?: CommandSender): Player[] {
        if (value === null || value === undefined)
            return [];
        if (value === "@a")
            return world.players;
        if (value === "@s" && sender && sender instanceof Player)
            return [sender as Player];

        let id = Number(value);
        return [world.players.find(e => isNaN(id) ? e.nick.startsWith(value) : e.pid === id)];
    }

    canInvoke(sender: CommandSender): boolean {
        return sender.isOp;
    }
}

export class Commands {
    static commands: Map<string, Command> = new Map([
        ["help", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                sender.sendMessage(/*html*/`Click <a href="/register" target="_blank" style="color: lightblue;">here</a> for commands`);
            }

            canInvoke(sender: CommandSender): boolean {
                return true;
            }
        }],
        ["list", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                sender.sendMessage(`Players (${world.players.length}): ${world.players.map(x => `${x.nick} (${x.pid})`).join(", ")}`);
            }

            canInvoke(sender: CommandSender): boolean {
                return true;
            }
        }],
        ["stop", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                process.exit();
            }
        }],
        ["give", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length < 3 || args.length > 4)
                    throw new SyntaxError();

                let targets = this.matchPlayers(args[1], sender);
                let amount = (args.length >= 3 ? Number(args[3]) : NaN) || 1;
                let id = Number(args[2]);
                let item = Items.get(isNaN(id) ? args[2].toUpperCase() : id);
                if (!item) {
                    let items = KITS[args[2].toUpperCase()];
                    if (items) {
                        for (let i = 0; i < amount; i++) {
                            for (let item of items) {
                                for (const target of targets) {
                                    if (item[0] == Items.BAG) {
                                        target.bag = true;
                                        target.updating = true;
                                    } else {
                                        target.gather(item[0], item[1]);
                                    }
                                }
                            }
                        }
                        sender.sendMessage(`Given x${amount} ${args[2].toUpperCase()} kit to ${targets.length} players`);
                    }
                } else {
                    for (const target of targets) {
                        if (item == Items.BAG) {
                            target.bag = true;
                            target.updating = true;
                        } else {
                            target.gather(item, amount);
                        }
                    }
                    sender.sendMessage(`Given x${amount} ${item.name} to ${targets.length} players`);
                }

            }
        }],
        ["tp", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length < 3 || args.length > 4)
                    throw new SyntaxError();

                let targets = this.matchPlayers(args[1], sender);
                let x: number = NaN;
                let y: number = NaN;
                if (args.length > 3) {
                    x = Number(args[2]) * 100;
                    y = Number(args[3]) * 100;
                } else {
                    const destination = this.matchPlayers(args[2], sender);
                    if (destination.length === 1) {
                        x = destination[0].pos.x;
                        y = destination[0].pos.y;
                    }
                }
                if (!isNaN(x) && !isNaN(y)) {
                    for (let target of targets) {
                        target.pos.x = x;
                        target.pos.y = y;
                        target.updateChunk(target.getChunk());
                        target.sendInfos();
                    }
                    sender.sendMessage(`Teleported ${targets.length} players to x ${x}, y ${y}`);
                } else {
                    sender.sendMessage("Invalid destination!", "red");
                }
            }
        }],
        ["summon", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length < 2 || args.length > 4)
                    throw new SyntaxError();

                let pos: Vector;
                if (args.length < 4) {
                    if (sender instanceof Player) {
                        pos = sender.pos;
                    } else {
                        throw new SyntaxError();
                    }
                } else {
                    pos = { x: Number(args[2]) * 100, y: Number(args[3]) * 100 };
                }

                if (!isNaN(pos.x) && !isNaN(pos.y)) {
                    let id = Number(args[1]);
                    let entityType = EntityTypes.get(isNaN(id) ? args[1].toUpperCase() : id);
                    new Entity(Object.assign({}, pos), 0, null, entityType, true);

                    sender.sendMessage(`Summoned ${entityType.name}!`);
                } else {
                    sender.sendMessage("Invalid destination!", "red");
                }
            }
        }],
        ["givexp", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length !== 3) throw new SyntaxError();

                let targets = this.matchPlayers(args[1], sender);
                let amount = Number(args[2]);
                if (isNaN(amount)) throw new SyntaxError();

                for (const target of targets) {
                    target.score += amount;
                }

                sender.sendMessage(`Given ${amount} xp to ${targets.length} players`);
            }
        }],
        ["message", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length < 3) throw new SyntaxError();

                let targets = this.matchPlayers(args[1], sender);
                let message = args[2];
                for (let m = 3; m < args.length; m++) {
                    message += ' ' + args[m];
                }

                for (const target of targets) {
                    target.sendError(message);
                }

                sender.sendMessage(`Sent message to ${targets.length} players`);
            }
        }],
        ["restart", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                world.restart();
                sender.sendMessage(`Restarting server!`);
            }
        }],
        ["mode", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length < 2) throw new SyntaxError();
                if (world.modes[args[1]]) {
                    sender.sendMessage(`Changing mode to ${args[1]} mode`);
                    world.restart(world.modes[args[1]]);

                } else {
                    sender.sendMessage(`Can't find ${args[1]} mode`);
                }

            }
        }],
        ["vincible", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length !== 2) throw new SyntaxError();
                let targets = this.matchPlayers(args[1], sender);
                for (const target of targets) target.invincible = false;
                sender.sendMessage(`Made ${targets.length} player vincible`);
            }
        }],
        ["invincible", new class extends Command {
            invoke(sender: CommandSender, args: string[]) {
                if (args.length !== 2) throw new SyntaxError();
                let targets = this.matchPlayers(args[1], sender);
                for (const target of targets) target.invincible = true;
                sender.sendMessage(`Made ${targets.length} player invincible`);
            }
        }]
    ]);

    static process(sender: CommandSender, input: string) {
        const args = input.split(' ');
        const command = this.commands.get(args[0]);

        if (command) {
            if (command.canInvoke(sender)) {
                try {
                    command.invoke(sender, args);
                } catch (error) {
                    sender.sendMessage(`Command failed: ${error}`, "red");
                }
            } else {
                sender.sendMessage("Insufficient permissions", "red");
            }
        } else {
            sender.sendMessage("Command not found", "red");
        }
    }
}