import * as http from "http";
import * as fs from "fs";

const server = http.createServer((req, res) => {
    if (req.url == "/servers") {
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify([{ "name": "Test Server", "players": { "online": 0, "max": 0 }, "ip": "localhost", "port": 8080, ssl: true }]));
    } else {
        fs.readFile(__dirname + "/../../client" + (req.url == "/" ? "/index.html" : req.url), function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(80);