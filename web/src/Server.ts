export default class Server {
    id: string;
    name: string;
    players: { online: number, max: number; };
    ip: string;
    port: number;
    ssl: boolean;
    lastupdate: number = new Date().getTime();
    joiningPlayers: Map<string, Date> = new Map();
    constructor(id: string, name: string, online: number, max: number, ip: string, port: number, ssl: boolean) {
        this.id = id;
        this.name = name;
        this.players = { online, max };
        this.ip = ip;
        this.port = port;
        this.ssl = ssl;
        this.joiningPlayers = new Map();
    }
}