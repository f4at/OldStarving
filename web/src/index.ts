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

app.use(session(sessionOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(async (req, res, next) => {
    if (req.url == "/register") {
        res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        return;
    }

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
            res.cookie('starve_nickname', `${req.session.displayName}`, { maxAge: 900000 });
            res.cookie('account_id', `${req.session.user.id}`, { maxAge: 900000 });
            res.cookie('session_id', `${req.session.id}`, { maxAge: 900000 });

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

if (config.debugServer) {
    for (let server of config.debugServer) {
        servers.push(server);
    }
}

app.get('/servers', function (req, res) {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(servers, (key, value) => key === "joiningPlayers" ? undefined : value));
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

app.post("/api/verify", async (req, res) => {
    const server = servers.find(x => x.id == req.body.server);
    if (server === null || !server.joiningPlayers.has(req.body.accountId)) {
        res.status(401).send();
        return;
    }

    const time = new Date().getTime() - server.joiningPlayers.get(req.body.accountId).getTime();
    console.log(`Server #${req.body.server} verified player ${req.body.accountId} (${time}ms)`);
    res.status(time < 5000 ? 200 : 401).send();
});

app.get('/api/discord/callback', async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(config.redirectUri)}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`,
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