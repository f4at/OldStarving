const fs= require('fs'); 
    https = require('https');
    WebSocket = require('ws');

function tohex(data) {
    return data%256,Math.floor(data/256)
}
function angleToRad(ag) {
    return ag/180*Math.PI
}
function angleToCoords(ag) {
    ag = angleToRad(ag)
    return {"x":Math.sin(ag),'y':Math.cos(ag)}
}
function distance(vector) {
    return (vector.x**2+vector.y**2)**0.5;
}
    

const server = https.createServer({
    key: fs.readFileSync('Server/data/SSL/key.pem'),
    cert: fs.readFileSync('Server/data/SSL/cert.pem'),
    port: 5111
});
server.listen(5111)

const wss = new WebSocket.Server({server});
const mapSize = {"x":10,"y":10}

var tools = [{'n':'hand','range':0,'damage':5}]
var players = []
var chunks = new Array(mapSize.x)
for (var i=0;i<mapSize.x;i++) {
    chunks[i] = new Array(mapSize.y);
}


function sendtoallplayers(packet) {
    for (let player of players) {
        if (player.online) {player.ws.send(packet)};
    }
}

function sendtoList(list,packet) {
    for (let player of list) {
        if (player.online) {player.ws.send(packet)};
    }
}

function getplayersList() {
    list = []
    for (let player of players) {
        list.push({i:player.pid,n:player.nickname,p:player.score})
    }
    return list
}
class Player {
    constructor(nick,token,ws) {
        this.nick = nick;
        this.token = token;
        this.ws = ws;
        this.health = 100;
        this.food = 100;
        this.temp = 100;
        this.pos = {"x":Math.random()*10000,"y":Math.random()*10000};
        this.angle = 0;
        this.type = 0;
        this.tool = 0;
        this.helmet = 0;
        this.score = 0;
        this.moving = false;
        this.attacking = false;
        this.attack = false;
        this.dmg = false;
        this.healing = true;
        this.movVector= {"x":0,"y":0};
        for (let i=1;i<128;i++) {
            if (!players.find(e=>e.pid == i)) {
                this.pid = i;
                break;
            }
        }
        this.online = true;
        this.id = 0;
        this.ws.send(JSON.stringify([3,this.pid,256,getplayersList(),this.pos.x,this.pos.y,256,0,0,'null',[],0]));
        players.push(this);
        sendtoallplayers(JSON.stringify([2,this.pid,this.nick]));
        this.chunk = {"x":Math.floor(this.pos.x/1000),"y":Math.floor(thisr.pos.y/1000)};
        chuncks[this.chunk.x][this.chunk.y].push(this);
        this.sendInfos();
        this.getInfos();
        this.updateLoop = setInterval(() => {
            if(this.moving || this.updating) {
                if (this.moving) {
                    this.pos.x += this.movVector.x;
                    this.pos.y += this.movVector.y;
                    //Dophysicshere
                    this.pos.x = Math.min(Math.max(0,this.pos.x),mapSize.x*1000);
                    this.pos.y = Math.min(Math.max(0,this.pos.y),mapSize.y*1000);
                    chunk = {'x':Math.floor(this.pos.x/1000),'y':Math.floor(this.pos.y/1000)};
                    if (chunk.x != this.chunk.x || this.chunk.y != this.chunk) {
                        this.updateChunk(chunk);
                    }
                }
                this.sendInfos();
            }
        },1/64)
        this.attackLoop = none;
        
    } getInfos() {
        let list = [0,0];
        for (let x=-2;x<=2;x++) {
            for (let y=-2;y<=2;y++) {
                for (player of chunks[x+this.chunk][y+this.chunk.t]) {
                    list.push([player.infoPacket]);
                }
            }
        }
        this.ws.send(list)
    } move(dir) {
        if (dir) {
            this.movVector.x = dir%4*2-3;
            this.movVector.y = Math.floor(dir/4)*2-3;
            let tot = distance(this.movVector);
            this.movVector.x *= this.speed/tot;
            this.movVector.x *= this.speed/tot;
            this.moving = true;
        } else {
            this.moving = false;
        }
    } rotate(ag) {
        this.angle = ag;
        this.update = True;
    } attack(ag) {
        this.angle = ag;
        this.attacking = true;
        this.attack = true;
        this.updating = true;
        if (!this.attackLoop) {
            this.attackLoop = setInterval(() => {
                if (this.attacking) {
                    this.attack = true;
                    this.updating = true;
                    tool = tools[this.tool]
                    agCoords = angleToCoords(this.angle)
                    center = {'x':agCoords.x*(tool.range+tool.range2)+this.pos.x,'y':agCoords.y*(tool.range+tool.range2)+this.pos.y}
                    this.hit(center,tool.range,tool.damage)
                    this.attackingCircle = {"center":{"x":this.pos.x+this,"y"},"rayon"}
                } else {
                    clearInterval(this.attackLoop);
                    this.attackLoop = none;
                }
            },0.5)
        }
    } hit(center,range,damage,odamage=0) {
        for (let x=-1;x<=1;x++) {
            if (this.chunk.x+x >= 0 && this.chunk.x+x < mapSize.x) {
                for (let y=-1;y<=1;y++) {
                    if (this.chunk.y+y >= 0 && this.chunk.y+y < mapSize.y) {
                        let players = chunks[x+this.chunk][y+this.chunk.t].filter(e=> distance(center.x-e.pos.x,center.y-e.pos.y) < range);
                        for (let player of players) {player.damage(damage)}
                    }
                }
            }
        }
    } damage(dmg) {
        this.health -= dmg;
        this.dmg = true;
        if (this.health < 0) {
            this.die()
        }
    } die() {
        //send death packet
        clearInterval(this.updateLoop);
        clearInterval(this.attackLoop);
        this.sendInfos(false)
        players = players.filter(e=>e==this);
        chunks[this.chunk.x][this.chunk.y] = chunks[this.chunk.x][this.chunk.y].filter(e=>e==this);
        this.ws.close();
    } stopAttack(ag) {
        this.attacking = false;
    } updateChunk(chunk) {
        let ymin = Math.max(-2+this.chunk.y,0), ymax=Math.min(3+this.chunk.y, mapSize.y),
            xmin = Math.max(-2+this.chunk.x,0), xmax=Math.min(3+this.chunk.x, mapSize.x);
        let list = [];
        for (let x=xmin;x<xmax;x++) {
            for (let y=ymin;x<ymax;y++) {
                if (Math.abs(chunk.x-x) > 2 || Math.abs(chunk.y-y) > 2 ) {
                    list = list.concat(chunks[x][y])
                }
            }
        }
        this.sendInfos(false,list)

        let ymin = Math.max(-2+chunk.y,0), ymax=Math.min(3+chunk.y, mapSize.y),
            xmin = Math.max(-2+chunk.x,0), xmax=Math.min(3+chunk.x, mapSize.x);
        let list = [];
        for (let x=xmin;x<xmax;x++) {
            for (let y=ymin;x<ymax;y++) {
                if (Math.abs(this.chunk.x-x) > 2 || Math.abs(this.chunk.y-y) > 2 ) {
                    list = list.concat(chunks[x][y])
                }
            }
        }
        this.sendInfos(true,list)

    } sendInfos(visible=true,to=null) {
        if (to) {
            for (player in to) {
                player.ws.send(this.infoPacket(visible));
            }
        } else {
            this.sendToRange(this.infoPacket(visible));
        }
    } infoPacket(visible=true) {
        if (visible) {
            pos = {"x":tohex(this.pos.x),"y":tohex(this.pos.y)};
            id = tohex(this.id);
            action = this.dmg*2;
            return new Uint8Array([ 0,0,action,this.pid,this.type,this.angle,pos.x[0],pos.x[1],pos.y[0],pos.y[1],id[0],id[1],this.tool,this.helmet])
        } else {
            id = tohex(this.id);
            return new Uint8Array([ 0,0,1,this.pid,this.type,0,0,0,0,0,id[0],id[1],0,0])
        }
    } sendToRange(packet) {
        for (let x=-2;x<=2;x++) {
            if (this.chunk.x+x >= 0 && this.chunk.x+x < mapSize.x) {
                for (let y=-2;y<=2;y++) {
                    if (this.chunk.y+y >= 0 && this.chunk.y+y < mapSize.y) {
                        for (player of chunks[x+this.chunk][y+this.chunk.t]) {
                            player.ws.send(packet)
                        }
                    }
                }
            }
        }
    } 
}

wss.on('connection', (ws,req) => {
    ws.binaryType = 'arraybuffer';
    ws.player = null;
    ws.on('message', (message) => {
        try {
            if (message instanceof ArrayBuffer) {
                let data = new Uint8Array(message);
                switch (data[0]) {
                    case 2:
                        ws.player.move(data[1]);
                        break;
                    case 3:
                        ws.player.rotate(data[1]);
                        break;
                }
            } else {
                let data = JSON.stringify(message);
                if (!ws.player) {
                    ws.player = players.find(e=> e.token == data[1]);
                    if (!ws.player) {
                        ws.player = new Player(data[1],data[2],ws);
                    }
                } else {
                    switch (data[0]) {
                        case 3:
                            break;
                    }
                }
            }
        }catch(e){
            console.log(e,message)
        }
    });
    ws.on('close', (code, reason) => {
        if (ws.player) {
            ws.player.online = false;
        }
        ws.close();
    });
});

server.on("request", (req, res) => {
    if (req.url == "/info.txt") {
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("content-type", "application/json");
        res.end( JSON.stringify([{"name": 'Test Server', "players": {"online": 0, "max": 0}, "address": "oldstarve.io", "port": 5111}]) );
    }
});
