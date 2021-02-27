import express from 'express';
import session, { SessionOptions, MemoryStore } from 'express-session';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import redis from 'redis';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';

const app = express();

import btoa from 'btoa';
import fetch from 'node-fetch';
import DiscordBot from "./DiscordBot";
import config from "../config";
import { AddressInfo } from 'net';
import Server from './Server';

const bot = new DiscordBot();
bot.start();

const counters = { playersCounter: 0 };

app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');
app.set('trust proxy', true);

const sessionOptions: SessionOptions = {
    secret: 'very secret something',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore()
};

if (config.redis) {
    let RedisStore = connectRedis(session);
    let redisClient = redis.createClient(config.redis);
    sessionOptions.store = new RedisStore({ client: redisClient });
}

abstract class Utils {
    static strings: String[] = [];
    static chars: String = '0123456789abcedfghejklmnopqrstuvwyzABCDEFGHEJKLMNEPQRSTUVWYZ';
    static randomString(x: number, d: boolean = true) {
        let str = '';
        while (true) {
            for (let i = 0; i < x; i++) {
                str += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            }
            if (!this.strings.includes(str)) {
                this.strings.push(str);
                break;
            }
        }
        return str;
    }
}

app.use(session(sessionOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(async (req, res, next) => {
    if (req.url == "/register") {
        res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        return;
    }
    if (config.discord || req.session.accessToken) {
        if (req.session.accessToken == null || req.session.user == null) {
            if (!req.url.startsWith("/login") && !req.url.startsWith("/api")) {
                res.redirect("/login");
                return;
            }
        } else {
            const authorized = await bot.checkUser(req.session.user.id);
            if (!authorized) {
                if (!req.url.startsWith("/unauthorized")) {
                    res.redirect("/unauthorized");
                    return;
                }
            } else {
                //res.cookie('starve_nickname', `${req.session.displayName}`);
                res.cookie('account_id', `${req.session.user.id}`);
                res.cookie('session_id', `${req.session.id}`);

                if (req.url == "/") {
                    console.log(`${req.session.displayName} (${req.session.user.id}) logged from ${req.ip}`);
                }
            }
        }
    } else {
        if (!req.session.user) {
            if (!req.url.startsWith("/api")) {
                counters.playersCounter += 1;
                req.session.displayName = `Player#${counters.playersCounter}`;
                req.session.user = { id: Utils.randomString(16) };
                res.cookie('starve_nickname', `${req.session.displayName}`);
                res.cookie('account_id', `${req.session.user.id}`);
                res.cookie('session_id', `${req.session.id}`);
            }
        } else {
            //res.cookie('starve_nickname', `${req.session.displayName}`);
            res.cookie('account_id', `${req.session.user.id}`);
            res.cookie('session_id', `${req.session.id}`);

            if (req.url == "/") {
                console.log(`${req.session.displayName} (${req.session.user.id}) logged from ${req.ip}`);
            }
        }
    }

    next();
});

// app.use(express.static(__dirname + '/../../client'));
app.use(express.static('./public'));

const servers: Server[] = [];

for (let server of config.debugServer) {
    servers.push(server);
}

app.get('/servers', function (req, res) {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(servers.filter(e => new Date().getTime() - e.lastupdate < 31000), (key, value) => key === "joiningPlayers" || key === "lastupdate" ? undefined : value));
});

app.get("/unauthorized", async (req, res) => {
    const authorized = await bot.checkUser(req.session.user.id);
    if (authorized) {
        res.redirect("/");
        return;
    }

    res.render('unauthorized', { layout: false, session: req.session });
});

app.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.clientId}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(config.redirectUri)}`);
});

app.post("/api/join", async (req, res) => {
    if (req.session.user == null)
        res.status(401).send();

    const server = servers.find(x => x.id == req.body.server);
    server.joiningPlayers.set(req.session.user.id, new Date());
    console.log(`${req.session.displayName} (${req.session.user.id}) is joining server #${req.body.server}`);
    res.status(200).send();
});

app.post("/api/serverupdate", async (req, res) => {
    if (config.apiKeys.includes(req.body.key)) {
        let server = servers.find(x => x.ip == req.body.ip && x.port == req.body.port);
        if (server) {
            server.players.online = req.body.online;
            server.players.max = req.body.max;
            server.name = req.body.name;
            server.lastupdate = new Date().getTime();
        } else {
            servers.push(new Server(servers.length.toString(), req.body.name, req.body.online, req.body.max, req.body.ip, req.body.port, req.body.ssl));
        }
        res.status(200).send();
    }
});

app.post("/api/verify", async (req, res) => {
    const server = servers.find(x => x.ip == req.body.ip && x.port == req.body.port);
    if (server === undefined || !server.joiningPlayers.has(req.body.accountId)) {
        res.status(401).send();
        return;
    }

    const time = new Date().getTime() - server.joiningPlayers.get(req.body.accountId).getTime();
    console.log(`Server #${server.id} verified player ${req.body.accountId} (${time}ms)`);
    res.status(time < 5000 ? 200 : 401).send();
});

app.get('/api/discord/callback', async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const response = await fetch(`https://discord.com/api/v8/oauth2/token`,
        {
            method: 'POST',
            body: `client_id=${config.clientId}&client_secret=${config.clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=identify`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    const json = await response.json();

    let user = await (await fetch('http://discordapp.com/api/users/@me', { headers: { Authorization: `${json.token_type} ${json.access_token}` } })).json();
    if (user.code || user.message) {
        res.redirect("/login");
    } else {
        req.session.accessToken = json.access_token;
        req.session.user = user;
        req.session.displayName = `${user.username}#${user.discriminator}`;
        console.log(`${req.session.displayName} (${user.id}) logged from ${req.ip} ${(await bot.checkUser(user.id)) ? "(pass)" : "(fail)"}`);
        res.redirect(`/`);
    }
});

let [hostname, port] = config.address.split(":");
const server = app.listen(Number.parseInt(port), hostname, () => {
    let address = server.address() as AddressInfo;
    console.log(`Listening on ${address.address}:${address.port}`);
});