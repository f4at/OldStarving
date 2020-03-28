import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';

const app = express();

import btoa from 'btoa';
import fetch from 'node-fetch';
import DiscordBot from "./DiscordBot";
import * as config from "../config.json";

const bot = new DiscordBot();
bot.start();

app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');

app.use(session({
    secret: 'very secret something',
    resave: false,
    saveUninitialized: true
}));

app.use(cookieParser());

app.use(async (req, res, next) => {
    if(req.url == "/register") {
        res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        return;
    }

    if (req.session.accessToken == null || req.session.user == null) {
        if (!req.url.startsWith("/login") && !req.url.startsWith("/api/discord/callback")) {
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
        }
    }
    next();
});

app.use(express.static(__dirname + '/../../client'));
app.get('/servers', function (req, res) {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify([{ "name": "Test Server", "players": { "online": 0, "max": 0 }, "ip": "localhost", "port": 8080, ssl: true }]));
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
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.clientId}&scope=identify&response_type=code&redirect_uri=${config.redirectUri}`);
});

app.get('/api/discord/callback', async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${config.redirectUri}`,
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

app.listen(80, () => {
    console.log("Listening on port 80");
});