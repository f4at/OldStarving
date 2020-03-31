export default class Server {
    id: string;
    name: string;
    players: { online: number, max: number; };
    ip: string;
    port: number;
    ssl: boolean;

    joiningPlayers?: Map<string, Date> = new Map();
}