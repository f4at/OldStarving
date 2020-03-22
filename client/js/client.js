Utils = {
    open_in_new_tab: function (c) {
        window.open(c, "_blank").focus();
    }, compare_object: function (c, g) {
        for (var f in c) {
            if (c[f] != g[f]) {
                return false;
            }
        }
        return true;
    }, compare_array: function (c, g) {
        if (c.length != g.length) {
            return false;
        }
        for (var f = 0; f < c.length; f++) {
            if (typeof c == "object") {
                if (!this.compare_object(c[f], g[f])) {
                    return false;
                }
            } else if (c[f] != g[f]) {
                return false;
            }
        }
        return true;
    }, copy_vector: function (c, g) {
        g.x = c.x;
        g.y = c.y;
    }, get_vector: function (c, g) {
        return { x: c.x - g.x, y: c.y - g.y };
    }, mul_vector: function (c, g) {
        c.x *= g;
        c.y *= g;
    }, scalar_product: function (c, g) {
        return c.x * g.x + c.y * g.y;
    }, norm: function (c) {
        return Math.sqrt(c.x * c.x + c.y * c.y);
    }, sign: function (c) {
        if (0 > c) {
            return -1;
        } else {
            return 1;
        }
    }, cross_product: function (c, g) {
        return c.x * g.y - c.y * g.x;
    }, get_angle: function (c, g) {
        return Math.acos(this.scalar_product(c, g) / (this.norm(c) * this.norm(g))) * this.sign(this.cross_product(c, g));
    }, get_std_angle: function (c, g) {
        return this.get_angle({ x: 1, y: 0 }, this.get_vector(c, g));
    }, dist: function (c, g) {
        return Math.sqrt((g.x - c.x) * (g.x - c.x) + (g.y - c.y) * (g.y - c.y));
    }, build_vector: function (c, g) {
        return { x: Math.cos(g) * c, y: Math.sin(g) * c };
    }, add_vector: function (c, g) {
        c.x += g.x;
        c.y += g.y;
    }, sub_vector: function (c, g) {
        c.x -= g.x;
        c.y -= g.y;
    }, translate_vector: function (c, g, f) {
        c.x += g;
        c.y += f;
    }, translate_new_vector: function (c, g, f) {
        return { x: c.x + g, y: c.y + f };
    }, move: function (c, g, f) {
        c.x += Math.cos(f) * g;
        c.y += Math.sin(f) * g;
    }, middle: function (c, g) {
        return Math.floor((c - g) / 2);
    }, middle_point: function (c, g) {
        return { x: (c.x + g.x) / 2, y: (c.y + g.y) / 2 };
    }, rand_sign: function () {
        if (.5 < Math.random()) {
            return 1;
        } else {
            return -1;
        }
    }, get_rand_pos_in_circle: function (c, g, f) {
        var d = this.rand_sign();
        var e = this.rand_sign();
        var m = Math.random() * Math.PI / 2;
        return { x: Math.floor(c + Math.cos(m) * d * f), y: Math.floor(g + Math.sin(m) * e * f) };
    }, Box: function (c, g, f, d) {
        this.x = c;
        this.y = g;
        this.w = f;
        this.h = d;
    }, randomize_list: function (c) {
        a = [];
        a.push.apply(a, c);
        for (c = []; 0 < a.length;) {
            var g = Math.floor(Math.random() * a.length);
            c.push(a[g]);
            a.splice(g, 1);
        }
        return c;
    }, restore_number: function (c) {
        if (2e4 <= c) {
            c = 1e3 * (c - 2e4);
        } else if (1e4 <= c) {
            c = 100 * (c - 1e4);
        }
        return c;
    }, simplify_number: function (c) {
        if (1e4 <= c) {
            var g = Math.max(0, 3 - (Math.floor(Math.log10(c)) - 2));
            var f = Math.floor(c / 1e3).toString();
            if (g) {
                f += "." + (c % 1e3 / 1e3).toString().substring(2).substring(0, g);
                c = f.length - 1;
                for (g = 0; 0 < c && f[c] == "0"; c--) {
                    g++;
                }
                f = f.substring(0, f.length - g);
                if (f[f.length - 1] == ".") {
                    f = f.substring(0, f.length - 1);
                }
            }
            return f + "k";
        }
        return c.toString();
    }, ease_out_quad: function (c) {
        return c * (2 - c);
    }, LinearAnimation: function (c, g, f, d, e, m) {
        this.o = c;
        this.v = g;
        this.max = f;
        this.min = d;
        this.max_speed = e;
        this.min_speed = m;
        this.update = function () {
            if (this.o) {
                var c = this.v + delta * this.max_speed;
                if (c > this.max) {
                    this.v = this.max;
                    this.o = false;
                    return true;
                }
                this.v = c;
            } else {
                c = this.v - delta * this.min_speed;
                if (c < this.min) {
                    this.v = this.min;
                    this.o = true;
                } else {
                    this.v = c;
                }
            }
        };
        return false;
    }, Ease: function (c, g, f, d, e, m) {
        this.fun = c;
        this.ed = g;
        this.em = f;
        this.sx = d;
        this.x = e;
        this.ex = m;
        this.ease = function (c) {
            if (c != this.ex) {
                this.ex = c;
                this.sx = this.x;
                this.ed = 0;
            }
            if (this.ex != this.x) {
                this.ed += delta;
                if (this.ed > this.em) {
                    this.x = this.ex;
                } else {
                    c = this.fun(this.ed / this.em);
                    this.x = this.sx + (this.ex - this.sx) * c;
                }
            }
        };
    }, Ease2d: function (c, g, f, d, e, m, p, n, r) {
        this.fun = c;
        this.ed = g;
        this.em = f;
        this.sx = d;
        this.sy = e;
        this.x = m;
        this.y = p;
        this.ex = n;
        this.ey = r;
        this.ease = function (c) {
            if (c.x != this.ex || c.y != this.ey) {
                this.ex = c.x;
                this.ey = c.y;
                this.sx = this.x;
                this.sy = this.y;
                this.ed = 0;
            }
            if (this.ex != this.x || this.ey != this.y) {
                this.ed += delta;
                if (this.ed > this.em) {
                    this.x = this.ex;
                    this.y = this.ey;
                } else {
                    c = this.fun(this.ed / this.em);
                    this.x = this.sx + (this.ex - this.sx) * c;
                    this.y = this.sy + (this.ey - this.sy) * c;
                }
            }
        };
    }
};
(function () {
    var c = function () {
        function c() {
            var c = 0;
            for (var d = {}; c < arguments.length; c++) {
                var e = arguments[c];
                var g;
                for (g in e) {
                    d[g] = e[g];
                }
            }
            return d;
        }
        function g(f) {
            function d(e, g, p) {
                var n;
                if (typeof document !== "undefined") {
                    if (1 < arguments.length) {
                        p = c({ path: "/" }, d.defaults, p);
                        if (typeof p.expires === "number") {
                            var r = new Date;
                            r.setMilliseconds(r.getMilliseconds() + 864e5 * p.expires);
                            p.expires = r;
                        }
                        try {
                            n = JSON.stringify(g);
                            if (/^[\{\[]/.test(n)) {
                                g = n;
                            }
                        } catch (A) { }
                        g = f.write ? f.write(g, e) : encodeURIComponent(String(g)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                        e = encodeURIComponent(String(e));
                        e = e.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                        e = e.replace(/[\(\)]/g, escape);
                        return document.cookie = [e, "=", g, p.expires ? "; expires=" + p.expires.toUTCString() : "", p.path ? "; path=" + p.path : "", p.domain ? "; domain=" + p.domain : "", p.secure ? "; secure" : ""].join("");
                    }
                    if (!e) {
                        n = {};
                    }
                    var r = document.cookie ? document.cookie.split("; ") : [];
                    var u = /(%[0-9A-Z]{2})+/g;
                    for (var q = 0; q < r.length; q++) {
                        var v = r[q].split("=");
                        var t = v.slice(1).join("=");
                        if (t.charAt(0) === '"') {
                            t = t.slice(1, -1);
                        }
                        try {
                            var z = v[0].replace(u, decodeURIComponent);
                            var t = f.read ? f.read(t, z) : f(t, z) || t.replace(u, decodeURIComponent);
                            if (this.json) {
                                try {
                                    t = JSON.parse(t);
                                } catch (A) { }
                            }
                            if (e === z) {
                                n = t;
                                break;
                            }
                            if (!e) {
                                n[z] = t;
                            }
                        } catch (A) { }
                    }
                    return n;
                }
            }
            d.set = d;
            d.get = function (c) {
                return d.call(d, c);
            };
            d.getJSON = function () {
                return d.apply({ json: true }, [].slice.call(arguments));
            };
            d.defaults = {};
            d.remove = function (e, f) {
                d(e, "", c(f, { expires: -1 }));
            };
            d.withConverter = g;
            return d;
        }
        return g(function () { });
    };
    var g = false;
    if (typeof define === "function" && define.amd) {
        define(c);
        g = true;
    }
    if (typeof exports === "object") {
        module.exports = c();
        g = true;
    }
    if (!g) {
        var f = window.Cookies;
        var d = window.Cookies = c();
        d.noConflict = function () {
            window.Cookies = f;
            return d;
        };
    }
}());
function Mouse() {
    this.DOWN = 0;
    this.UP = 1;
    this.IDLE = 2;
    this.IN = 0;
    this.OUT = 1;
    this.pos = { x: 0, y: 0 };
    this.angle = this.y_old = this.x_old = 0;
    this.state = this.IDLE;
    this.dist = this.IN;
    this.down = function () {
        this.state = this.DOWN;
    };
    this.up = function () {
        this.state = this.UP;
    };
    this.update = function () {
        if (this.pos.x != this.x_old || this.pos.y != this.y_old) {
            this.x_old = this.pos.x;
            this.y_old = this.pos.y;
            return true;
        } else {
            return false;
        }
    };
}
function Keyboard() {
    this.set_azerty = function () {
        this.LEFT = 81;
        this.RIGHT = 68;
        this.TOP = 90;
        this.DOWN = 83;
    };
    this.set_qwerty = function () {
        this.LEFT = 65;
        this.RIGHT = 68;
        this.TOP = 87;
        this.BOTTOM = 83;
    };
    this.UP = 0;
    this.DOWN = 1;
    this._1 = 49;
    this._2 = 50;
    this._3 = 51;
    this._4 = 52;
    this._5 = 53;
    this.CTRL = 17;
    this.ARROW_LEFT = 37;
    this.ARROW_RIGHT = 39;
    this.ARROW_TOP = 38;
    this.ARROW_BOTTOM = 40;
    this.SPACE = 32;
    this.R = 82;
    this.G = 71;
    this.V = 86;
    this.B = 66;
    this.set_qwerty();
    this.keys = Array(255).fill(this.UP);
    this.up = function (c) {
        this.keys[Math.min(c.charCode || c.keyCode, 255)] = this.UP;
    };
    this.down = function (c) {
        c = Math.min(c.charCode || c.keyCode, 255);
        if (c == this.LEFT || c == this.ARROW_LEFT) {
            this.press_left();
        } else if (c == this.TOP || c == this.ARROW_TOP) {
            this.press_top();
        } else if (c == this.DOWN || c == this.ARROW_DOWN) {
            this.press_bottom();
        } else if (c == this.RIGHT || c == this.ARROW_RIGHT) {
            this.press_right();
        }
        this.keys[c] = this.DOWN;
        return c;
    };
    this.press_left = function () {
        this.keys[this.RIGHT] = this.UP;
        this.keys[this.ARROW_RIGHT] = this.UP;
    };
    this.press_right = function () {
        this.keys[this.LEFT] = this.UP;
        this.keys[this.ARROW_LEFT] = this.UP;
    };
    this.press_bottom = function () {
        this.keys[this.TOP] = this.UP;
        this.keys[this.ARROW_TOP] = this.UP;
    };
    this.press_top = function () {
        this.keys[this.BOTTOM] = this.UP;
        this.keys[this.ARROW_BOTTOM] = this.UP;
    };
    this.clear_directionnal = function () {
        this.keys[this.RIGHT] = this.UP;
        this.keys[this.ARROW_RIGHT] = this.UP;
        this.keys[this.LEFT] = this.UP;
        this.keys[this.ARROW_LEFT] = this.UP;
        this.keys[this.TOP] = this.UP;
        this.keys[this.ARROW_TOP] = this.UP;
        this.keys[this.BOTTOM] = this.UP;
        this.keys[this.ARROW_BOTTOM] = this.UP;
    };
    this.is_left = function () {
        return this.keys[this.LEFT] || this.keys[this.ARROW_LEFT];
    };
    this.is_right = function () {
        return this.keys[this.RIGHT] || this.keys[this.ARROW_RIGHT];
    };
    this.is_top = function () {
        return this.keys[this.TOP] || this.keys[this.ARROW_TOP];
    };
    this.is_bottom = function () {
        return this.keys[this.BOTTOM] || this.keys[this.ARROW_BOTTOM];
    };
    this.is_ctrl = function () {
        return this.keys[this.CTRL];
    };
    this.is_1 = function () {
        return this.keys[this._1];
    };
    this.is_2 = function () {
        return this.keys[this._2];
    };
    this.is_3 = function () {
        return this.keys[this._3];
    };
    this.is_4 = function () {
        return this.keys[this._4];
    };
    this.is_space = function () {
        return this.keys[this.SPACE];
    };
    this.is_r = function () {
        return this.keys[this.R];
    };
    this.is_g = function () {
        return this.keys[this.G];
    };
    this.is_v = function () {
        return this.keys[this.V];
    };
    this.is_b = function () {
        return this.keys[this.B];
    };
}
var can = document.getElementById("game_canvas");
var ctx = can.getContext("2d");
var canw = can.width;
var canh = can.height;
var canw2 = can.width / 2;
var canh2 = can.height / 2;
var canm = { x: canw2, y: canh2 };
var scale = 1;
can.oncontextmenu = function () {
    return false;
};
function CTI(c) {
    var g = new Image;
    g.src = c.toDataURL("image/png");
    g.width = c.width;
    g.height = c.height;
    return g;
}
function resize_canvas() {
    if (can.width != window.innerWidth) {
        can.width = window.innerWidth;
        canw = can.width;
        canw2 = can.width / 2;
    }
    if (can.height != window.innerHeight) {
        can.height = window.innerHeight;
        canh = can.height;
        canh2 = can.height / 2;
    }
    canm = { x: canw2, y: canh2 };
    if (user) {
        user.cam.rw = can.width;
        user.cam.rh = can.height;
    }
    if (loader.is_run) {
        loader.update();
    } else if (ui.is_run) {
        ui.update();
    } else if (game.is_run) {
        game.update();
    }
}
var game_body = document.getElementById("game_body");
game_body.ondragstart = function () {
    return false;
};
game_body.ondrop = function () {
    return false;
};
game_body.onresize = resize_canvas;
(function () {
    var c = 0;
    var g = ["ms", "moz", "webkit", "o"];
    for (var f = 0; f < g.length && !window.requestAnimationFrame; ++f) {
        window.requestAnimationFrame = window[g[f] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[g[f] + "CancelAnimationFrame"] || window[g[f] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (d, e) {
            var f = (new Date).getTime();
            var g = Math.max(0, 16 - (f - c));
            var n = window.setTimeout(function () {
                d(f + g);
            }, g);
            c = f + g;
            return n;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (c) {
            clearTimeout(c);
        };
    }
}());
IMAGES = { LOGO: "img/logo.png" };
var SPRITE = { GROUND: ["#133A2B", "#032428"], SNOW_GROUND: ["#EBF2F0", "#136167"], CRAFT_LOADING: ["#4EB687", "#187484"], DAY: 0, NIGHT: 1, WINTER_BIOME_Y: 10359, FLAKES_NUMBER: 34, FLAKES_SIZES: 5, STEP_SPACE: 50, SWORD: 0, PICK: 1, HAND: 2, TREE: 3, BODY: 4, STONES: 5, SEED: 6, PICK_GOLD: 7, PICK_DIAMOND: 8, SWORD_GOLD: 9, SWORD_DIAMOND: 10, WOOD_FIRE: 11, WORKBENCH: 12, PLANT_SEED: 13, CRAFT_PICK: 14, PICK_WOOD: 15, WALL: 16, SPIKE: 17, MEAT: 18, COOKED_MEAT: 19, INV_PLANT: 82, BANDAGE: 21, CRAFT_SWORD: 22, CRAFT_WORK: 88, RABBIT: 91, PLAY: 87, GAUGES: 99, LEADERBOARD: 105, HURT: 137, COLD: 140, HUNGER: 143, GROUND_FIRE: 147, COUNTER: 151, CRAFT_SEED: 154, HERB: 158, HAND_SHADOW: 162, PLANT_MINI: 168, GOLD: 149, DIAMOND: 187, FIRE: 191, HALO_FIRE: 195, CRAFT_SWORD_GOLD: 200, CRAFT_SWORD_DIAMOND: 216, INV_SWORD_GOLD: 220, INV_SWORD_DIAMOND: 224, PLANT: 228, FRUIT: 232, CRAFT_PICK_GOLD: 236, CRAFT_PICK_DIAMOND: 35, INV_PICK_GOLD: 49, INV_PICK_DIAMOND: 248, INV_GOLD: 252, INV_DIAMOND: 259, WOLF: 265, INV_MEAT: 269, GEAR2: 273, CRAFT_FIRE: 277, INV_BANDAGE: 281, CRAFT_BANDAGE: 285, CORD: 289, INV_CORD: 294, YOUR_SCORE: 298, TREE_BRANCH: 308, HEAL: 63, INV_FIRE: 64, INV_WORK: 65, INV_SEED: 66, INV_PICK: 67, INV_PICK_WOOD: 68, CRAFT_PICK_WOOD: 69, INV_STONE: 70, INV_WOOD: 71, INV_WALL: 72, CRAFT_WALL: 73, INV_SPIKE: 74, CRAFT_SPIKE: 75, HURT_RABBIT: 76, INV_COOKED_MEAT: 77, GEAR: 78, CRAFT_COOKED_MEAT: 79, MINIMAP: 80, HURT_WOLF: 81, BIG_FIRE_WOOD: 20, CRAFT_BIG_FIRE: 83, INV_BIG_FIRE: 84, SPIDER: 85, INV_SWORD: 86, DIAMOND_WALL: 25, STONE_WALL: 23, CRAFT_STONE_WALL: 89, INV_STONE_WALL: 90, GOLD_WALL: 24, CRAFT_GOLD_WALL: 92, INV_GOLD_WALL: 93, INV_DIAMOND_WALL: 94, CRAFT_DIAMOND_WALL: 95, HURT_SPIDER: 96, EMPTY_SLOT: 97, WEB: 98, DOOR_WOOD_CLOSE: 26, CRAFT_DOOR_WOOD_CLOSE: 100, INV_DOOR_WOOD_CLOSE: 101, DOOR_WOOD_OPEN: 102, CHEST: 27, INV_CHEST: 106, CRAFT_CHEST: 107, CHEST_SLOT: 108, CHEST_SWORD: 109, CHEST_PICK: 110, CHEST_STONE: 111, CHEST_WOOD: 112, CHEST_PLANT: 113, CHEST_GOLD: 114, CHEST_DIAMOND: 115, CHEST_PICK_GOLD: 116, CHEST_PICK_DIAMOND: 117, CHEST_SWORD_GOLD: 118, CHEST_SWORD_DIAMOND: 119, CHEST_FIRE: 120, CHEST_WORK: 121, CHEST_SEED: 122, CHEST_WALL: 123, CHEST_SPIKE: 124, CHEST_PICK_WOOD: 125, CHEST_COOKED_MEAT: 126, CHEST_MEAT: 127, CHEST_BIG_FIRE: 128, CHEST_BANDAGE: 129, CHEST_CORD: 130, CHEST_STONE_WALL: 131, CHEST_GOLD_WALL: 132, CHEST_DIAMOND_WALL: 133, CHEST_DOOR_WOOD_CLOSE: 134, CHEST_WORKBENCH: 135, CHEST_CHEST: 136, STONE_SPIKE: 28, CRAFT_STONE_SPIKE: 138, INV_STONE_SPIKE: 139, GOLD_SPIKE: 29, INV_GOLD_SPIKE: 141, CRAFT_GOLD_SPIKE: 142, DIAMOND_SPIKE: 30, INV_DIAMOND_SPIKE: 144, CRAFT_DIAMOND_SPIKE: 145, CHEST_PLUS: 146, BAG: 48, CRAFT_BAG: 148, FUR: 34, INV_FUR: 150, EARMUFFS: 36, INV_EARMUFFS: 152, CRAFT_EARMUFFS: 153, DOOR_STONE_CLOSE: 31, CRAFT_DOOR_STONE_CLOSE: 155, INV_DOOR_STONE_CLOSE: 156, DOOR_STONE_OPEN: 157, DOOR_GOLD_CLOSE: 32, CRAFT_DOOR_GOLD_CLOSE: 159, INV_DOOR_GOLD_CLOSE: 160, DOOR_GOLD_OPEN: 161, DOOR_DIAMOND_CLOSE: 33, CRAFT_DOOR_DIAMOND_CLOSE: 163, INV_DOOR_DIAMOND_CLOSE: 164, DOOR_DIAMOND_OPEN: 165, CRAFT_COAT: 166, INV_COAT: 167, COAT: 37, CHEST_STONE_SPIKE: 169, CHEST_GOLD_SPIKE: 170, CHEST_DIAMOND_SPIKE: 171, CHEST_BAG: 172, CHEST_FUR: 173, CHEST_EARMUFFS: 174, CHEST_DOOR_STONE_CLOSE: 175, CHEST_DOOR_GOLD_CLOSE: 176, CHEST_DOOR_DIAMOND_CLOSE: 177, CHEST_COAT: 178, INV_BAG: 179, FUR_WOLF: 180, INV_FUR_WOLF: 181, CHEST_FUR_WOLF: 182, SPEAR: 38, INV_SPEAR: 188, CRAFT_SPEAR: 189, CHEST_SPEAR: 190, GOLD_SPEAR: 39, INV_GOLD_SPEAR: 192, CRAFT_GOLD_SPEAR: 193, CHEST_GOLD_SPEAR: 194, DIAMOND_SPEAR: 40, INV_DIAMOND_SPEAR: 196, CRAFT_DIAMOND_SPEAR: 197, CHEST_DIAMOND_SPEAR: 198, FURNACE_ON: 199, FURNACE_OFF: 41, INV_FURNACE: 201, CRAFT_FURNACE: 202, CHEST_FURNACE: 203, FURNACE_SLOT: 204, FURNACE_BUTTON: 205, FIR: 206, STONES_WINTER: 209, GOLD_WINTER: 210, DIAMOND_WINTER: 211, GROUND_FIRE_WINTER: 212, AMETHYST: 213, INV_AMETHYST: 214, FOX: 215, EXPLORER_HAT: 42, INV_EXPLORER_HAT: 217, CRAFT_EXPLORER_HAT: 218, CHEST_EXPLORER_HAT: 219, STONE_HELMET: 43, INV_STONE_HELMET: 221, CRAFT_STONE_HELMET: 222, CHEST_STONE_HELMET: 223, GOLD_HELMET: 44, INV_GOLD_HELMET: 225, CRAFT_GOLD_HELMET: 226, CHEST_GOLD_HELMET: 227, DIAMOND_HELMET: 45, INV_DIAMOND_HELMET: 229, CRAFT_DIAMOND_HELMET: 230, CHEST_DIAMOND_HELMET: 231, BOOK: 46, INV_BOOK: 233, CRAFT_BOOK: 234, CHEST_BOOK: 235, PAPER: 47, INV_PAPER: 237, CRAFT_PAPER: 238, CHEST_PAPER: 239, HERB_WINTER: 240, BEAR: 241, CHEST_AMETHYST: 242, SNOW: 243, DRAGON_GROUND: 244, DRAGON: 245, WING_LEFT: 246, WING_RIGHT: 247, SWORD_AMETHYST: 50, INV_SWORD_AMETHYST: 249, CRAFT_SWORD_AMETHYST: 250, CHEST_SWORD_AMETHYST: 251, PICK_AMETHYST: 51, INV_PICK_AMETHYST: 253, CHEST_PICK_AMETHYST: 254, CRAFT_PICK_AMETHYST: 255, HURT_FOX: 256, HURT_BEAR: 257, HURT_DRAGON: 258, SLOT_NUMBER: 259, HURT_WING_LEFT: 208, HURT_WING_RIGHT: 207, FLAKES: 264, AMETHYST_SPEAR: 52, INV_AMETHYST_SPEAR: 260, CRAFT_AMETHYST_SPEAR: 261, CHEST_AMETHYST_SPEAR: 262, SNOW_STEP: 263, HAMMER: 53, INV_HAMMER: 266, CRAFT_HAMMER: 267, CHEST_HAMMER: 268, HAMMER_GOLD: 54, INV_HAMMER_GOLD: 270, CRAFT_HAMMER_GOLD: 271, CHEST_HAMMER_GOLD: 272, HAMMER_DIAMOND: 55, INV_HAMMER_DIAMOND: 274, CRAFT_HAMMER_DIAMOND: 275, CHEST_HAMMER_DIAMOND: 276, HAMMER_AMETHYST: 56, INV_HAMMER_AMETHYST: 278, CRAFT_HAMMER_AMETHYST: 279, CHEST_HAMMER_AMETHYST: 280, AMETHYST_WALL: 57, INV_AMETHYST_WALL: 282, CRAFT_AMETHYST_WALL: 283, CHEST_AMETHYST_WALL: 284, AMETHYST_SPIKE: 58, INV_AMETHYST_SPIKE: 286, CRAFT_AMETHYST_SPIKE: 287, CHEST_AMETHYST_SPIKE: 288, DOOR_AMETHYST_CLOSE: 59, CRAFT_DOOR_AMETHYST_CLOSE: 290, INV_DOOR_AMETHYST_CLOSE: 291, DOOR_AMETHYST_OPEN: 292, CHEST_DOOR_AMETHYST_CLOSE: 293, CAP_SCARF: 60, INV_CAP_SCARF: 295, CRAFT_CAP_SCARF: 296, CHEST_CAP_SCARF: 297, FUR_WINTER: 61, INV_FUR_WINTER: 299, CHEST_FUR_WINTER: 300, SLOT_NUMBER: 301, DOOR_WOOD_OPEN_WINTER: 302, DOOR_STONE_OPEN_WINTER: 303, DOOR_GOLD_OPEN_WINTER: 304, DOOR_DIAMOND_OPEN_WINTER: 305, DOOR_AMETHYST_OPEN_WINTER: 306, BLUE_CORD: 62, INV_BLUE_CORD: 307, CHEST_BLUE_CORD: 309, CRAFT_BLUE_CORD: 310, BIGMAP: 311 };
sprite = [];
function fill_path(c, g, f, d) {
    if (g) {
        c.fillStyle = g;
        c.fill();
    }
    if (f) {
        c.lineWidth = d;
        c.strokeStyle = f;
        c.stroke();
    }
}
function round_rect(c, g, f, d, e, m) {
    if (d < 2 * m) {
        m = d / 2;
    }
    if (e < 2 * m) {
        m = e / 2;
    }
    if (0 > m) {
        m = 0;
    }
    c.beginPath();
    c.moveTo(g + m, f);
    c.arcTo(g + d, f, g + d, f + e, m);
    c.arcTo(g + d, f + e, g, f + e, m);
    c.arcTo(g, f + e, g, f, m);
    c.arcTo(g, f, g + d, f, m);
    c.closePath();
}
function circle(c, g, f, d) {
    c.beginPath();
    c.arc(g, f, d, 0, 2 * Math.PI);
}
function round_regular_polygon(c, g, f, d) {
    var e = 2 * Math.PI / g;
    c.beginPath();
    var m = [{ x: f, y: 0 }];
    var p = [];
    for (var n = 1; n < g; n++) {
        m.push({ x: Math.cos(n * e) * f, y: Math.sin(n * e) * f });
        var r = m.length;
        p.push(Utils.middle_point(m[r - 2], m[r - 1]));
    }
    p.push(Utils.middle_point(m[m.length - 1], m[0]));
    f = p[p.length - 1];
    c.moveTo(f.x, f.y);
    for (n = 0; n < g; n++) {
        c.arcTo(m[n].x, m[n].y, p[n].x, p[n].y, d);
    }
    c.closePath();
}
function create_rotated_img(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = Math.sqrt(g.width * g.width + g.height * g.height);
    d2 = e / 2;
    f.width = e;
    f.height = e;
    d.translate(d2, d2);
    d.rotate(c);
    d.drawImage(g, -g.width / 2, -g.height / 2);
    return f;
}
function create_message(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = Math.floor(28 * c);
    var m = Math.floor(20 * c);
    d.font = m + "px Baloo Paaji";
    var p = 8 * c;
    var n = d.measureText(g).width + 2 * p;
    f.width = n;
    f.height = e;
    round_rect(d, 0, 0, n, e, 10 * c);
    d.globalAlpha = .5;
    fill_path(d, "#000");
    d.globalAlpha = 1;
    d.textBaseline = "middle";
    d.font = m + "px Baloo Paaji";
    d.beginPath();
    d.fillStyle = "#FFF";
    d.fillText(g, p, e / 2);
    return f;
}
function create_hurt_player(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 120 * c;
    var m = 110 * c;
    var p = 20 * c;
    var n = 112 * c;
    var r = 82 * c;
    var u = n / 2;
    var q = r / 2;
    var v = 4 * c;
    f.width = e;
    f.height = m;
    d.globalAlpha = 1;
    d.translate(e / 2, m / 2);
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, g, g, v);
    return f;
}
function create_player(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 120 * c;
    var m = 110 * c;
    var p = 20 * c;
    var n = 8 * c;
    var r = 112 * c;
    var u = 82 * c;
    var q = r / 2;
    var v = u / 2;
    var t = 4 * c;
    f.width = e;
    f.height = m;
    d.translate(e / 2, m / 2 + n);
    d.globalAlpha = .5;
    round_rect(d, -q, -v, r, u, p);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    d.translate(0, -n);
    round_rect(d, -q, -v, r, u, p);
    fill_path(d, g[1], g[2], t);
    e = 25 * c;
    m = 20 * c;
    p = 15 * c;
    n = 5 * c;
    r = 28 * c;
    u = 12 * c;
    q = 22 * c;
    v = 12 * c;
    d.save();
    d.translate(-e, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[3]);
    d.restore();
    d.save();
    d.translate(-r, u);
    d.globalAlpha = 1;
    circle(d, 0, 0, n);
    fill_path(d, g[4]);
    d.restore();
    d.save();
    d.translate(e, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[3]);
    d.restore();
    d.save();
    d.translate(q, v);
    d.globalAlpha = 1;
    circle(d, 0, 0, n);
    fill_path(d, g[4]);
    return f;
}
function create_plant_seed(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 40 * c;
    var m = 40 * c;
    g.width = e;
    g.height = m;
    var e = c * e / 2;
    var m = c * m / 2;
    var p = 15 * c;
    d.save();
    d.translate(e, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, f[0]);
    p = 5 * c;
    d.translate(2 * c, 1 * c);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, f[1]);
    d.restore();
    return g;
}
function create_food_plant(c) {
    var g = document.createElement("canvas");
    var f = g.getContext("2d");
    g.width = 200 * c;
    g.height = 200 * c;
    c = create_plant(.35, false, ["#0e3022", "#0b8052", "#077b49"]);
    f.drawImage(c, 10, 10);
    c = create_fruit(.9, false, ["#54318e", "#725ba3"]);
    f.drawImage(c, 21, 20);
    c = create_fruit(.9, false, ["#54318e", "#725ba3"]);
    f.drawImage(c, 38, 28);
    c = create_fruit(.9, false, ["#54318e", "#725ba3"]);
    f.drawImage(c, 15, 37);
    c = create_fruit(.9, false, ["#54318e", "#725ba3"]);
    f.drawImage(c, 32, 45);
    return g;
}
function create_gear(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 100 * c;
    var m = 100 * c;
    f.width = e;
    f.height = m;
    var p = 5 * c;
    var n = 28 * c;
    var r = p / 2;
    var u = n / 2;
    d.translate(e / 2, m / 2);
    for (e = 0; 4 > e; e++) {
        round_rect(d, -r, -u, p, n, 2 * c);
        d.rotate(Math.PI / 4);
        fill_path(d, g);
    }
    d.arc(0, 0, 10 * c, 0, 2 * Math.PI);
    fill_path(d, g);
    d.globalCompositeOperation = "destination-out";
    circle(d, 0, 0, 4 * c);
    d.fill();
    return f;
}
function create_minimap_object(c, g, f, d, e, m, p) {
    p = p === void 0 ? 0 : p;
    for (var n = m == -1 ? 0 : m; n >= p; n--) {
        for (var r = 0; 300 > r; r++) {
            for (var u = 0; 100 > u; u++) {
                var q = MAP.tiles[u][r];
                if (q) {
                    var q = m == -1 ? q[d] : q[d][n];
                    for (var v = 0; v < q.length; v++) {
                        var t = q[v];
                        c.fillStyle = f;
                        circle(c, t.x * g * .0077, t.y * g * .0125, e * g);
                        c.fill();
                    }
                }
            }
        }
    }
}
function create_minimap(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 250 * c;
    f.height = 150 * c;
    d.translate(9 * c, 12 * c);
    d.fillStyle = g[9];
    d.fillRect(5 * c, 0, f.width - 30 * c, f.height - 21 * c);
    d.fillStyle = g[0];
    d.fillRect(0, -3 * c, .915 * f.width, f.height - 21 * c);
    d.fillStyle = g[17];
    d.fillRect(.328 * f.width - c, 0, .66 * f.width - 12 * c, f.height - 25 * c);
    create_minimap_object(d, c, g[17], "so", 3, 6, 0);
    create_minimap_object(d, c, g[5], "t", 2, 5, 4);
    create_minimap_object(d, c, g[6], "t", 3, 3, 2);
    create_minimap_object(d, c, g[7], "t", 4, 1, 0);
    create_minimap_object(d, c, g[8], "b", 3, 3, 2);
    create_minimap_object(d, c, g[9], "b", 4, 1, 0);
    create_minimap_object(d, c, g[2], "s", 2, 2, 2);
    create_minimap_object(d, c, g[3], "s", 3, 1, 1);
    create_minimap_object(d, c, g[4], "s", 4, 0, 0);
    create_minimap_object(d, c, g[10], "g", 2, 2, 2);
    create_minimap_object(d, c, g[11], "g", 3, 1, 1);
    create_minimap_object(d, c, g[12], "g", 4, 0, 0);
    create_minimap_object(d, c, g[1], "p", 4, -1);
    create_minimap_object(d, c, g[25], "dg", 3, 6, 0);
    create_minimap_object(d, c, g[19], "f", 2, 2, 2);
    create_minimap_object(d, c, g[20], "f", 3, 1, 1);
    create_minimap_object(d, c, g[21], "f", 4, 0, 0);
    create_minimap_object(d, c, g[18], "sw", 2, 2, 2);
    create_minimap_object(d, c, g[18], "sw", 2, 1, 1);
    create_minimap_object(d, c, g[18], "sw", 2, 0, 0);
    create_minimap_object(d, c, g[22], "gw", 2, 2, 2);
    create_minimap_object(d, c, g[22], "gw", 3, 1, 1);
    create_minimap_object(d, c, g[22], "gw", 4, 0, 0);
    create_minimap_object(d, c, g[23], "dw", 2, 2, 2);
    create_minimap_object(d, c, g[23], "dw", 3, 1, 1);
    create_minimap_object(d, c, g[23], "dw", 4, 0, 0);
    create_minimap_object(d, c, g[24], "a", 2, 2, 2);
    create_minimap_object(d, c, g[24], "a", 3, 1, 1);
    create_minimap_object(d, c, g[24], "a", 4, 0, 0);
    d.translate(-9 * c, -4 * c);
    round_rect(d, 5 * c, 0, f.width - 10 * c, f.height - 18 * c, 10 * c);
    d.lineWidth = 5 * c;
    d.strokeStyle = g[16];
    d.stroke();
    return f;
}
function create_workbench(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 125 * c;
    var p = 95 * c;
    var n = 10 * c;
    var r = 8 * c;
    var u = 112 * c;
    var q = 82 * c;
    var v = u / 2;
    var t = q / 2;
    var z = 4 * c;
    d.width = m;
    d.height = p;
    e.translate(m / 2 - 4 * c, p / 2 + 4 * c);
    e.globalAlpha = g ? .5 : 1;
    round_rect(e, -v, -t, u, q, n);
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(0, -r);
    round_rect(e, -v, -t, u, q, n);
    fill_path(e, f[1], f[2], z);
    m = 55 * c;
    p = 45 * c;
    n = 5;
    e.translate(-40 * c, -30 * c);
    round_rect(e, 0, 0, m, p, n);
    fill_path(e, f[3]);
    g = create_gear(.7 * c, f[3]);
    e.drawImage(g, 45 * c, -25 * c);
    g = create_gear(.7 * c, f[3]);
    e.drawImage(g, 45 * c, 15 * c);
    g = create_gear(1.2 * c, f[3]);
    e.drawImage(g, 28 * c, -30 * c);
    m = 15 * c;
    p = 70 * c;
    n = 5 * c;
    e.translate(78 * c, -5 * c);
    round_rect(e, 0, 0, m, p, n);
    fill_path(e, f[4]);
    m = 9 * c;
    p = 50 * c;
    n = 3 * c;
    e.translate(-20 * c, 20 * c);
    e.rotate(Math.PI / 5);
    e.globalAlpha = .6;
    round_rect(e, 0, 0, m, p, n);
    fill_path(e, f[5]);
    e.translate(-20 * c, 29 * c);
    e.rotate(Math.PI / 5);
    e.globalAlpha = .6;
    e.beginPath();
    e.lineJoin = "round";
    e.moveTo(0, 0);
    e.lineTo(0, 30 * c);
    e.lineTo(30 * c, 30 * c);
    e.closePath();
    fill_path(e, null, f[5], 8 * c);
    return d;
}
function create_rabbit(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 6 * c;
    f.width = 85 * c;
    f.height = 115 * c;
    d.translate(-130 * c, -60 * c + e);
    d.globalAlpha = .5;
    d.beginPath();
    d.bezierCurveTo(190 * c, 87 * c, 201 * c, 59 * c, 208 * c, 64 * c);
    d.bezierCurveTo(213 * c, 68 * c, 204 * c, 93 * c, 195 * c, 109 * c);
    d.bezierCurveTo(195 * c, 109 * c, 202 * c, 124 * c, 191 * c, 141 * c);
    d.bezierCurveTo(182 * c, 151 * c, 164 * c, 155 * c, 148 * c, 144 * c);
    d.bezierCurveTo(136 * c, 135 * c, 138 * c, 111 * c, 145 * c, 104 * c);
    d.bezierCurveTo(140 * c, 92 * c, 131 * c, 67 * c, 138 * c, 63 * c);
    d.bezierCurveTo(145 * c, 61 * c, 153 * c, 82 * c, 155 * c, 96 * c);
    d.bezierCurveTo(167 * c, 91 * c, 178 * c, 92 * c, 187 * c, 98 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.translate(0, -e);
    d.globalAlpha = 1;
    d.beginPath();
    d.bezierCurveTo(190 * c, 87 * c, 201 * c, 59 * c, 208 * c, 64 * c);
    d.bezierCurveTo(213 * c, 68 * c, 204 * c, 93 * c, 195 * c, 109 * c);
    d.bezierCurveTo(195 * c, 109 * c, 202 * c, 124 * c, 191 * c, 141 * c);
    d.bezierCurveTo(182 * c, 151 * c, 164 * c, 155 * c, 148 * c, 144 * c);
    d.bezierCurveTo(136 * c, 135 * c, 138 * c, 111 * c, 145 * c, 104 * c);
    d.bezierCurveTo(140 * c, 92 * c, 131 * c, 67 * c, 138 * c, 63 * c);
    d.bezierCurveTo(145 * c, 61 * c, 153 * c, 82 * c, 155 * c, 96 * c);
    d.bezierCurveTo(167 * c, 91 * c, 178 * c, 92 * c, 187 * c, 98 * c);
    d.closePath();
    fill_path(d, g[1], g[2], 4);
    var e = 155 * c;
    var m = 133 * c;
    var p = 10 * c;
    var n = 3 * c;
    var r = e + -3 * c;
    var u = m + -5 * c;
    d.save();
    d.translate(e, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[3]);
    d.restore();
    d.save();
    d.translate(r, u);
    d.globalAlpha = 1;
    circle(d, 0, 0, n);
    fill_path(d, g[4]);
    d.restore();
    d.save();
    d.translate(e + 27 * c, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[3]);
    d.restore();
    d.save();
    d.translate(27 * c + r, u);
    d.globalAlpha = 1;
    circle(d, 0, 0, n);
    fill_path(d, g[4]);
    return f;
}
function create_hurt_rabbit(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 4 * c;
    f.width = 85 * c;
    f.height = 115 * c;
    d.translate(-130 * c, -60 * c);
    d.globalAlpha = 1;
    d.beginPath();
    d.bezierCurveTo(190 * c, 87 * c, 201 * c, 59 * c, 208 * c, 64 * c);
    d.bezierCurveTo(213 * c, 68 * c, 204 * c, 93 * c, 195 * c, 109 * c);
    d.bezierCurveTo(195 * c, 109 * c, 202 * c, 124 * c, 191 * c, 141 * c);
    d.bezierCurveTo(182 * c, 151 * c, 164 * c, 155 * c, 148 * c, 144 * c);
    d.bezierCurveTo(136 * c, 135 * c, 138 * c, 111 * c, 145 * c, 104 * c);
    d.bezierCurveTo(140 * c, 92 * c, 131 * c, 67 * c, 138 * c, 63 * c);
    d.bezierCurveTo(145 * c, 61 * c, 153 * c, 82 * c, 155 * c, 96 * c);
    d.bezierCurveTo(167 * c, 91 * c, 178 * c, 92 * c, 187 * c, 98 * c);
    d.closePath();
    fill_path(d, g, g, e);
    return f;
}
function create_hurt_wolf(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 89 * c;
    f.height = 135 * c;
    d.translate(-23 * c, -8 * c);
    d.beginPath();
    d.bezierCurveTo(35 * c, 37 * c, 33 * c, 21 * c, 33 * c, 21 * c);
    d.bezierCurveTo(33 * c, 21 * c, 51 * c, 32 * c, 52 * c, 32 * c);
    d.bezierCurveTo(65 * c, 26 * c, 74 * c, 27 * c, 84 * c, 33 * c);
    d.bezierCurveTo(84 * c, 33 * c, 94 * c, 28 * c, 102 * c, 24 * c);
    d.bezierCurveTo(102 * c, 24 * c, 100 * c, 34 * c, 97 * c, 47 * c);
    d.bezierCurveTo(97 * c, 47 * c, 107 * c, 62 * c, 101 * c, 76 * c);
    d.bezierCurveTo(94 * c, 92 * c, 80 * c, 115 * c, 68 * c, 129 * c);
    d.bezierCurveTo(68 * c, 129 * c, 46 * c, 101 * c, 35 * c, 83 * c);
    d.bezierCurveTo(31 * c, 77 * c, 26 * c, 56 * c, 38 * c, 46 * c);
    d.closePath();
    fill_path(d, g, g, 4);
    return f;
}
function create_wolf(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 8 * c;
    f.width = 89 * c;
    f.height = 135 * c;
    d.translate(-23 * c, -8 * c + e);
    d.globalAlpha = .5;
    d.beginPath();
    d.bezierCurveTo(35 * c, 37 * c, 33 * c, 21 * c, 33 * c, 21 * c);
    d.bezierCurveTo(33 * c, 21 * c, 51 * c, 32 * c, 52 * c, 32 * c);
    d.bezierCurveTo(65 * c, 26 * c, 74 * c, 27 * c, 84 * c, 33 * c);
    d.bezierCurveTo(84 * c, 33 * c, 94 * c, 28 * c, 102 * c, 24 * c);
    d.bezierCurveTo(102 * c, 24 * c, 100 * c, 34 * c, 97 * c, 47 * c);
    d.bezierCurveTo(97 * c, 47 * c, 107 * c, 62 * c, 101 * c, 76 * c);
    d.bezierCurveTo(94 * c, 92 * c, 80 * c, 115 * c, 68 * c, 129 * c);
    d.bezierCurveTo(68 * c, 129 * c, 46 * c, 101 * c, 35 * c, 83 * c);
    d.bezierCurveTo(31 * c, 77 * c, 26 * c, 56 * c, 38 * c, 46 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.translate(0, -e);
    d.globalAlpha = 1;
    d.beginPath();
    d.bezierCurveTo(35 * c, 37 * c, 33 * c, 21 * c, 33 * c, 21 * c);
    d.bezierCurveTo(33 * c, 21 * c, 51 * c, 32 * c, 52 * c, 32 * c);
    d.bezierCurveTo(65 * c, 26 * c, 74 * c, 27 * c, 84 * c, 33 * c);
    d.bezierCurveTo(84 * c, 33 * c, 94 * c, 28 * c, 102 * c, 24 * c);
    d.bezierCurveTo(102 * c, 24 * c, 100 * c, 34 * c, 97 * c, 47 * c);
    d.bezierCurveTo(97 * c, 47 * c, 107 * c, 62 * c, 101 * c, 76 * c);
    d.bezierCurveTo(94 * c, 92 * c, 80 * c, 115 * c, 68 * c, 129 * c);
    d.bezierCurveTo(68 * c, 129 * c, 46 * c, 101 * c, 35 * c, 83 * c);
    d.bezierCurveTo(31 * c, 77 * c, 26 * c, 56 * c, 38 * c, 46 * c);
    d.closePath();
    fill_path(d, g[1], g[2], 4);
    var e = 49 * c;
    var m = 83 * c;
    var p = 8 * c;
    var n = 3 * c;
    var r = e + -3 * c;
    var u = m + -5 * c;
    d.save();
    d.translate(e, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[3]);
    d.restore();
    d.save();
    d.translate(r, u);
    d.globalAlpha = 1;
    circle(d, 0, 0, n);
    fill_path(d, g[4]);
    d.restore();
    d.save();
    d.translate(e + 37 * c, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[3]);
    d.restore();
    d.save();
    d.translate(37 * c + r, u);
    d.globalAlpha = 1;
    circle(d, 0, 0, n);
    fill_path(d, g[4]);
    return f;
}
function create_meat(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 55 * c;
    g.height = 55 * c;
    d.translate(-65 * c, -55 * c + 8 * c);
    d.globalAlpha = 1;
    d.beginPath();
    d.moveTo(95 * c, 60 * c);
    d.bezierCurveTo(107 * c, 62 * c, 110 * c, 73 * c, 107 * c, 79 * c);
    d.bezierCurveTo(104 * c, 85 * c, 85 * c, 93 * c, 81 * c, 88 * c);
    d.bezierCurveTo(74 * c, 80 * c, 85 * c, 60 * c, 95 * c, 60 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 3);
    d.globalAlpha = 1;
    d.beginPath();
    d.moveTo(91 * c, 70 * c);
    d.bezierCurveTo(91 * c, 75 * c, 100 * c, 76 * c, 100 * c, 73 * c);
    d.bezierCurveTo(100 * c, 69 * c, 89 * c, 65 * c, 91 * c, 70 * c);
    d.closePath();
    fill_path(d, f[2], f[3], 3);
    return g;
}
function create_hurt_spider(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 238 * c;
    f.height = 230 * c;
    d.translate(-93 * c, -110 * c);
    circle(d, 213.5 * c, 256.75 * c, 75 * c);
    fill_path(d, g);
    circle(d, 213.5 * c, 175.75 * c, 25 * c);
    fill_path(d, g);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(156.5 * c, 137.75 * c);
    d.bezierCurveTo(170.5 * c, 173.75 * c, 195.5 * c, 177.75 * c, 209.5 * c, 177.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(217.5 * c, 178.75 * c);
    d.bezierCurveTo(251.5 * c, 177.75 * c, 263.5 * c, 153.75 * c, 270.5 * c, 140.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(130.5 * c, 124.75 * c);
    d.bezierCurveTo(153.5 * c, 185.75 * c, 198.5 * c, 185.75 * c, 213.5 * c, 185.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 183.75 * c);
    d.bezierCurveTo(265.5 * c, 192.75 * c, 293.5 * c, 141.75 * c, 297.5 * c, 124.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(107.5 * c, 213.75 * c);
    d.bezierCurveTo(151.5 * c, 190.75 * c, 198.5 * c, 184.75 * c, 210.5 * c, 184.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(212.5 * c, 187.75 * c);
    d.bezierCurveTo(258.5 * c, 182.75 * c, 286.5 * c, 194.75 * c, 314.5 * c, 206.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(102.5 * c, 258.75 * c);
    d.bezierCurveTo(142.5 * c, 200.75 * c, 193.5 * c, 194.75 * c, 211.5 * c, 185.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 192.75 * c);
    d.bezierCurveTo(276.5 * c, 194.75 * c, 306.5 * c, 233.75 * c, 316.5 * c, 246.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(219.5 * c, 158.75 * c);
    d.bezierCurveTo(226.5 * c, 159.75 * c, 227.5 * c, 147.75 * c, 219.5 * c, 145.75 * c);
    d.closePath();
    d.lineWidth = 10 * c;
    d.strokeStyle = g;
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(210.5 * c, 160.75 * c);
    d.bezierCurveTo(203.5 * c, 159.75 * c, 199.5 * c, 146.75 * c, 210.5 * c, 145.75 * c);
    d.closePath();
    d.lineWidth = 10 * c;
    d.strokeStyle = g;
    d.stroke();
    return f;
}
function create_spider(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 238 * c;
    f.height = 230 * c;
    d.translate(-93 * c, -110 * c + 5 * c);
    d.globalAlpha = .3;
    circle(d, 213.5 * c, 256.75 * c, 75 * c);
    fill_path(d, g[5]);
    circle(d, 213.5 * c, 175.75 * c, 25 * c);
    fill_path(d, g[5]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(156.5 * c, 137.75 * c);
    d.bezierCurveTo(170.5 * c, 173.75 * c, 195.5 * c, 177.75 * c, 209.5 * c, 177.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(217.5 * c, 178.75 * c);
    d.bezierCurveTo(251.5 * c, 177.75 * c, 263.5 * c, 153.75 * c, 270.5 * c, 140.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(130.5 * c, 124.75 * c);
    d.bezierCurveTo(153.5 * c, 185.75 * c, 198.5 * c, 185.75 * c, 213.5 * c, 185.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 183.75 * c);
    d.bezierCurveTo(265.5 * c, 192.75 * c, 293.5 * c, 141.75 * c, 297.5 * c, 124.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(107.5 * c, 213.75 * c);
    d.bezierCurveTo(151.5 * c, 190.75 * c, 198.5 * c, 184.75 * c, 210.5 * c, 184.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(212.5 * c, 187.75 * c);
    d.bezierCurveTo(258.5 * c, 182.75 * c, 286.5 * c, 194.75 * c, 314.5 * c, 206.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(102.5 * c, 258.75 * c);
    d.bezierCurveTo(142.5 * c, 200.75 * c, 193.5 * c, 194.75 * c, 211.5 * c, 185.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 192.75 * c);
    d.bezierCurveTo(276.5 * c, 194.75 * c, 306.5 * c, 233.75 * c, 316.5 * c, 246.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[5];
    d.stroke();
    d.translate(0, -5);
    d.globalAlpha = 1;
    circle(d, 213.5 * c, 256.75 * c, 75 * c);
    fill_path(d, g[3]);
    circle(d, 213.5 * c, 175.75 * c, 25 * c);
    fill_path(d, g[3]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(219.5 * c, 158.75 * c);
    d.bezierCurveTo(226.5 * c, 159.75 * c, 227.5 * c, 147.75 * c, 219.5 * c, 145.75 * c);
    d.closePath();
    d.lineWidth = 10 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(210.5 * c, 160.75 * c);
    d.bezierCurveTo(203.5 * c, 159.75 * c, 199.5 * c, 146.75 * c, 210.5 * c, 145.75 * c);
    d.closePath();
    d.lineWidth = 10 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(219.5 * c, 158.75 * c);
    d.bezierCurveTo(226.5 * c, 159.75 * c, 227.5 * c, 147.75 * c, 219.5 * c, 145.75 * c);
    d.closePath();
    d.fillStyle = g[0];
    d.fill();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(210.5 * c, 160.75 * c);
    d.bezierCurveTo(203.5 * c, 159.75 * c, 199.5 * c, 146.75 * c, 210.5 * c, 145.75 * c);
    d.closePath();
    d.fillStyle = g[0];
    d.fill();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(156.5 * c, 137.75 * c);
    d.bezierCurveTo(170.5 * c, 173.75 * c, 195.5 * c, 177.75 * c, 209.5 * c, 177.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(217.5 * c, 178.75 * c);
    d.bezierCurveTo(251.5 * c, 177.75 * c, 263.5 * c, 153.75 * c, 270.5 * c, 140.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(130.5 * c, 124.75 * c);
    d.bezierCurveTo(153.5 * c, 185.75 * c, 198.5 * c, 185.75 * c, 213.5 * c, 185.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 183.75 * c);
    d.bezierCurveTo(265.5 * c, 192.75 * c, 293.5 * c, 141.75 * c, 297.5 * c, 124.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(107.5 * c, 213.75 * c);
    d.bezierCurveTo(151.5 * c, 190.75 * c, 198.5 * c, 184.75 * c, 210.5 * c, 184.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(212.5 * c, 187.75 * c);
    d.bezierCurveTo(258.5 * c, 182.75 * c, 286.5 * c, 194.75 * c, 314.5 * c, 206.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(102.5 * c, 258.75 * c);
    d.bezierCurveTo(142.5 * c, 200.75 * c, 193.5 * c, 194.75 * c, 211.5 * c, 185.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 192.75 * c);
    d.bezierCurveTo(276.5 * c, 194.75 * c, 306.5 * c, 233.75 * c, 316.5 * c, 246.75 * c);
    d.lineWidth = 17 * c;
    d.strokeStyle = g[3];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(156.5 * c, 137.75 * c);
    d.bezierCurveTo(170.5 * c, 173.75 * c, 195.5 * c, 177.75 * c, 209.5 * c, 177.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(217.5 * c, 178.75 * c);
    d.bezierCurveTo(251.5 * c, 177.75 * c, 263.5 * c, 153.75 * c, 270.5 * c, 140.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(130.5 * c, 124.75 * c);
    d.bezierCurveTo(153.5 * c, 185.75 * c, 198.5 * c, 185.75 * c, 213.5 * c, 185.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 183.75 * c);
    d.bezierCurveTo(265.5 * c, 192.75 * c, 293.5 * c, 141.75 * c, 297.5 * c, 124.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(107.5 * c, 213.75 * c);
    d.bezierCurveTo(151.5 * c, 190.75 * c, 198.5 * c, 184.75 * c, 210.5 * c, 184.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(212.5 * c, 187.75 * c);
    d.bezierCurveTo(258.5 * c, 182.75 * c, 286.5 * c, 194.75 * c, 314.5 * c, 206.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(102.5 * c, 258.75 * c);
    d.bezierCurveTo(142.5 * c, 200.75 * c, 193.5 * c, 194.75 * c, 211.5 * c, 185.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(214.5 * c, 192.75 * c);
    d.bezierCurveTo(276.5 * c, 194.75 * c, 306.5 * c, 233.75 * c, 316.5 * c, 246.75 * c);
    d.lineWidth = 8 * c;
    d.strokeStyle = g[0];
    d.stroke();
    circle(d, 213.5 * c, 256.75 * c, 70 * c);
    fill_path(d, g[0]);
    circle(d, 213.5 * c, 175.75 * c, 20 * c);
    fill_path(d, g[0]);
    circle(d, 222 * c, 166 * c, 5 * c);
    d.fillStyle = g[2];
    d.fill();
    circle(d, 205 * c, 166 * c, 5 * c);
    d.fillStyle = g[2];
    d.fill();
    circle(d, 206.2 * c, 167 * c, 2.5 * c);
    d.fillStyle = g[4];
    d.fill();
    circle(d, 223.2 * c, 167 * c, 2.5 * c);
    d.fillStyle = g[4];
    d.fill();
    d.save();
    d.translate(213.5 * c, 293.75 * c);
    d.rotate(.76);
    round_rect(d, -22 * c, -21 * c, 44 * c, 42 * c, 6 * c);
    d.restore();
    d.fillStyle = g[1];
    d.fill();
    d.save();
    d.translate(212.5 * c, 258.25 * c);
    d.rotate(.8);
    round_rect(d, -15 * c, -14.5 * c, 30 * c, 29 * c, 6 * c);
    d.restore();
    d.fillStyle = g[1];
    d.fill();
    return f;
}
function create_web(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 450 * c;
    f.height = 470 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(226.5 * c, 91.546875 * c);
    d.bezierCurveTo(254.5 * c, 115.546875 * c, 261.5 * c, 115.546875 * c, 294.5 * c, 109.546875 * c);
    d.bezierCurveTo(299.5 * c, 141.546875 * c, 315.5 * c, 151.546875 * c, 344.5 * c, 158.546875 * c);
    d.bezierCurveTo(330.5 * c, 195.546875 * c, 341.5 * c, 207.546875 * c, 361.5 * c, 226.546875 * c);
    d.bezierCurveTo(331.5 * c, 251.546875 * c, 335.5 * c, 270.546875 * c, 342.5 * c, 295.546875 * c);
    d.bezierCurveTo(300.5 * c, 296.546875 * c, 293.5 * c, 325.546875 * c, 292.5 * c, 344.546875 * c);
    d.bezierCurveTo(257.5 * c, 326.546875 * c, 242.5 * c, 338.546875 * c, 224.5 * c, 361.546875 * c);
    d.bezierCurveTo(200.5 * c, 329.546875 * c, 180.5 * c, 334.546875 * c, 155.5 * c, 341.546875 * c);
    d.bezierCurveTo(146.5 * c, 307.546875 * c, 140.5 * c, 302.546875 * c, 107.5 * c, 292.546875 * c);
    d.bezierCurveTo(117.5 * c, 253.546875 * c, 109.5 * c, 244.546875 * c, 89.5 * c, 224.546875 * c);
    d.bezierCurveTo(118.5 * c, 191.546875 * c, 114.5 * c, 182.546875 * c, 108.5 * c, 156.546875 * c);
    d.bezierCurveTo(143.5 * c, 149.546875 * c, 150.5 * c, 136.546875 * c, 157.5 * c, 106.546875 * c);
    d.bezierCurveTo(202.5 * c, 120.546875 * c, 211.5 * c, 103.546875 * c, 228.5 * c, 91.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(224.5 * c, 129.546875 * c);
    d.bezierCurveTo(247.5 * c, 147.546875 * c, 252.5 * c, 143.546875 * c, 274.5 * c, 141.546875 * c);
    d.bezierCurveTo(279.5 * c, 163.546875 * c, 289.5 * c, 168.546875 * c, 311.5 * c, 178.546875 * c);
    d.bezierCurveTo(301.5 * c, 199.546875 * c, 307.5 * c, 213.546875 * c, 323.5 * c, 226.546875 * c);
    d.bezierCurveTo(303.5 * c, 240.546875 * c, 303.5 * c, 255.546875 * c, 312.5 * c, 275.546875 * c);
    d.bezierCurveTo(281.5 * c, 278.546875 * c, 276.5 * c, 291.546875 * c, 272.5 * c, 313.546875 * c);
    d.bezierCurveTo(248.5 * c, 301.546875 * c, 239.5 * c, 310.546875 * c, 224.5 * c, 324.546875 * c);
    d.bezierCurveTo(211.5 * c, 304.546875 * c, 199.5 * c, 301.546875 * c, 176.5 * c, 309.546875 * c);
    d.bezierCurveTo(165.5 * c, 276.546875 * c, 159.5 * c, 275.546875 * c, 138.5 * c, 274.546875 * c);
    d.bezierCurveTo(148.5 * c, 248.546875 * c, 140.5 * c, 237.546875 * c, 125.5 * c, 225.546875 * c);
    d.bezierCurveTo(145.5 * c, 205.546875 * c, 146.5 * c, 195.546875 * c, 142.5 * c, 176.546875 * c);
    d.bezierCurveTo(173.5 * c, 164.546875 * c, 173.5 * c, 155.546875 * c, 178.5 * c, 140.546875 * c);
    d.bezierCurveTo(214.5 * c, 143.546875 * c, 214.5 * c, 135.546875 * c, 226.5 * c, 129.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(224.5 * c, 160.546875 * c);
    d.bezierCurveTo(236.5 * c, 168.546875 * c, 239.5 * c, 168.546875 * c, 258.5 * c, 168.546875 * c);
    d.bezierCurveTo(261.5 * c, 185.546875 * c, 268.5 * c, 187.546875 * c, 282.5 * c, 192.546875 * c);
    d.bezierCurveTo(277.5 * c, 208.546875 * c, 283.5 * c, 216.546875 * c, 289.5 * c, 228.546875 * c);
    d.bezierCurveTo(277.5 * c, 243.546875 * c, 280.5 * c, 253.546875 * c, 281.5 * c, 260.546875 * c);
    d.bezierCurveTo(264.5 * c, 260.546875 * c, 259.5 * c, 269.546875 * c, 256.5 * c, 283.546875 * c);
    d.bezierCurveTo(244.5 * c, 276.546875 * c, 232.5 * c, 283.546875 * c, 223.5 * c, 291.546875 * c);
    d.bezierCurveTo(213.5 * c, 276.546875 * c, 205.5 * c, 278.546875 * c, 190.5 * c, 281.546875 * c);
    d.bezierCurveTo(181.5 * c, 262.546875 * c, 173.5 * c, 259.546875 * c, 165.5 * c, 258.546875 * c);
    d.bezierCurveTo(169.5 * c, 239.546875 * c, 167.5 * c, 233.546875 * c, 157.5 * c, 225.546875 * c);
    d.bezierCurveTo(169.5 * c, 208.546875 * c, 170.5 * c, 203.546875 * c, 168.5 * c, 192.546875 * c);
    d.bezierCurveTo(181.5 * c, 187.546875 * c, 188.5 * c, 179.546875 * c, 192.5 * c, 168.546875 * c);
    d.bezierCurveTo(216.5 * c, 170.546875 * c, 218.5 * c, 163.546875 * c, 225.5 * c, 160.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(205.5 * c, 194.546875 * c);
    d.bezierCurveTo(216.5 * c, 192.546875 * c, 219.5 * c, 191.546875 * c, 225.5 * c, 185.546875 * c);
    d.bezierCurveTo(232.5 * c, 193.546875 * c, 237.5 * c, 191.546875 * c, 246.5 * c, 192.546875 * c);
    d.bezierCurveTo(249.5 * c, 202.546875 * c, 253.5 * c, 205.546875 * c, 258.5 * c, 207.546875 * c);
    d.bezierCurveTo(259.5 * c, 222.546875 * c, 256.5 * c, 223.546875 * c, 265.5 * c, 226.546875 * c);
    d.bezierCurveTo(256.5 * c, 231.546875 * c, 255.5 * c, 241.546875 * c, 259.5 * c, 248.546875 * c);
    d.bezierCurveTo(250.5 * c, 245.546875 * c, 245.5 * c, 252.546875 * c, 243.5 * c, 260.546875 * c);
    d.bezierCurveTo(234.5 * c, 256.546875 * c, 229.5 * c, 258.546875 * c, 223.5 * c, 265.546875 * c);
    d.bezierCurveTo(218.5 * c, 255.546875 * c, 213.5 * c, 257.546875 * c, 204.5 * c, 261.546875 * c);
    d.bezierCurveTo(203.5 * c, 251.546875 * c, 198.5 * c, 248.546875 * c, 189.5 * c, 244.546875 * c);
    d.bezierCurveTo(194.5 * c, 237.546875 * c, 192.5 * c, 231.546875 * c, 184.5 * c, 225.546875 * c);
    d.bezierCurveTo(191.5 * c, 211.546875 * c, 192.5 * c, 209.546875 * c, 190.5 * c, 204.546875 * c);
    d.bezierCurveTo(200.5 * c, 204.546875 * c, 204.5 * c, 198.546875 * c, 207.5 * c, 194.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(149.5 * c, 93.546875 * c);
    d.bezierCurveTo(287.5 * c, 332.546875 * c, 226 * c, 225.546875 * c, 302.5 * c, 357.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(224.5 * c, 66.546875 * c);
    d.bezierCurveTo(224.5 * c, 223.546875 * c, 224.5 * c, 223.546875 * c, 224.5 * c, 380.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(302.5 * c, 88.546875 * c);
    d.bezierCurveTo(222.5 * c, 227.546875 * c, 222.5 * c, 227.546875 * c, 142.5 * c, 366.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(361.5 * c, 147.546875 * c);
    d.bezierCurveTo(223 * c, 226.546875 * c, 223 * c, 226.546875 * c, 84.5 * c, 305.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(379.5 * c, 225.546875 * c);
    d.bezierCurveTo(221 * c, 225.546875 * c, 221 * c, 225.546875 * c, 62.5 * c, 225.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(90.5 * c, 147.546875 * c);
    d.bezierCurveTo(226.5 * c, 226.546875 * c, 226.5 * c, 226.546875 * c, 362.5 * c, 305.546875 * c);
    d.closePath();
    fill_path(d, void 0, g[0], 4);
    return f;
}
function create_cord(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 75 * c;
    g.height = 55 * c;
    d.translate(-30 * c, -40 * c);
    d.globalAlpha = 1;
    d.beginPath();
    d.bezierCurveTo(67 * c, 56 * c, 72 * c, 71 * c, 72 * c, 71 * c);
    d.bezierCurveTo(72 * c, 71 * c, 84 * c, 70 * c, 75 * c, 82 * c);
    d.bezierCurveTo(70 * c, 88 * c, 61 * c, 89 * c, 58 * c, 89 * c);
    d.bezierCurveTo(55 * c, 89 * c, 40 * c, 89 * c, 46 * c, 77 * c);
    d.bezierCurveTo(46 * c, 77 * c, 43 * c, 63 * c, 43 * c, 63 * c);
    d.bezierCurveTo(35 * c, 61 * c, 35 * c, 53 * c, 42 * c, 47 * c);
    d.bezierCurveTo(48 * c, 42 * c, 62 * c, 41 * c, 66 * c, 43 * c);
    d.bezierCurveTo(70 * c, 45 * c, 72 * c, 48 * c, 67 * c, 56 * c);
    d.closePath();
    fill_path(d, f[0]);
    d.beginPath();
    d.bezierCurveTo(68 * c, 61 * c, 72 * c, 76 * c, 72 * c, 76 * c);
    d.bezierCurveTo(65 * c, 85 * c, 61 * c, 85 * c, 49 * c, 83 * c);
    d.bezierCurveTo(49 * c, 83 * c, 44 * c, 63 * c, 44 * c, 63 * c);
    d.bezierCurveTo(54 * c, 63 * c, 60 * c, 63 * c, 67 * c, 55 * c);
    d.closePath();
    fill_path(d, f[1]);
    d.beginPath();
    d.moveTo(69 * c, 65 * c);
    d.bezierCurveTo(70 * c, 61 * c, 81 * c, 66 * c, 86 * c, 66 * c);
    d.bezierCurveTo(90 * c, 66 * c, 97 * c, 63 * c, 97 * c, 56 * c);
    d.bezierCurveTo(97 * c, 50 * c, 93 * c, 47 * c, 88 * c, 44 * c);
    fill_path(d, false, f[1], 2);
    d.beginPath();
    d.moveTo(50 * c, 48 * c);
    d.bezierCurveTo(43 * c, 52 * c, 50 * c, 54 * c, 51 * c, 54 * c);
    d.bezierCurveTo(54 * c, 54 * c, 59 * c, 52 * c, 59 * c, 49 * c);
    d.bezierCurveTo(59 * c, 48 * c, 55 * c, 46 * c, 50 * c, 48 * c);
    fill_path(d, f[2]);
    return g;
}
function create_bandage(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 195 * c;
    var m = 190 * c;
    g.width = e;
    g.height = m;
    var p = 10 * c;
    var n = 35 * c;
    var r = 150 * c;
    var u = n / 2;
    var q = r / 2;
    var v = 4 * c;
    d.translate(e / 2 - 5 * c, m / 2 - 5 * c);
    d.rotate(-Math.PI / 1.25);
    d.globalAlpha = 1;
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], v);
    d.translate(0, 0);
    d.rotate(Math.PI / 3);
    d.globalAlpha = 1;
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], v);
    d.translate(0, 5);
    round_rect(d, -u / 2, -q / 2, n / 2, r / 3, p - 2);
    fill_path(d, f[1]);
    return g;
}
function create_craft_button(c, g, f, d, e) {
    var m = document.createElement("canvas");
    var p = m.getContext("2d");
    var n = 70 * c;
    var r = 70 * c;
    var u = 10 * c;
    var q = 5 * c;
    m.width = n;
    m.height = r + q;
    for (var v = 0; v < g.length; v++) {
        var t = g[v];
        p.globalAlpha = t.a;
        var z = t.f(f, false, t.c);
        p.save();
        p.translate(n / 2 + t.x * c, r / 2 + t.y * c);
        p.rotate(t.r);
        p.drawImage(z, -z.width / 2, -z.height / 2);
        p.restore();
    }
    c = [];
    for (v = 0; v < d.length; v++) {
        g = document.createElement("canvas");
        f = g.getContext("2d");
        g.width = n;
        g.height = r + q;
        f.globalAlpha = e / 2;
        if (v == 2) {
            round_rect(f, 0, q, n, r, u);
        } else {
            round_rect(f, 0, 0, n, r + q, u);
        }
        fill_path(f, "#081a19");
        f.globalAlpha = e;
        if (v == 2) {
            round_rect(f, 0, q, n, r, u);
        } else {
            round_rect(f, 0, 0, n, r, u);
        }
        fill_path(f, d[v]);
        f.globalAlpha = 1;
        if (v == 2) {
            f.drawImage(m, 0, q);
        } else {
            f.drawImage(m, 0, 0);
        }
        c.push(CTI(g));
    }
    return c;
}
function create_big_fire_wood(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 140 * c;
    var m = 90 * c;
    g.width = 193 * c;
    g.height = 198 * c;
    var p = 10 * c;
    var n = 25 * c;
    var r = 180 * c;
    var u = n / 2;
    var q = r / 2;
    var v = 4 * c;
    d.translate(-25 * c, 1 * c);
    d.translate(e, m);
    d.rotate(-Math.PI / 5);
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], v);
    d.translate(-30 * c, -25 * c);
    d.rotate(Math.PI / 3);
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], v);
    d.translate(35 * c, 30 * c);
    d.rotate(Math.PI / 3);
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], v);
    return g;
}
function create_fire(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 145 * c;
    var m = 145 * c;
    g.width = e;
    g.height = m;
    var p = 70 * c;
    d.translate(e / 2, m / 2);
    d.globalAlpha = .4;
    circle(d, 0, 0, p);
    fill_path(d, f[0]);
    p = 50 * c;
    d.translate(0, 0);
    d.globalAlpha = .8;
    circle(d, 0, 0, p);
    fill_path(d, f[0]);
    p = 35 * c;
    d.translate(0, 0);
    d.globalAlpha = .8;
    circle(d, 0, 0, p);
    fill_path(d, f[1]);
    p = 20 * c;
    d.translate(0, 0);
    d.globalAlpha = .8;
    circle(d, 0, 0, p);
    fill_path(d, f[2]);
    return g;
}
function create_wood_fire(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 135 * c;
    var m = 190 * c;
    g.width = e;
    g.height = m;
    var p = 10 * c;
    var n = 25 * c;
    var r = 180 * c;
    var u = n / 2;
    var q = r / 2;
    c *= 4;
    d.translate(e / 2, m / 2);
    d.rotate(-Math.PI / 5);
    d.globalAlpha = 1;
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], c);
    d.translate(0, 0);
    d.rotate(Math.PI / 5);
    d.globalAlpha = 1;
    round_rect(d, -u, -q, n, r, p);
    fill_path(d, f[0], f[1], c);
    return g;
}
function create_ground_fire(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 205 * c;
    var m = 205 * c;
    g.width = e;
    g.height = m;
    c *= 100;
    d.translate(e / 2, m / 2);
    d.globalAlpha = 1;
    circle(d, 0, 0, c);
    fill_path(d, f[0]);
    return g;
}
function create_halo_fire(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 370 * c;
    var m = 370 * c;
    g.width = e;
    g.height = m;
    d.globalAlpha = .2;
    circle(d, e / 2, m / 2, 180 * c);
    fill_path(d, f[0]);
    return g;
}
function create_hand(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 220 * c;
    var m = 220 * c;
    var p = 16 * c;
    var n = 4 * c;
    f.width = e;
    f.height = m;
    d.translate(e / 2, m / 2);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, g[0], g[1], n);
    return f;
}
function create_hand_shadow(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = 220 * c;
    var m = 220 * c;
    var p = 16 * c;
    f.width = e;
    f.height = m;
    d.translate(e / 2, m / 2);
    d.globalAlpha = .5;
    circle(d, 0, 0, p);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    return f;
}
function create_apricot_tree(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 210 * c;
    var p = 205 * c;
    var n = 30 * c;
    var r = 20 * c;
    var u = 200 * c;
    var q = 180 * c;
    var v = u / 2;
    var t = q / 2;
    d.width = m;
    d.height = p;
    e.translate(m / 2, p / 2 - 8 * c);
    e.globalAlpha = .5;
    round_rect(e, -v, -t, u, q + r, n);
    fill_path(e, g[0]);
    if (f) {
        e.rotate(Math.PI);
    }
    e.globalAlpha = 1;
    round_rect(e, -v, -t, u, q, n);
    fill_path(e, g[1], g[2], 4);
    e.globalAlpha = 1;
    round_rect(e, -v + 35 * c, -t + 20 * c, u - 50 * c, q - 50 * c, n - 10 * c);
    fill_path(e, g[3]);
    return d;
}
function create_tree_branch(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 450 * c;
    var p = 145 * c;
    var n = m / 2;
    var r = p / 2;
    var u = 10 * c;
    var q = 300 * c;
    var v = 30 * c;
    var t = q / 2;
    var z = v / 2;
    if (f) {
        d.width = 145 * c;
        d.height = 450 * c;
        e.rotate(Math.PI / 2);
        e.save();
        e.globalAlpha = .5;
        round_rect(e, 100 * c, -110 * c, q, v, u);
        fill_path(e, g[0]);
        e.translate(178 * c, -98 * c);
        round_rect(e, -t, -z - 6 * c, 100 * c, 100 * c, u);
        fill_path(e, g[0]);
        e.translate(-50 * c, 5 * c);
        round_rect(e, 220 * c, -15 * c, 90 * c, 90 * c, u);
        fill_path(e, g[0]);
        e.restore();
        e.save();
        e.globalAlpha = 1;
        e.translate(250 * c, -63 * c);
        round_rect(e, -t - 20 * c, -z, q, v, u);
        fill_path(e, g[1], g[2], 4);
        e.translate(-70 * c, -40 * c);
        round_rect(e, -t - 20 * c, -z, 100 * c, 100 * c, u);
        fill_path(e, g[3], g[4], 4);
        e.translate(-70 * c, 15 * c);
        round_rect(e, 220 * c, -22 * c, 90 * c, 90 * c, u);
        fill_path(e, g[3], g[4], 4);
        round_rect(e, 230 * c, -12 * c, 55 * c, 55 * c, u);
        fill_path(e, g[5]);
        e.translate(-70 * c, 0);
        round_rect(e, -15 * c, -2 * c, 60 * c, 60 * c, u);
    } else {
        d.width = m;
        d.height = p;
        e.save();
        e.globalAlpha = .5;
        e.translate(n, r + 10 * c);
        round_rect(e, -t, -z, q, v, u);
        fill_path(e, g[0]);
        e.translate(-65 * c, -25 * c);
        round_rect(e, -t, -z - 6 * c, 100 * c, 100 * c, 15 * c);
        fill_path(e, g[0]);
        e.translate(-35 * c, -5 * c);
        round_rect(e, 220 * c, -15 * c, 90 * c, 90 * c, 15 * c);
        fill_path(e, g[0]);
        e.restore();
        e.save();
        e.globalAlpha = 1;
        e.translate(240 * c, 70 * c);
        round_rect(e, -t, -z, q, v, u);
        fill_path(e, g[1], g[2], 4);
        e.translate(-60 * c, -40 * c);
        round_rect(e, -t - 20 * c, -z, 100 * c, 100 * c, 15 * c);
        fill_path(e, g[3], g[4], 4);
        e.translate(-55 * c, 10 * c);
        round_rect(e, 220 * c, -22 * c, 90 * c, 90 * c, 15 * c);
        fill_path(e, g[3], g[4], 4);
        round_rect(e, 240 * c, -12 * c, 55 * c, 55 * c, 12 * c);
        fill_path(e, g[5]);
        e.translate(45 * c, 0 * c);
        round_rect(e, -145 * c, -2 * c, 60 * c, 60 * c, 12 * c);
    }
    fill_path(e, g[5]);
    e.restore();
    return d;
}
function create_apricot_forest(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = Math.max(g.width, c.width);
    var m = Math.max(g.height, c.height);
    f.width = e;
    f.height = m;
    d.drawImage(c, (e - c.width) / 2, (m - c.height) / 2);
    d.drawImage(g, (e - g.width) / 2, (m - g.height) / 2);
    return f;
}
function create_pickaxe(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 105 * c;
    var p = 125 * c;
    var n = 4 * c;
    var r = 10 * c;
    var u = 5 * c;
    var q = 10 * c;
    var v = 110 * c;
    var t = q / 2;
    var z = v / 2;
    d.width = m;
    d.height = p;
    e.save();
    e.globalAlpha = g ? .5 : 1;
    e.translate(m / 2 + 8 * c, p / 2 + u);
    round_rect(e, -t, -z, q, v, r);
    if (g) {
        fill_path(e, f[0]);
    } else {
        fill_path(e, f[1]);
    }
    e.translate(-130 * c + u, -128 * c + u);
    e.beginPath();
    e.bezierCurveTo(159 * c, 93 * c, 156 * c, 99 * c, 154 * c, 102 * c);
    e.bezierCurveTo(128 * c, 92 * c, 90 * c, 93 * c, 72 * c, 96 * c);
    e.bezierCurveTo(68 * c, 84 * c, 143 * c, 73 * c, 162 * c, 86 * c);
    e.closePath();
    fill_path(e, f[2]);
    e.restore();
    e.translate(m / 2 + 8, p / 2);
    e.globalAlpha = 1;
    round_rect(e, -t, -z, q, v, r);
    fill_path(e, f[3], f[4], n);
    e.translate(-130 * c, -125 * c);
    e.beginPath();
    e.bezierCurveTo(159 * c, 93 * c, 156 * c, 99 * c, 154 * c, 102 * c);
    e.bezierCurveTo(128 * c, 92 * c, 90 * c, 93 * c, 72 * c, 96 * c);
    e.bezierCurveTo(68 * c, 84 * c, 143 * c, 73 * c, 162 * c, 86 * c);
    e.closePath();
    fill_path(e, f[5], f[6], n);
    return d;
}
function create_sword(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 100 * c;
    d.height = 250 * c;
    e.translate(-135 * c, -75 * c);
    e.globalAlpha = g ? .8 : 1;
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(178.5 * c, 238.03125 * c);
    e.bezierCurveTo(177 * c, 175.03125 * c, 177 * c, 175.03125 * c, 175.5 * c, 112.03125 * c);
    e.bezierCurveTo(184.5 * c, 100.53125 * c, 184.5 * c, 100.53125 * c, 193.5 * c, 89.03125 * c);
    e.bezierCurveTo(202 * c, 100.03125 * c, 202 * c, 100.03125 * c, 210.5 * c, 111.03125 * c);
    e.bezierCurveTo(209.5 * c, 174.03125 * c, 209.5 * c, 174.03125 * c, 208.5 * c, 237.03125 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(155.5 * c, 239.03125 * c);
    e.bezierCurveTo(194 * c, 238.53125 * c, 194 * c, 238.53125 * c, 232.5 * c, 238.03125 * c);
    e.bezierCurveTo(232.5 * c, 243.03125 * c, 232.5 * c, 243.03125 * c, 232.5 * c, 248.03125 * c);
    e.bezierCurveTo(194 * c, 248.53125 * c, 194 * c, 248.53125 * c, 155.5 * c, 249.03125 * c);
    e.closePath();
    fill_path(e, f[0]);
    circle(e, 160.5 * c, 243.03125 * c, 7 * c);
    fill_path(e, f[0]);
    circle(e, 227.5 * c, 242.03125 * c, 7 * c);
    fill_path(e, f[0]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(185.5 * c, 253.03125 * c);
    e.bezierCurveTo(193.5 * c, 253.03125 * c, 193.5 * c, 253.03125 * c, 201.5 * c, 253.03125 * c);
    e.bezierCurveTo(201.5 * c, 276.03125 * c, 201.5 * c, 276.03125 * c, 201.5 * c, 299.03125 * c);
    e.bezierCurveTo(194.5 * c, 299.03125 * c, 194.5 * c, 299.03125 * c, 187.5 * c, 299.03125 * c);
    e.closePath();
    fill_path(e, f[0], f[0], 5 * c);
    circle(e, 194 * c, 298 * c, 9 * c);
    fill_path(e, f[0], f[0], 5 * c);
    e.globalAlpha = 1;
    e.translate(-10 * c, 10 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(178.5 * c, 238.03125 * c);
    e.bezierCurveTo(177 * c, 175.03125 * c, 177 * c, 175.03125 * c, 175.5 * c, 112.03125 * c);
    e.bezierCurveTo(184.5 * c, 100.53125 * c, 184.5 * c, 100.53125 * c, 193.5 * c, 89.03125 * c);
    e.bezierCurveTo(202 * c, 100.03125 * c, 202 * c, 100.03125 * c, 210.5 * c, 111.03125 * c);
    e.bezierCurveTo(209.5 * c, 174.03125 * c, 209.5 * c, 174.03125 * c, 208.5 * c, 237.03125 * c);
    e.closePath();
    fill_path(e, f[3], f[4], 5 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(155.5 * c, 239.03125 * c);
    e.bezierCurveTo(194 * c, 238.53125 * c, 194 * c, 238.53125 * c, 232.5 * c, 238.03125 * c);
    e.bezierCurveTo(232.5 * c, 243.03125 * c, 232.5 * c, 243.03125 * c, 232.5 * c, 248.03125 * c);
    e.bezierCurveTo(194 * c, 248.53125 * c, 194 * c, 248.53125 * c, 155.5 * c, 249.03125 * c);
    e.closePath();
    fill_path(e, f[1], f[2], 5 * c);
    circle(e, 160.5 * c, 243.03125 * c, 7 * c);
    fill_path(e, f[1], f[2], 5 * c);
    circle(e, 227.5 * c, 242.03125 * c, 7 * c);
    fill_path(e, f[1], f[2], 5 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(185.5 * c, 253.03125 * c);
    e.bezierCurveTo(193.5 * c, 253.03125 * c, 193.5 * c, 253.03125 * c, 201.5 * c, 253.03125 * c);
    e.bezierCurveTo(201.5 * c, 276.03125 * c, 201.5 * c, 276.03125 * c, 201.5 * c, 299.03125 * c);
    e.bezierCurveTo(194.5 * c, 299.03125 * c, 194.5 * c, 299.03125 * c, 187.5 * c, 299.03125 * c);
    e.closePath();
    fill_path(e, f[1], f[2], 7 * c);
    circle(e, 194 * c, 298 * c, 9 * c);
    fill_path(e, f[1], f[2], 7 * c);
    return d;
}
function create_seed(c) {
    var g = document.createElement("canvas");
    var f = g.getContext("2d");
    var d = 4 * c;
    var e = 5 * c;
    g.width = 70 * c;
    g.height = 90 * c;
    f.save();
    f.translate(-80 * c, -70 * c + e);
    f.globalAlpha = .5;
    f.beginPath();
    f.bezierCurveTo(130 * c, 79 * c, 132 * c, 86 * c, 130 * c, 93 * c);
    f.bezierCurveTo(128 * c, 100 * c, 121 * c, 107 * c, 120 * c, 107 * c);
    f.bezierCurveTo(120 * c, 107 * c, 115 * c, 98 * c, 115 * c, 92 * c);
    f.bezierCurveTo(115 * c, 86 * c, 119 * c, 76 * c, 127 * c, 73 * c);
    f.closePath();
    fill_path(f, "#0d1b1c");
    f.restore();
    f.save();
    f.translate(-80 * c, -70 * c + e);
    f.globalAlpha = .5;
    f.beginPath();
    f.bezierCurveTo(112 * c, 109 * c, 111 * c, 100 * c, 106 * c, 93 * c);
    f.bezierCurveTo(104 * c, 90 * c, 91 * c, 87 * c, 91 * c, 87 * c);
    f.bezierCurveTo(91 * c, 88 * c, 91 * c, 96 * c, 94 * c, 102 * c);
    f.bezierCurveTo(97 * c, 108 * c, 106 * c, 112 * c, 113 * c, 112 * c);
    f.closePath();
    fill_path(f, "#0d1b1c");
    f.restore();
    f.save();
    f.translate(-80 * c, -70 * c + e);
    f.globalAlpha = .5;
    f.beginPath();
    f.bezierCurveTo(108 * c, 120 * c, 100 * c, 119 * c, 91 * c, 127 * c);
    f.bezierCurveTo(83 * c, 134 * c, 82 * c, 146 * c, 83 * c, 146 * c);
    f.bezierCurveTo(84 * c, 146 * c, 98 * c, 142 * c, 103 * c, 138 * c);
    f.bezierCurveTo(107 * c, 135 * c, 110 * c, 130 * c, 112 * c, 121 * c);
    f.closePath();
    fill_path(f, "#0d1b1c");
    f.restore();
    f.save();
    f.translate(3 * c, -93 * c + e);
    f.rotate(Math.PI / 5);
    f.globalAlpha = .5;
    f.beginPath();
    f.bezierCurveTo(130 * c, 79 * c, 132 * c, 86 * c, 130 * c, 93 * c);
    f.bezierCurveTo(128 * c, 100 * c, 121 * c, 107 * c, 120 * c, 107 * c);
    f.bezierCurveTo(120 * c, 107 * c, 115 * c, 98 * c, 115 * c, 92 * c);
    f.bezierCurveTo(115 * c, 86 * c, 119 * c, 76 * c, 127 * c, 73 * c);
    f.closePath();
    fill_path(f, "#0d1b1c");
    f.restore();
    f.save();
    f.translate(-80 * c, -70 * c);
    f.globalAlpha = 1;
    f.beginPath();
    f.bezierCurveTo(130 * c, 79 * c, 132 * c, 86 * c, 130 * c, 93 * c);
    f.bezierCurveTo(128 * c, 100 * c, 121 * c, 107 * c, 120 * c, 107 * c);
    f.bezierCurveTo(120 * c, 107 * c, 115 * c, 98 * c, 115 * c, 92 * c);
    f.bezierCurveTo(115 * c, 86 * c, 119 * c, 76 * c, 127 * c, 73 * c);
    f.closePath();
    fill_path(f, "#493d36", "#332b28", d);
    f.restore();
    f.save();
    f.translate(-80 * c, -70 * c);
    f.globalAlpha = 1;
    f.beginPath();
    f.bezierCurveTo(112 * c, 109 * c, 111 * c, 100 * c, 106 * c, 93 * c);
    f.bezierCurveTo(104 * c, 90 * c, 91 * c, 87 * c, 91 * c, 87 * c);
    f.bezierCurveTo(91 * c, 88 * c, 91 * c, 96 * c, 94 * c, 102 * c);
    f.bezierCurveTo(97 * c, 108 * c, 106 * c, 112 * c, 113 * c, 112 * c);
    f.closePath();
    fill_path(f, "#493d36", "#332b28", d);
    f.restore();
    f.save();
    f.translate(-80 * c, -70 * c);
    f.globalAlpha = 1;
    f.beginPath();
    f.bezierCurveTo(108 * c, 120 * c, 100 * c, 119 * c, 91 * c, 127 * c);
    f.bezierCurveTo(83 * c, 134 * c, 82 * c, 146 * c, 83 * c, 146 * c);
    f.bezierCurveTo(84 * c, 146 * c, 98 * c, 142 * c, 103 * c, 138 * c);
    f.bezierCurveTo(107 * c, 135 * c, 110 * c, 130 * c, 112 * c, 121 * c);
    f.closePath();
    fill_path(f, "#493d36", "#332b28", d);
    f.restore();
    f.save();
    f.translate(3 * c, -93 * c);
    f.rotate(Math.PI / 5);
    f.globalAlpha = 1;
    f.beginPath();
    f.bezierCurveTo(130 * c, 79 * c, 132 * c, 86 * c, 130 * c, 93 * c);
    f.bezierCurveTo(128 * c, 100 * c, 121 * c, 107 * c, 120 * c, 107 * c);
    f.bezierCurveTo(120 * c, 107 * c, 115 * c, 98 * c, 115 * c, 92 * c);
    f.bezierCurveTo(115 * c, 86 * c, 119 * c, 76 * c, 127 * c, 73 * c);
    f.closePath();
    fill_path(f, "#493d36", "#332b28", d);
    f.restore();
    return g;
}
function create_text(c, g, f, d, e, m, p, n, r, u, q) {
    var v = document.createElement("canvas");
    var t = v.getContext("2d");
    m = m ? m * c : 0;
    var z = Math.floor(c * f);
    t.font = z + "px Baloo Paaji";
    n *= c;
    var A = p ? 2 * n : 0;
    r = r ? Math.min(t.measureText(g).width + 2 * c + A, r) : t.measureText(g).width + 2 * c + A;
    z = (z + m) * c + A;
    v.width = r;
    v.height = z;
    if (p) {
        t.fillStyle = p;
        round_rect(t, 0, 0, r, z, 2 * n);
        t.fill();
        t.translate(n, n);
    }
    t.textBaseline = "middle";
    t.font = f + "px Baloo Paaji";
    if (e) {
        t.beginPath();
        t.fillStyle = e;
        t.fillText(g, 0, z / 2 + m - A / 2, r);
    }
    t.beginPath();
    if (u) {
        t.strokeStyle = u;
        t.lineWidth = q;
        t.strokeText(g, 0, (z - A) / 2, r);
    }
    t.fillStyle = d;
    t.fillText(g, 0, (z - A) / 2, r);
    return v;
}
function create_stone(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 220 * c;
    var m = 220 * c;
    var p = 100 * c;
    var n = p / 4;
    c *= 20;
    g.width = e;
    g.height = m;
    d.translate(e / 2, m / 2 + c);
    d.globalAlpha = .5;
    round_regular_polygon(d, 7, p, n);
    fill_path(d, f[0]);
    d.globalAlpha = 1;
    d.translate(0, -c);
    round_regular_polygon(d, 7, p, n);
    fill_path(d, f[1]);
    round_regular_polygon(d, 6, .65 * p, .65 * n);
    fill_path(d, f[2]);
    return g;
}
function create_gold(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 120 * c;
    var m = 150 * c;
    var p = 60 * c;
    var n = p / 4;
    var r = 15 * c;
    g.width = e;
    g.height = m;
    d.save();
    d.translate(e / 2 + 0 * c, m / 2 + 0 * c + r);
    d.rotate(Math.PI / 3);
    d.globalAlpha = .5;
    round_regular_polygon(d, 8, p, n);
    fill_path(d, f[0]);
    d.restore();
    d.save();
    d.translate(e / 2 - 11 * c, m / 2 + 12 * c);
    d.globalAlpha = 1;
    d.rotate(Math.PI / 3);
    d.translate(0, -r);
    round_regular_polygon(d, 8, p, n);
    fill_path(d, f[1]);
    d.restore();
    d.save();
    d.translate(e / 2 - 9 * c, m / 2 - 12 * c);
    d.rotate(Math.PI / 2.8);
    round_regular_polygon(d, 5, .5 * p, .4 * n);
    fill_path(d, f[2]);
    d.restore();
    d.save();
    d.translate(e / 2 + 19 * c, m / 2 + 5 * c);
    d.rotate(Math.PI / 1);
    round_regular_polygon(d, 5, .5 * p, .4 * n);
    fill_path(d, f[2]);
    d.restore();
    d.save();
    d.translate(e / 2 - 8 * c, m / 2 + 20 * c);
    d.rotate(Math.PI / 2.25);
    round_regular_polygon(d, 5, .5 * p, .4 * n);
    fill_path(d, f[2]);
    d.restore();
    return g;
}
function create_diamond(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    var e = 180 * c;
    var m = 210 * c;
    var p = 60 * c;
    var n = p / 4;
    var r = 20 * c;
    g.width = e;
    g.height = m;
    d.save();
    d.translate(e / 2 - 0 * c, m / 2 - 35 * c + r);
    d.rotate(Math.PI / -1.8);
    d.globalAlpha = .5;
    d.translate(0 * c, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[0]);
    d.restore();
    d.save();
    d.translate(e / 2 + 10 * c, m / 2 + 15 * c + r);
    d.rotate(Math.PI / 2);
    d.globalAlpha = .5;
    d.translate(0 * c, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[0]);
    d.restore();
    d.save();
    d.translate(e / 2 - 50 * c, m / 2 + 40 * c + r);
    d.rotate(Math.PI / 3);
    d.globalAlpha = .5;
    d.translate(0, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[0]);
    d.restore();
    d.save();
    d.translate(e / 2 - 0 * c, m / 2 - 35 * c);
    d.rotate(Math.PI / -1.8);
    d.globalAlpha = 1;
    d.translate(0 * c, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[1]);
    d.restore();
    d.save();
    d.translate(e / 2 + 10 * c, m / 2 + 15 * c);
    d.rotate(Math.PI / 2);
    d.globalAlpha = 1;
    d.translate(0, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[1]);
    d.restore();
    d.save();
    d.translate(e / 2 - 50 * c, m / 2 + 40 * c);
    d.rotate(Math.PI / 3);
    d.globalAlpha = 1;
    d.translate(0, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[1]);
    d.restore();
    p = 30 * c;
    n = p / 4;
    d.save();
    d.translate(e / 2 + 5 * c, m / 2 - 20 * c);
    d.rotate(Math.PI / -1.8);
    d.globalAlpha = 1;
    d.translate(0, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[2]);
    d.restore();
    d.save();
    d.translate(e / 2 + 0 * c, m / 2 + 10 * c);
    d.rotate(Math.PI / 2);
    d.globalAlpha = 1;
    d.translate(0, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[2]);
    d.restore();
    d.save();
    d.translate(e / 2 - 45 * c, m / 2 + 35 * c);
    d.rotate(Math.PI / 3);
    d.globalAlpha = 1;
    d.translate(0, -20 * c);
    round_regular_polygon(d, 5, p, n);
    fill_path(d, f[2]);
    d.restore();
    circle(d, e / 2 - 7 * c, m / 2 + 7 * c, 5);
    fill_path(d, f[2]);
    return g;
}
function create_plant(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 10 * c;
    var p = 4 * c;
    d.width = 140 * c;
    d.height = 150 * c;
    e.translate(-50 * c, -38 * c + m);
    e.globalAlpha = g ? .5 : 1;
    e.beginPath();
    e.bezierCurveTo(160 * c, 65 * c, 160 * c, 85 * c, 152 * c, 95 * c);
    e.bezierCurveTo(152 * c, 95 * c, 173 * c, 94 * c, 187 * c, 102 * c);
    e.bezierCurveTo(187 * c, 102 * c, 180 * c, 120 * c, 155 * c, 126 * c);
    e.bezierCurveTo(154 * c, 126 * c, 166 * c, 138 * c, 169 * c, 148 * c);
    e.bezierCurveTo(169 * c, 148 * c, 148 * c, 152 * c, 133 * c, 140 * c);
    e.bezierCurveTo(133 * c, 140 * c, 134 * c, 160 * c, 122 * c, 175 * c);
    e.bezierCurveTo(122 * c, 175 * c, 107 * c, 162 * c, 107 * c, 144 * c);
    e.bezierCurveTo(107 * c, 144 * c, 98 * c, 164 * c, 73 * c, 167 * c);
    e.bezierCurveTo(73 * c, 167 * c, 72 * c, 134 * c, 90 * c, 127 * c);
    e.bezierCurveTo(90 * c, 127 * c, 70 * c, 134 * c, 55 * c, 123 * c);
    e.bezierCurveTo(55 * c, 123 * c, 58 * c, 115 * c, 75 * c, 104 * c);
    e.bezierCurveTo(75 * c, 104 * c, 66 * c, 96 * c, 61 * c, 77 * c);
    e.bezierCurveTo(61 * c, 77 * c, 83 * c, 74 * c, 102 * c, 89 * c);
    e.bezierCurveTo(102 * c, 89 * c, 92 * c, 66 * c, 110 * c, 41 * c);
    e.bezierCurveTo(111 * c, 40 * c, 130 * c, 54 * c, 130 * c, 82 * c);
    e.bezierCurveTo(130 * c, 82 * c, 143 * c, 67 * c, 159 * c, 65 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.translate(0, 0 - m);
    e.globalAlpha = 1;
    e.beginPath();
    e.bezierCurveTo(160 * c, 65 * c, 160 * c, 85 * c, 152 * c, 95 * c);
    e.bezierCurveTo(152 * c, 95 * c, 173 * c, 94 * c, 187 * c, 102 * c);
    e.bezierCurveTo(187 * c, 102 * c, 180 * c, 120 * c, 155 * c, 126 * c);
    e.bezierCurveTo(154 * c, 126 * c, 166 * c, 138 * c, 169 * c, 148 * c);
    e.bezierCurveTo(169 * c, 148 * c, 148 * c, 152 * c, 133 * c, 140 * c);
    e.bezierCurveTo(133 * c, 140 * c, 134 * c, 160 * c, 122 * c, 175 * c);
    e.bezierCurveTo(122 * c, 175 * c, 107 * c, 162 * c, 107 * c, 144 * c);
    e.bezierCurveTo(107 * c, 144 * c, 98 * c, 164 * c, 73 * c, 167 * c);
    e.bezierCurveTo(73 * c, 167 * c, 72 * c, 134 * c, 90 * c, 127 * c);
    e.bezierCurveTo(90 * c, 127 * c, 70 * c, 134 * c, 55 * c, 123 * c);
    e.bezierCurveTo(55 * c, 123 * c, 58 * c, 115 * c, 75 * c, 104 * c);
    e.bezierCurveTo(75 * c, 104 * c, 66 * c, 96 * c, 61 * c, 77 * c);
    e.bezierCurveTo(61 * c, 77 * c, 83 * c, 74 * c, 102 * c, 89 * c);
    e.bezierCurveTo(102 * c, 89 * c, 92 * c, 66 * c, 110 * c, 41 * c);
    e.bezierCurveTo(111 * c, 40 * c, 130 * c, 54 * c, 130 * c, 82 * c);
    e.bezierCurveTo(130 * c, 82 * c, 143 * c, 67 * c, 159 * c, 65 * c);
    e.closePath();
    fill_path(e, f[1], f[2], p);
    return d;
}
function create_fruit(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 18 * c;
    g.height = 18 * c;
    var e = 9 * c;
    var m = 9 * c;
    var p = 8 * c;
    d.save();
    d.translate(e, m);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, f[0]);
    p = 3 * c;
    d.translate(0, -3 * c);
    d.globalAlpha = 1;
    circle(d, 0, 0, p);
    fill_path(d, f[1]);
    d.restore();
    return g;
}
function create_herb(c, g, f, d) {
    g = document.createElement("canvas");
    var e = g.getContext("2d");
    if (d == 0) {
        g.width = 270 * c;
        g.height = 250 * c;
        e.beginPath();
        e.moveTo(140 * c, 3 * c);
        e.translate(-25 * c, -20 * c);
        e.bezierCurveTo(218 * c, 31 * c, 251 * c, 61 * c, 265 * c, 85 * c);
        e.bezierCurveTo(278 * c, 108 * c, 295 * c, 160 * c, 285 * c, 195 * c);
        e.bezierCurveTo(271 * c, 242 * c, 213 * c, 268 * c, 188 * c, 266 * c);
        e.bezierCurveTo(139 * c, 262 * c, 70 * c, 244 * c, 47 * c, 204 * c);
        e.bezierCurveTo(20 * c, 158 * c, 35 * c, 78 * c, 59 * c, 56 * c);
        e.bezierCurveTo(90 * c, 28 * c, 124 * c, 23 * c, 140 * c, 23 * c);
        e.closePath();
        fill_path(e, f[0]);
    } else if (d == 1) {
        g.width = 430 * c;
        g.height = 350 * c;
        e.beginPath();
        e.moveTo(180 * c, 5 * c);
        e.translate(-30 * c, -60 * c);
        e.bezierCurveTo(283 * c, 60 * c, 265 * c, 163 * c, 335 * c, 206 * c);
        e.bezierCurveTo(376 * c, 231 * c, 492 * c, 299 * c, 434 * c, 357 * c);
        e.bezierCurveTo(371 * c, 421 * c, 289 * c, 394 * c, 255 * c, 386 * c);
        e.bezierCurveTo(218 * c, 377 * c, 91 * c, 359 * c, 50 * c, 272 * c);
        e.bezierCurveTo(12 * c, 192 * c, 107 * c, 75 * c, 178 * c, 69 * c);
        e.closePath();
        fill_path(e, f[0]);
    } else if (d == 2) {
        g.width = 400 * c;
        g.height = 300 * c;
        e.beginPath();
        e.moveTo(80 * c, 52 * c);
        e.translate(-40 * c, -30 * c);
        e.bezierCurveTo(124 * c, 77 * c, 241 * c, 22 * c, 311 * c, 65 * c);
        e.bezierCurveTo(352 * c, 90 * c, 404 * c, 176 * c, 346 * c, 234 * c);
        e.bezierCurveTo(283 * c, 298 * c, 179 * c, 299 * c, 145 * c, 291 * c);
        e.bezierCurveTo(108 * c, 282 * c, 100 * c, 239 * c, 63 * c, 205 * c);
        e.bezierCurveTo(37 * c, 181 * c, 45 * c, 131 * c, 80 * c, 107 * c);
        e.closePath();
        fill_path(e, f[0]);
    }
    return g;
}
function create_flake(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = c * g * 2;
    var p = c * g * 2;
    d.width = m;
    d.height = p;
    e.translate(m / 2, p / 2);
    circle(e, 0, 0, g * c, 0);
    fill_path(e, f);
    return d;
}
function create_wall(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 130 * c;
    var p = 142 * c;
    d.width = m;
    d.height = p;
    e.translate(m / 2, p / 2 + 7 * c);
    e.globalAlpha = g ? .5 : 1;
    circle(e, 0, 0, 60 * c);
    fill_path(e, f[0]);
    e.translate(0, -7 * c);
    e.globalAlpha = 1;
    circle(e, 0, 0, 60 * c, 0);
    fill_path(e, f[1], f[2], 4 * c);
    circle(e, 0, 0, 40 * c);
    fill_path(e, f[3]);
    circle(e, 0, 0, 25 * c);
    fill_path(e, f[4], f[5], 8 * c);
    return d;
}
function create_wall_diamond(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 130 * c;
    d.height = 142 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(65 * c, 80 * c);
    e.rotate(.2);
    round_regular_polygon(e, 9, 60 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(65 * c, 71 * c);
    e.rotate(.2);
    round_regular_polygon(e, 9, 60 * c, 10 * c);
    fill_path(e, f[1], f[2], 4);
    e.rotate(-.32);
    round_regular_polygon(e, 9, 38 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.68);
    round_regular_polygon(e, 9, 20 * c, 8 * c);
    fill_path(e, f[5], f[6], 6);
    e.restore();
    return d;
}
function create_wall_stone(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 130 * c;
    d.height = 148 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(65 * c, 85 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 60 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(65 * c, 75 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 60 * c, 10 * c);
    fill_path(e, f[1], f[2], 4);
    e.rotate(.64);
    round_regular_polygon(e, 7, 40 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.12);
    round_regular_polygon(e, 7, 23 * c, 5 * c);
    e.restore();
    fill_path(e, f[5]);
    return d;
}
function create_wall_gold(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 125 * c;
    d.height = 138 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(63 * c, 73 * c);
    e.rotate(1);
    round_regular_polygon(e, 8, 60 * c, 10 * c);
    fill_path(e, f[0]);
    e.restore();
    e.globalAlpha = 1;
    e.save();
    e.translate(63 * c, 63 * c);
    e.rotate(1);
    round_regular_polygon(e, 8, 60 * c, 10 * c);
    fill_path(e, f[1], f[2], 4);
    e.rotate(.56);
    round_regular_polygon(e, 8, 40 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.28);
    round_regular_polygon(e, 8, 28 * c, 8 * c);
    fill_path(e, f[5]);
    e.restore();
    return d;
}
function create_door_wood(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 90 * c;
    d.height = 98 * c;
    e.globalAlpha = g ? .5 : 1;
    circle(e, 44 * c, 55 * c, 41 * c);
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    circle(e, 44 * c, 45 * c, 41 * c);
    fill_path(e, f[1], f[2], 4);
    circle(e, 44 * c, 45 * c, 31 * c);
    fill_path(e, f[3]);
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -9 * c, -25.5 * c, 18 * c, 51 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -26 * c, -9 * c, 52 * c, 18 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    circle(e, 45 * c, 29 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 45 * c, 61 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 28 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 62 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    return d;
}
function create_door_stone(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 90 * c;
    d.height = 98 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(44 * c, 50 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 41 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(44 * c, 44 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 41 * c, 10 * c);
    fill_path(e, f[1], f[2], 4);
    round_regular_polygon(e, 7, 35 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    round_regular_polygon(e, 7, 23 * c, 5 * c);
    e.restore();
    fill_path(e, f[5]);
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -9 * c, -25.5 * c, 18 * c, 51 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -26 * c, -9 * c, 52 * c, 18 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    circle(e, 45 * c, 29 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 45 * c, 61 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 28 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 62 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    return d;
}
function create_door_gold(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 90 * c;
    d.height = 98 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(44 * c, 50 * c);
    e.rotate(1);
    round_regular_polygon(e, 8, 41 * c, 10 * c);
    fill_path(e, f[0]);
    e.restore();
    e.globalAlpha = 1;
    e.save();
    e.translate(44 * c, 44 * c);
    e.rotate(1);
    round_regular_polygon(e, 8, 41 * c, 10 * c);
    fill_path(e, f[1], f[2], 4);
    e.rotate(.56);
    round_regular_polygon(e, 8, 33 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.28);
    round_regular_polygon(e, 8, 24 * c, 8 * c);
    fill_path(e, f[5]);
    e.restore();
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -9 * c, -25.5 * c, 18 * c, 51 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -26 * c, -9 * c, 52 * c, 18 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    circle(e, 45 * c, 29 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 45 * c, 61 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 28 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 62 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    return d;
}
function create_furnace_on(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 300 * c;
    d.height = 300 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(150 * c, 160 * c);
    e.rotate(6.28);
    round_regular_polygon(e, 6, 146 * c, 30 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(6.28);
    round_regular_polygon(e, 6, 146 * c, 30 * c);
    e.restore();
    fill_path(e, f[1], f[2], 8 * c);
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(0);
    round_regular_polygon(e, 6, 105 * c, 30 * c);
    e.restore();
    fill_path(e, f[3], f[3], 8 * c);
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(0);
    round_regular_polygon(e, 6, 66 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[2], 8 * c);
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(0);
    round_regular_polygon(e, 6, 31 * c, 30 * c);
    e.restore();
    fill_path(e, f[5], f[6], 8 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(150 * c, 207 * c);
    e.bezierCurveTo(150 * c, 151 * c, 150 * c, 101 * c, 150 * c, 94 * c);
    e.closePath();
    fill_path(e, void 0, f[2], 8 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(118 * c, 100 * c);
    e.bezierCurveTo(118 * c, 205 * c, 118 * c, 207 * c, 118 * c, 200 * c);
    e.closePath();
    fill_path(e, void 0, f[2], 8 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(183 * c, 100 * c);
    e.bezierCurveTo(183 * c, 203 * c, 183 * c, 203 * c, 183 * c, 200 * c);
    e.closePath();
    fill_path(e, void 0, f[2], 8 * c);
    return d;
}
function create_furnace_off(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 300 * c;
    d.height = 300 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(150 * c, 160 * c);
    e.rotate(6.28);
    round_regular_polygon(e, 6, 146 * c, 30 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(6.28);
    round_regular_polygon(e, 6, 146 * c, 30 * c);
    e.restore();
    fill_path(e, f[1], f[2], 8 * c);
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(0);
    round_regular_polygon(e, 6, 105 * c, 30 * c);
    e.restore();
    fill_path(e, f[3], f[3], 8 * c);
    e.save();
    e.translate(150 * c, 150 * c);
    e.rotate(0);
    round_regular_polygon(e, 6, 66 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[2], 8 * c);
    e.save();
    e.translate(131 * c, 116 * c);
    round_regular_polygon(e, 7, 17 * c, 8 * c);
    e.restore();
    fill_path(e, f[6]);
    e.save();
    e.translate(163 * c, 168 * c);
    round_regular_polygon(e, 7, 25 * c, 8 * c);
    e.restore();
    fill_path(e, f[6]);
    e.save();
    e.translate(117 * c, 151 * c);
    round_regular_polygon(e, 7, 11 * c, 8 * c);
    e.restore();
    fill_path(e, f[6]);
    e.save();
    e.translate(167 * c, 122 * c);
    round_regular_polygon(e, 7, 12 * c, 8 * c);
    e.restore();
    fill_path(e, f[6]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(150 * c, 207 * c);
    e.bezierCurveTo(150 * c, 151 * c, 150 * c, 101 * c, 150 * c, 94 * c);
    e.closePath();
    fill_path(e, void 0, f[2], 8 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(118 * c, 100 * c);
    e.bezierCurveTo(118 * c, 205 * c, 118 * c, 207 * c, 118 * c, 200 * c);
    e.closePath();
    fill_path(e, void 0, f[2], 8 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(183 * c, 100 * c);
    e.bezierCurveTo(183 * c, 203 * c, 183 * c, 203 * c, 183 * c, 200 * c);
    e.closePath();
    fill_path(e, void 0, f[2], 8 * c);
    return d;
}
function create_furnace_slot(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 118 * c;
    g.height = 129 * c;
    d.save();
    d.translate(90 * c, 90 * c);
    round_rect(d, -86.5 * c, -86 * c, 110 * c, 110 * c, 15 * c);
    d.restore();
    fill_path(d, f[0], f[1], 4);
    return g;
}
function create_door_diamond(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 90 * c;
    d.height = 98 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(44 * c, 50 * c);
    e.rotate(.2);
    round_regular_polygon(e, 9, 41 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(44 * c, 44 * c);
    e.rotate(.2);
    round_regular_polygon(e, 9, 41 * c, 10 * c);
    fill_path(e, f[1], f[2], 4);
    e.rotate(-.32);
    round_regular_polygon(e, 9, 32 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.68);
    round_regular_polygon(e, 9, 23 * c, 8 * c);
    fill_path(e, f[5], f[6], 6);
    e.restore();
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -9 * c, -25.5 * c, 18 * c, 51 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    e.save();
    e.translate(45 * c, 45 * c);
    e.rotate(0);
    round_rect(e, -26 * c, -9 * c, 52 * c, 18 * c, 30 * c);
    e.restore();
    fill_path(e, f[4], f[4], 2);
    circle(e, 45 * c, 29 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 45 * c, 61 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 28 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    circle(e, 62 * c, 45 * c, 7 * c);
    fill_path(e, f[5]);
    return d;
}
function create_coat(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 135 * c;
    g.height = 120 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(3.5 * c, 55.25 * c);
    d.bezierCurveTo(3.5 * c, 114.25 * c, 2.5 * c, 109.25 * c, 3.5 * c, 112.25 * c);
    d.bezierCurveTo(5.5 * c, 119.25 * c, 8.5 * c, 119.25 * c, 11.5 * c, 119.25 * c);
    d.bezierCurveTo(15.5 * c, 114.25 * c, 13.5 * c, 95.25 * c, 14.5 * c, 82.25 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 7 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(6.5 * c, 43.25 * c);
    d.bezierCurveTo(3.5 * c, 27.25 * c, 7.5 * c, 20.25 * c, 25.5 * c, 11.25 * c);
    d.bezierCurveTo(45.5 * c, -.75 * c, 73.5 * c, 1.25 * c, 107.5 * c, 10.25 * c);
    d.bezierCurveTo(131.5 * c, 21.25 * c, 125.5 * c, 34.25 * c, 125.5 * c, 36.25 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 7 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(120.5 * c, 62.25 * c);
    d.bezierCurveTo(121.5 * c, 95.25 * c, 120.5 * c, 80.25 * c, 120.5 * c, 100.25 * c);
    d.bezierCurveTo(118.5 * c, 119.25 * c, 123.5 * c, 118.25 * c, 129.5 * c, 113.25 * c);
    d.bezierCurveTo(133.5 * c, 107.25 * c, 130.5 * c, 97.25 * c, 130.5 * c, 87.25 * c);
    d.bezierCurveTo(129.5 * c, 56.25 * c, 130 * c, 70.75 * c, 129.5 * c, 54.25 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 7 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(17.5 * c, 27 * c);
    d.bezierCurveTo(48.5 * c, 5 * c, 93.5 * c, 14 * c, 118.5 * c, 26 * c);
    d.bezierCurveTo(132.5 * c, 35 * c, 133.5 * c, 52 * c, 132.5 * c, 68 * c);
    d.bezierCurveTo(125.5 * c, 87 * c, 116.5 * c, 84 * c, 96.5 * c, 75 * c);
    d.bezierCurveTo(60.5 * c, 66 * c, 52.5 * c, 74 * c, 37.5 * c, 78 * c);
    d.bezierCurveTo(2.5 * c, 86 * c, 3.5 * c, 78 * c, 1.5 * c, 61 * c);
    d.bezierCurveTo(1.5 * c, 37 * c, 9.5 * c, 32 * c, 15.5 * c, 28 * c);
    d.closePath();
    fill_path(d, f[2], f[3], 7 * c);
    return g;
}
function create_spear(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 81 * c;
    d.height = 263 * c;
    e.globalAlpha = g ? .6 : 1;
    e.save();
    e.translate(35 * c, 160 * c);
    e.rotate(0);
    round_rect(e, -6 * c, -94.5 * c, 12 * c, 189 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.save();
    e.translate(-9 * c, 11 * c);
    e.moveTo(26.0714111328125 * c, 50.9 * c);
    e.bezierCurveTo(32.0714111328125 * c, 35.892852783203125 * c, 39.0714111328125 * c, 18.892852783203125 * c, 45.0714111328125 * c, 7.892852783203125 * c);
    e.bezierCurveTo(51.0714111328125 * c, 13.892852783203125 * c, 56.0714111328125 * c, 36.892852783203125 * c, 60.0714111328125 * c, 50.892852783203125 * c);
    e.bezierCurveTo(52.5714111328125 * c, 58.892852783203125 * c, 52.5714111328125 * c, 58.892852783203125 * c, 45.0714111328125 * c, 66.89285278320312 * c);
    e.bezierCurveTo(37.0714111328125 * c, 58.892852783203125 * c, 37.0714111328125 * c, 58.892852783203125 * c, 29.0714111328125 * c, 50.892852783203125 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.restore();
    e.globalAlpha = 1;
    e.save();
    e.translate(45.0714111328125 * c, 149.39285278320312 * c);
    e.rotate(0);
    round_rect(e, -6 * c, -94.5 * c, 12 * c, 189 * c, 10 * c);
    e.restore();
    fill_path(e, f[1], f[2], 6 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(29.0714111328125 * c, 50.9 * c);
    e.bezierCurveTo(32.0714111328125 * c, 35.892852783203125 * c, 39.0714111328125 * c, 18.892852783203125 * c, 45.0714111328125 * c, 7.892852783203125 * c);
    e.bezierCurveTo(51.0714111328125 * c, 13.892852783203125 * c, 56.0714111328125 * c, 36.892852783203125 * c, 60.0714111328125 * c, 50.892852783203125 * c);
    e.bezierCurveTo(52.5714111328125 * c, 58.892852783203125 * c, 52.5714111328125 * c, 58.892852783203125 * c, 45.0714111328125 * c, 66.89285278320312 * c);
    e.bezierCurveTo(37.0714111328125 * c, 58.892852783203125 * c, 37.0714111328125 * c, 58.892852783203125 * c, 29.0714111328125 * c, 50.892852783203125 * c);
    e.closePath();
    fill_path(e, f[3], f[4], 6 * c);
    return d;
}
function create_plus_chest(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 200 * c;
    g.height = 200 * c;
    d.save();
    d.translate(112 * c, 158 * c);
    round_rect(d, -86.5 * c, -86 * c, 150 * c, 35 * c, 20 * c);
    d.restore();
    fill_path(d, f[0]);
    d.save();
    d.translate(170 * c, 100 * c);
    round_rect(d, -86.5 * c, -86 * c, 35 * c, 150 * c, 20 * c);
    d.restore();
    fill_path(d, f[0]);
    return g;
}
function create_chest_slot(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 118 * c;
    g.height = 129 * c;
    d.save();
    d.translate(90 * c, 90 * c);
    round_rect(d, -86.5 * c, -86 * c, 110 * c, 110 * c, 15 * c);
    d.restore();
    fill_path(d, f[0], f[1], 4);
    d.save();
    round_rect(d, 30 * c, 115 * c, 60 * c, 5 * c, 15 * c);
    d.restore();
    fill_path(d, f[2], f[3], 4);
    d.save();
    round_rect(d, 50 * c, 117 * c, 20 * c, 10 * c, 15 * c);
    d.restore();
    fill_path(d, f[2]);
    return g;
}
function create_chest(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 165 * c;
    g.height = 123 * c;
    d.save();
    d.translate(81 * c, 65 * c);
    round_rect(d, -78 * c, -54.5 * c, 156 * c, 109 * c, 20 * c);
    d.restore();
    fill_path(d, f[0]);
    d.save();
    d.translate(81 * c, 58 * c);
    round_rect(d, -78 * c, -54.5 * c, 156 * c, 109 * c, 20 * c);
    d.restore();
    fill_path(d, f[1], f[2], 4);
    d.save();
    d.translate(81 * c, 58 * c);
    round_rect(d, -69 * c, -47 * c, 138 * c, 93 * c, 15 * c);
    d.restore();
    fill_path(d, f[3], f[4], 4);
    d.save();
    d.translate(79 * c, 54 * c);
    round_rect(d, -34 * c, -40 * c, 68 * c, 88 * c, 13 * c);
    d.restore();
    fill_path(d, void 0, f[5], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(44 * c, 13 * c);
    d.bezierCurveTo(43.5 * c, 55 * c, 43.5 * c, 55 * c, 43 * c, 101 * c);
    d.closePath();
    fill_path(d, void 0, f[6], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(115 * c, 13 * c);
    d.bezierCurveTo(115 * c, 56 * c, 115 * c, 56 * c, 115 * c, 101 * c);
    d.closePath();
    fill_path(d, void 0, f[6], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(35 * c, 6 * c);
    d.bezierCurveTo(35 * c, 56 * c, 36 * c, 109 * c, 35 * c, 110 * c);
    d.closePath();
    fill_path(d, void 0, f[7], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(123 * c, 6 * c);
    d.bezierCurveTo(123 * c, 56 * c, 123 * c, 56 * c, 123 * c, 110 * c);
    d.closePath();
    fill_path(d, void 0, f[7], 4);
    d.save();
    d.translate(79 * c, 113 * c);
    round_rect(d, -18 * c, -2 * c, 36 * c, 4 * c, 20 * c);
    d.restore();
    fill_path(d, void 0, f[8], 4);
    d.save();
    d.translate(75 * c, 118 * c);
    round_rect(d, -6 * c, -2.5 * c, 20 * c, 5 * c, 20 * c);
    d.restore();
    fill_path(d, f[8]);
    return g;
}
function create_bag(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 86 * c;
    g.height = 45 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(15 * c, 15 * c);
    d.bezierCurveTo(16 * c, 15 * c, 19.5 * c, 9 * c, 24 * c, 2 * c);
    d.bezierCurveTo(41 * c, 2 * c, 41 * c, 2 * c, 58 * c, 2 * c);
    d.bezierCurveTo(64 * c, 13 * c, 61 * c, 8 * c, 65 * c, 13 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 4);
    d.save();
    d.translate(43 * c, 27 * c);
    d.rotate(0);
    round_rect(d, -40 * c, -15 * c, 80 * c, 30 * c, 10 * c);
    d.restore();
    fill_path(d, f[0], f[1], 4);
    d.save();
    d.translate(43 * c, 33 * c);
    d.rotate(0);
    round_rect(d, -17 * c, -4.5 * c, 34 * c, 9 * c, 10 * c);
    d.restore();
    fill_path(d, f[0], f[1], 4);
    return g;
}
function create_fur(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 92 * c;
    g.height = 108 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(31 * c, 10 * c);
    d.bezierCurveTo(37 * c, 2 * c, 49 * c, 0 * c, 61 * c, 15 * c);
    d.bezierCurveTo(81 * c, 31 * c, 78 * c, 25 * c, 79 * c, 37 * c);
    d.bezierCurveTo(76 * c, 44 * c, 81 * c, 56 * c, 85 * c, 63 * c);
    d.bezierCurveTo(91 * c, 71 * c, 90 * c, 78 * c, 83 * c, 84 * c);
    d.bezierCurveTo(60 * c, 98 * c, 67 * c, 95 * c, 57 * c, 102 * c);
    d.bezierCurveTo(47 * c, 106 * c, 43 * c, 106 * c, 31 * c, 98 * c);
    d.bezierCurveTo(22 * c, 91 * c, 17 * c, 89 * c, 7 * c, 84 * c);
    d.bezierCurveTo(1 * c, 77 * c, 4 * c, 73 * c, 7 * c, 60 * c);
    d.bezierCurveTo(11 * c, 50 * c, 5 * c, 32 * c, 15 * c, 27 * c);
    d.bezierCurveTo(26 * c, 18 * c, 26 * c, 24 * c, 31 * c, 10 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 4);
    return g;
}
function create_earmuff(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 151 * c;
    g.height = 80 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(133 * c, 54 * c);
    d.bezierCurveTo(136 * c, 18 * c, 129 * c, 18 * c, 114 * c, 13 * c);
    d.bezierCurveTo(51 * c, 0 * c, 36 * c, 16 * c, 34 * c, 16 * c);
    d.bezierCurveTo(8 * c, 28 * c, 22 * c, 56 * c, 21 * c, 57 * c);
    d.closePath();
    fill_path(d, f[2], f[3], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(130 * c, 40 * c);
    d.bezierCurveTo(132 * c, 35 * c, 132 * c, 30 * c, 132 * c, 29 * c);
    d.bezierCurveTo(145 * c, 38 * c, 144 * c, 43 * c, 137 * c, 54 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(20 * c, 33 * c);
    d.bezierCurveTo(24 * c, 44 * c, 215 * c, 39.46875 * c, 23 * c, 44 * c);
    d.bezierCurveTo(19 * c, 49 * c, 19 * c, 49 * c, 15 * c, 54 * c);
    d.bezierCurveTo(4 * c, 43 * c, 10 * c, 35 * c, 20 * c, 32 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 4);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(18 * c, 52 * c);
    d.bezierCurveTo(24 * c, 31 * c, 34 * c, 25 * c, 75 * c, 23 * c);
    d.bezierCurveTo(130 * c, 24 * c, 129 * c, 32 * c, 134 * c, 51 * c);
    d.bezierCurveTo(138 * c, 70 * c, 126 * c, 72 * c, 90 * c, 73 * c);
    d.bezierCurveTo(18 * c, 72 * c, 15 * c, 68 * c, 18 * c, 54 * c);
    d.closePath();
    fill_path(d, f[0], f[1], 4);
    return g;
}
function create_cap_scarf(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 138 * c;
    d.height = 133 * c;
    e.globalAlpha = g ? .3 : 1;
    e.translate(0, 5 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(26 * c, 79.640625 * c);
    e.bezierCurveTo(13 * c, 84.640625 * c, 9 * c, 86.640625 * c, 7 * c, 78.640625 * c);
    e.bezierCurveTo(6 * c, 69.640625 * c, 15 * c, 67.640625 * c, 31 * c, 62.640625 * c);
    e.bezierCurveTo(63 * c, 55.640625 * c, 85 * c, 57.640625 * c, 104 * c, 63.640625 * c);
    e.bezierCurveTo(131 * c, 69.640625 * c, 132 * c, 71.640625 * c, 131 * c, 78.640625 * c);
    e.bezierCurveTo(131 * c, 91.640625 * c, 112 * c, 80.640625 * c, 91 * c, 75.640625 * c);
    e.bezierCurveTo(51 * c, 70.640625 * c, 45 * c, 74.640625 * c, 28 * c, 78.640625 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(8 * c, 82.640625 * c);
    e.bezierCurveTo(40 * c, 107.640625 * c, 53 * c, 104.640625 * c, 67 * c, 106.640625 * c);
    e.bezierCurveTo(101 * c, 103.640625 * c, 117 * c, 93.640625 * c, 127 * c, 84.640625 * c);
    e.bezierCurveTo(135 * c, 95.640625 * c, 131 * c, 107.640625 * c, 110 * c, 118.640625 * c);
    e.bezierCurveTo(78 * c, 129.640625 * c, 67 * c, 130.640625 * c, 27 * c, 119.640625 * c);
    e.bezierCurveTo(0 * c, 105.640625 * c, 8 * c, 83.640625 * c, 10 * c, 84.640625 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(0, -5 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(8 * c, 73.640625 * c);
    e.bezierCurveTo(7 * c, 23.640625 * c, 33 * c, 19.640625 * c, 71 * c, 17.640625 * c);
    e.bezierCurveTo(129 * c, 19.640625 * c, 130 * c, 45.640625 * c, 130 * c, 76.640625 * c);
    e.bezierCurveTo(90 * c, 63.640625 * c, 85 * c, 63.640625 * c, 73 * c, 63.640625 * c);
    e.bezierCurveTo(38 * c, 63.640625 * c, 33 * c, 66.640625 * c, 8 * c, 73.640625 * c);
    e.closePath();
    fill_path(e, f[1], f[2], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(72 * c, 28.640625 * c);
    e.bezierCurveTo(51 * c, 25.640625 * c, 56 * c, 7.640625 * c, 70 * c, 5.640625 * c);
    e.bezierCurveTo(94 * c, 7.640625 * c, 87 * c, 29.640625 * c, 72 * c, 28.640625 * c);
    e.closePath();
    fill_path(e, f[3], f[2], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(51 * c, 26.640625 * c);
    e.bezierCurveTo(42 * c, 29.640625 * c, 43 * c, 31.640625 * c, 42 * c, 37.640625 * c);
    fill_path(e, void 0, f[2], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(90 * c, 26.640625 * c);
    e.bezierCurveTo(100 * c, 28.640625 * c, 98 * c, 34.640625 * c, 99 * c, 38.640625 * c);
    fill_path(e, void 0, f[2], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(26 * c, 79.640625 * c);
    e.bezierCurveTo(13 * c, 84.640625 * c, 9 * c, 86.640625 * c, 7 * c, 78.640625 * c);
    e.bezierCurveTo(6 * c, 69.640625 * c, 15 * c, 67.640625 * c, 31 * c, 62.640625 * c);
    e.bezierCurveTo(63 * c, 55.640625 * c, 85 * c, 57.640625 * c, 104 * c, 63.640625 * c);
    e.bezierCurveTo(131 * c, 69.640625 * c, 132 * c, 71.640625 * c, 131 * c, 78.640625 * c);
    e.bezierCurveTo(131 * c, 91.640625 * c, 112 * c, 80.640625 * c, 91 * c, 75.640625 * c);
    e.bezierCurveTo(51 * c, 70.640625 * c, 45 * c, 74.640625 * c, 28 * c, 78.640625 * c);
    e.closePath();
    fill_path(e, f[3], f[4], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(8 * c, 82.640625 * c);
    e.bezierCurveTo(40 * c, 107.640625 * c, 53 * c, 104.640625 * c, 67 * c, 106.640625 * c);
    e.bezierCurveTo(101 * c, 103.640625 * c, 117 * c, 93.640625 * c, 127 * c, 84.640625 * c);
    e.bezierCurveTo(135 * c, 95.640625 * c, 131 * c, 107.640625 * c, 110 * c, 118.640625 * c);
    e.bezierCurveTo(78 * c, 129.640625 * c, 67 * c, 130.640625 * c, 27 * c, 119.640625 * c);
    e.bezierCurveTo(0 * c, 105.640625 * c, 8 * c, 83.640625 * c, 10 * c, 84.640625 * c);
    e.closePath();
    fill_path(e, f[3], f[4], 4 * c);
    return d;
}
function create_spike(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    var m = 170 * c;
    var p = 172 * c;
    d.width = m;
    d.height = p;
    e.translate(m / 2, p / 2 + 7 * c);
    e.globalAlpha = g ? .5 : 0;
    circle(e, 0, 0, 60 * c);
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(0, -7 * c);
    e.save();
    for (g = 0; 10 > g; g++) {
        e.rotate(Math.PI / 5);
        e.save();
        e.translate(65 * c, 0);
        round_regular_polygon(e, 3, 20 * c, 4 * c);
        fill_path(e, f[1], f[2], 4 * c);
        e.restore();
    }
    e.restore();
    circle(e, 0, 0, 60 * c, 0);
    fill_path(e, f[3], f[4], 4 * c);
    circle(e, 0, 0, 40 * c);
    fill_path(e, f[5]);
    circle(e, 0, 0, 25 * c);
    fill_path(e, f[6], f[7], 8 * c);
    return d;
}
function create_spike_stone(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 170 * c;
    d.height = 170 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(85 * c, 88 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 60 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(85 * c, 80 * c);
    for (g = 0; 10 > g; g++) {
        e.rotate(Math.PI / 5);
        e.save();
        e.translate(65 * c, 0);
        round_regular_polygon(e, 3, 21 * c, 4 * c);
        fill_path(e, f[1], f[2], 4 * c);
        e.restore();
    }
    e.save();
    e.translate(0 * c, 0 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 60 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.64);
    round_regular_polygon(e, 7, 40 * c, 10 * c);
    fill_path(e, f[5], f[6], 4);
    e.rotate(.12);
    round_regular_polygon(e, 7, 23 * c, 5 * c);
    e.restore();
    fill_path(e, f[7]);
    return d;
}
function create_spike_gold(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 170 * c;
    d.height = 170 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(85 * c, 95 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 60 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(85 * c, 82 * c);
    for (g = 0; 10 > g; g++) {
        e.rotate(Math.PI / 5);
        e.save();
        e.translate(65 * c, 0);
        round_regular_polygon(e, 3, 21 * c, 4 * c);
        fill_path(e, f[1], f[2], 4 * c);
        e.restore();
    }
    e.save();
    e.translate(0 * c, 0 * c);
    e.rotate(1);
    round_regular_polygon(e, 8, 60 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(.56);
    round_regular_polygon(e, 8, 40 * c, 10 * c);
    fill_path(e, f[5], f[6], 4);
    e.rotate(.28);
    round_regular_polygon(e, 8, 28 * c, 8 * c);
    fill_path(e, f[7]);
    e.restore();
    return d;
}
function create_spike_diamond(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 170 * c;
    d.height = 170 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(85 * c, 95 * c);
    e.rotate(1.4);
    round_regular_polygon(e, 7, 60 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(85 * c, 82 * c);
    for (g = 0; 10 > g; g++) {
        e.rotate(Math.PI / 5);
        e.save();
        e.translate(65 * c, 0);
        round_regular_polygon(e, 3, 21 * c, 4 * c);
        fill_path(e, f[1], f[2], 4 * c);
        e.restore();
    }
    e.save();
    e.translate(0 * c, 0 * c);
    e.rotate(.2);
    round_regular_polygon(e, 9, 60 * c, 10 * c);
    fill_path(e, f[3], f[4], 4);
    e.rotate(-.32);
    round_regular_polygon(e, 9, 38 * c, 10 * c);
    fill_path(e, f[5], f[6], 4);
    e.rotate(.68);
    round_regular_polygon(e, 9, 20 * c, 8 * c);
    fill_path(e, f[7], f[8], 6);
    e.restore();
    return d;
}
function create_hammer(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 69 * c;
    d.height = 120 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(30 * c, 84 * c);
    round_rect(e, -6 * c, -66.5 * c, 8 * c, 100 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.save();
    e.translate(30 * c, 45 * c);
    round_rect(e, -9.5 * c, -6.5 * c, 16 * c, 13 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.save();
    e.translate(30 * c, 17 * c);
    round_rect(e, -7.5 * c, -5.5 * c, 12 * c, 11 * c, 10 * c);
    e.restore();
    fill_path(e, f[0]);
    e.save();
    e.translate(30 * c, 31 * c);
    round_rect(e, -26 * c, -14.5 * c, 52 * c, 29 * c, 5 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(36 * c, 79.140625 * c);
    round_rect(e, -6 * c, -66.5 * c, 8 * c, 100 * c, 10 * c);
    e.restore();
    fill_path(e, f[1], f[2], 3 * c);
    e.save();
    e.translate(35 * c, 40.140625 * c);
    round_rect(e, -9.5 * c, -6.5 * c, 16 * c, 13 * c, 10 * c);
    e.restore();
    fill_path(e, f[3], f[4], 3 * c);
    e.save();
    e.translate(35 * c, 12.140625 * c);
    round_rect(e, -7.5 * c, -5.5 * c, 12 * c, 11 * c, 10 * c);
    e.restore();
    fill_path(e, f[3], f[4], 3 * c);
    e.save();
    e.translate(34.5 * c, 26.140625 * c);
    round_rect(e, -26 * c, -14.5 * c, 52 * c, 29 * c, 5 * c);
    e.restore();
    fill_path(e, f[3], f[4], 3 * c);
    return d;
}
function create_fir_one(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 149 * c;
    f.height = 153 * c;
    d.globalAlpha = .5;
    circle(d, 74.5 * c, 85 * c, 66 * c);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    circle(d, 75.5 * c, 72.5 * c, 67 * c);
    fill_path(d, g[1], g[2], 4 * c);
    circle(d, 75.5 * c, 73.5 * c, 54 * c);
    fill_path(d, g[3]);
    d.globalAlpha = .5;
    circle(d, 74.5 * c, 80.5 * c, 39 * c);
    fill_path(d, g[4]);
    d.globalAlpha = 1;
    circle(d, 74.5 * c, 74.5 * c, 37 * c);
    fill_path(d, g[5]);
    return f;
}
function create_fir_two(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 173 * c;
    f.height = 178 * c;
    d.globalAlpha = .5;
    circle(d, 86.5 * c, 98 * c, 80 * c);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    circle(d, 86.5 * c, 89 * c, 81 * c);
    fill_path(d, g[1], g[2], 4 * c);
    circle(d, 86.5 * c, 86 * c, 59 * c);
    fill_path(d, g[3], g[4], 4 * c);
    d.globalAlpha = .5;
    circle(d, 86.5 * c, 95 * c, 34 * c);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    circle(d, 86.5 * c, 89 * c, 34 * c);
    fill_path(d, g[5]);
    return f;
}
function create_fir_three(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 253 * c;
    f.height = 260 * c;
    d.globalAlpha = .5;
    circle(d, 126.5 * c, 134 * c, 119 * c);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    circle(d, 126.5 * c, 124 * c, 119 * c);
    fill_path(d, g[1], g[2], 4 * c);
    circle(d, 126.5 * c, 127 * c, 100 * c);
    fill_path(d, g[3]);
    d.globalAlpha = .5;
    circle(d, 126.5 * c, 135 * c, 81 * c);
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    circle(d, 126.5 * c, 125 * c, 84 * c);
    fill_path(d, g[4], g[5], 4 * c);
    circle(d, 126.5 * c, 125 * c, 61 * c);
    fill_path(d, g[6], g[7], 4 * c);
    d.globalAlpha = .5;
    circle(d, 126.5 * c, 134 * c, 40 * c);
    fill_path(d, g[8]);
    d.globalAlpha = 1;
    circle(d, 126.5 * c, 125 * c, 40 * c);
    fill_path(d, g[9]);
    return f;
}
function create_amethyst(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 139 * c;
    d.height = 132 * c;
    e.translate(0, 10 * c);
    e.globalAlpha = g ? .5 : 1;
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(32 * c, 77 * c);
    e.bezierCurveTo(6 * c, 41 * c, 6 * c, 33 * c, 12 * c, 27 * c);
    e.bezierCurveTo(27 * c, 6 * c, 28 * c, 6 * c, 37 * c, 6 * c);
    e.bezierCurveTo(62 * c, 3 * c, 64 * c, 5 * c, 67 * c, 13 * c);
    e.bezierCurveTo(80 * c, 36 * c, 73.5 * c, 25 * c, 80 * c, 37 * c);
    e.bezierCurveTo(73.5 * c, 54 * c, 65 * c, 74 * c, 67 * c, 71 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(65 * c, 37 * c);
    e.bezierCurveTo(105 * c, 40 * c, 113 * c, 39 * c, 117 * c, 48 * c);
    e.bezierCurveTo(126 * c, 70 * c, 128 * c, 72 * c, 124 * c, 80 * c);
    e.bezierCurveTo(112 * c, 101 * c, 110 * c, 104 * c, 99 * c, 104 * c);
    e.bezierCurveTo(59 * c, 100 * c, 55 * c, 99 * c, 56 * c, 99 * c);
    e.bezierCurveTo(47.5 * c, 79 * c, 45 * c, 66 * c, 39 * c, 59 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(30 * c, 63 * c);
    e.bezierCurveTo(5 * c, 99 * c, 5 * c, 101 * c, 8 * c, 103 * c);
    e.bezierCurveTo(19 * c, 123 * c, 22 * c, 125 * c, 28 * c, 126 * c);
    e.bezierCurveTo(57 * c, 127 * c, 55 * c, 127 * c, 58 * c, 120 * c);
    e.bezierCurveTo(82 * c, 86 * c, 83 * c, 78 * c, 82 * c, 87 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.translate(0, -10 * c);
    e.globalAlpha = 1;
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(32 * c, 77 * c);
    e.bezierCurveTo(6 * c, 41 * c, 6 * c, 33 * c, 12 * c, 27 * c);
    e.bezierCurveTo(27 * c, 6 * c, 28 * c, 6 * c, 37 * c, 6 * c);
    e.bezierCurveTo(62 * c, 3 * c, 64 * c, 5 * c, 67 * c, 13 * c);
    e.bezierCurveTo(80 * c, 36 * c, 73.5 * c, 25 * c, 80 * c, 37 * c);
    e.bezierCurveTo(73.5 * c, 54 * c, 65 * c, 74 * c, 67 * c, 71 * c);
    e.closePath();
    fill_path(e, f[1]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(65 * c, 37 * c);
    e.bezierCurveTo(105 * c, 40 * c, 113 * c, 39 * c, 117 * c, 48 * c);
    e.bezierCurveTo(126 * c, 70 * c, 128 * c, 72 * c, 124 * c, 80 * c);
    e.bezierCurveTo(112 * c, 101 * c, 110 * c, 104 * c, 99 * c, 104 * c);
    e.bezierCurveTo(59 * c, 100 * c, 55 * c, 99 * c, 56 * c, 99 * c);
    e.bezierCurveTo(47.5 * c, 79 * c, 45 * c, 66 * c, 39 * c, 59 * c);
    e.closePath();
    fill_path(e, f[1]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(30 * c, 63 * c);
    e.bezierCurveTo(5 * c, 99 * c, 5 * c, 101 * c, 8 * c, 103 * c);
    e.bezierCurveTo(19 * c, 123 * c, 22 * c, 125 * c, 28 * c, 126 * c);
    e.bezierCurveTo(57 * c, 127 * c, 55 * c, 127 * c, 58 * c, 120 * c);
    e.bezierCurveTo(82 * c, 86 * c, 83 * c, 78 * c, 82 * c, 87 * c);
    e.closePath();
    fill_path(e, f[1]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(80 * c, 38 * c);
    e.bezierCurveTo(72.5 * c, 52 * c, 72.5 * c, 52 * c, 65 * c, 66 * c);
    e.bezierCurveTo(47.5 * c, 37 * c, 47.5 * c, 37 * c, 30 * c, 7 * c);
    e.bezierCurveTo(48 * c, 4 * c, 57 * c, 4 * c, 64 * c, 10 * c);
    e.closePath();
    fill_path(e, f[2]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(65 * c, 65 * c);
    e.bezierCurveTo(125 * c, 73 * c, 95.5 * c, 69 * c, 126 * c, 73 * c);
    e.bezierCurveTo(119 * c, 98 * c, 106 * c, 104 * c, 98 * c, 103 * c);
    e.bezierCurveTo(84.5 * c, 102 * c, 84.5 * c, 102 * c, 71 * c, 101 * c);
    e.bezierCurveTo(64 * c, 86 * c, 64 * c, 86 * c, 57 * c, 70 * c);
    e.closePath();
    fill_path(e, f[2]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(27 * c, 69 * c);
    e.bezierCurveTo(64 * c, 65 * c, 46 * c, 67 * c, 65 * c, 65 * c);
    e.bezierCurveTo(43.5 * c, 94 * c, 43.5 * c, 94 * c, 22 * c, 123 * c);
    e.bezierCurveTo(8 * c, 103 * c, 8 * c, 103 * c, 9 * c, 103 * c);
    e.bezierCurveTo(5 * c, 98 * c, 11 * c, 89 * c, 26 * c, 70 * c);
    e.closePath();
    fill_path(e, f[2]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(26 * c, 69 * c);
    e.bezierCurveTo(65 * c, 60 * c, 45 * c, 65 * c, 64 * c, 60 * c);
    e.bezierCurveTo(63 * c, 65 * c, 63 * c, 65 * c, 62 * c, 70 * c);
    e.closePath();
    fill_path(e, f[2]);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(80 * c, 38 * c);
    e.bezierCurveTo(68 * c, 70 * c, 75 * c, 53 * c, 70 * c, 68 * c);
    e.bezierCurveTo(65 * c, 67 * c, 65 * c, 67 * c, 60 * c, 65 * c);
    e.closePath();
    fill_path(e, f[2]);
    return d;
}
function create_dragon_ground(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 100 * c;
    f.height = 100 * c;
    d.fillStyle = g[0];
    d.fillRect(0, 0, f.width, f.height);
    return f;
}
function create_snow_one(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 120 * c;
    f.height = 300 * c;
    d.translate(-80 * c, -20);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(200.5 * c, 14.953125 * c);
    d.bezierCurveTo(203 * c, 171.953125 * c, 203 * c, 171.953125 * c, 205.5 * c, 328.953125 * c);
    d.bezierCurveTo(188.5 * c, 257.953125 * c, 164.5 * c, 216.953125 * c, 166.5 * c, 176.953125 * c);
    d.bezierCurveTo(168.5 * c, 133.953125 * c, 198.5 * c, 98.953125 * c, 200.5 * c, 14.953125 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_two(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 120 * c;
    f.height = 300 * c;
    d.translate(-200 * c, -40 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(344 * c, 18.40625 * c);
    d.bezierCurveTo(345 * c, 361.40625 * c, 344 * c, 191.40625 * c, 344 * c, 364.40625 * c);
    d.bezierCurveTo(261 * c, 275.40625 * c, 274 * c, 259.40625 * c, 229 * c, 213.40625 * c);
    d.bezierCurveTo(199 * c, 187.40625 * c, 222 * c, 133.40625 * c, 273 * c, 100.40625 * c);
    d.bezierCurveTo(321 * c, 71.40625 * c, 327 * c, 34.40625 * c, 344 * c, 18.40625 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(335 * c, 38.072906494140625 * c);
    d.bezierCurveTo(307 * c, 62.072906494140625 * c, 291 * c, 60.072906494140625 * c, 262 * c, 68.07290649414062 * c);
    d.bezierCurveTo(223 * c, 80.07290649414062 * c, 225 * c, 111.07290649414062 * c, 264 * c, 139.07290649414062 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_three(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 120 * c;
    f.height = 320 * c;
    d.translate(-60 * c, -15 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(188.5 * c, 3.953125 * c);
    d.bezierCurveTo(188.5 * c, 171.453125 * c, 188.5 * c, 171.453125 * c, 188.5 * c, 338.953125 * c);
    d.bezierCurveTo(162.5 * c, 268.953125 * c, 145.5 * c, 265.953125 * c, 116.5 * c, 244.953125 * c);
    d.bezierCurveTo(67.5 * c, 204.953125 * c, 87.5 * c, 160.953125 * c, 113.5 * c, 125.953125 * c);
    d.bezierCurveTo(141.5 * c, 90.953125 * c, 176.5 * c, 56.953125 * c, 188.5 * c, 3.953125 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_four(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 120 * c;
    f.height = 330 * c;
    d.translate(-60 * c, -10 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(188.5 * c, 7.953125 * c);
    d.bezierCurveTo(188.5 * c, 334.953125 * c, 188.5 * c, 332.953125 * c, 188.5 * c, 339.953125 * c);
    d.bezierCurveTo(166.5 * c, 295.953125 * c, 145.5 * c, 295.953125 * c, 139.5 * c, 282.953125 * c);
    d.bezierCurveTo(124.5 * c, 244.953125 * c, 139.5 * c, 243.953125 * c, 131.5 * c, 212.953125 * c);
    d.bezierCurveTo(118.5 * c, 161.953125 * c, 69.5 * c, 156.953125 * c, 74.5 * c, 92.953125 * c);
    d.bezierCurveTo(85.5 * c, 41.953125 * c, 158.5 * c, 49.953125 * c, 188.5 * c, 7.953125 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_five(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 48 * c;
    f.height = 47 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(7.1875 * c, 25.434661865234375 * c);
    d.bezierCurveTo(11.1875 * c, 13.434661865234375 * c, 18.1875 * c, 8.434661865234375 * c, 32.1875 * c, 10.434661865234375 * c);
    d.bezierCurveTo(45.1875 * c, 14.434661865234375 * c, 41.1875 * c, 24.434661865234375 * c, 36.1875 * c, 30.434661865234375 * c);
    d.bezierCurveTo(22.1875 * c, 42.434661865234375 * c, 2.1875 * c, 41.434661865234375 * c, 7.1875 * c, 25.434661865234375 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_six(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 120 * c;
    f.height = 280 * c;
    d.translate(-100 * c, -20 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(228.5 * c, 331.953125 * c);
    d.bezierCurveTo(228.5 * c, 12.953125 * c, 228.5 * c, 171.453125 * c, 228.5 * c, 10.953125 * c);
    d.bezierCurveTo(196.5 * c, 76.953125 * c, 206.5 * c, 78.953125 * c, 191.5 * c, 114.953125 * c);
    d.bezierCurveTo(162.5 * c, 170.953125 * c, 206.5 * c, 220.953125 * c, 210.5 * c, 251.953125 * c);
    d.bezierCurveTo(218.5 * c, 287.953125 * c, 220.5 * c, 291.953125 * c, 228.5 * c, 331.953125 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_sept(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 33 * c;
    f.height = 35 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(12.75 * c, 7.1328125 * c);
    d.bezierCurveTo(26.75 * c, 8.1328125 * c, 27.75 * c, 14.1328125 * c, 24.75 * c, 23.1328125 * c);
    d.bezierCurveTo(19.75 * c, 31.1328125 * c, 15.75 * c, 33.1328125 * c, 6.75 * c, 26.1328125 * c);
    d.bezierCurveTo(.75 * c, 19.1328125 * c, 4.75 * c, 8.1328125 * c, 12.75 * c, 7.1328125 * c);
    d.closePath();
    fill_path(d, g[0]);
    return f;
}
function create_snow_step(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 20 * c;
    f.height = 35 * c;
    round_rect(d, 0, 0, 20, 35, 7);
    fill_path(d, g[0]);
    return f;
}
function create_winter_fox(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 161 * c;
    f.height = 190 * c;
    d.globalAlpha = .5;
    d.translate(0, 8);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(9 * c, 93 * c);
    d.bezierCurveTo(17 * c, 95 * c, 19 * c, 95 * c, 21 * c, 95 * c);
    d.bezierCurveTo(9 * c, 83 * c, 17 * c, 93 * c, 4 * c, 76 * c);
    d.bezierCurveTo(11 * c, 75 * c, 11 * c, 75 * c, 18 * c, 75 * c);
    d.bezierCurveTo(13 * c, 67 * c, 13 * c, 67 * c, 7 * c, 59 * c);
    d.bezierCurveTo(14 * c, 59 * c, 14 * c, 59 * c, 21 * c, 59 * c);
    d.bezierCurveTo(46 * c, 35 * c, 35 * c, 45 * c, 49 * c, 31 * c);
    d.bezierCurveTo(53 * c, 24 * c, 51 * c, 21 * c, 51 * c, 16 * c);
    d.bezierCurveTo(63 * c, 23 * c, 63 * c, 24 * c, 69 * c, 29 * c);
    d.bezierCurveTo(76 * c, 7 * c, 75 * c, 11 * c, 76 * c, 6 * c);
    d.bezierCurveTo(81 * c, 12 * c, 84 * c, 18 * c, 89 * c, 27 * c);
    d.bezierCurveTo(95 * c, 25 * c, 100 * c, 16 * c, 105 * c, 14 * c);
    d.bezierCurveTo(103 * c, 25 * c, 111 * c, 33 * c, 110 * c, 34 * c);
    d.bezierCurveTo(123 * c, 48 * c, 123 * c, 48 * c, 136 * c, 62 * c);
    d.bezierCurveTo(142 * c, 60 * c, 147 * c, 59 * c, 155 * c, 58 * c);
    d.bezierCurveTo(147 * c, 65 * c, 147 * c, 65 * c, 139 * c, 73 * c);
    d.bezierCurveTo(145 * c, 73 * c, 145 * c, 73 * c, 151 * c, 73 * c);
    d.bezierCurveTo(145 * c, 80 * c, 145 * c, 80 * c, 138 * c, 87 * c);
    d.bezierCurveTo(144 * c, 88 * c, 144 * c, 88 * c, 150 * c, 89 * c);
    d.bezierCurveTo(125 * c, 103 * c, 125 * c, 125 * c, 113 * c, 141 * c);
    d.bezierCurveTo(92 * c, 178 * c, 85 * c, 177 * c, 76 * c, 178 * c);
    d.bezierCurveTo(64 * c, 179 * c, 51 * c, 164 * c, 35 * c, 131 * c);
    d.bezierCurveTo(18 * c, 95 * c, 13 * c, 99 * c, 8 * c, 93 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    d.translate(0, -8);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(9 * c, 93 * c);
    d.bezierCurveTo(17 * c, 95 * c, 19 * c, 95 * c, 21 * c, 95 * c);
    d.bezierCurveTo(9 * c, 83 * c, 17 * c, 93 * c, 4 * c, 76 * c);
    d.bezierCurveTo(11 * c, 75 * c, 11 * c, 75 * c, 18 * c, 75 * c);
    d.bezierCurveTo(13 * c, 67 * c, 13 * c, 67 * c, 7 * c, 59 * c);
    d.bezierCurveTo(14 * c, 59 * c, 14 * c, 59 * c, 21 * c, 59 * c);
    d.bezierCurveTo(46 * c, 35 * c, 35 * c, 45 * c, 49 * c, 31 * c);
    d.bezierCurveTo(53 * c, 24 * c, 51 * c, 21 * c, 51 * c, 16 * c);
    d.bezierCurveTo(63 * c, 23 * c, 63 * c, 24 * c, 69 * c, 29 * c);
    d.bezierCurveTo(76 * c, 7 * c, 75 * c, 11 * c, 76 * c, 6 * c);
    d.bezierCurveTo(81 * c, 12 * c, 84 * c, 18 * c, 89 * c, 27 * c);
    d.bezierCurveTo(95 * c, 25 * c, 100 * c, 16 * c, 105 * c, 14 * c);
    d.bezierCurveTo(103 * c, 25 * c, 111 * c, 33 * c, 110 * c, 34 * c);
    d.bezierCurveTo(123 * c, 48 * c, 123 * c, 48 * c, 136 * c, 62 * c);
    d.bezierCurveTo(142 * c, 60 * c, 147 * c, 59 * c, 155 * c, 58 * c);
    d.bezierCurveTo(147 * c, 65 * c, 147 * c, 65 * c, 139 * c, 73 * c);
    d.bezierCurveTo(145 * c, 73 * c, 145 * c, 73 * c, 151 * c, 73 * c);
    d.bezierCurveTo(145 * c, 80 * c, 145 * c, 80 * c, 138 * c, 87 * c);
    d.bezierCurveTo(144 * c, 88 * c, 144 * c, 88 * c, 150 * c, 89 * c);
    d.bezierCurveTo(125 * c, 103 * c, 125 * c, 125 * c, 113 * c, 141 * c);
    d.bezierCurveTo(92 * c, 178 * c, 85 * c, 177 * c, 76 * c, 178 * c);
    d.bezierCurveTo(64 * c, 179 * c, 51 * c, 164 * c, 35 * c, 131 * c);
    d.bezierCurveTo(18 * c, 95 * c, 13 * c, 99 * c, 8 * c, 93 * c);
    d.closePath();
    fill_path(d, g[1]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(28 * c, 63 * c);
    d.bezierCurveTo(23 * c, 54 * c, 24 * c, 47 * c, 26 * c, 37 * c);
    d.bezierCurveTo(28 * c, 29 * c, 31 * c, 31 * c, 41 * c, 35 * c);
    d.bezierCurveTo(52 * c, 45 * c, 55 * c, 51 * c, 57 * c, 53 * c);
    d.bezierCurveTo(50 * c, 50 * c, 44 * c, 47 * c, 43 * c, 48 * c);
    d.bezierCurveTo(43 * c, 52 * c, 43 * c, 52 * c, 42 * c, 57 * c);
    d.bezierCurveTo(38 * c, 54 * c, 38 * c, 54 * c, 33 * c, 51 * c);
    d.bezierCurveTo(34 * c, 56 * c, 34 * c, 56 * c, 34 * c, 61 * c);
    d.closePath();
    fill_path(d, g[3]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(99 * c, 55 * c);
    d.bezierCurveTo(107 * c, 43 * c, 113 * c, 39 * c, 121 * c, 34 * c);
    d.bezierCurveTo(130 * c, 29 * c, 130 * c, 34 * c, 130 * c, 42 * c);
    d.bezierCurveTo(131 * c, 57 * c, 128 * c, 61 * c, 129 * c, 63 * c);
    d.bezierCurveTo(124 * c, 62 * c, 124 * c, 62 * c, 119 * c, 61 * c);
    d.bezierCurveTo(119 * c, 56 * c, 120 * c, 61 * c, 118 * c, 52 * c);
    d.bezierCurveTo(115 * c, 55 * c, 111 * c, 59 * c, 111 * c, 58 * c);
    d.bezierCurveTo(110 * c, 54 * c, 109 * c, 57 * c, 109 * c, 51 * c);
    d.closePath();
    fill_path(d, g[3]);
    circle(d, 103 * c, 110 * c, 11 * c);
    fill_path(d, g[4]);
    circle(d, 55 * c, 111 * c, 11 * c);
    fill_path(d, g[4]);
    circle(d, 99 * c, 107 * c, 5 * c);
    fill_path(d, g[1]);
    circle(d, 51 * c, 108 * c, 5 * c);
    fill_path(d, g[1]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(31 * c, 121 * c);
    d.bezierCurveTo(45 * c, 128 * c, 51 * c, 133 * c, 53 * c, 141 * c);
    d.bezierCurveTo(59 * c, 161 * c, 70 * c, 173 * c, 80 * c, 169 * c);
    d.bezierCurveTo(89 * c, 172 * c, 99 * c, 149 * c, 107 * c, 133 * c);
    d.bezierCurveTo(114 * c, 122 * c, 119 * c, 123 * c, 124 * c, 119 * c);
    d.bezierCurveTo(109 * c, 148 * c, 117 * c, 133 * c, 109 * c, 147 * c);
    d.bezierCurveTo(87 * c, 180 * c, 84 * c, 179 * c, 76 * c, 178 * c);
    d.bezierCurveTo(49 * c, 173 * c, 44 * c, 149 * c, 31 * c, 121 * c);
    d.closePath();
    fill_path(d, g[5]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.translate(-2, 0);
    d.moveTo(71 * c, 162 * c);
    d.bezierCurveTo(80 * c, 155 * c, 85 * c, 159 * c, 89 * c, 164 * c);
    d.bezierCurveTo(90 * c, 171 * c, 86 * c, 173 * c, 79 * c, 173 * c);
    d.bezierCurveTo(67 * c, 172 * c, 67 * c, 168 * c, 71 * c, 162 * c);
    d.closePath();
    fill_path(d, g[3]);
    d.translate(2, 0);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(9 * c, 93 * c);
    d.bezierCurveTo(17 * c, 95 * c, 19 * c, 95 * c, 21 * c, 95 * c);
    d.bezierCurveTo(9 * c, 83 * c, 17 * c, 93 * c, 4 * c, 76 * c);
    d.bezierCurveTo(11 * c, 75 * c, 11 * c, 75 * c, 18 * c, 75 * c);
    d.bezierCurveTo(13 * c, 67 * c, 13 * c, 67 * c, 7 * c, 59 * c);
    d.bezierCurveTo(14 * c, 59 * c, 14 * c, 59 * c, 21 * c, 59 * c);
    d.bezierCurveTo(46 * c, 35 * c, 35 * c, 45 * c, 49 * c, 31 * c);
    d.bezierCurveTo(53 * c, 24 * c, 51 * c, 21 * c, 51 * c, 16 * c);
    d.bezierCurveTo(63 * c, 23 * c, 63 * c, 24 * c, 69 * c, 29 * c);
    d.bezierCurveTo(76 * c, 7 * c, 75 * c, 11 * c, 76 * c, 6 * c);
    d.bezierCurveTo(81 * c, 12 * c, 84 * c, 18 * c, 89 * c, 27 * c);
    d.bezierCurveTo(95 * c, 25 * c, 100 * c, 16 * c, 105 * c, 14 * c);
    d.bezierCurveTo(103 * c, 25 * c, 111 * c, 33 * c, 110 * c, 34 * c);
    d.bezierCurveTo(123 * c, 48 * c, 123 * c, 48 * c, 136 * c, 62 * c);
    d.bezierCurveTo(142 * c, 60 * c, 147 * c, 59 * c, 155 * c, 58 * c);
    d.bezierCurveTo(147 * c, 65 * c, 147 * c, 65 * c, 139 * c, 73 * c);
    d.bezierCurveTo(145 * c, 73 * c, 145 * c, 73 * c, 151 * c, 73 * c);
    d.bezierCurveTo(145 * c, 80 * c, 145 * c, 80 * c, 138 * c, 87 * c);
    d.bezierCurveTo(144 * c, 88 * c, 144 * c, 88 * c, 150 * c, 89 * c);
    d.bezierCurveTo(125 * c, 103 * c, 125 * c, 125 * c, 113 * c, 141 * c);
    d.bezierCurveTo(92 * c, 178 * c, 85 * c, 177 * c, 76 * c, 178 * c);
    d.bezierCurveTo(64 * c, 179 * c, 51 * c, 164 * c, 35 * c, 131 * c);
    d.bezierCurveTo(18 * c, 95 * c, 13 * c, 99 * c, 8 * c, 93 * c);
    d.closePath();
    fill_path(d, void 0, g[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(25 * c, 63 * c);
    d.bezierCurveTo(16 * c, 58 * c, 17 * c, 51 * c, 17 * c, 33 * c);
    d.bezierCurveTo(19 * c, 12 * c, 21 * c, 12 * c, 32 * c, 17 * c);
    d.bezierCurveTo(63 * c, 31 * c, 66 * c, 45 * c, 66 * c, 54 * c);
    fill_path(d, g[1], g[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(91 * c, 53 * c);
    d.bezierCurveTo(91 * c, 40 * c, 98 * c, 33 * c, 121 * c, 20 * c);
    d.bezierCurveTo(137 * c, 12 * c, 137 * c, 16 * c, 139 * c, 27 * c);
    d.bezierCurveTo(141 * c, 49 * c, 140 * c, 57 * c, 134 * c, 64 * c);
    fill_path(d, g[1], g[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(31 * c, 63 * c);
    d.bezierCurveTo(23 * c, 54 * c, 24 * c, 47 * c, 26 * c, 37 * c);
    d.bezierCurveTo(28 * c, 29 * c, 31 * c, 31 * c, 41 * c, 35 * c);
    d.bezierCurveTo(52 * c, 45 * c, 55 * c, 51 * c, 57 * c, 53 * c);
    d.bezierCurveTo(50 * c, 50 * c, 44 * c, 47 * c, 43 * c, 48 * c);
    d.bezierCurveTo(43 * c, 52 * c, 43 * c, 52 * c, 42 * c, 57 * c);
    d.bezierCurveTo(38 * c, 54 * c, 38 * c, 54 * c, 33 * c, 51 * c);
    d.bezierCurveTo(34 * c, 56 * c, 34 * c, 56 * c, 34 * c, 61 * c);
    d.closePath();
    fill_path(d, g[3]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(99 * c, 55 * c);
    d.bezierCurveTo(107 * c, 43 * c, 113 * c, 39 * c, 121 * c, 34 * c);
    d.bezierCurveTo(130 * c, 29 * c, 130 * c, 34 * c, 130 * c, 42 * c);
    d.bezierCurveTo(131 * c, 57 * c, 128 * c, 61 * c, 129 * c, 63 * c);
    d.bezierCurveTo(124 * c, 62 * c, 124 * c, 62 * c, 119 * c, 61 * c);
    d.bezierCurveTo(119 * c, 56 * c, 120 * c, 61 * c, 118 * c, 52 * c);
    d.bezierCurveTo(115 * c, 55 * c, 111 * c, 59 * c, 111 * c, 58 * c);
    d.bezierCurveTo(110 * c, 54 * c, 109 * c, 57 * c, 109 * c, 51 * c);
    d.closePath();
    fill_path(d, g[3]);
    return f;
}
function create_hurt_fox_winter(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 161 * c;
    f.height = 190 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(9 * c, 93 * c);
    d.bezierCurveTo(17 * c, 95 * c, 19 * c, 95 * c, 21 * c, 95 * c);
    d.bezierCurveTo(9 * c, 83 * c, 17 * c, 93 * c, 4 * c, 76 * c);
    d.bezierCurveTo(11 * c, 75 * c, 11 * c, 75 * c, 18 * c, 75 * c);
    d.bezierCurveTo(13 * c, 67 * c, 13 * c, 67 * c, 7 * c, 59 * c);
    d.bezierCurveTo(14 * c, 59 * c, 14 * c, 59 * c, 21 * c, 59 * c);
    d.bezierCurveTo(46 * c, 35 * c, 35 * c, 45 * c, 49 * c, 31 * c);
    d.bezierCurveTo(53 * c, 24 * c, 51 * c, 21 * c, 51 * c, 16 * c);
    d.bezierCurveTo(63 * c, 23 * c, 63 * c, 24 * c, 69 * c, 29 * c);
    d.bezierCurveTo(76 * c, 7 * c, 75 * c, 11 * c, 76 * c, 6 * c);
    d.bezierCurveTo(81 * c, 12 * c, 84 * c, 18 * c, 89 * c, 27 * c);
    d.bezierCurveTo(95 * c, 25 * c, 100 * c, 16 * c, 105 * c, 14 * c);
    d.bezierCurveTo(103 * c, 25 * c, 111 * c, 33 * c, 110 * c, 34 * c);
    d.bezierCurveTo(123 * c, 48 * c, 123 * c, 48 * c, 136 * c, 62 * c);
    d.bezierCurveTo(142 * c, 60 * c, 147 * c, 59 * c, 155 * c, 58 * c);
    d.bezierCurveTo(147 * c, 65 * c, 147 * c, 65 * c, 139 * c, 73 * c);
    d.bezierCurveTo(145 * c, 73 * c, 145 * c, 73 * c, 151 * c, 73 * c);
    d.bezierCurveTo(145 * c, 80 * c, 145 * c, 80 * c, 138 * c, 87 * c);
    d.bezierCurveTo(144 * c, 88 * c, 144 * c, 88 * c, 150 * c, 89 * c);
    d.bezierCurveTo(125 * c, 103 * c, 125 * c, 125 * c, 113 * c, 141 * c);
    d.bezierCurveTo(92 * c, 178 * c, 85 * c, 177 * c, 76 * c, 178 * c);
    d.bezierCurveTo(64 * c, 179 * c, 51 * c, 164 * c, 35 * c, 131 * c);
    d.bezierCurveTo(18 * c, 95 * c, 13 * c, 99 * c, 8 * c, 93 * c);
    d.closePath();
    fill_path(d, g, g, 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(25 * c, 63 * c);
    d.bezierCurveTo(16 * c, 58 * c, 17 * c, 51 * c, 17 * c, 33 * c);
    d.bezierCurveTo(19 * c, 12 * c, 21 * c, 12 * c, 32 * c, 17 * c);
    d.bezierCurveTo(63 * c, 31 * c, 66 * c, 45 * c, 66 * c, 54 * c);
    fill_path(d, g, g, 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(91 * c, 53 * c);
    d.bezierCurveTo(91 * c, 40 * c, 98 * c, 33 * c, 121 * c, 20 * c);
    d.bezierCurveTo(137 * c, 12 * c, 137 * c, 16 * c, 139 * c, 27 * c);
    d.bezierCurveTo(141 * c, 49 * c, 140 * c, 57 * c, 134 * c, 64 * c);
    fill_path(d, g, g, 4 * c);
    return f;
}
function create_polar_bear(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 147 * c;
    f.height = 172 * c;
    d.globalAlpha = .5;
    d.translate(0, 8 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(8 * c, 50 * c);
    d.bezierCurveTo(15 * c, 16 * c, 49 * c, 6 * c, 67 * c, 6 * c);
    d.bezierCurveTo(121 * c, 3 * c, 128 * c, 32 * c, 135 * c, 48 * c);
    d.bezierCurveTo(146 * c, 96 * c, 124 * c, 131 * c, 96 * c, 135 * c);
    d.bezierCurveTo(96 * c, 158 * c, 79 * c, 156 * c, 75 * c, 156 * c);
    d.bezierCurveTo(50 * c, 154 * c, 53 * c, 150 * c, 52 * c, 135 * c);
    d.bezierCurveTo(2 * c, 127 * c, 3 * c, 87 * c, 8 * c, 50 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.translate(0, -8 * c);
    d.globalAlpha = 1;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(8 * c, 50 * c);
    d.bezierCurveTo(15 * c, 16 * c, 49 * c, 6 * c, 67 * c, 6 * c);
    d.bezierCurveTo(121 * c, 3 * c, 128 * c, 32 * c, 135 * c, 48 * c);
    d.bezierCurveTo(146 * c, 96 * c, 124 * c, 131 * c, 96 * c, 135 * c);
    d.bezierCurveTo(96 * c, 158 * c, 79 * c, 156 * c, 75 * c, 156 * c);
    d.bezierCurveTo(50 * c, 154 * c, 53 * c, 150 * c, 52 * c, 135 * c);
    d.bezierCurveTo(2 * c, 127 * c, 3 * c, 87 * c, 8 * c, 50 * c);
    d.closePath();
    fill_path(d, g[1], g[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(14 * c, 57 * c);
    d.bezierCurveTo(2 * c, 50 * c, 5 * c, 22 * c, 24 * c, 22 * c);
    d.bezierCurveTo(41 * c, 21 * c, 54 * c, 32 * c, 55 * c, 48 * c);
    fill_path(d, g[1], g[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(93 * c, 47 * c);
    d.bezierCurveTo(94 * c, 24 * c, 116 * c, 21 * c, 120 * c, 20 * c);
    d.bezierCurveTo(144 * c, 17 * c, 146 * c, 52 * c, 133 * c, 58 * c);
    fill_path(d, g[1], g[2], 4 * c);
    circle(d, 51 * c, 91 * c, 9 * c);
    fill_path(d, g[3]);
    circle(d, 95 * c, 91 * c, 9 * c);
    fill_path(d, g[3]);
    circle(d, 91 * c, 89 * c, 4 * c);
    fill_path(d, g[4]);
    circle(d, 47 * c, 89 * c, 4 * c);
    fill_path(d, g[4]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(54 * c, 133 * c);
    d.bezierCurveTo(56 * c, 108 * c, 64 * c, 99 * c, 73 * c, 98 * c);
    d.bezierCurveTo(86 * c, 97 * c, 91 * c, 119 * c, 93 * c, 133 * c);
    d.bezierCurveTo(94 * c, 155 * c, 90 * c, 150 * c, 74 * c, 155 * c);
    d.bezierCurveTo(50 * c, 152 * c, 55 * c, 145 * c, 54 * c, 134 * c);
    d.closePath();
    fill_path(d, g[5]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(65.25 * c, 135 * c);
    d.bezierCurveTo(75.25 * c, 128 * c, 83.25 * c, 133 * c, 83.25 * c, 138 * c);
    d.bezierCurveTo(88.25 * c, 148 * c, 61.25 * c, 149 * c, 64.25 * c, 137 * c);
    d.closePath();
    fill_path(d, g[6]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(74 * c, 145 * c);
    d.bezierCurveTo(74 * c, 148 * c, 74 * c, 148 * c, 74 * c, 151 * c);
    d.closePath();
    fill_path(d, void 0, g[6], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(19 * c, 58 * c);
    d.bezierCurveTo(10 * c, 38 * c, 18 * c, 33 * c, 28 * c, 34 * c);
    d.bezierCurveTo(41 * c, 39 * c, 45 * c, 45 * c, 50 * c, 51 * c);
    d.closePath();
    fill_path(d, g[6]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(100 * c, 51 * c);
    d.bezierCurveTo(106 * c, 36 * c, 119 * c, 31 * c, 128 * c, 36 * c);
    d.bezierCurveTo(137 * c, 49 * c, 128 * c, 58 * c, 128 * c, 60 * c);
    d.closePath();
    fill_path(d, g[6]);
    return f;
}
function create_hurt_polar_bear(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 147 * c;
    f.height = 172 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(8 * c, 50 * c);
    d.bezierCurveTo(15 * c, 16 * c, 49 * c, 6 * c, 67 * c, 6 * c);
    d.bezierCurveTo(121 * c, 3 * c, 128 * c, 32 * c, 135 * c, 48 * c);
    d.bezierCurveTo(146 * c, 96 * c, 124 * c, 131 * c, 96 * c, 135 * c);
    d.bezierCurveTo(96 * c, 158 * c, 79 * c, 156 * c, 75 * c, 156 * c);
    d.bezierCurveTo(50 * c, 154 * c, 53 * c, 150 * c, 52 * c, 135 * c);
    d.bezierCurveTo(2 * c, 127 * c, 3 * c, 87 * c, 8 * c, 50 * c);
    d.closePath();
    fill_path(d, g, g, 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(14 * c, 57 * c);
    d.bezierCurveTo(2 * c, 50 * c, 5 * c, 22 * c, 24 * c, 22 * c);
    d.bezierCurveTo(41 * c, 21 * c, 54 * c, 32 * c, 55 * c, 48 * c);
    fill_path(d, g, g, 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(93 * c, 47 * c);
    d.bezierCurveTo(94 * c, 24 * c, 116 * c, 21 * c, 120 * c, 20 * c);
    d.bezierCurveTo(144 * c, 17 * c, 146 * c, 52 * c, 133 * c, 58 * c);
    fill_path(d, g, g, 4 * c);
    return f;
}
function create_dragon(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 229 * c;
    f.height = 371 * c;
    d.globalAlpha = .5;
    d.translate(0, 10 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(89 * c, 94 * c);
    d.bezierCurveTo(99 * c, 52 * c, 101 * c, 33 * c, 115 * c, 35 * c);
    d.bezierCurveTo(137 * c, 37 * c, 132 * c, 66 * c, 142 * c, 95 * c);
    d.bezierCurveTo(208 * c, 155 * c, 216 * c, 176 * c, 221 * c, 226 * c);
    d.bezierCurveTo(221 * c, 276 * c, 186 * c, 299 * c, 171 * c, 311 * c);
    d.bezierCurveTo(143 * c, 352 * c, 150 * c, 352 * c, 111 * c, 354 * c);
    d.bezierCurveTo(71 * c, 349 * c, 74 * c, 341 * c, 55 * c, 316 * c);
    d.bezierCurveTo(0 * c, 260 * c, 7 * c, 237 * c, 12 * c, 191 * c);
    d.bezierCurveTo(29 * c, 132 * c, 77 * c, 105 * c, 89 * c, 95 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    d.translate(0, -10 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(89 * c, 94 * c);
    d.bezierCurveTo(99 * c, 52 * c, 101 * c, 33 * c, 115 * c, 35 * c);
    d.bezierCurveTo(137 * c, 37 * c, 132 * c, 66 * c, 142 * c, 95 * c);
    d.bezierCurveTo(208 * c, 155 * c, 216 * c, 176 * c, 221 * c, 226 * c);
    d.bezierCurveTo(221 * c, 276 * c, 186 * c, 299 * c, 171 * c, 311 * c);
    d.bezierCurveTo(143 * c, 352 * c, 150 * c, 352 * c, 111 * c, 354 * c);
    d.bezierCurveTo(71 * c, 349 * c, 74 * c, 341 * c, 55 * c, 316 * c);
    d.bezierCurveTo(0 * c, 260 * c, 7 * c, 237 * c, 12 * c, 191 * c);
    d.bezierCurveTo(29 * c, 132 * c, 77 * c, 105 * c, 89 * c, 95 * c);
    d.closePath();
    fill_path(d, g[1], g[6], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(104.5 * c, 43 * c);
    d.bezierCurveTo(86.5 * c, 224 * c, 55.5 * c, 266 * c, 26.5 * c, 282 * c);
    d.bezierCurveTo(53.5 * c, 315 * c, 40.5 * c, 299 * c, 54.5 * c, 316 * c);
    d.bezierCurveTo(64.5 * c, 329 * c, 64.5 * c, 329 * c, 74.5 * c, 342 * c);
    d.bezierCurveTo(110.5 * c, 364 * c, 135.5 * c, 351 * c, 144.5 * c, 348 * c);
    d.bezierCurveTo(158.5 * c, 330 * c, 171.5 * c, 313 * c, 172.5 * c, 312 * c);
    d.bezierCurveTo(188.5 * c, 298 * c, 193.5 * c, 294 * c, 206.5 * c, 276 * c);
    d.bezierCurveTo(141.5 * c, 244 * c, 131.5 * c, 81 * c, 120.5 * c, 37 * c);
    d.bezierCurveTo(110.5 * c, 32 * c, 108.5 * c, 36 * c, 105.5 * c, 40 * c);
    d.closePath();
    fill_path(d, g[3]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(89 * c, 94 * c);
    d.bezierCurveTo(99 * c, 52 * c, 101 * c, 33 * c, 115 * c, 35 * c);
    d.bezierCurveTo(137 * c, 37 * c, 132 * c, 66 * c, 142 * c, 95 * c);
    d.bezierCurveTo(208 * c, 155 * c, 216 * c, 176 * c, 221 * c, 226 * c);
    d.bezierCurveTo(221 * c, 276 * c, 186 * c, 299 * c, 171 * c, 311 * c);
    d.bezierCurveTo(143 * c, 352 * c, 150 * c, 352 * c, 111 * c, 354 * c);
    d.bezierCurveTo(71 * c, 349 * c, 74 * c, 341 * c, 55 * c, 316 * c);
    d.bezierCurveTo(0 * c, 260 * c, 7 * c, 237 * c, 12 * c, 191 * c);
    d.bezierCurveTo(29 * c, 132 * c, 77 * c, 105 * c, 89 * c, 95 * c);
    d.closePath();
    fill_path(d, void 0, g[6], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(91.5 * c, 18 * c);
    d.bezierCurveTo(95.5 * c, 5 * c, 97.5 * c, 8 * c, 107.5 * c, 23 * c);
    d.bezierCurveTo(115.5 * c, 36 * c, 114.5 * c, 37 * c, 113.5 * c, 48 * c);
    d.bezierCurveTo(106.5 * c, 55 * c, 105.5 * c, 49 * c, 97.5 * c, 39 * c);
    d.bezierCurveTo(88.5 * c, 26 * c, 90.5 * c, 25 * c, 91.5 * c, 18 * c);
    d.closePath();
    fill_path(d, g[4], g[5], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(89.5 * c, 52 * c);
    d.bezierCurveTo(93.5 * c, 31 * c, 102.5 * c, 53 * c, 105.5 * c, 59 * c);
    d.bezierCurveTo(113.5 * c, 73 * c, 110.5 * c, 75 * c, 111.5 * c, 77 * c);
    d.bezierCurveTo(105.5 * c, 91 * c, 103.5 * c, 83 * c, 95.5 * c, 73 * c);
    d.bezierCurveTo(88.5 * c, 63 * c, 87.5 * c, 59 * c, 89.5 * c, 52 * c);
    d.closePath();
    fill_path(d, g[4], g[5], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(127.5 * c, 54 * c);
    d.bezierCurveTo(133.5 * c, 42 * c, 140.5 * c, 35 * c, 141.5 * c, 50 * c);
    d.bezierCurveTo(143.5 * c, 61 * c, 135.5 * c, 67 * c, 133.5 * c, 73 * c);
    d.bezierCurveTo(123.5 * c, 82 * c, 121.5 * c, 82 * c, 120.5 * c, 71 * c);
    d.bezierCurveTo(119.5 * c, 64 * c, 121.5 * c, 61 * c, 127.5 * c, 54 * c);
    d.closePath();
    fill_path(d, g[4], g[5], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(117.5 * c, 42 * c);
    d.bezierCurveTo(116.5 * c, 29 * c, 121.5 * c, 25 * c, 127.5 * c, 17 * c);
    d.bezierCurveTo(136.5 * c, 5 * c, 137.5 * c, 5 * c, 139.5 * c, 18 * c);
    d.bezierCurveTo(140.5 * c, 33 * c, 136.5 * c, 34 * c, 131.5 * c, 41 * c);
    d.bezierCurveTo(120.5 * c, 53 * c, 118.5 * c, 52 * c, 117.5 * c, 42 * c);
    d.closePath();
    fill_path(d, g[4], g[5], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(103.5 * c, 129 * c);
    d.bezierCurveTo(111.5 * c, 112 * c, 112.5 * c, 111 * c, 117.5 * c, 114 * c);
    d.bezierCurveTo(125.5 * c, 129 * c, 123.5 * c, 128 * c, 125.5 * c, 130 * c);
    d.bezierCurveTo(111.5 * c, 138 * c, 109.5 * c, 133 * c, 104.5 * c, 130 * c);
    d.closePath();
    fill_path(d, g[4], g[8], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(101.5 * c, 177 * c);
    d.bezierCurveTo(109.5 * c, 157 * c, 114.5 * c, 150 * c, 119.5 * c, 159 * c);
    d.bezierCurveTo(124 * c, 168 * c, 124 * c, 168 * c, 128.5 * c, 177 * c);
    d.bezierCurveTo(113.5 * c, 187 * c, 108.5 * c, 181 * c, 101.5 * c, 177 * c);
    d.closePath();
    fill_path(d, g[4], g[8], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(96.5 * c, 232 * c);
    d.bezierCurveTo(108.5 * c, 206 * c, 111.5 * c, 204 * c, 118.5 * c, 210 * c);
    d.bezierCurveTo(131.5 * c, 230 * c, 125 * c, 220 * c, 131.5 * c, 230 * c);
    d.bezierCurveTo(115.5 * c, 248 * c, 104.5 * c, 238 * c, 97.5 * c, 232 * c);
    d.closePath();
    fill_path(d, g[4], g[8], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(53.5 * c, 283 * c);
    d.bezierCurveTo(69.5 * c, 284 * c, 71.5 * c, 287 * c, 81.5 * c, 300 * c);
    d.bezierCurveTo(50.5 * c, 305 * c, 53.5 * c, 289 * c, 53.5 * c, 284 * c);
    d.closePath();
    fill_path(d, g[2]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(143.5 * c, 303 * c);
    d.bezierCurveTo(151.5 * c, 286 * c, 162.5 * c, 284 * c, 175.5 * c, 285 * c);
    d.bezierCurveTo(165.5 * c, 306 * c, 160.5 * c, 303 * c, 143.5 * c, 304 * c);
    d.closePath();
    fill_path(d, g[2]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(78.5 * c, 337 * c);
    d.bezierCurveTo(85.5 * c, 340 * c, 89.5 * c, 341 * c, 86.5 * c, 343 * c);
    d.bezierCurveTo(80.5 * c, 340 * c, 80.5 * c, 341 * c, 78.5 * c, 337 * c);
    d.closePath();
    fill_path(d, g[0], g[0], 2 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(134.5 * c, 345 * c);
    d.bezierCurveTo(141.5 * c, 337 * c, 143.5 * c, 337 * c, 147.5 * c, 338 * c);
    d.bezierCurveTo(145.5 * c, 345 * c, 140.5 * c, 345 * c, 135.5 * c, 345 * c);
    d.closePath();
    fill_path(d, g[0]);
    circle(d, 162.5 * c, 292 * c, 9 * c);
    fill_path(d, g[10]);
    circle(d, 63.5 * c, 292 * c, 9 * c);
    fill_path(d, g[10]);
    circle(d, 61 * c, 289 * c, 5 * c);
    fill_path(d, g[7]);
    circle(d, 160 * c, 289 * c, 5 * c);
    fill_path(d, g[7]);
    return f;
}
function create_hurt_dragon(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 229 * c;
    f.height = 371 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(89 * c, 94 * c);
    d.bezierCurveTo(99 * c, 52 * c, 101 * c, 33 * c, 115 * c, 35 * c);
    d.bezierCurveTo(137 * c, 37 * c, 132 * c, 66 * c, 142 * c, 95 * c);
    d.bezierCurveTo(208 * c, 155 * c, 216 * c, 176 * c, 221 * c, 226 * c);
    d.bezierCurveTo(221 * c, 276 * c, 186 * c, 299 * c, 171 * c, 311 * c);
    d.bezierCurveTo(143 * c, 352 * c, 150 * c, 352 * c, 111 * c, 354 * c);
    d.bezierCurveTo(71 * c, 349 * c, 74 * c, 341 * c, 55 * c, 316 * c);
    d.bezierCurveTo(0 * c, 260 * c, 7 * c, 237 * c, 12 * c, 191 * c);
    d.bezierCurveTo(29 * c, 132 * c, 77 * c, 105 * c, 89 * c, 95 * c);
    d.closePath();
    fill_path(d, g, g, 4 * c);
    return f;
}
function create_wingleft(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 156 * c;
    f.height = 189 * c;
    d.globalAlpha = .5;
    d.translate(0, 10);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(139 * c, 178 * c);
    d.bezierCurveTo(47 * c, 119 * c, 48 * c, 122 * c, 40 * c, 119 * c);
    d.bezierCurveTo(31 * c, 119 * c, 41 * c, 93 * c, 18 * c, 23 * c);
    d.bezierCurveTo(11 * c, 1 * c, 16 * c, 1 * c, 22 * c, 13 * c);
    d.bezierCurveTo(42 * c, 66 * c, 48 * c, 88 * c, 53 * c, 103 * c);
    d.bezierCurveTo(71 * c, 112 * c, 138 * c, 155 * c, 146 * c, 160 * c);
    d.bezierCurveTo(149 * c, 173 * c, 144 * c, 174 * c, 140 * c, 178 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    d.translate(0, -10);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(17 * c, 11 * c);
    d.bezierCurveTo(31 * c, 13 * c, 63 * c, 31 * c, 74 * c, 33 * c);
    d.bezierCurveTo(77 * c, 66 * c, 91 * c, 73 * c, 110 * c, 83 * c);
    d.bezierCurveTo(109 * c, 119 * c, 125 * c, 141 * c, 135 * c, 160 * c);
    d.bezierCurveTo(47 * c, 113 * c, 48 * c, 117 * c, 42 * c, 111 * c);
    d.closePath();
    fill_path(d, g[3]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(46 * c, 95 * c);
    d.bezierCurveTo(72 * c, 33 * c, 71 * c, 35 * c, 72 * c, 34 * c);
    d.bezierCurveTo(60.5 * c, 70 * c, 60.5 * c, 70 * c, 49 * c, 106 * c);
    d.closePath();
    fill_path(d, g[4]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(49 * c, 99 * c);
    d.bezierCurveTo(107 * c, 85 * c, 80 * c, 91 * c, 111 * c, 84 * c);
    d.bezierCurveTo(80.5 * c, 95 * c, 80.5 * c, 95 * c, 50 * c, 106 * c);
    d.closePath();
    fill_path(d, g[4]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(139 * c, 178 * c);
    d.bezierCurveTo(47 * c, 119 * c, 48 * c, 122 * c, 40 * c, 119 * c);
    d.bezierCurveTo(31 * c, 119 * c, 41 * c, 93 * c, 18 * c, 23 * c);
    d.bezierCurveTo(11 * c, 1 * c, 16 * c, 1 * c, 22 * c, 13 * c);
    d.bezierCurveTo(42 * c, 66 * c, 48 * c, 88 * c, 53 * c, 103 * c);
    d.bezierCurveTo(71 * c, 112 * c, 138 * c, 155 * c, 146 * c, 160 * c);
    d.bezierCurveTo(149 * c, 173 * c, 144 * c, 174 * c, 140 * c, 178 * c);
    d.closePath();
    fill_path(d, g[1], g[2], 4 * c);
    return f;
}
function create_hurt_wingleft(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 156 * c;
    f.height = 189 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(139 * c, 178 * c);
    d.bezierCurveTo(47 * c, 119 * c, 48 * c, 122 * c, 40 * c, 119 * c);
    d.bezierCurveTo(31 * c, 119 * c, 41 * c, 93 * c, 18 * c, 23 * c);
    d.bezierCurveTo(11 * c, 1 * c, 16 * c, 1 * c, 22 * c, 13 * c);
    d.bezierCurveTo(42 * c, 66 * c, 48 * c, 88 * c, 53 * c, 103 * c);
    d.bezierCurveTo(71 * c, 112 * c, 138 * c, 155 * c, 146 * c, 160 * c);
    d.bezierCurveTo(149 * c, 173 * c, 144 * c, 174 * c, 140 * c, 178 * c);
    d.closePath();
    fill_path(d, g, g, 4 * c);
    return f;
}
function create_wingright(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 175 * c;
    f.height = 190 * c;
    d.globalAlpha = .5;
    d.translate(0, 10 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(7.5 * c, 165 * c);
    d.bezierCurveTo(52.5 * c, 136 * c, 96.5 * c, 117 * c, 110.5 * c, 111 * c);
    d.bezierCurveTo(124.5 * c, 73 * c, 136.5 * c, 42 * c, 150.5 * c, 13 * c);
    d.bezierCurveTo(155.5 * c, 1 * c, 165.5 * c, 1 * c, 156.5 * c, 17 * c);
    d.bezierCurveTo(120.5 * c, 94 * c, 125.5 * c, 112 * c, 126.5 * c, 113 * c);
    d.bezierCurveTo(130.5 * c, 119 * c, 124.5 * c, 123 * c, 116.5 * c, 123 * c);
    d.bezierCurveTo(86.5 * c, 139 * c, 31.5 * c, 171 * c, 19.5 * c, 179 * c);
    d.bezierCurveTo(7.5 * c, 176 * c, 9.5 * c, 173 * c, 7.5 * c, 166 * c);
    d.closePath();
    fill_path(d, g[0]);
    d.globalAlpha = 1;
    d.translate(0, -10 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(155.5 * c, 10 * c);
    d.bezierCurveTo(126 * c, 21 * c, 126 * c, 21 * c, 96.5 * c, 33 * c);
    d.bezierCurveTo(85.5 * c, 71 * c, 70.5 * c, 77 * c, 54.5 * c, 85 * c);
    d.bezierCurveTo(56.5 * c, 104 * c, 45.5 * c, 125 * c, 28.5 * c, 156 * c);
    d.bezierCurveTo(112.5 * c, 117 * c, 73.5 * c, 135 * c, 118.5 * c, 115 * c);
    d.closePath();
    fill_path(d, g[3]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(96.5 * c, 31 * c);
    d.bezierCurveTo(108 * c, 66 * c, 108 * c, 66 * c, 119.5 * c, 101 * c);
    d.bezierCurveTo(119.5 * c, 106 * c, 119.5 * c, 106 * c, 119.5 * c, 112 * c);
    d.bezierCurveTo(86.5 * c, 98 * c, 86.5 * c, 98 * c, 53.5 * c, 84 * c);
    d.bezierCurveTo(84 * c, 94 * c, 84 * c, 94 * c, 114.5 * c, 104 * c);
    d.bezierCurveTo(105.5 * c, 68 * c, 105.5 * c, 68 * c, 96.5 * c, 32 * c);
    d.closePath();
    fill_path(d, g[4]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(7.5 * c, 165 * c);
    d.bezierCurveTo(52.5 * c, 136 * c, 96.5 * c, 117 * c, 110.5 * c, 111 * c);
    d.bezierCurveTo(124.5 * c, 73 * c, 136.5 * c, 42 * c, 150.5 * c, 13 * c);
    d.bezierCurveTo(155.5 * c, 1 * c, 165.5 * c, 1 * c, 156.5 * c, 17 * c);
    d.bezierCurveTo(120.5 * c, 94 * c, 125.5 * c, 112 * c, 126.5 * c, 113 * c);
    d.bezierCurveTo(130.5 * c, 119 * c, 124.5 * c, 123 * c, 116.5 * c, 123 * c);
    d.bezierCurveTo(86.5 * c, 139 * c, 31.5 * c, 171 * c, 19.5 * c, 179 * c);
    d.bezierCurveTo(7.5 * c, 176 * c, 9.5 * c, 173 * c, 7.5 * c, 166 * c);
    d.closePath();
    fill_path(d, g[1], g[2], 4 * c);
    return f;
}
function create_hurt_wingright(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    f.width = 175 * c;
    f.height = 190 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(7.5 * c, 165 * c);
    d.bezierCurveTo(52.5 * c, 136 * c, 96.5 * c, 117 * c, 110.5 * c, 111 * c);
    d.bezierCurveTo(124.5 * c, 73 * c, 136.5 * c, 42 * c, 150.5 * c, 13 * c);
    d.bezierCurveTo(155.5 * c, 1 * c, 165.5 * c, 1 * c, 156.5 * c, 17 * c);
    d.bezierCurveTo(120.5 * c, 94 * c, 125.5 * c, 112 * c, 126.5 * c, 113 * c);
    d.bezierCurveTo(130.5 * c, 119 * c, 124.5 * c, 123 * c, 116.5 * c, 123 * c);
    d.bezierCurveTo(86.5 * c, 139 * c, 31.5 * c, 171 * c, 19.5 * c, 179 * c);
    d.bezierCurveTo(7.5 * c, 176 * c, 9.5 * c, 173 * c, 7.5 * c, 166 * c);
    d.closePath();
    fill_path(d, g, g, 4 * c);
    return f;
}
function create_explorer_hat(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 187 * c;
    d.height = 119 * c;
    e.globalAlpha = g ? .5 : 1;
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.translate(0, 3);
    e.moveTo(53 * c, 45 * c);
    e.bezierCurveTo(3 * c, 60 * c, 11 * c, 72 * c, 19 * c, 81 * c);
    e.bezierCurveTo(28 * c, 82 * c, 24 * c, 81 * c, 29 * c, 82 * c);
    e.bezierCurveTo(26 * c, 87 * c, 28 * c, 84 * c, 28 * c, 87 * c);
    e.bezierCurveTo(63 * c, 101 * c, 92 * c, 100 * c, 138 * c, 93 * c);
    e.bezierCurveTo(172 * c, 87 * c, 180 * c, 72 * c, 168 * c, 62 * c);
    e.bezierCurveTo(154 * c, 51 * c, 150 * c, 50 * c, 148 * c, 49 * c);
    e.bezierCurveTo(132 * c, 42 * c, 90 * c, 40 * c, 55 * c, 45 * c);
    e.closePath();
    fill_path(e, f[5]);
    e.globalAlpha = 1;
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.translate(0, -3);
    e.moveTo(53 * c, 45 * c);
    e.bezierCurveTo(3 * c, 60 * c, 11 * c, 72 * c, 19 * c, 81 * c);
    e.bezierCurveTo(28 * c, 82 * c, 24 * c, 81 * c, 29 * c, 82 * c);
    e.bezierCurveTo(26 * c, 87 * c, 28 * c, 84 * c, 28 * c, 87 * c);
    e.bezierCurveTo(63 * c, 101 * c, 92 * c, 100 * c, 138 * c, 93 * c);
    e.bezierCurveTo(172 * c, 87 * c, 180 * c, 72 * c, 168 * c, 62 * c);
    e.bezierCurveTo(154 * c, 51 * c, 150 * c, 50 * c, 148 * c, 49 * c);
    e.bezierCurveTo(132 * c, 42 * c, 90 * c, 40 * c, 55 * c, 45 * c);
    e.closePath();
    fill_path(e, f[0], f[1], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(151 * c, 60 * c);
    e.bezierCurveTo(140 * c, 36 * c, 137 * c, 32 * c, 124 * c, 29 * c);
    e.bezierCurveTo(98 * c, 22 * c, 80 * c, 24 * c, 62 * c, 28 * c);
    e.bezierCurveTo(42 * c, 35 * c, 38 * c, 46 * c, 34 * c, 58 * c);
    e.bezierCurveTo(53 * c, 74 * c, 76 * c, 76 * c, 91 * c, 78 * c);
    e.closePath();
    fill_path(e, f[0], f[1], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(37 * c, 53 * c);
    e.bezierCurveTo(30 * c, 56 * c, 29 * c, 67 * c, 30 * c, 68 * c);
    e.bezierCurveTo(94 * c, 108 * c, 150 * c, 76 * c, 155 * c, 70 * c);
    e.bezierCurveTo(154 * c, 60 * c, 151 * c, 54 * c, 149 * c, 53 * c);
    e.bezierCurveTo(101 * c, 74 * c, 66 * c, 66 * c, 37 * c, 53 * c);
    e.closePath();
    fill_path(e, f[2], f[3], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(100 * c, 36 * c);
    e.bezierCurveTo(92 * c, 25 * c, 86 * c, 28 * c, 82 * c, 34 * c);
    e.bezierCurveTo(88 * c, 40 * c, 93 * c, 40 * c, 98 * c, 36 * c);
    e.closePath();
    fill_path(e, f[0], f[1], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(80 * c, 43 * c);
    e.bezierCurveTo(69 * c, 46 * c, 67 * c, 52 * c, 69 * c, 58 * c);
    fill_path(e, void 0, f[1], 4 * c);
    circle(e, 58 * c, 50 * c, 5 * c);
    fill_path(e, f[4]);
    circle(e, 43 * c, 65 * c, 5 * c);
    fill_path(e, f[4]);
    circle(e, 58 * c, 73 * c, 5 * c);
    fill_path(e, f[4]);
    circle(e, 58 * c, 50 * c, 2 * c);
    fill_path(e, f[5]);
    circle(e, 43 * c, 65 * c, 2 * c);
    fill_path(e, f[5]);
    circle(e, 58 * c, 73 * c, 2 * c);
    fill_path(e, f[5]);
    return d;
}
function create_viking_hat(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 175 * c;
    d.height = 106 * c;
    e.globalAlpha = g ? .5 : 1;
    e.save();
    e.translate(88 * c, 83 * c);
    e.rotate(0);
    round_rect(e, -61.5 * c, -6.5 * c, 123 * c, 13 * c, 30 * c);
    e.restore();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.save();
    e.translate(88 * c, 58 * c);
    e.rotate(0);
    round_rect(e, -57.5 * c, -28.5 * c, 115 * c, 57 * c, 30 * c);
    e.restore();
    fill_path(e, f[1], f[2], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(45.83332824707031 * c, 42.682281494140625 * c);
    e.bezierCurveTo(32.83332824707031 * c, 37.682281494140625 * c, 26.833328247070312 * c, 30.682281494140625 * c, 18.833328247070312 * c, 21.682281494140625 * c);
    e.bezierCurveTo(10.833328247070312 * c, 13.682281494140625 * c, 11.833328247070312 * c, 13.682281494140625 * c, 10.833328247070312 * c, 26.682281494140625 * c);
    e.bezierCurveTo(9.833328247070312 * c, 46.682281494140625 * c, 20.833328247070312 * c, 57.682281494140625 * c, 34.83332824707031 * c, 65.68228149414062 * c);
    e.closePath();
    fill_path(e, f[3], f[4], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(129.8333282470703 * c, 46.015625 * c);
    e.bezierCurveTo(141.8333282470703 * c, 44.015625 * c, 152.8333282470703 * c, 30.015625 * c, 157.8333282470703 * c, 23.015625 * c);
    e.bezierCurveTo(165.8333282470703 * c, 10.015625 * c, 167.8333282470703 * c, 15.015625 * c, 165.8333282470703 * c, 32.015625 * c);
    e.bezierCurveTo(164.8333282470703 * c, 49.015625 * c, 150.8333282470703 * c, 64.015625 * c, 142.8333282470703 * c, 69.015625 * c);
    e.closePath();
    fill_path(e, f[3], f[4], 4 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(29 * c, 74 * c);
    e.bezierCurveTo(26 * c, 47 * c, 39 * c, 35 * c, 61 * c, 38 * c);
    e.bezierCurveTo(92 * c, 38 * c, 92 * c, 38 * c, 124 * c, 38 * c);
    e.bezierCurveTo(156 * c, 47 * c, 149 * c, 65 * c, 149 * c, 82 * c);
    e.bezierCurveTo(88 * c, 83 * c, 88 * c, 83 * c, 28 * c, 83 * c);
    e.closePath();
    fill_path(e, f[5], f[2], 4 * c);
    e.save();
    e.translate(90 * c, 36 * c);
    e.rotate(0);
    round_rect(e, -6 * c, -10 * c, 12 * c, 20 * c, 30 * c);
    e.restore();
    fill_path(e, f[6], f[4], 4 * c);
    e.save();
    e.translate(89 * c, 58 * c);
    e.rotate(0);
    round_rect(e, -6.5 * c, -25 * c, 13 * c, 50 * c, 30 * c);
    e.restore();
    fill_path(e, f[3], f[4], 4 * c);
    e.save();
    e.translate(88 * c, 83.875 * c);
    e.rotate(0);
    round_rect(e, -61.5 * c, -6.5 * c, 123 * c, 13 * c, 30 * c);
    e.restore();
    fill_path(e, f[3], f[4], 4 * c);
    circle(e, 89 * c, 83.375 * c, 4 * c);
    fill_path(e, f[3], f[4], 4 * c);
    circle(e, 124 * c, 83 * c, 4 * c);
    fill_path(e, f[3], f[4], 4 * c);
    circle(e, 53 * c, 83 * c, 4 * c);
    fill_path(e, f[3], f[4], 4 * c);
    return d;
}
function create_gold_helmet(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 142 * c;
    g.height = 118 * c;
    d.save();
    d.translate(70.16665649414062 * c, 38.20831298828125 * c);
    round_rect(d, -58.5 * c, -27.5 * c, 117 * c, 55 * c, 20 * c);
    d.restore();
    fill_path(d, f[0], f[1], 4 * c);
    d.save();
    d.translate(70 * c, 42.70831298828125 * c);
    round_rect(d, -61 * c, -20 * c, 122 * c, 40 * c, 20 * c);
    d.restore();
    fill_path(d, f[2], f[1], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(123 * c, 70.375 * c);
    d.bezierCurveTo(115 * c, 99.375 * c, 119 * c, 85.375 * c, 115 * c, 100.375 * c);
    d.bezierCurveTo(112 * c, 116.375 * c, 117 * c, 109.375 * c, 131 * c, 100.375 * c);
    d.bezierCurveTo(131 * c, 83.375 * c, 131 * c, 83.375 * c, 131 * c, 66.375 * c);
    d.closePath();
    fill_path(d, f[2], f[1], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(11 * c, 68.375 * c);
    d.bezierCurveTo(11.166656494140625 * c, 84.375 * c, 9 * c, 99.375 * c, 10 * c, 100.375 * c);
    d.bezierCurveTo(35 * c, 113.375 * c, 27 * c, 110.375 * c, 25 * c, 95.375 * c);
    d.bezierCurveTo(16 * c, 68.375 * c, 17 * c, 69.375 * c, 17 * c, 68.375 * c);
    d.closePath();
    fill_path(d, f[2], f[1], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(46 * c, 32.375 * c);
    d.bezierCurveTo(43 * c, 8.375 * c, 45 * c, 7.375 * c, 56 * c, 6.375 * c);
    d.bezierCurveTo(105 * c, 4.375 * c, 102 * c, 6.375 * c, 97 * c, 32.375 * c);
    d.bezierCurveTo(138 * c, 43.375 * c, 133 * c, 45.375 * c, 133 * c, 58.375 * c);
    d.bezierCurveTo(133 * c, 85.375 * c, 125 * c, 74.375 * c, 111 * c, 70.375 * c);
    d.bezierCurveTo(70 * c, 69.875 * c, 29 * c, 69.375 * c, 29 * c, 69.375 * c);
    d.bezierCurveTo(7 * c, 84.375 * c, 7 * c, 70.375 * c, 7 * c, 59.375 * c);
    d.bezierCurveTo(6 * c, 28.375 * c, 32 * c, 39.375 * c, 44 * c, 32.375 * c);
    d.closePath();
    fill_path(d, f[2], f[1], 4 * c);
    circle(d, 71 * c, 44.375 * c, 16.55294535724685 * c);
    fill_path(d, f[2], f[1], 4 * c);
    circle(d, 71 * c, 43.70831298828125 * c, 8.94427190999916 * c);
    fill_path(d, f[2], f[1], 4 * c);
    return g;
}
function create_diamond_helmet(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 142 * c;
    g.height = 118 * c;
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(111 * c, 27.3671875 * c);
    d.bezierCurveTo(128 * c, 9.3671875 * c, 125 * c, 13.3671875 * c, 126 * c, 21.3671875 * c);
    d.bezierCurveTo(126 * c, 33.3671875 * c, 119 * c, 43.3671875 * c, 118 * c, 42.3671875 * c);
    d.closePath();
    fill_path(d, f[3], f[4], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(31 * c, 23.3671875 * c);
    d.bezierCurveTo(17 * c, 15.3671875 * c, 16 * c, 14.3671875 * c, 17 * c, 20.3671875 * c);
    d.bezierCurveTo(22 * c, 33.3671875 * c, 20 * c, 27.3671875 * c, 24 * c, 34.3671875 * c);
    d.closePath();
    fill_path(d, f[3], f[4], 4 * c);
    d.save();
    d.translate(70.5 * c, 34.8671875 * c);
    d.rotate(0);
    round_rect(d, -49.5 * c, -21.5 * c, 99 * c, 43 * c, 15 * c);
    d.restore();
    fill_path(d, f[0], f[1], 4 * c);
    d.save();
    d.translate(71 * c, 40.8671875 * c);
    d.rotate(0);
    round_rect(d, -49 * c, -12.5 * c, 98 * c, 25 * c, 15 * c);
    d.restore();
    fill_path(d, f[2], f[1], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(19.800003051757812 * c, 75.95625305175781 * c);
    d.bezierCurveTo(19.300003051757812 * c, 82.95625305175781 * c, 19.300003051757812 * c, 82.95625305175781 * c, 18.800003051757812 * c, 89.95625305175781 * c);
    d.bezierCurveTo(38.80000305175781 * c, 115.95625305175781 * c, 37.80000305175781 * c, 104.95625305175781 * c, 31.800003051757812 * c, 91.95625305175781 * c);
    d.closePath();
    fill_path(d, f[2], f[1], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(119.80000305175781 * c, 75.95625305175781 * c);
    d.bezierCurveTo(120.80000305175781 * c, 82.95625305175781 * c, 120.80000305175781 * c, 82.95625305175781 * c, 121.80000305175781 * c, 89.95625305175781 * c);
    d.bezierCurveTo(101.80000305175781 * c, 111.95625305175781 * c, 99.80000305175781 * c, 111.95625305175781 * c, 112.80000305175781 * c, 81.95625305175781 * c);
    d.closePath();
    fill_path(d, f[2], f[1], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(17.800003051757812 * c, 49.15625 * c);
    d.bezierCurveTo(17.800003051757812 * c, 64.15625 * c, 17.800003051757812 * c, 64.15625 * c, 17.800003051757812 * c, 79.15625 * c);
    d.bezierCurveTo(23.300003051757812 * c, 85.15625 * c, 23.300003051757812 * c, 85.15625 * c, 28.800003051757812 * c, 91.15625 * c);
    d.bezierCurveTo(36.80000305175781 * c, 96.15625 * c, 32.80000305175781 * c, 91.15625 * c, 28.800003051757812 * c, 77.15625 * c);
    d.bezierCurveTo(33.80000305175781 * c, 65.15625 * c, 33.80000305175781 * c, 65.15625 * c, 38.80000305175781 * c, 53.15625 * c);
    d.closePath();
    fill_path(d, f[3], f[4], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(123.80000305175781 * c, 53.95625305175781 * c);
    d.bezierCurveTo(121.80000305175781 * c, 77.95625305175781 * c, 121.80000305175781 * c, 74.95625305175781 * c, 121.80000305175781 * c, 78.95625305175781 * c);
    d.bezierCurveTo(115.80000305175781 * c, 84.95625305175781 * c, 115.80000305175781 * c, 84.95625305175781 * c, 109.80000305175781 * c, 90.95625305175781 * c);
    d.bezierCurveTo(102.80000305175781 * c, 93.95625305175781 * c, 105.80000305175781 * c, 86.95625305175781 * c, 110.80000305175781 * c, 76.95625305175781 * c);
    d.bezierCurveTo(107.30000305175781 * c, 65.45625305175781 * c, 103.80000305175781 * c, 53.95625305175781 * c, 103.80000305175781 * c, 53.95625305175781 * c);
    d.closePath();
    fill_path(d, f[3], f[4], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(18 * c, 56.3671875 * c);
    d.bezierCurveTo(70 * c, 56.8671875 * c, 70 * c, 56.8671875 * c, 122 * c, 57.3671875 * c);
    d.bezierCurveTo(137 * c, 20.3671875 * c, 137 * c, 16.3671875 * c, 126 * c, 22.3671875 * c);
    d.bezierCurveTo(115.5 * c, 34.3671875 * c, 115.5 * c, 34.3671875 * c, 105 * c, 46.3671875 * c);
    d.bezierCurveTo(70.5 * c, 46.3671875 * c, 70.5 * c, 46.3671875 * c, 36 * c, 46.3671875 * c);
    d.bezierCurveTo(4 * c, 14.3671875 * c, 7 * c, 18.3671875 * c, 8 * c, 27.3671875 * c);
    d.bezierCurveTo(12.5 * c, 41.8671875 * c, 12.5 * c, 41.8671875 * c, 17 * c, 56.3671875 * c);
    d.closePath();
    fill_path(d, f[3], f[4], 4 * c);
    d.save();
    d.translate(68.30000305175781 * c, 41.45625305175781 * c);
    d.rotate(.76);
    round_rect(d, -20.5 * c, -20.5 * c, 41 * c, 41 * c, 10 * c);
    d.restore();
    fill_path(d, void 0, f[5], 4 * c);
    d.save();
    d.translate(68.80000305175781 * c, 44.45625305175781 * c);
    d.rotate(.76);
    round_rect(d, -21 * c, -20.5 * c, 42 * c, 41 * c, 10 * c);
    d.restore();
    fill_path(d, f[3], f[4], 4 * c);
    d.save();
    d.translate(69.80000305175781 * c, 44.556243896484375 * c);
    d.rotate(.76);
    round_rect(d, -10 * c, -10 * c, 20 * c, 20 * c, 5 * c);
    d.restore();
    fill_path(d, f[6], f[7], 4 * c);
    return g;
}
function create_book(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 400 * c;
    g.height = 400 * c;
    d.save();
    d.translate(204 * c, 195.0833282470703 * c);
    d.rotate(10.16);
    round_rect(d, -97.5 * c, -134.5 * c, 195 * c, 269 * c, 10 * c);
    d.restore();
    fill_path(d, f[0], f[1], 8 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(58.5 * c, 226.5833282470703 * c);
    d.bezierCurveTo(120.5 * c, 281.5833282470703 * c, 120.5 * c, 281.5833282470703 * c, 182.5 * c, 336.5833282470703 * c);
    d.bezierCurveTo(263 * c, 248.5833282470703 * c, 263 * c, 248.5833282470703 * c, 343.5 * c, 160.5833282470703 * c);
    d.bezierCurveTo(280.5 * c, 104.58332824707031 * c, 280.5 * c, 104.58332824707031 * c, 217.5 * c, 48.58332824707031 * c);
    d.closePath();
    fill_path(d, f[2], f[3], 4 * c);
    d.save();
    d.translate(197 * c, 169.0833282470703 * c);
    d.rotate(10.16);
    round_rect(d, -93.5 * c, -126.5 * c, 187 * c, 253 * c, 10 * c);
    d.restore();
    fill_path(d, f[4], f[1], 8 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(226.5 * c, 24.583328247070312 * c);
    d.bezierCurveTo(58.5 * c, 207.5833282470703 * c, 143 * c, 116.58332824707031 * c, 59.5 * c, 208.5833282470703 * c);
    d.closePath();
    fill_path(d, void 0, f[1], 8 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(46.133331298828125 * c, 202.64999389648438 * c);
    d.bezierCurveTo(46.133331298828125 * c, 215.64999389648438 * c, 46.133331298828125 * c, 215.64999389648438 * c, 46.133331298828125 * c, 228.64999389648438 * c);
    d.closePath();
    fill_path(d, f[4], f[1], 8 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(55.133331298828125 * c, 211.64999389648438 * c);
    d.bezierCurveTo(55.133331298828125 * c, 225.14999389648438 * c, 55.133331298828125 * c, 225.14999389648438 * c, 55.133331298828125 * c, 238.64999389648438 * c);
    d.bezierCurveTo(50.133331298828125 * c, 235.64999389648438 * c, 50.133331298828125 * c, 235.64999389648438 * c, 45.133331298828125 * c, 232.64999389648438 * c);
    d.bezierCurveTo(45.133331298828125 * c, 216.64999389648438 * c, 45.133331298828125 * c, 216.64999389648438 * c, 45.133331298828125 * c, 200.64999389648438 * c);
    d.closePath();
    fill_path(d, f[4], f[1], 8 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(46.133331298828125 * c, 198.39999389648438 * c);
    d.bezierCurveTo(46.133331298828125 * c, 199.89999389648438 * c, 46.133331298828125 * c, 199.89999389648438 * c, 46.133331298828125 * c, 201.39999389648438 * c);
    d.closePath();
    fill_path(d, f[4], f[1], 8 * c);
    d.save();
    d.translate(249.63333129882812 * c, 120.89999389648438 * c);
    d.rotate(7.04);
    round_rect(d, -58.5 * c, -32 * c, 117 * c, 64 * c, 10 * c);
    d.restore();
    fill_path(d, f[5]);
    return g;
}
function create_paper(c, g, f) {
    var d = document.createElement("canvas");
    var e = d.getContext("2d");
    d.width = 170 * c;
    d.height = 170 * c;
    e.globalAlpha = g ? .5 : 1;
    e.translate(-10 * c, 10 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(72.5 * c, 4.109375 * c);
    e.bezierCurveTo(117 * c, 9.609375 * c, 117 * c, 9.609375 * c, 161.5 * c, 15.109375 * c);
    e.bezierCurveTo(134.5 * c, 106.109375 * c, 110.5 * c, 130.109375 * c, 63.5 * c, 145.109375 * c);
    e.bezierCurveTo(33.5 * c, 120.609375 * c, 33.5 * c, 120.609375 * c, 3.5 * c, 96.109375 * c);
    e.bezierCurveTo(82.5 * c, 75.109375 * c, 69.5 * c, 29.109375 * c, 71.5 * c, 6.109375 * c);
    e.closePath();
    fill_path(e, f[0]);
    e.globalAlpha = 1;
    e.translate(10 * c, -10 * c);
    e.beginPath();
    e.lineCap = "round";
    e.lineJoin = "round";
    e.moveTo(72.5 * c, 4.109375 * c);
    e.bezierCurveTo(117 * c, 9.609375 * c, 117 * c, 9.609375 * c, 161.5 * c, 15.109375 * c);
    e.bezierCurveTo(134.5 * c, 106.109375 * c, 110.5 * c, 130.109375 * c, 63.5 * c, 145.109375 * c);
    e.bezierCurveTo(33.5 * c, 120.609375 * c, 33.5 * c, 120.609375 * c, 3.5 * c, 96.109375 * c);
    e.bezierCurveTo(82.5 * c, 75.109375 * c, 69.5 * c, 29.109375 * c, 71.5 * c, 6.109375 * c);
    e.closePath();
    fill_path(e, f[1], f[2], 10 * c);
    return d;
}
function create_leaderboard(c) {
    var g = document.createElement("canvas");
    var f = g.getContext("2d");
    var d = 200 * c;
    var e = 280 * c;
    var m = 10 * c;
    g.width = d;
    g.height = e;
    f.beginPath();
    round_rect(f, 0, -m, d + m, e - m, m);
    f.globalAlpha = .8;
    fill_path(f, "#3D8075");
    f.globalAlpha = 1;
    e = create_text(c, "Leaderboard", 25, "#FFF");
    f.drawImage(e, (d - e.width) / 2, 5 * c);
    return g;
}
function create_button_background(c, g) {
    var f = document.createElement("canvas");
    var d = f.getContext("2d");
    var e = c.w + c.lw;
    var m = c.h + c.lw;
    var p = .1 * m;
    f.width = e;
    f.height = m + p;
    d.beginPath();
    d.translate(e / 2, m / 2 + p);
    d.globalAlpha = .5;
    round_rect(d, -c.w / 2, -c.h / 2, c.w, c.h, c.r);
    fill_path(d, "#000", "#000", c.lw);
    d.globalAlpha = 1;
    d.beginPath();
    if (!g) {
        d.translate(0, -p);
    }
    round_rect(d, -c.w / 2, -c.h / 2, c.w, c.h, c.r);
    fill_path(d, c.bg, c.fg, c.lw);
    d.beginPath();
    d.fillStyle = c.color;
    d.textBaseline = "middle";
    d.textAlign = "center";
    d.font = c.size + "px " + c.font;
    d.fillText(c.text, 0, 0);
    return f;
}
function create_button(c) {
    var g = [];
    for (var f = 0; f < c.length; f++) {
        g.push(create_button_background(c[f], f == 2 ? true : false));
    }
    return g;
}
function create_gauges(c) {
    var g = document.createElement("canvas");
    var f = g.getContext("2d");
    var d = 335 * c;
    var e = 250 * c;
    var m = 120 * c;
    var p = 20 * c;
    var n = 35 * c;
    var r = 65 * c;
    var u = 8 * c;
    var q = 4 * c;
    g.width = d;
    g.height = m;
    f.globalAlpha = .3;
    round_rect(f, 2 * -u, 0, d + 2 * u, 1.2 * m, 2 * u);
    fill_path(f, "#000");
    f.globalAlpha = 1;
    f.beginPath();
    f.translate(0, 15 * c);
    d = create_text(c, "Life", 15, "#FFF");
    f.drawImage(d, 12 * c, 3 * c);
    round_rect(f, r, 0, e, p, u);
    fill_path(f, null, "#69A148", q);
    f.translate(0, n);
    d = create_text(c, "Food", 15, "#FFF");
    f.drawImage(d, 12 * c, 3 * c);
    round_rect(f, r, 0, e, p, u);
    fill_path(f, null, "#AF352A", q);
    f.translate(0, n);
    d = create_text(c, "Cold", 15, "#FFF");
    f.drawImage(d, 12 * c, 3 * c);
    round_rect(f, r, 0, e, p, u);
    fill_path(f, null, "#669BB1", q);
    return g;
}
function create_images() {
    sprite[SPRITE.FLAKES] = [];
    sprite[SPRITE.FLAKES][SPRITE.DAY] = [];
    sprite[SPRITE.FLAKES][SPRITE.NIGHT] = [];
    for (var c = 0; c < SPRITE.FLAKES_SIZES; c++) {
        sprite[SPRITE.FLAKES][SPRITE.DAY].push(CTI(create_flake(1, 4 + c, "#fff")));
        sprite[SPRITE.FLAKES][SPRITE.NIGHT].push(CTI(create_flake(1, 4 + c, "#fff")));
    }
    sprite[SPRITE.STONES] = [];
    sprite[SPRITE.STONES][SPRITE.DAY] = [];
    sprite[SPRITE.STONES][SPRITE.NIGHT] = [];
    sprite[SPRITE.STONES][SPRITE.DAY].push(CTI(create_stone(1.1, false, ["#252B28", "#58645F", "#75827D"])));
    sprite[SPRITE.STONES][SPRITE.DAY].push(CTI(create_stone(.9, false, ["#252B28", "#58645F", "#75827D"])));
    sprite[SPRITE.STONES][SPRITE.DAY].push(CTI(create_stone(.6, false, ["#252B28", "#58645F", "#75827D"])));
    sprite[SPRITE.STONES][SPRITE.NIGHT].push(CTI(create_stone(1.1, false, ["#030d14", "#123335", "#183f3f"])));
    sprite[SPRITE.STONES][SPRITE.NIGHT].push(CTI(create_stone(.9, false, ["#030d14", "#123335", "#183f3f"])));
    sprite[SPRITE.STONES][SPRITE.NIGHT].push(CTI(create_stone(.6, false, ["#030d14", "#123335", "#183f3f"])));
    sprite[SPRITE.GOLD] = [];
    sprite[SPRITE.GOLD][SPRITE.DAY] = [];
    sprite[SPRITE.GOLD][SPRITE.NIGHT] = [];
    sprite[SPRITE.GOLD][SPRITE.DAY].push(CTI(create_gold(1.5, false, ["#282823", "#877c2d", "#c4bc51"])));
    sprite[SPRITE.GOLD][SPRITE.DAY].push(CTI(create_gold(1.3, false, ["#282823", "#877c2d", "#c4bc51"])));
    sprite[SPRITE.GOLD][SPRITE.DAY].push(CTI(create_gold(1.1, false, ["#282823", "#877c2d", "#c4bc51"])));
    sprite[SPRITE.GOLD][SPRITE.NIGHT].push(CTI(create_gold(1.5, false, ["#030d14", "#1b4444", "#16605a"])));
    sprite[SPRITE.GOLD][SPRITE.NIGHT].push(CTI(create_gold(1.3, false, ["#030d14", "#1b4444", "#16605a"])));
    sprite[SPRITE.GOLD][SPRITE.NIGHT].push(CTI(create_gold(1.1, false, ["#030d14", "#1b4444", "#16605a"])));
    sprite[SPRITE.DIAMOND] = [];
    sprite[SPRITE.DIAMOND][SPRITE.DAY] = [];
    sprite[SPRITE.DIAMOND][SPRITE.NIGHT] = [];
    sprite[SPRITE.DIAMOND][SPRITE.DAY].push(CTI(create_diamond(1.1, false, ["#232828", "#3fc9c9", "#74ede6"])));
    sprite[SPRITE.DIAMOND][SPRITE.DAY].push(CTI(create_diamond(.9, false, ["#232828", "#3fc9c9", "#74ede6"])));
    sprite[SPRITE.DIAMOND][SPRITE.DAY].push(CTI(create_diamond(.7, false, ["#232828", "#3fc9c9", "#74ede6"])));
    sprite[SPRITE.DIAMOND][SPRITE.NIGHT].push(CTI(create_diamond(1.1, false, ["#030d14", "#2b9390", "#57bcb5"])));
    sprite[SPRITE.DIAMOND][SPRITE.NIGHT].push(CTI(create_diamond(.9, false, ["#030d14", "#2b9390", "#57bcb5"])));
    sprite[SPRITE.DIAMOND][SPRITE.NIGHT].push(CTI(create_diamond(.7, false, ["#030d14", "#2b9390", "#57bcb5"])));
    sprite[SPRITE.BODY] = [];
    sprite[SPRITE.BODY][SPRITE.DAY] = CTI(create_player(.6, ["#0d1b1c", "#dff2f7", "#187484", "#231f20", "#ffffff"]));
    sprite[SPRITE.BODY][SPRITE.NIGHT] = CTI(create_player(.6, ["#030d14", "#106664", "#01333a", "#15183f", "#ffffff"]));
    sprite[SPRITE.HAND] = [];
    sprite[SPRITE.HAND][SPRITE.DAY] = CTI(create_hand(.6, ["#dff2f7", "#187484"]));
    sprite[SPRITE.HAND][SPRITE.NIGHT] = CTI(create_hand(.6, ["#106664", "#01333a"]));
    sprite[SPRITE.HAND_SHADOW] = [];
    sprite[SPRITE.HAND_SHADOW][SPRITE.DAY] = CTI(create_hand_shadow(.6, ["#0d1b1c"]));
    sprite[SPRITE.HAND_SHADOW][SPRITE.NIGHT] = CTI(create_hand_shadow(.6, ["#030d14"]));
    sprite[SPRITE.TREE] = [];
    sprite[SPRITE.TREE][SPRITE.DAY] = [];
    sprite[SPRITE.TREE][SPRITE.NIGHT] = [];
    sprite[SPRITE.TREE][SPRITE.DAY].push(create_apricot_tree(1.1, ["#0e3022", "#0c8e5b", "#037542", "#209e64"], false));
    sprite[SPRITE.TREE][SPRITE.DAY].push(create_apricot_tree(1.1, ["#0e3022", "#0c8e5b", "#037542", "#209e64"], true));
    sprite[SPRITE.TREE][SPRITE.DAY].push(create_apricot_tree(.9, ["#0e3022", "#096d41", "#1f7b43", "#1f7b43"], false));
    sprite[SPRITE.TREE][SPRITE.DAY].push(create_apricot_tree(.9, ["#0e3022", "#096d41", "#1f7b43", "#1f7b43"], true));
    sprite[SPRITE.TREE][SPRITE.DAY].push(create_apricot_tree(.7, ["#0e3022", "#124c34", "#0E3D26", "#155136"], false));
    sprite[SPRITE.TREE][SPRITE.DAY].push(create_apricot_tree(.7, ["#0e3022", "#124c34", "#0E3D26", "#155136"], true));
    sprite[SPRITE.TREE][SPRITE.NIGHT].push(create_apricot_tree(1.1, ["#030d14", "#124949", "#0e3838", "#15514f"], true));
    sprite[SPRITE.TREE][SPRITE.NIGHT].push(create_apricot_tree(1.1, ["#030d14", "#124949", "#0e3838", "#15514f"], false));
    sprite[SPRITE.TREE][SPRITE.NIGHT].push(create_apricot_tree(.9, ["#030d14", "#0b3534", "#144443", "#174240"], true));
    sprite[SPRITE.TREE][SPRITE.NIGHT].push(create_apricot_tree(.9, ["#030d14", "#0b3534", "#144443", "#174240"], false));
    sprite[SPRITE.TREE][SPRITE.NIGHT].push(create_apricot_tree(.7, ["#030d14", "#082b29", "#073332", "#073332"], false));
    sprite[SPRITE.TREE][SPRITE.NIGHT].push(create_apricot_tree(.7, ["#030d14", "#082b29", "#073332", "#073332"], true));
    sprite[SPRITE.TREE_BRANCH] = [];
    sprite[SPRITE.TREE_BRANCH][SPRITE.DAY] = [];
    sprite[SPRITE.TREE_BRANCH][SPRITE.NIGHT] = [];
    sprite[SPRITE.TREE_BRANCH][SPRITE.DAY].push(CTI(create_apricot_forest(create_tree_branch(1.1, "#0e3022 #4d2d14 #432516 #096d41 #08562e #107746".split(" "), false), sprite[SPRITE.TREE][SPRITE.DAY][0])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.DAY].push(CTI(create_apricot_forest(create_tree_branch(1.1, "#0e3022 #4d2d14 #432516 #096d41 #08562e #107746".split(" "), true), sprite[SPRITE.TREE][SPRITE.DAY][0])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.NIGHT].push(CTI(create_apricot_forest(create_tree_branch(1.1, "#030d14 #031619 #041c21 #0a3333 #113f3c #113f3c".split(" "), false), sprite[SPRITE.TREE][SPRITE.NIGHT][1])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.NIGHT].push(CTI(create_apricot_forest(create_tree_branch(1.1, "#030d14 #031619 #041c21 #0a3333 #113f3c #113f3c".split(" "), true), sprite[SPRITE.TREE][SPRITE.NIGHT][1])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.DAY].push(CTI(create_apricot_forest(create_tree_branch(.9, "#0e3022 #4d2d14 #432516 #096d41 #107746 #107746".split(" "), false), sprite[SPRITE.TREE][SPRITE.DAY][2])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.DAY].push(CTI(create_apricot_forest(create_tree_branch(.9, "#0e3022 #4d2d14 #432516 #096d41 #107746 #107746".split(" "), true), sprite[SPRITE.TREE][SPRITE.DAY][2])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.NIGHT].push(CTI(create_apricot_forest(create_tree_branch(.9, "#030d14 #031619 #041c21 #082b29 #083b3a #083b3a".split(" "), false), sprite[SPRITE.TREE][SPRITE.NIGHT][3])));
    sprite[SPRITE.TREE_BRANCH][SPRITE.NIGHT].push(CTI(create_apricot_forest(create_tree_branch(.9, "#030d14 #031619 #041c21 #082b29 #083b3a #083b3a".split(" "), true), sprite[SPRITE.TREE][SPRITE.NIGHT][3])));
    sprite[SPRITE.TREE][SPRITE.DAY][2] = CTI(sprite[SPRITE.TREE][SPRITE.DAY][2]);
    sprite[SPRITE.TREE][SPRITE.DAY][1] = CTI(sprite[SPRITE.TREE][SPRITE.DAY][1]);
    sprite[SPRITE.TREE][SPRITE.DAY][0] = CTI(sprite[SPRITE.TREE][SPRITE.DAY][0]);
    sprite[SPRITE.TREE][SPRITE.NIGHT][2] = CTI(sprite[SPRITE.TREE][SPRITE.NIGHT][2]);
    sprite[SPRITE.TREE][SPRITE.NIGHT][1] = CTI(sprite[SPRITE.TREE][SPRITE.NIGHT][1]);
    sprite[SPRITE.TREE][SPRITE.NIGHT][0] = CTI(sprite[SPRITE.TREE][SPRITE.NIGHT][0]);
    sprite[SPRITE.PICK_WOOD] = [];
    sprite[SPRITE.PICK_WOOD][SPRITE.DAY] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #4d2d14 #432516".split(" "))));
    sprite[SPRITE.PICK_WOOD][SPRITE.NIGHT] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#030d14 #000000 #030d14 #0d2e33 #0b2326 #0d2e33 #0b2326".split(" "))));
    sprite[SPRITE.PICK] = [];
    sprite[SPRITE.PICK][SPRITE.DAY] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #939393 #5f6061".split(" "))));
    sprite[SPRITE.PICK][SPRITE.NIGHT] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#030d14 #000000 #030d14 #0d2e33 #0b2326 #485e66 #1f343f".split(" "))));
    sprite[SPRITE.PICK_GOLD] = [];
    sprite[SPRITE.PICK_GOLD][SPRITE.DAY] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#0d1b1c #000000 #0d1b1c #493e26 #382e19 #c4bc51 #b29c32".split(" "))));
    sprite[SPRITE.PICK_GOLD][SPRITE.NIGHT] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#030d14 #000000 #030d14 #263947 #182935 #43aa82 #29997c".split(" "))));
    sprite[SPRITE.PICK_DIAMOND] = [];
    sprite[SPRITE.PICK_DIAMOND][SPRITE.DAY] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#0d1b1c #000000 #0d1b1c #262114 #211108 #63c9d6 #29aaa1".split(" "))));
    sprite[SPRITE.PICK_DIAMOND][SPRITE.NIGHT] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#030d14 #000000 #030d14 #111316 #0a0b0c #73dde5 #3dc4c0".split(" "))));
    sprite[SPRITE.PICK_AMETHYST] = [];
    sprite[SPRITE.PICK_AMETHYST][SPRITE.DAY] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#0d1b1c #000000 #0d1b1c #262114 #211108 #b864d6 #8c29aa".split(" "))));
    sprite[SPRITE.PICK_AMETHYST][SPRITE.NIGHT] = CTI(create_rotated_img(4, create_pickaxe(.75, true, "#030d14 #000000 #030d14 #111316 #0a0b0c #8359d3 #764eb5".split(" "))));
    sprite[SPRITE.SWORD] = [];
    sprite[SPRITE.SWORD][SPRITE.DAY] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"])));
    sprite[SPRITE.SWORD][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#0d2e33", "#0b2326", "#485e66", "#1f343f"])));
    sprite[SPRITE.SWORD_GOLD] = [];
    sprite[SPRITE.SWORD_GOLD][SPRITE.DAY] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"])));
    sprite[SPRITE.SWORD_GOLD][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#263947", "#182935", "#43aa82", "#29997c"])));
    sprite[SPRITE.SWORD_DIAMOND] = [];
    sprite[SPRITE.SWORD_DIAMOND][SPRITE.DAY] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"])));
    sprite[SPRITE.SWORD_DIAMOND][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#111316", "#0a0b0c", "#73dde5", "#3dc4c0"])));
    sprite[SPRITE.SWORD_AMETHYST] = [];
    sprite[SPRITE.SWORD_AMETHYST][SPRITE.DAY] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"])));
    sprite[SPRITE.SWORD_AMETHYST][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_sword(.42, true, ["#0d1b1c", "#111316", "#0a0b0c", "#8359d3", "#764eb5"])));
    sprite[SPRITE.SEED] = create_seed(1);
    sprite[SPRITE.HERB] = [];
    sprite[SPRITE.HERB][SPRITE.DAY] = [];
    sprite[SPRITE.HERB][SPRITE.NIGHT] = [];
    sprite[SPRITE.HERB][SPRITE.DAY].push(CTI(create_herb(.9, false, ["#1b4936"], 0)));
    sprite[SPRITE.HERB][SPRITE.DAY].push(CTI(create_herb(.9, false, ["#1b4936"], 1)));
    sprite[SPRITE.HERB][SPRITE.DAY].push(CTI(create_herb(.9, false, ["#1b4936"], 2)));
    sprite[SPRITE.HERB][SPRITE.NIGHT].push(CTI(create_herb(.9, false, ["#083033"], 0)));
    sprite[SPRITE.HERB][SPRITE.NIGHT].push(CTI(create_herb(.9, false, ["#083033"], 1)));
    sprite[SPRITE.HERB][SPRITE.NIGHT].push(CTI(create_herb(.9, false, ["#083033"], 2)));
    sprite[SPRITE.PLANT] = [];
    sprite[SPRITE.PLANT][SPRITE.DAY] = CTI(create_plant(1.2, true, ["#0e3022", "#0b8052", "#077b49"]));
    sprite[SPRITE.PLANT][SPRITE.NIGHT] = CTI(create_plant(1.2, true, ["#030d14", "#084442", "#0a4049"]));
    sprite[SPRITE.PLANT_MINI] = [];
    sprite[SPRITE.PLANT_MINI][SPRITE.DAY] = CTI(create_plant(.8, true, ["#0e3022", "#0b8052", "#077b49"]));
    sprite[SPRITE.PLANT_MINI][SPRITE.NIGHT] = CTI(create_plant(.8, true, ["#030d14", "#084442", "#0a4049"]));
    sprite[SPRITE.FRUIT] = [];
    sprite[SPRITE.FRUIT][SPRITE.DAY] = CTI(create_fruit(1.4, false, ["#54318e", "#725ba3"]));
    sprite[SPRITE.FRUIT][SPRITE.NIGHT] = CTI(create_fruit(1.4, false, ["#2f195e", "#5b498c"]));
    sprite[SPRITE.FIRE] = [];
    sprite[SPRITE.FIRE][SPRITE.DAY] = CTI(create_fire(.9, false, ["#efd435", "#ec8d35", "#e96132"]));
    sprite[SPRITE.FIRE][SPRITE.NIGHT] = CTI(create_fire(.9, false, ["#efdb7b", "#efe854", "#e8ef62"]));
    sprite[SPRITE.BIG_FIRE_WOOD] = [];
    sprite[SPRITE.BIG_FIRE_WOOD][SPRITE.DAY] = CTI(create_big_fire_wood(.9, false, ["#4d2d14", "#432516"]));
    sprite[SPRITE.BIG_FIRE_WOOD][SPRITE.NIGHT] = CTI(create_big_fire_wood(.9, false, ["#282404", "#0a0a01"]));
    sprite[SPRITE.WOOD_FIRE] = [];
    sprite[SPRITE.WOOD_FIRE][SPRITE.DAY] = CTI(create_wood_fire(.9, false, ["#4d2d14", "#432516"]));
    sprite[SPRITE.WOOD_FIRE][SPRITE.NIGHT] = CTI(create_wood_fire(.9, false, ["#282404", "#0a0a01"]));
    sprite[SPRITE.HALO_FIRE] = [];
    sprite[SPRITE.HALO_FIRE][SPRITE.DAY] = CTI(create_halo_fire(.9, false, ["#efd435"]));
    sprite[SPRITE.HALO_FIRE][SPRITE.NIGHT] = CTI(create_halo_fire(.9, false, ["#fffabb"]));
    sprite[SPRITE.GROUND_FIRE] = [];
    sprite[SPRITE.GROUND_FIRE][SPRITE.DAY] = CTI(create_ground_fire(.9, false, ["#2d8f48"]));
    sprite[SPRITE.GROUND_FIRE][SPRITE.NIGHT] = CTI(create_ground_fire(.9, false, ["#0b5454"]));
    sprite[SPRITE.GEAR] = CTI(create_gear(1, "#ffffff", 1));
    sprite[SPRITE.GEAR2] = CTI(create_gear(1.5, "#ffffff", 1));
    sprite[SPRITE.YOUR_SCORE] = CTI(create_text(1, "Your score:", 15, "#FFF"));
    sprite[SPRITE.CRAFT_SEED] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(3 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_seed, x: 0, y: 0, a: 1, r: 0 }], .7, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_SEED] = create_craft_button(1, [{ f: create_seed, x: 0, y: 0, a: 1, r: 0, c: ["#756e52", "#898064", "#685b40"] }], .7, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_SWORD] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493d36", "#332b28", "#939393", "#5f6061"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_SWORD_GOLD] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_SWORD_DIAMOND] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_SWORD_AMETHYST] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_PICK_WOOD] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #4d2d14 #432516".split(" ") }], .5, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_PICK] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #939393 #5f6061".split(" ") }], .5, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_PICK_GOLD] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #493e26 #382e19 #c4bc51 #b29c32".split(" ") }], .5, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_PICK_DIAMOND] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #262114 #211108 #63c9d6 #29aaa1".split(" ") }], .5, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_PICK_AMETHYST] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #262114 #211108 #b864d6 #8c29aa".split(" ") }], .5, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_FIRE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_wood_fire, x: 0, y: 0, a: 1, r: -Math.PI / 7, c: ["#4d2d14", "#432516", "#58645F", "#75827D"] }, { f: create_fire, x: 0, y: 0, a: 1, r: -Math.PI / 7, c: ["#efd435", "#ec8d35", "#e96132"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_FIRE] = create_craft_button(1, [{ f: create_wood_fire, x: -2, y: -2, a: 1, r: -Math.PI / 7, c: ["#4d2d14", "#432516"] }, { f: create_fire, x: -2, y: -2, a: 1, r: -Math.PI / 7, c: ["#efd435", "#ec8d35", "#e96132"] }], .3, ["#3ba578", "#4eb687", "#3da34d"], .8);
    sprite[SPRITE.CRAFT_BIG_FIRE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_big_fire_wood, x: -1, y: 0, a: 1, r: -Math.PI / 7, c: ["#4d2d14", "#432516", "#58645F", "#75827D", "#485548"] }, { f: create_fire, x: 0, y: 0, a: 1, r: -Math.PI / 7, c: ["#efd435", "#ec8d35", "#e96132"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_BIG_FIRE] = create_craft_button(1, [{ f: create_big_fire_wood, x: -2, y: -1, a: 1, r: -Math.PI / 7, c: ["#4d2d14", "#432516", "#58645F", "#75827D", "#0c2c2e"] }, { f: create_fire, x: -2, y: -1, a: 1, r: -Math.PI / 7, c: ["#efd435", "#ec8d35", "#e96132"] }], .3, ["#3ba578", "#4eb687", "#3da34d"], .8);
    sprite[SPRITE.INV_SWORD] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493d36", "#332b28", "#939393", "#5f6061"] }], .3, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_SWORD_GOLD] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .3, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_SWORD_DIAMOND] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .3, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_SWORD_AMETHYST] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .3, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_PICK_WOOD] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #4d2d14 #432516".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_PICK] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #939393 #5f6061".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_PICK_GOLD] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #493e26 #382e19 #c4bc51 #b29c32".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_PICK_DIAMOND] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #262114 #211108 #63c9d6 #29aaa1".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_PICK_AMETHYST] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #262114 #211108 #b864d6 #8c29aa".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.INV_STONE] = create_craft_button(1, [{ f: create_stone, x: -5, y: -5, a: 1, r: 0, c: ["#252B28", "#58645F", "#75827D"] }], .23, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.INV_GOLD] = create_craft_button(1, [{ f: create_gold, x: -5, y: -5, a: 1, r: 0, c: ["#282823", "#877c2d", "#c4bc51"] }], .43, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.INV_DIAMOND] = create_craft_button(1, [{ f: create_diamond, x: -5, y: -5, a: 1, r: 0, c: ["#232828", "#3fc9c9", "#74ede6"] }], .33, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.INV_WOOD] = create_craft_button(1, [{ f: create_wood_fire, x: 0, y: -5, a: 1, r: Math.PI / 2.5, c: ["#4d2d14", "#432516"] }], .3, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.EMPTY_SLOT] = create_craft_button(1, [], .3, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.INV_PLANT] = create_craft_button(1, [{ f: create_food_plant, x: 0, y: 0, a: 1, r: 0 }], .4, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.PLANT_SEED] = [];
    sprite[SPRITE.PLANT_SEED][SPRITE.DAY] = CTI(create_plant_seed(.9, false, ["#7d613e", "#9e7e5a"]));
    sprite[SPRITE.PLANT_SEED][SPRITE.NIGHT] = CTI(create_plant_seed(.9, false, ["#084442", "#125e5a"]));
    sprite[SPRITE.WORKBENCH] = [];
    sprite[SPRITE.WORKBENCH][SPRITE.DAY] = CTI(create_workbench(1.2, true, "#0d1b1c #4d2d14 #432516 #756e52 #663f22 #9e9577".split(" ")));
    sprite[SPRITE.WORKBENCH][SPRITE.NIGHT] = CTI(create_workbench(1.2, true, "#030d14 #0d2e33 #072322 #3e706b #123d3f #4e827c".split(" ")));
    sprite[SPRITE.CRAFT_WORK] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_workbench, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4d2d14 #432516 #756e52 #663f22 #9e9577".split(" ") }], .45, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_WORK] = create_craft_button(1, [{ f: create_workbench, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4d2d14 #432516 #756e52 #663f22 #9e9577".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.INV_STONE_WALL] = create_craft_button(1, [{ f: create_wall_stone, x: -2, y: -2, a: 1, r: 0, c: "#0d1b1c #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ") }], .4, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_STONE_WALL] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_wall_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ") }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.WALL] = [];
    sprite[SPRITE.WALL][SPRITE.DAY] = CTI(create_wall(1, true, "#0d1b1c #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ")));
    sprite[SPRITE.WALL][SPRITE.NIGHT] = CTI(create_wall(1, true, "#030d14 #0d2e33 #184747 #123b3f #0d2e33 #174444".split(" ")));
    sprite[SPRITE.DIAMOND_WALL] = [];
    sprite[SPRITE.DIAMOND_WALL][SPRITE.DAY] = CTI(create_wall_diamond(1, true, "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ")));
    sprite[SPRITE.DIAMOND_WALL][SPRITE.NIGHT] = CTI(create_wall_diamond(1, true, "#030d14 #2b9390 #43b5af #43b5af #4bbcb4 #83ddd4 #59c9c0".split(" ")));
    sprite[SPRITE.INV_DIAMOND_WALL] = create_craft_button(1, [{ f: create_wall_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .4, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_DIAMOND_WALL] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_wall_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.AMETHYST_WALL] = [];
    sprite[SPRITE.AMETHYST_WALL][SPRITE.DAY] = CTI(create_wall_stone(1, true, "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ")));
    sprite[SPRITE.AMETHYST_WALL][SPRITE.NIGHT] = CTI(create_wall_stone(1, true, "#030d14 #8359d3 #764eb5 #8f65de #7f55cc #9d77e6".split(" ")));
    sprite[SPRITE.INV_AMETHYST_WALL] = create_craft_button(1, [{ f: create_wall_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .4, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_AMETHYST_WALL] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_wall_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.STONE_WALL] = [];
    sprite[SPRITE.STONE_WALL][SPRITE.DAY] = CTI(create_wall_stone(1, true, "#0d1b1c #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ")));
    sprite[SPRITE.STONE_WALL][SPRITE.NIGHT] = CTI(create_wall_stone(1, true, "#030d14 #163a3a #214c4b #1f4948 #295957 #1f5955".split(" ")));
    sprite[SPRITE.GOLD_WALL] = [];
    sprite[SPRITE.GOLD_WALL][SPRITE.DAY] = CTI(create_wall_gold(1, true, "#0d1b1c #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ")));
    sprite[SPRITE.GOLD_WALL][SPRITE.NIGHT] = CTI(create_wall_gold(1, true, "#030d14 #1f4948 #215e55 #1f6058 #2a7773 #2c7a70".split(" ")));
    sprite[SPRITE.INV_GOLD_WALL] = create_craft_button(1, [{ f: create_wall_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ") }], .4, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_GOLD_WALL] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_wall_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ") }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CRAFT_WALL] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_wall, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ") }], .45, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_WALL] = create_craft_button(1, [{ f: create_wall, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.SPIKE] = [];
    sprite[SPRITE.SPIKE][SPRITE.DAY] = CTI(create_spike(1, true, "#0d1b1c #5f6061 #939393 #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ")));
    sprite[SPRITE.SPIKE][SPRITE.NIGHT] = CTI(create_spike(1, true, "#030d14 #1f343f #485e66 #0d2e33 #184747 #123b3f #0d2e33 #174444".split(" ")));
    sprite[SPRITE.CRAFT_SPIKE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_spike, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_SPIKE] = create_craft_button(1, [{ f: create_spike, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ") }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.GOLD_SPIKE] = [];
    sprite[SPRITE.GOLD_SPIKE][SPRITE.DAY] = CTI(create_spike_gold(1, true, "#0d1b1c #69685a #9c9683 #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ")));
    sprite[SPRITE.GOLD_SPIKE][SPRITE.NIGHT] = CTI(create_spike_gold(1, true, "#030d14 #1a3732 #1e544c #1f4948 #215e55 #1f6058 #2a7773 #2c7a70".split(" ")));
    sprite[SPRITE.CRAFT_GOLD_SPIKE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_spike_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_GOLD_SPIKE] = create_craft_button(1, [{ f: create_spike_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ") }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DIAMOND_SPIKE] = [];
    sprite[SPRITE.DIAMOND_SPIKE][SPRITE.DAY] = CTI(create_spike_diamond(1, true, "#0d1b1c #7d8b90 #9facaa #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ")));
    sprite[SPRITE.DIAMOND_SPIKE][SPRITE.NIGHT] = CTI(create_spike_diamond(1, true, "#030d14 #2c4b55 #546d77 #2b9390 #43b5af #43b5af #4bbcb4 #83ddd4 #59c9c0".split(" ")));
    sprite[SPRITE.CRAFT_DIAMOND_SPIKE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_spike_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #7d8b90 #9facaa #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_DIAMOND_SPIKE] = create_craft_button(1, [{ f: create_spike_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #7d8b90 #9facaa #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.STONE_SPIKE] = [];
    sprite[SPRITE.STONE_SPIKE][SPRITE.DAY] = CTI(create_spike_stone(1, true, "#0d1b1c #6a7570 #939393 #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ")));
    sprite[SPRITE.STONE_SPIKE][SPRITE.NIGHT] = CTI(create_spike_stone(1, true, "#030d14 #1f343f #485e66 #163a3a #214c4b #1f4948 #295957 #1f5955".split(" ")));
    sprite[SPRITE.CRAFT_STONE_SPIKE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_spike_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_STONE_SPIKE] = create_craft_button(1, [{ f: create_spike_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ") }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.AMETHYST_SPIKE] = [];
    sprite[SPRITE.AMETHYST_SPIKE][SPRITE.DAY] = CTI(create_spike_stone(1, true, "#0d1b1c #6a7570 #939393 #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ")));
    sprite[SPRITE.AMETHYST_SPIKE][SPRITE.NIGHT] = CTI(create_spike_stone(1, true, "#030d14 #1f343f #485e66 #8359d3 #764eb5 #8f65de #7f55cc #9d77e6".split(" ")));
    sprite[SPRITE.CRAFT_AMETHYST_SPIKE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_spike_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_AMETHYST_SPIKE] = create_craft_button(1, [{ f: create_spike_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DOOR_WOOD_CLOSE] = [];
    sprite[SPRITE.DOOR_WOOD_CLOSE][SPRITE.DAY] = CTI(create_door_wood(1.5, true, "#0d1b1c #4c3b19 #574122 #644928 #574122 #735534".split(" ")));
    sprite[SPRITE.DOOR_WOOD_CLOSE][SPRITE.NIGHT] = CTI(create_door_wood(1.5, true, "#030d14 #0d2e33 #184747 #123b3f #0d2e33 #174444".split(" ")));
    sprite[SPRITE.CRAFT_DOOR_WOOD_CLOSE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_door_wood, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4c3b19 #574122 #644928 #574122 #735534".split(" ") }], .6, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_DOOR_WOOD_CLOSE] = create_craft_button(1, [{ f: create_door_wood, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4c3b19 #574122 #644928 #574122 #735534".split(" ") }], .6, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DOOR_WOOD_OPEN] = [];
    sprite[SPRITE.DOOR_WOOD_OPEN][SPRITE.DAY] = CTI(create_door_wood(1, false, "#133a2b #133a2b #1a4935 #1a4935 #133a2b #1a4935".split(" ")));
    sprite[SPRITE.DOOR_WOOD_OPEN][SPRITE.NIGHT] = CTI(create_door_wood(1, false, "#032428 #032428 #07393d #07393d #032428 #07393d".split(" ")));
    sprite[SPRITE.DOOR_STONE_CLOSE] = [];
    sprite[SPRITE.DOOR_STONE_CLOSE][SPRITE.DAY] = CTI(create_door_stone(1.5, true, "#0d1b1c #6a7570 #939995 #9baaa3 #8a938e #adbcb5".split(" ")));
    sprite[SPRITE.DOOR_STONE_CLOSE][SPRITE.NIGHT] = CTI(create_door_stone(1.5, true, "#030d14 #163a3a #214c4b #1f4948 #164542 #295957".split(" ")));
    sprite[SPRITE.CRAFT_DOOR_STONE_CLOSE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_door_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #6a7570 #939995 #9baaa3 #8a938e #adbcb5".split(" ") }], .6, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_DOOR_STONE_CLOSE] = create_craft_button(1, [{ f: create_door_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #6a7570 #939995 #9baaa3 #8a938e #adbcb5".split(" ") }], .6, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DOOR_STONE_OPEN] = [];
    sprite[SPRITE.DOOR_STONE_OPEN][SPRITE.DAY] = CTI(create_door_stone(1, false, "#133a2b #133a2b #1a4935 #1a4935 #133a2b #1a4935".split(" ")));
    sprite[SPRITE.DOOR_STONE_OPEN][SPRITE.NIGHT] = CTI(create_door_stone(1, false, "#032428 #032428 #07393d #07393d #032428 #07393d".split(" ")));
    sprite[SPRITE.DOOR_AMETHYST_CLOSE] = [];
    sprite[SPRITE.DOOR_AMETHYST_CLOSE][SPRITE.DAY] = CTI(create_door_stone(1.5, true, "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ")));
    sprite[SPRITE.DOOR_AMETHYST_CLOSE][SPRITE.NIGHT] = CTI(create_door_stone(1.5, true, "#030d14 #8359d3 #764eb5 #8f65de #7f55cc #9d77e6".split(" ")));
    sprite[SPRITE.CRAFT_DOOR_AMETHYST_CLOSE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_door_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .6, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_DOOR_AMETHYST_CLOSE] = create_craft_button(1, [{ f: create_door_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .6, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DOOR_AMETHYST_OPEN] = [];
    sprite[SPRITE.DOOR_AMETHYST_OPEN][SPRITE.DAY] = CTI(create_door_stone(1, false, "#133a2b #133a2b #1a4935 #1a4935 #133a2b #1a4935".split(" ")));
    sprite[SPRITE.DOOR_AMETHYST_OPEN][SPRITE.NIGHT] = CTI(create_door_stone(1, false, "#032428 #032428 #07393d #07393d #032428 #07393d".split(" ")));
    sprite[SPRITE.DOOR_GOLD_CLOSE] = [];
    sprite[SPRITE.DOOR_GOLD_CLOSE][SPRITE.DAY] = CTI(create_door_gold(1.5, true, "#0d1b1c #877d36 #a08f47 #a7983c #9a8636 #c1b06b".split(" ")));
    sprite[SPRITE.DOOR_GOLD_CLOSE][SPRITE.NIGHT] = CTI(create_door_gold(1.5, true, "#030d14 #1f4948 #215e55 #1f6058 #1f605c #2c7a70".split(" ")));
    sprite[SPRITE.CRAFT_DOOR_GOLD_CLOSE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_door_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #877d36 #a08f47 #a7983c #9a8636 #c1b06b".split(" ") }], .6, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_DOOR_GOLD_CLOSE] = create_craft_button(1, [{ f: create_door_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #877d36 #a08f47 #a7983c #9a8636 #c1b06b".split(" ") }], .6, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DOOR_GOLD_OPEN] = [];
    sprite[SPRITE.DOOR_GOLD_OPEN][SPRITE.DAY] = CTI(create_door_gold(1, false, "#133a2b #133a2b #1a4935 #1a4935 #133a2b #1a4935".split(" ")));
    sprite[SPRITE.DOOR_GOLD_OPEN][SPRITE.NIGHT] = CTI(create_door_gold(1, false, "#032428 #032428 #07393d #07393d #032428 #07393d".split(" ")));
    sprite[SPRITE.DOOR_DIAMOND_CLOSE] = [];
    sprite[SPRITE.DOOR_DIAMOND_CLOSE][SPRITE.DAY] = CTI(create_door_diamond(1.5, true, "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ")));
    sprite[SPRITE.DOOR_DIAMOND_CLOSE][SPRITE.NIGHT] = CTI(create_door_diamond(1.5, true, "#030d14 #2b9390 #43b5af #43b5af #4bbcb4 #83ddd4 #59c9c0".split(" ")));
    sprite[SPRITE.CRAFT_DOOR_DIAMOND_CLOSE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_door_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .6, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_DOOR_DIAMOND_CLOSE] = create_craft_button(1, [{ f: create_door_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .6, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.DOOR_DIAMOND_OPEN] = [];
    sprite[SPRITE.DOOR_DIAMOND_OPEN][SPRITE.DAY] = CTI(create_door_diamond(1, false, "#133a2b #133a2b #1a4935 #1a4935 #133a2b #1a4935".split(" ")));
    sprite[SPRITE.DOOR_DIAMOND_OPEN][SPRITE.NIGHT] = CTI(create_door_diamond(1, false, "#032428 #032428 #07393d #07393d #032428 #07393d".split(" ")));
    sprite[SPRITE.CHEST] = [];
    sprite[SPRITE.CHEST][SPRITE.DAY] = CTI(create_chest(.5, true, "#133a2b #9e8838 #c4a23a #4c3b19 #614627 #614627 #614627 #c4a23a #c4a23a #c4a23a".split(" ")));
    sprite[SPRITE.CHEST][SPRITE.NIGHT] = CTI(create_chest(.5, true, "#032428 #266161 #2b6664 #123335 #1f5453 #1f5453 #1f5453 #2b6664 #2b6664 #2b6664".split(" ")));
    sprite[SPRITE.CRAFT_CHEST] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(6 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_chest, x: 0, y: 2, a: 1, r: 0, c: "#133a2b #9e8838 #c4a23a #4c3b19 #614627 #614627 #614627 #c4a23a #c4a23a #c4a23a".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_CHEST] = create_craft_button(1, [{ f: create_chest, x: 0, y: 2, a: 1, r: 0, c: "#133a2b #9e8838 #c4a23a #4c3b19 #614627 #614627 #614627 #c4a23a #c4a23a #c4a23a".split(" ") }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.RABBIT] = [];
    sprite[SPRITE.RABBIT][SPRITE.DAY] = CTI(create_rabbit(.9, ["#0e3022", "#ee97bf", "#FFFFFF", "#000000", "#ffffff"]));
    sprite[SPRITE.RABBIT][SPRITE.NIGHT] = CTI(create_rabbit(.9, ["#030d14", "#4d1b59", "#5d3f77", "#220e26", "#ffffff"]));
    sprite[SPRITE.SPIDER] = [];
    sprite[SPRITE.SPIDER][SPRITE.DAY] = CTI(create_rotated_img(Math.PI, create_spider(.9, "#000000 #b7252c #b7252c #b7252c #FFFFFF #000000".split(" "))));
    sprite[SPRITE.SPIDER][SPRITE.NIGHT] = CTI(create_rotated_img(Math.PI, create_spider(.9, "#030d14 #401d49 #b7252c #401d49 #FFFFFF #000000".split(" "))));
    sprite[SPRITE.WEB] = CTI(create_web(.6, ["#FFFFFF"]));
    sprite[SPRITE.WOLF] = [];
    sprite[SPRITE.WOLF][SPRITE.DAY] = CTI(create_wolf(1.4, ["#0e3022", "#231f20", "#b7252c", "#b6222a", "#ffffff"]));
    sprite[SPRITE.WOLF][SPRITE.NIGHT] = CTI(create_wolf(1.4, ["#030d14", "#1e181c", "#462966", "#462966", "#ffffff"]));
    sprite[SPRITE.MEAT] = CTI(create_meat(1, true, ["#dd5d57", "#ffffff", "#5e5d5e", "#ffffff"]));
    sprite[SPRITE.INV_MEAT] = create_craft_button(1, [{ f: create_meat, x: 0, y: -3, a: 1, r: 0, c: ["#dd5d57", "#ffffff", "#5e5d5e", "#ffffff"] }], 1.4, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.COOKED_MEAT] = CTI(create_meat(1, true, ["#602920", "#844f49", "#5e5d5e", "#d3ccc7"]));
    sprite[SPRITE.INV_COOKED_MEAT] = create_craft_button(1, [{ f: create_meat, x: 0, y: -3, a: 1, r: 0, c: ["#602920", "#844f49", "#5e5d5e", "#d3ccc7"] }], 1.4, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_COOKED_MEAT] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(1.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_meat, x: 0, y: -5, a: 1, r: 0, c: ["#602920", "#844f49", "#5e5d5e", "#d3ccc7"] }], 1.4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CORD] = CTI(create_cord(1, true, ["#cec0c4", "#ffffff", "#6d6768"]));
    sprite[SPRITE.INV_CORD] = create_craft_button(1, [{ f: create_cord, x: -3, y: -3, a: 1, r: 0, c: ["#cec0c4", "#ffffff", "#6d6768"] }], .9, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.BLUE_CORD] = CTI(create_cord(1, true, ["#d4e9ec", "#37b1d7", "#506c71"]));
    sprite[SPRITE.INV_BLUE_CORD] = create_craft_button(1, [{ f: create_cord, x: -3, y: -3, a: 1, r: 0, c: ["#d4e9ec", "#37b1d7", "#506c71"] }], .9, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_BLUE_CORD] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(2.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_cord, x: 0, y: -5, a: 1, r: 0, c: ["#d4e9ec", "#37b1d7", "#506c71"] }], .9, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.FUR] = CTI(create_fur(1, true, ["#ef96be", "#ffffff"]));
    sprite[SPRITE.INV_FUR] = create_craft_button(1, [{ f: create_fur, x: -3, y: -3, a: 1, r: 0, c: ["#ef96be", "#ffffff"] }], .5, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.FUR_WOLF] = CTI(create_fur(1, true, ["#231f20", "#b6222a"]));
    sprite[SPRITE.INV_FUR_WOLF] = create_craft_button(1, [{ f: create_fur, x: -3, y: -3, a: 1, r: 0, c: ["#231f20", "#b6222a"] }], .5, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.FUR_WINTER] = CTI(create_fur(1, true, ["#ffffff", "#b6222a"]));
    sprite[SPRITE.INV_FUR_WINTER] = create_craft_button(1, [{ f: create_fur, x: -3, y: -3, a: 1, r: 0, c: ["#ffffff", "#b6222a"] }], .5, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.EARMUFFS] = [];
    sprite[SPRITE.EARMUFFS][SPRITE.DAY] = CTI(create_earmuff(.6, true, ["#f9efeb", "#dfd1cb", "#3e3c25", "#4d4a2e"]));
    sprite[SPRITE.EARMUFFS][SPRITE.NIGHT] = CTI(create_earmuff(.6, true, ["#478e8b", "#327e73", "#073030", "#08403f"]));
    sprite[SPRITE.INV_EARMUFFS] = create_craft_button(1, [{ f: create_earmuff, x: 0, y: 0, a: 1, r: 0, c: ["#f9efeb", "#dfd1cb", "#3e3c25", "#4d4a2e"] }], .4, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.CRAFT_EARMUFFS] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_earmuff, x: 0, y: 0, a: 1, r: 0, c: ["#f9efeb", "#dfd1cb", "#3e3c25", "#4d4a2e"] }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.COAT] = [];
    sprite[SPRITE.COAT][SPRITE.DAY] = CTI(create_coat(.6, true, ["#3e3c25", "#4d4a2e", "#f9efeb", "#dfd1cb"]));
    sprite[SPRITE.COAT][SPRITE.NIGHT] = CTI(create_coat(.6, true, ["#073030", "#08403f", "#478e8b", "#327e73"]));
    sprite[SPRITE.INV_COAT] = create_craft_button(1, [{ f: create_coat, x: 0, y: 0, a: 1, r: 0, c: ["#3e3c25", "#4d4a2e", "#f9efeb", "#dfd1cb"] }], .4, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.CRAFT_COAT] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_coat, x: 0, y: 0, a: 1, r: 0, c: ["#3e3c25", "#4d4a2e", "#f9efeb", "#dfd1cb"] }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CAP_SCARF] = [];
    sprite[SPRITE.CAP_SCARF][SPRITE.DAY] = CTI(create_cap_scarf(.6, true, ["#171a19", "#dee7e7", "#b8cccb", "#ffffff", "#e3e8e8"]));
    sprite[SPRITE.CAP_SCARF][SPRITE.NIGHT] = CTI(create_cap_scarf(.6, true, ["#073030", "#368981", "#1c635e", "#7bbab4", "#469e95"]));
    sprite[SPRITE.INV_CAP_SCARF] = create_craft_button(1, [{ f: create_cap_scarf, x: 0, y: 0, a: 1, r: 0, c: ["#171a19", "#dee7e7", "#b8cccb", "#ffffff", "#e3e8e8"] }], .4, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.CRAFT_CAP_SCARF] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.8 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_cap_scarf, x: 0, y: 0, a: 1, r: 0, c: ["#171a19", "#dee7e7", "#b8cccb", "#ffffff", "#e3e8e8"] }], .4, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.BANDAGE] = CTI(create_bandage(1, false, ["#ffffff", "#cec0c4"]));
    sprite[SPRITE.CRAFT_BANDAGE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5.5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_bandage, x: 0, y: 0, a: 1, r: 0, c: ["#ffffff", "#cec0c4"] }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_BANDAGE] = create_craft_button(1, [{ f: create_bandage, x: -2, y: -2, a: 1, r: 0, c: ["#ffffff", "#cec0c4"] }], .35, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.BAG] = [];
    sprite[SPRITE.BAG][SPRITE.DAY] = CTI(create_bag(.6, false, ["#872f13", "#471e12"]));
    sprite[SPRITE.BAG][SPRITE.NIGHT] = CTI(create_bag(.6, false, ["#0e3336", "#092626"]));
    sprite[SPRITE.CRAFT_BAG] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(3 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_bag, x: 0, y: 0, a: 1, r: 0, c: ["#872f13", "#471e12"] }], .7, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.INV_BAG] = create_craft_button(1, [{ f: create_bag, x: -2, y: -2, a: 1, r: 0, c: ["#872f13", "#471e12"] }], .7, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.FURNACE_ON] = [];
    sprite[SPRITE.FURNACE_ON][SPRITE.DAY] = CTI(create_furnace_on(.5, true, "#0d1b1c #939393 #5f6061 #c0c0c0 #ffad22 #fffdd5 #fee764".split(" ")));
    sprite[SPRITE.FURNACE_ON][SPRITE.NIGHT] = CTI(create_furnace_on(.5, true, "#0d1b1c #485e66 #1f343f #60757d #ffdc73 #fffce2 #fef259".split(" ")));
    sprite[SPRITE.INV_FURNACE] = create_craft_button(1, [{ f: create_furnace_on, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #939393 #5f6061 #c0c0c0 #ffad22 #fffdd5 #fee764".split(" ") }], .18, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_FURNACE] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(12 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_furnace_on, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #939393 #5f6061 #c0c0c0 #ffad22 #fffdd5 #fee764".split(" ") }], .18, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.FURNACE_OFF] = [];
    sprite[SPRITE.FURNACE_OFF][SPRITE.DAY] = CTI(create_furnace_off(.5, true, "#0d1b1c #939393 #5f6061 #c0c0c0 #4f4f4f #6c6c6c #454545".split(" ")));
    sprite[SPRITE.FURNACE_OFF][SPRITE.NIGHT] = CTI(create_furnace_off(.5, true, "#0d1b1c #485e66 #1f343f #60757d #152229 #0c1113 #0c1113".split(" ")));
    sprite[SPRITE.FURNACE_SLOT] = CTI(create_furnace_slot(.8, true, ["#5f6061", "#939393"]));
    sprite[SPRITE.FURNACE_BUTTON] = create_craft_button(1, [{ f: create_wood_fire, x: 0, y: 0, a: 1, r: Math.PI / 2.5, c: ["#4d2d14", "#432516"] }], .3, ["#494949", "#5b5858", "#3d3b3b"], 1);
    sprite[SPRITE.SPEAR] = [];
    sprite[SPRITE.SPEAR][SPRITE.DAY] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"])));
    sprite[SPRITE.SPEAR][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#0d2e33", "#0b2326", "#485e66", "#1f343f"])));
    sprite[SPRITE.INV_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"] }], .27, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_SPEAR] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(8 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"] }], .27, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.GOLD_SPEAR] = [];
    sprite[SPRITE.GOLD_SPEAR][SPRITE.DAY] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"])));
    sprite[SPRITE.GOLD_SPEAR][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_spear(.6, true, ["#030d14", "#263947", "#182935", "#43aa82", "#29997c"])));
    sprite[SPRITE.INV_GOLD_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .27, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_GOLD_SPEAR] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(8 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .27, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.DIAMOND_SPEAR] = [];
    sprite[SPRITE.DIAMOND_SPEAR][SPRITE.DAY] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"])));
    sprite[SPRITE.DIAMOND_SPEAR][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#111316", "#0a0b0c", "#73dde5", "#3dc4c0"])));
    sprite[SPRITE.INV_DIAMOND_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .27, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_DIAMOND_SPEAR] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(8 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .27, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.AMETHYST_SPEAR] = [];
    sprite[SPRITE.AMETHYST_SPEAR][SPRITE.DAY] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"])));
    sprite[SPRITE.AMETHYST_SPEAR][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_spear(.6, true, ["#0d1b1c", "#111316", "#0a0b0c", "#8359d3", "#764eb5"])));
    sprite[SPRITE.INV_AMETHYST_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .27, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_AMETHYST_SPEAR] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(8 * c, "#918770");
        }, x: 2, y: 0, a: .3, r: 0
    }, { f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .27, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.HAMMER] = [];
    sprite[SPRITE.HAMMER][SPRITE.DAY] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"])));
    sprite[SPRITE.HAMMER][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_hammer(1, true, ["#030d14", "#263947", "#182935", "#485e66", "#1f343f"])));
    sprite[SPRITE.INV_HAMMER] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"] }], .52, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_HAMMER] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.2 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"] }], .52, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.HAMMER_GOLD] = [];
    sprite[SPRITE.HAMMER_GOLD][SPRITE.DAY] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"])));
    sprite[SPRITE.HAMMER_GOLD][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#0d2e33", "#0b2326", "#43aa82", "#29997c"])));
    sprite[SPRITE.INV_HAMMER_GOLD] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .52, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_HAMMER_GOLD] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.2 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .52, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.HAMMER_DIAMOND] = [];
    sprite[SPRITE.HAMMER_DIAMOND][SPRITE.DAY] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"])));
    sprite[SPRITE.HAMMER_DIAMOND][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#111316", "#0a0b0c", "#73dde5", "#3dc4c0"])));
    sprite[SPRITE.INV_HAMMER_DIAMOND] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .52, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_HAMMER_DIAMOND] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.2 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .52, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.HAMMER_AMETHYST] = [];
    sprite[SPRITE.HAMMER_AMETHYST][SPRITE.DAY] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"])));
    sprite[SPRITE.HAMMER_AMETHYST][SPRITE.NIGHT] = CTI(create_rotated_img(3, create_hammer(1, true, ["#0d1b1c", "#111316", "#0a0b0c", "#8359d3", "#764eb5"])));
    sprite[SPRITE.INV_HAMMER_AMETHYST] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .52, ["#3ba578", "#4eb687", "#3da34d"], 1);
    sprite[SPRITE.CRAFT_HAMMER_AMETHYST] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(4.2 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .52, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.CHEST_SEED] = create_craft_button(1, [{ f: create_seed, x: 0, y: 0, a: 1, r: 0, c: ["#756e52", "#898064", "#685b40"] }], .7, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_FIRE] = create_craft_button(1, [{ f: create_wood_fire, x: -2, y: -2, a: 1, r: -Math.PI / 7, c: ["#4d2d14", "#432516"] }, { f: create_fire, x: -2, y: -2, a: 1, r: -Math.PI / 7, c: ["#efd435", "#ec8d35", "#e96132"] }], .3, ["#968e55", "#b1a868", "#888046"], .8);
    sprite[SPRITE.CHEST_BIG_FIRE] = create_craft_button(1, [{ f: create_big_fire_wood, x: -2, y: -1, a: 1, r: -Math.PI / 7, c: ["#4d2d14", "#432516", "#58645F", "#75827D", "#0c2c2e"] }, { f: create_fire, x: -2, y: -1, a: 1, r: -Math.PI / 7, c: ["#efd435", "#ec8d35", "#e96132"] }], .3, ["#968e55", "#b1a868", "#888046"], .8);
    sprite[SPRITE.CHEST_SWORD] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493d36", "#332b28", "#939393", "#5f6061"] }], .3, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_SWORD_GOLD] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .3, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_SWORD_DIAMOND] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .3, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_SWORD_AMETHYST] = create_craft_button(1, [{ f: create_sword, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .3, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_PICK_WOOD] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #4d2d14 #432516".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_PICK] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #4d2d14 #432516 #939393 #5f6061".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_PICK_GOLD] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #493e26 #382e19 #c4bc51 #b29c32".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_PICK_DIAMOND] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #262114 #211108 #63c9d6 #29aaa1".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_PICK_AMETHYST] = create_craft_button(1, [{ f: create_pickaxe, x: -2, y: 5, a: 1, r: -Math.PI / 5, c: "#0d1b1c #000000 #0d1b1c #262114 #211108 #b864d6 #8c29aa".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_STONE] = create_craft_button(1, [{ f: create_stone, x: -5, y: -5, a: 1, r: 0, c: ["#252B28", "#58645F", "#75827D"] }], .23, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_GOLD] = create_craft_button(1, [{ f: create_gold, x: -5, y: -5, a: 1, r: 0, c: ["#282823", "#877c2d", "#c4bc51"] }], .43, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DIAMOND] = create_craft_button(1, [{ f: create_diamond, x: -5, y: -5, a: 1, r: 0, c: ["#232828", "#3fc9c9", "#74ede6"] }], .33, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_WOOD] = create_craft_button(1, [{ f: create_wood_fire, x: 0, y: -5, a: 1, r: Math.PI / 2.5, c: ["#4d2d14", "#432516"] }], .3, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_PLANT] = create_craft_button(1, [{ f: create_food_plant, x: 0, y: -2, a: 1, r: 0 }], .4, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_WORKBENCH] = create_craft_button(1, [{ f: create_workbench, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4d2d14 #432516 #756e52 #663f22 #9e9577".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_STONE_WALL] = create_craft_button(1, [{ f: create_wall_stone, x: -2, y: -2, a: 1, r: 0, c: "#0d1b1c #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ") }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DIAMOND_WALL] = create_craft_button(1, [{ f: create_wall_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_GOLD_WALL] = create_craft_button(1, [{ f: create_wall_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ") }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_AMETHYST_WALL] = create_craft_button(1, [{ f: create_wall_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_WALL] = create_craft_button(1, [{ f: create_wall, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_SPIKE] = create_craft_button(1, [{ f: create_spike, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #4c3a15 #634828 #564021 #634828 #4c3a15".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_MEAT] = create_craft_button(1, [{ f: create_meat, x: 0, y: -3, a: 1, r: 0, c: ["#dd5d57", "#ffffff", "#5e5d5e", "#ffffff"] }], 1.4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_COOKED_MEAT] = create_craft_button(1, [{ f: create_meat, x: 0, y: -3, a: 1, r: 0, c: ["#602920", "#844f49", "#5e5d5e", "#d3ccc7"] }], 1.4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_CORD] = create_craft_button(1, [{ f: create_cord, x: -3, y: -3, a: 1, r: 0, c: ["#cec0c4", "#ffffff", "#6d6768"] }], .9, ["#9e8838", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_BLUE_CORD] = create_craft_button(1, [{ f: create_cord, x: -3, y: -3, a: 1, r: 0, c: ["#d4e9ec", "#37b1d7", "#506c71"] }], .9, ["#9e8838", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_BANDAGE] = create_craft_button(1, [{ f: create_bandage, x: 0, y: 0, a: 1, r: 0, c: ["#ffffff", "#cec0c4"] }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DOOR_WOOD_CLOSE] = create_craft_button(1, [{ f: create_door_wood, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #4c3b19 #574122 #644928 #574122 #735534".split(" ") }], .6, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_CHEST] = create_craft_button(1, [{ f: create_chest, x: 0, y: 2, a: 1, r: 0, c: "#133a2b #9e8838 #c4a23a #4c3b19 #614627 #614627 #614627 #c4a23a #c4a23a #c4a23a".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_SLOT] = CTI(create_chest_slot(.8, true, ["#4c3b19", "#c4a23a", "#c4a23a", "#c4a23a"]));
    sprite[SPRITE.CHEST_PLUS] = create_craft_button(.5, [{ f: create_plus_chest, x: 0, y: 2, a: 1, r: 0, c: ["#ffffff"] }], .16, ["#c4a23a", "#d0ad41", "#b89733"], .9);
    sprite[SPRITE.CHEST_STONE_SPIKE] = create_craft_button(1, [{ f: create_spike_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #6a7570 #939995 #9baaa3 #adbcb5 #8a938e".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_GOLD_SPIKE] = create_craft_button(1, [{ f: create_spike_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #877d36 #a08f47 #a7983c #b29e4d #c1b06b".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DIAMOND_SPIKE] = create_craft_button(1, [{ f: create_spike_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #7d8b90 #9facaa #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_AMETHYST_SPIKE] = create_craft_button(1, [{ f: create_spike_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5f6061 #939393 #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_BAG] = create_craft_button(1, [{ f: create_bag, x: 0, y: 0, a: 1, r: 0, c: ["#872f13", "#471e12"] }], .7, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_FUR] = create_craft_button(1, [{ f: create_fur, x: 0, y: 0, a: 1, r: 0, c: ["#ef96be", "#ffffff"] }], .5, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_FUR_WOLF] = create_craft_button(1, [{ f: create_fur, x: 0, y: 0, a: 1, r: 0, c: ["#231f20", "#b6222a"] }], .5, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_FUR_WINTER] = create_craft_button(1, [{ f: create_fur, x: 0, y: 0, a: 1, r: 0, c: ["#ffffff", "#b6222a"] }], .5, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_EARMUFFS] = create_craft_button(1, [{ f: create_earmuff, x: 0, y: 0, a: 1, r: 0, c: ["#f9efeb", "#dfd1cb", "#3e3c25", "#4d4a2e"] }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_CAP_SCARF] = create_craft_button(1, [{ f: create_cap_scarf, x: 0, y: 0, a: 1, r: 0, c: ["#171a19", "#dee7e7", "#b8cccb", "#ffffff", "#e3e8e8"] }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DOOR_STONE_CLOSE] = create_craft_button(1, [{ f: create_door_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #6a7570 #939995 #9baaa3 #8a938e #adbcb5".split(" ") }], .6, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DOOR_GOLD_CLOSE] = create_craft_button(1, [{ f: create_door_gold, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #877d36 #a08f47 #a7983c #9a8636 #c1b06b".split(" ") }], .6, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DOOR_DIAMOND_CLOSE] = create_craft_button(1, [{ f: create_door_diamond, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #5cc5ce #89d1d4 #86d0d1 #95d5d8 #e0f2f6 #b3e0e3".split(" ") }], .6, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DOOR_AMETHYST_CLOSE] = create_craft_button(1, [{ f: create_door_stone, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #b15ecf #8c29aa #c26de0 #af59cd #d588f1".split(" ") }], .6, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_COAT] = create_craft_button(1, [{ f: create_coat, x: 0, y: 0, a: 1, r: 0, c: ["#3e3c25", "#4d4a2e", "#f9efeb", "#dfd1cb"] }], .4, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"] }], .27, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_GOLD_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .27, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_DIAMOND_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .27, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_AMETHYST_SPEAR] = create_craft_button(1, [{ f: create_spear, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .27, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_HAMMER] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#4d2d14", "#432516", "#939393", "#5f6061"] }], .52, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_HAMMER_GOLD] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#493e26", "#382e19", "#c4bc51", "#b29c32"] }], .52, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_HAMMER_DIAMOND] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#63c9d6", "#29aaa1"] }], .52, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_HAMMER_AMETHYST] = create_craft_button(1, [{ f: create_hammer, x: 2, y: 0, a: 1, r: Math.PI / 5, c: ["#0d1b1c", "#262114", "#211108", "#b864d6", "#8c29aa"] }], .52, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_FURNACE] = create_craft_button(1, [{ f: create_furnace_on, x: 0, y: 0, a: 1, r: 0, c: "#0d1b1c #939393 #5f6061 #c0c0c0 #ffad22 #fffdd5 #fee764".split(" ") }], .18, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_EXPLORER_HAT] = create_craft_button(1, [{ f: create_explorer_hat, x: 0, y: 0, a: 1, r: 0, c: "#c9a65f #ae863f #655530 #4a391c #ebdd79 #4a421c".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], 1);
    sprite[SPRITE.CHEST_STONE_HELMET] = create_craft_button(1, [{ f: create_viking_hat, x: 0, y: 0, a: 1, r: 0, c: "#252525 #9b8251 #5e4a2d #737373 #4f4f4f #8c7542".split(" ") }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_GOLD_HELMET] = create_craft_button(1, [{ f: create_gold_helmet, x: 0, y: 0, a: 1, r: 0, c: ["#dbce71", "#b29c32", "#c4bc51"] }], .35, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_DIAMOND_HELMET] = create_craft_button(1, [{ f: create_diamond_helmet, x: 0, y: 0, a: 1, r: 0, c: "#717171 #485252 #555555 #65c7cd #4aadad #358d8b #c1e6ea #a6dce4".split(" ") }], .45, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_BOOK] = create_craft_button(1, [{ f: create_book, x: 0, y: 0, a: 1, r: 0, c: "#511f00 #2f1300 #ffffff #d4d4d4 #5b2400 #984e21".split(" ") }], .15, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_PAPER] = create_craft_button(1, [{ f: create_paper, x: 0, y: 0, a: 1, r: 0, c: ["#221e1b", "#ffffff", "#f6f0e7"] }], .3, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.CHEST_AMETHYST] = create_craft_button(1, [{ f: create_amethyst, x: 0, y: 0, a: 1, r: 0, c: ["#1d051e", "#c27add", "#cd98e5"] }], .3, ["#968e55", "#b1a868", "#888046"], .7);
    sprite[SPRITE.HURT_WOLF] = CTI(create_hurt_wolf(1.4, "#BB0000"));
    sprite[SPRITE.HURT_SPIDER] = CTI(create_rotated_img(Math.PI, create_hurt_spider(.9, "#BB0000")));
    sprite[SPRITE.EXPLORER_HAT] = [];
    sprite[SPRITE.EXPLORER_HAT][SPRITE.DAY] = CTI(create_explorer_hat(.55, true, "#c9a65f #ae863f #655530 #4a391c #ebdd79 #4a421c".split(" ")));
    sprite[SPRITE.EXPLORER_HAT][SPRITE.NIGHT] = CTI(create_explorer_hat(.55, true, "#15514f #0f3f3d #123335 #0d2d2b #2b6664 #070d16".split(" ")));
    sprite[SPRITE.INV_EXPLORER_HAT] = create_craft_button(1, [{ f: create_explorer_hat, x: 0, y: 0, a: 1, r: 0, c: "#c9a65f #ae863f #655530 #4a391c #ebdd79 #4a421c".split(" ") }], .35, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.CRAFT_EXPLORER_HAT] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(6 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_explorer_hat, x: 0, y: 0, a: 1, r: 0, c: "#c9a65f #ae863f #655530 #4a391c #ebdd79 #4a421c".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.STONE_HELMET] = [];
    sprite[SPRITE.STONE_HELMET][SPRITE.DAY] = CTI(create_viking_hat(.58, true, "#252525 #9b8251 #5e4a2d #737373 #4f4f4f #8c7542".split(" ")));
    sprite[SPRITE.STONE_HELMET][SPRITE.NIGHT] = CTI(create_viking_hat(.58, true, "#15514f #216661 #0f3f3d #295957 #0f3f3d #1c5e5b".split(" ")));
    sprite[SPRITE.INV_STONE_HELMET] = create_craft_button(1, [{ f: create_viking_hat, x: 0, y: 0, a: 1, r: 0, c: "#252525 #9b8251 #5e4a2d #737373 #4f4f4f #8c7542".split(" ") }], .35, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.CRAFT_STONE_HELMET] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(6 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_viking_hat, x: 0, y: 0, a: 1, r: 0, c: "#252525 #9b8251 #5e4a2d #737373 #4f4f4f #8c7542".split(" ") }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.GOLD_HELMET] = [];
    sprite[SPRITE.GOLD_HELMET][SPRITE.DAY] = CTI(create_gold_helmet(.58, true, ["#dbce71", "#b29c32", "#c4bc51"]));
    sprite[SPRITE.GOLD_HELMET][SPRITE.NIGHT] = CTI(create_gold_helmet(.58, true, ["#2b7c57", "#15543c", "#1a7961"]));
    sprite[SPRITE.INV_GOLD_HELMET] = create_craft_button(1, [{ f: create_gold_helmet, x: 0, y: 0, a: 1, r: 0, c: ["#dbce71", "#b29c32", "#c4bc51"] }], .35, ["#3ba1a4", "#4eb0b6", "#3da39a"], .7);
    sprite[SPRITE.CRAFT_GOLD_HELMET] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(6 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_gold_helmet, x: 0, y: 0, a: 1, r: 0, c: ["#dbce71", "#b29c32", "#c4bc51"] }], .35, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.DIAMOND_HELMET] = [];
    sprite[SPRITE.DIAMOND_HELMET][SPRITE.DAY] = CTI(create_diamond_helmet(.69, true, "#717171 #485252 #555555 #65c7cd #4aadad #358d8b #c1e6ea #a6dce4".split(" ")));
    sprite[SPRITE.DIAMOND_HELMET][SPRITE.NIGHT] = CTI(create_diamond_helmet(.69, true, "#183f3f #092121 #123335 #2b9390 #277a74 #1f665f #83ddd4 #59c9c0".split(" ")));
    sprite[SPRITE.INV_DIAMOND_HELMET] = create_craft_button(1, [{ f: create_diamond_helmet, x: 0, y: 0, a: 1, r: 0, c: "#717171 #485252 #555555 #65c7cd #4aadad #358d8b #c1e6ea #a6dce4".split(" ") }], .45, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_DIAMOND_HELMET] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(5 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_diamond_helmet, x: 0, y: 0, a: 1, r: 0, c: "#717171 #485252 #555555 #65c7cd #4aadad #358d8b #c1e6ea #a6dce4".split(" ") }], .45, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.BOOK] = [];
    sprite[SPRITE.BOOK][SPRITE.DAY] = CTI(create_rotated_img(2.2, create_book(.2, true, "#511f00 #2f1300 #ffffff #d4d4d4 #5b2400 #984e21".split(" "))));
    sprite[SPRITE.BOOK][SPRITE.NIGHT] = CTI(create_rotated_img(2.2, create_book(.2, true, "#183f3f #092121 #63bec4 #0e3c37 #1e4f52 #2e6c70".split(" "))));
    sprite[SPRITE.INV_BOOK] = create_craft_button(1, [{ f: create_book, x: 0, y: 0, a: 1, r: 0, c: "#511f00 #2f1300 #ffffff #d4d4d4 #5b2400 #984e21".split(" ") }], .15, ["#3ba578", "#4eb687", "#3da34d"], .7);
    sprite[SPRITE.CRAFT_BOOK] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(15 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_book, x: 0, y: 0, a: 1, r: 0, c: "#511f00 #2f1300 #ffffff #d4d4d4 #5b2400 #984e21".split(" ") }], .15, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.PAPER] = CTI(create_paper(.5, true, ["#221e1b", "#ffffff", "#f6f0e7"]));
    sprite[SPRITE.INV_PAPER] = create_craft_button(1, [{ f: create_paper, x: 0, y: 0, a: 1, r: 0, c: ["#221e1b", "#ffffff", "#f6f0e7"] }], .3, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.CRAFT_PAPER] = create_craft_button(1, [{
        f: function (c) {
            return create_gear(7 * c, "#918770");
        }, x: 0, y: 0, a: .3, r: 0
    }, { f: create_paper, x: 0, y: 0, a: 1, r: 0, c: ["#221e1b", "#ffffff", "#f6f0e7"] }], .3, ["#756e52", "#898064", "#685b40"], .8);
    sprite[SPRITE.FIR] = [];
    sprite[SPRITE.FIR][SPRITE.DAY] = [];
    sprite[SPRITE.FIR][SPRITE.NIGHT] = [];
    sprite[SPRITE.FIR][SPRITE.DAY].push(CTI(create_fir_three(1.3, "#0a2d18 #124c34 #227248 #ccedd9 #2d7a55 #3c9660 #afddc1 #bbefd0 #0a2d18 #e4efe8".split(" "))));
    sprite[SPRITE.FIR][SPRITE.DAY].push(CTI(create_fir_two(1.5, "#191919 #134d35 #247349 #afddc1 #bbefd0 #e4efe8".split(" "))));
    sprite[SPRITE.FIR][SPRITE.DAY].push(CTI(create_fir_one(1.5, "#191919 #134d35 #247349 #cde7d6 #122d1c #e3eee7".split(" "))));
    sprite[SPRITE.FIR][SPRITE.NIGHT].push(CTI(create_fir_three(1.3, "#000000 #0e3638 #174a51 #328587 #174a51 #1d5559 #328587 #48a8aa #0a2728 #56afac".split(" "))));
    sprite[SPRITE.FIR][SPRITE.NIGHT].push(CTI(create_fir_two(1.5, "#000000 #0e3638 #174a51 #328587 #48a8aa #56afac".split(" "))));
    sprite[SPRITE.FIR][SPRITE.NIGHT].push(CTI(create_fir_one(1.5, "#000000 #0e3638 #174a51 #328587 #0a2728 #56afac".split(" "))));
    sprite[SPRITE.DRAGON] = [];
    sprite[SPRITE.DRAGON][SPRITE.DAY] = CTI(create_dragon(.8, "#292b2b #c7efef #6dbcb8 #80ccca #2a4c4a #8bd0cb #c42333 #ffffff #6dbcb8 #1b2826 #c42333".split(" ")));
    sprite[SPRITE.DRAGON][SPRITE.NIGHT] = CTI(create_dragon(.8, "#050505 #1a847f #0b514a #126861 #1d3a38 #327570 #200333 #ffffff #327570 #1d3a38 #480772".split(" ")));
    sprite[SPRITE.WING_LEFT] = [];
    sprite[SPRITE.WING_LEFT][SPRITE.DAY] = CTI(create_wingleft(.8, ["#292b2b", "#1f3f3f", "#c1233b", "#80ccca", "#23171d"]));
    sprite[SPRITE.WING_LEFT][SPRITE.NIGHT] = CTI(create_wingleft(.8, ["#050505", "#1d3a38", "#200333", "#126861", "#23171d"]));
    sprite[SPRITE.WING_RIGHT] = [];
    sprite[SPRITE.WING_RIGHT][SPRITE.DAY] = CTI(create_wingright(.8, ["#292b2b", "#1f3f3f", "#c1233b", "#80ccca", "#23171d"]));
    sprite[SPRITE.WING_RIGHT][SPRITE.NIGHT] = CTI(create_wingright(.8, ["#050505", "#1d3a38", "#200333", "#126861", "#23171d"]));
    sprite[SPRITE.HERB_WINTER] = [];
    sprite[SPRITE.HERB_WINTER][SPRITE.DAY] = [];
    sprite[SPRITE.HERB_WINTER][SPRITE.NIGHT] = [];
    sprite[SPRITE.HERB_WINTER][SPRITE.DAY].push(CTI(create_herb(.9, false, ["#f9f9f9"], 0)));
    sprite[SPRITE.HERB_WINTER][SPRITE.DAY].push(CTI(create_herb(.9, false, ["#f9f9f9"], 1)));
    sprite[SPRITE.HERB_WINTER][SPRITE.DAY].push(CTI(create_herb(.9, false, ["#f9f9f9"], 2)));
    sprite[SPRITE.HERB_WINTER][SPRITE.NIGHT].push(CTI(create_herb(.9, false, ["#156a70"], 0)));
    sprite[SPRITE.HERB_WINTER][SPRITE.NIGHT].push(CTI(create_herb(.9, false, ["#156a70"], 1)));
    sprite[SPRITE.HERB_WINTER][SPRITE.NIGHT].push(CTI(create_herb(.9, false, ["#156a70"], 2)));
    sprite[SPRITE.STONES_WINTER] = [];
    sprite[SPRITE.STONES_WINTER][SPRITE.DAY] = [];
    sprite[SPRITE.STONES_WINTER][SPRITE.NIGHT] = [];
    sprite[SPRITE.STONES_WINTER][SPRITE.DAY].push(CTI(create_stone(1.1, false, ["#0a2d18", "#c3d1cb", "#e4efe8"])));
    sprite[SPRITE.STONES_WINTER][SPRITE.DAY].push(CTI(create_stone(.9, false, ["#0a2d18", "#c3d1cb", "#e4efe8"])));
    sprite[SPRITE.STONES_WINTER][SPRITE.DAY].push(CTI(create_stone(.6, false, ["#0a2d18", "#c3d1cb", "#e4efe8"])));
    sprite[SPRITE.STONES_WINTER][SPRITE.NIGHT].push(CTI(create_stone(1.1, false, ["#0a2728", "#3c8e88", "#40a39b"])));
    sprite[SPRITE.STONES_WINTER][SPRITE.NIGHT].push(CTI(create_stone(.9, false, ["#0a2728", "#3c8e88", "#40a39b"])));
    sprite[SPRITE.STONES_WINTER][SPRITE.NIGHT].push(CTI(create_stone(.6, false, ["#0a2728", "#3c8e88", "#40a39b"])));
    sprite[SPRITE.GOLD_WINTER] = [];
    sprite[SPRITE.GOLD_WINTER][SPRITE.DAY] = [];
    sprite[SPRITE.GOLD_WINTER][SPRITE.NIGHT] = [];
    sprite[SPRITE.GOLD_WINTER][SPRITE.DAY].push(CTI(create_gold(1.5, false, ["#2b280a", "#ddcf8a", "#f4efc6"])));
    sprite[SPRITE.GOLD_WINTER][SPRITE.DAY].push(CTI(create_gold(1.3, false, ["#2b280a", "#ddcf8a", "#f4efc6"])));
    sprite[SPRITE.GOLD_WINTER][SPRITE.DAY].push(CTI(create_gold(1.1, false, ["#2b280a", "#ddcf8a", "#f4efc6"])));
    sprite[SPRITE.GOLD_WINTER][SPRITE.NIGHT].push(CTI(create_gold(1.5, false, ["#0a2728", "#3e8989", "#50a09c"])));
    sprite[SPRITE.GOLD_WINTER][SPRITE.NIGHT].push(CTI(create_gold(1.3, false, ["#0a2728", "#3e8989", "#50a09c"])));
    sprite[SPRITE.GOLD_WINTER][SPRITE.NIGHT].push(CTI(create_gold(1.1, false, ["#0a2728", "#3e8989", "#50a09c"])));
    sprite[SPRITE.DIAMOND_WINTER] = [];
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.DAY] = [];
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.NIGHT] = [];
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.DAY].push(CTI(create_diamond(1.1, false, ["#123d38", "#70e0dd", "#95efea"])));
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.DAY].push(CTI(create_diamond(.9, false, ["#123d38", "#70e0dd", "#95efea"])));
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.DAY].push(CTI(create_diamond(.7, false, ["#123d38", "#70e0dd", "#95efea"])));
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.NIGHT].push(CTI(create_diamond(1.1, false, ["#123d38", "#47b2ac", "#5cccc4"])));
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.NIGHT].push(CTI(create_diamond(.9, false, ["#123d38", "#47b2ac", "#5cccc4"])));
    sprite[SPRITE.DIAMOND_WINTER][SPRITE.NIGHT].push(CTI(create_diamond(.7, false, ["#123d38", "#47b2ac", "#5cccc4"])));
    sprite[SPRITE.AMETHYST] = [];
    sprite[SPRITE.AMETHYST][SPRITE.DAY] = [];
    sprite[SPRITE.AMETHYST][SPRITE.NIGHT] = [];
    sprite[SPRITE.AMETHYST][SPRITE.DAY].push(CTI(create_amethyst(1.7, false, ["#1d051e", "#c27add", "#cd98e5"])));
    sprite[SPRITE.AMETHYST][SPRITE.DAY].push(CTI(create_amethyst(1.5, false, ["#1d051e", "#c27add", "#cd98e5"])));
    sprite[SPRITE.AMETHYST][SPRITE.DAY].push(CTI(create_amethyst(1.3, false, ["#1d051e", "#c27add", "#cd98e5"])));
    sprite[SPRITE.AMETHYST][SPRITE.NIGHT].push(CTI(create_amethyst(1.7, false, ["#123d38", "#41aaa0", "#5cccc4"])));
    sprite[SPRITE.AMETHYST][SPRITE.NIGHT].push(CTI(create_amethyst(1.5, false, ["#123d38", "#41aaa0", "#5cccc4"])));
    sprite[SPRITE.AMETHYST][SPRITE.NIGHT].push(CTI(create_amethyst(1.3, false, ["#123d38", "#41aaa0", "#5cccc4"])));
    sprite[SPRITE.SNOW] = [];
    sprite[SPRITE.SNOW][SPRITE.DAY] = [];
    sprite[SPRITE.SNOW][SPRITE.NIGHT] = [];
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_one(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_two(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_three(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_four(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_five(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_six(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.DAY].push(CTI(create_snow_sept(1, ["#ebf2f0"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_one(1, ["#136167"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_two(1, ["#136167"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_three(1, ["#136167"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_four(1, ["#136167"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_five(1, ["#136167"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_six(1, ["#136167"])));
    sprite[SPRITE.SNOW][SPRITE.NIGHT].push(CTI(create_snow_sept(1, ["#136167"])));
    sprite[SPRITE.DRAGON_GROUND] = [];
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY] = [];
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT] = [];
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_dragon_ground(3, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_snow_one(1, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_snow_two(1, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_snow_three(1, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_snow_four(1, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_snow_five(1, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.DAY].push(CTI(create_snow_six(1, ["#594837"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_dragon_ground(3, ["#083534"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_snow_one(1, ["#083534"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_snow_two(1, ["#083534"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_snow_three(1, ["#083534"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_snow_four(1, ["#083534"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_snow_five(1, ["#083534"])));
    sprite[SPRITE.DRAGON_GROUND][SPRITE.NIGHT].push(CTI(create_snow_six(1, ["#083534"])));
    sprite[SPRITE.INV_AMETHYST] = create_craft_button(1, [{ f: create_amethyst, x: -5, y: -5, a: 1, r: 0, c: ["#1d051e", "#c27add", "#cd98e5"] }], .31, ["#2b5c48", "#2b5c48", "#2b5c48"], .7);
    sprite[SPRITE.GROUND_FIRE_WINTER] = [];
    sprite[SPRITE.GROUND_FIRE_WINTER][SPRITE.DAY] = CTI(create_ground_fire(.9, false, ["#a3c9bd"]));
    sprite[SPRITE.GROUND_FIRE_WINTER][SPRITE.NIGHT] = CTI(create_ground_fire(.9, false, ["#1b6d6d"]));
    sprite[SPRITE.DOOR_WOOD_OPEN_WINTER] = [];
    sprite[SPRITE.DOOR_WOOD_OPEN_WINTER][SPRITE.DAY] = CTI(create_door_wood(1, false, "#EBF2F0 #EBF2F0 #b2d4d1 #b2d4d1 #EBF2F0 #b2d4d1".split(" ")));
    sprite[SPRITE.DOOR_WOOD_OPEN_WINTER][SPRITE.NIGHT] = CTI(create_door_wood(1, false, "#136167 #136167 #24878f #24878f #136167 #24878f".split(" ")));
    sprite[SPRITE.DOOR_STONE_OPEN_WINTER] = [];
    sprite[SPRITE.DOOR_STONE_OPEN_WINTER][SPRITE.DAY] = CTI(create_door_stone(1, false, "#EBF2F0 #EBF2F0 #b2d4d1 #b2d4d1 #EBF2F0 #b2d4d1".split(" ")));
    sprite[SPRITE.DOOR_STONE_OPEN_WINTER][SPRITE.NIGHT] = CTI(create_door_stone(1, false, "#136167 #136167 #24878f #24878f #136167 #24878f".split(" ")));
    sprite[SPRITE.DOOR_AMETHYST_OPEN_WINTER] = [];
    sprite[SPRITE.DOOR_AMETHYST_OPEN_WINTER][SPRITE.DAY] = CTI(create_door_stone(1, false, "#EBF2F0 #EBF2F0 #b2d4d1 #b2d4d1 #EBF2F0 #b2d4d1".split(" ")));
    sprite[SPRITE.DOOR_AMETHYST_OPEN_WINTER][SPRITE.NIGHT] = CTI(create_door_stone(1, false, "#136167 #136167 #24878f #24878f #136167 #24878f".split(" ")));
    sprite[SPRITE.DOOR_DIAMOND_OPEN_WINTER] = [];
    sprite[SPRITE.DOOR_DIAMOND_OPEN_WINTER][SPRITE.DAY] = CTI(create_door_diamond(1, false, "#EBF2F0 #EBF2F0 #b2d4d1 #b2d4d1 #EBF2F0 #b2d4d1".split(" ")));
    sprite[SPRITE.DOOR_DIAMOND_OPEN_WINTER][SPRITE.NIGHT] = CTI(create_door_diamond(1, false, "#136167 #136167 #24878f #24878f #136167 #24878f".split(" ")));
    sprite[SPRITE.DOOR_GOLD_OPEN_WINTER] = [];
    sprite[SPRITE.DOOR_GOLD_OPEN_WINTER][SPRITE.DAY] = CTI(create_door_gold(1, false, "#EBF2F0 #EBF2F0 #b2d4d1 #b2d4d1 #EBF2F0 #b2d4d1".split(" ")));
    sprite[SPRITE.DOOR_GOLD_OPEN_WINTER][SPRITE.NIGHT] = CTI(create_door_gold(1, false, "#136167 #136167 #24878f #24878f #136167 #24878f".split(" ")));
    sprite[SPRITE.FOX] = [];
    sprite[SPRITE.FOX][SPRITE.DAY] = CTI(create_winter_fox(.9, "#1d051e #ffffff #c41c50 #2c2e2d #c63450 #f7e7f0".split(" ")));
    sprite[SPRITE.FOX][SPRITE.NIGHT] = CTI(create_winter_fox(.9, "#123d38 #1a847f #200333 #131919 #01333a #b6f2db".split(" ")));
    sprite[SPRITE.BEAR] = [];
    sprite[SPRITE.BEAR][SPRITE.DAY] = CTI(create_polar_bear(.9, "#1d051e #ffffff #c41c50 #c63450 #ffffff #f7e7f0 #2b2d2d".split(" ")));
    sprite[SPRITE.BEAR][SPRITE.NIGHT] = CTI(create_polar_bear(.9, "#123d38 #1a847f #200333 #01333a #ffffff #b6f2db #2b2d2d".split(" ")));
    sprite[SPRITE.MINIMAP] = [];
    sprite[SPRITE.MINIMAP][SPRITE.DAY] = CTI(create_minimap(1, "#0d1c16 #54318e #6e7773 #6e7773 #6e7773 #124c34 #133a2b #133a2b #133a2b #133a2b #a8962c #a8962c #a8962c #3fc9c9 #3fc9c9 #3fc9c9 #0d1c16 #e7f0f0 #a8a8a8 #c3ded4 #bad9ce #c8dbd5 #e8db65 #61ded2 #c850f2 #a8a8a8".split(" ")));
    sprite[SPRITE.MINIMAP][SPRITE.NIGHT] = CTI(create_minimap(1, "#021314 #2f195e #245655 #245655 #245655 #032625 #0b3534 #0b3534 #0b3534 #0b3534 #225150 #225150 #225150 #2b9390 #2b9390 #2b9390 #021314 #0F5156 #377775 #032625 #032625 #032625 #225150 #2b9390 #752b93 #377775".split(" ")));
    sprite[SPRITE.BIGMAP] = [];
    sprite[SPRITE.BIGMAP][SPRITE.DAY] = CTI(create_minimap(3, "#0d1c16 #54318e #6e7773 #6e7773 #6e7773 #124c34 #133a2b #133a2b #133a2b #133a2b #a8962c #a8962c #a8962c #3fc9c9 #3fc9c9 #3fc9c9 #0d1c16 #e7f0f0 #a8a8a8 #c3ded4 #bad9ce #c8dbd5 #e8db65 #61ded2 #c850f2 #a8a8a8".split(" ")));
    sprite[SPRITE.BIGMAP][SPRITE.NIGHT] = CTI(create_minimap(3, "#021314 #2f195e #245655 #245655 #245655 #032625 #0b3534 #0b3534 #0b3534 #0b3534 #225150 #225150 #225150 #2b9390 #2b9390 #2b9390 #021314 #0F5156 #377775 #032625 #032625 #032625 #225150 #2b9390 #752b93 #377775".split(" ")));
    sprite[SPRITE.SNOW_STEP] = [];
    sprite[SPRITE.SNOW_STEP][SPRITE.DAY] = CTI(create_snow_step(1, ["#c8e0de"]));
    sprite[SPRITE.SNOW_STEP][SPRITE.NIGHT] = CTI(create_snow_step(1, ["#147071"]));
    sprite[SPRITE.HURT_FOX] = CTI(create_hurt_fox_winter(.9, "#BB0000"));
    sprite[SPRITE.HURT_BEAR] = CTI(create_hurt_polar_bear(.9, "#BB0000"));
    sprite[SPRITE.HURT_DRAGON] = CTI(create_hurt_dragon(.8, "#BB0000"));
    sprite[SPRITE.HURT_WING_LEFT] = CTI(create_hurt_wingleft(.8, "#BB0000"));
    sprite[SPRITE.HURT_WING_RIGHT] = CTI(create_hurt_wingright(.8, "#BB0000"));
    sprite[SPRITE.HURT_RABBIT] = CTI(create_hurt_rabbit(.9, "#BB0000"));
    sprite[SPRITE.HURT] = CTI(create_hurt_player(.6, "#BB0000"));
    sprite[SPRITE.COLD] = CTI(create_hurt_player(.6, "#1CE7E0"));
    sprite[SPRITE.HUNGER] = CTI(create_hurt_player(.6, "#DBE71C"));
    sprite[SPRITE.HEAL] = CTI(create_hurt_player(.6, "#00BB00"));
    sprite[SPRITE.GAUGES] = CTI(create_gauges(1));
    sprite[SPRITE.LEADERBOARD] = CTI(create_leaderboard(1));
    sprite[SPRITE.COUNTER] = [];
    sprite[SPRITE.SLOT_NUMBER] = [];
    for (c = 0; 11 > c; c++) {
        sprite[SPRITE.SLOT_NUMBER][c] = create_text(1, "" + (c + 1), 12, "#FFF");
    }
    sprite[SPRITE.PLAY] = create_button([{ text: "PLAY", size: 20, font: "Baloo Paaji", w: 100, h: 40, lw: 4, r: 10, bg: "#096D41", fg: "#096D41", color: "#FFF" }, { text: "PLAY", size: 20, font: "Baloo Paaji", w: 100, h: 40, lw: 4, r: 10, bg: "#002211", fg: "#002211", color: "#FFF" }, { text: "PLAY", size: 20, font: "Baloo Paaji", w: 100, h: 40, lw: 4, r: 10, bg: "#000000", fg: "#000000", color: "#FFF" }]);
    sprite[SPRITE.AUTO_FEED] = create_text(1, "Auto-Feed", 25, "#FFF", void 0, void 0, "#000", 5, 140);
}
function init_fake_world() {
    document.getElementById("game_body").style.backgroundColor = SPRITE.GROUND[fake_world.time];
    fake_world.items.push(new Item(ITEMS.FIRE, 0, 0, 0, 0, Math.random() * Math.PI * 2, 0, 0));
    fake_world.items.push(new Item(ITEMS.FRUIT, 0, 0, 0, 0, 0, 0, 5));
    fake_world.items.push(new Item(ITEMS.WORKBENCH, 0, 0, 0, 0, Math.PI / 4, 0, 0));
    fake_world.items.push(new Item(ITEMS.FRUIT, 0, 0, 0, 0, 0, 0, 5));
}
function draw_fake_world() {
    var c = fake_world.time;
    if (sprite[SPRITE.HERB]) {
        ctx.drawImage(sprite[SPRITE.HERB][c][1], canw2 + 480, canh2 + 190);
        ctx.drawImage(sprite[SPRITE.HERB][c][2], canw2 + 180, canh2 - 430);
        ctx.drawImage(sprite[SPRITE.HERB][c][1], canw2 - 855, canh2 + 100);
        ctx.drawImage(sprite[SPRITE.HERB][c][0], canw2 - 550, canh2 - 300);
        ctx.drawImage(sprite[SPRITE.HERB][c][0], canw2 - 1020, canh2 - 520);
    }
    if (sprite[SPRITE.STONES]) {
        ctx.drawImage(sprite[SPRITE.STONES][c][1], canw2 - 80, canh2 - 640);
        ctx.drawImage(sprite[SPRITE.STONES][c][1], canw2 + 80, canh2 + 490);
        ctx.drawImage(sprite[SPRITE.STONES][c][2], canw2 - 180, canh2 - 700);
        ctx.drawImage(sprite[SPRITE.STONES][c][0], canw2 + 550, canh2 + 100);
        ctx.drawImage(sprite[SPRITE.STONES][c][1], canw2 + 450, canh2 + 300);
        ctx.drawImage(sprite[SPRITE.STONES][c][1], canw2 + 780, canh2 + 300);
        ctx.drawImage(sprite[SPRITE.STONES][c][2], canw2 + 980, canh2 + 200);
        ctx.drawImage(sprite[SPRITE.STONES][c][2], canw2 + 680, canh2 + 600);
        ctx.drawImage(sprite[SPRITE.STONES][c][2], canw2 - 380, canh2 + 100);
        ctx.drawImage(sprite[SPRITE.STONES][c][2], canw2 + 280, canh2 + 250);
    }
    if (sprite[SPRITE.PLANT]) {
        ctx.drawImage(sprite[SPRITE.PLANT][c], canw2 - 590, canh2);
        ctx.drawImage(sprite[SPRITE.PLANT][c], canw2 + 120, canh2 - 390);
        ctx.drawImage(sprite[SPRITE.PLANT][c], canw2 - 270, canh2 + 340);
    }
    if (sprite[SPRITE.TREE]) {
        ctx.drawImage(sprite[SPRITE.TREE][c][5], canw2 - 700, canh2 - 600);
        ctx.drawImage(sprite[SPRITE.TREE][c][5], canw2 - 970, canh2 - 250);
        ctx.drawImage(sprite[SPRITE.TREE][c][5], canw2 - 720, canh2 - 200);
        ctx.drawImage(sprite[SPRITE.TREE][c][3], canw2 - 1020, canh2 + 340);
        ctx.drawImage(sprite[SPRITE.TREE][c][3], canw2 - 1120, canh2 - 0);
        ctx.drawImage(sprite[SPRITE.TREE][c][2], canw2 - 630, canh2 - 300);
        ctx.drawImage(sprite[SPRITE.TREE][c][5], canw2 - 495, canh2 - 90);
        ctx.drawImage(sprite[SPRITE.TREE][c][4], canw2 - 520, canh2 + 340);
        ctx.drawImage(sprite[SPRITE.TREE][c][2], canw2 + 830, canh2 - 520);
    }
    if (user && world) {
        var c = user.cam.x;
        var g = user.cam.y;
        user.cam.x = canw2;
        user.cam.y = canh2;
        var f = world.time;
        world.time = fake_world.time;
        var d = fake_world.items;
        d[2].x = 400;
        d[2].y = 100;
        d[2].draw(SPRITE.WORKBENCH);
        var e = d[1];
        e.x = -500;
        e.y = 100;
        e.fruits[0].x = e.x - 20.5;
        e.fruits[0].y = e.y - 22.5;
        e.fruits[1].x = e.x - 35.5;
        e.fruits[1].y = e.y + 7.5;
        e.fruits[2].x = e.x + 7.5;
        e.fruits[2].y = e.y - 30;
        e.fruits[3].x = e.x + 22.5;
        e.fruits[3].y = e.y;
        e.fruits[4].x = e.x - 7.5;
        e.fruits[4].y = e.y + 14.5;
        for (var m = 0; m < e.info; m++) {
            e.fruits[m].draw(SPRITE.FRUIT);
        }
        e = d[3];
        e.x = 210;
        e.y = -290;
        e.fruits[0].x = e.x - 20.5;
        e.fruits[0].y = e.y - 22.5;
        e.fruits[1].x = e.x - 35.5;
        e.fruits[1].y = e.y + 7.5;
        e.fruits[2].x = e.x + 7.5;
        e.fruits[2].y = e.y - 30;
        e.fruits[3].x = e.x + 22.5;
        e.fruits[3].y = e.y;
        e.fruits[4].x = e.x - 7.5;
        e.fruits[4].y = e.y + 14.5;
        for (m = 0; m < e.info; m++) {
            e.fruits[m].draw(SPRITE.FRUIT);
        }
        d[0].x = 450;
        d[0].y = -100;
        d[0].draw_bg(SPRITE.WOOD_FIRE);
        d[0].draw_fg();
        user.cam.x = c;
        user.cam.y = g;
        world.time = f;
    }
}
function draw_slot_number(c, g, f) {
    c = sprite[SPRITE.SLOT_NUMBER][c];
    var d = g.info.translate.x + 5 * scale;
    var e = g.info.translate.y + 5 * scale;
    if (g.info.state == BUTTON_CLICK || f) {
        e += 5 * scale;
    }
    ctx.drawImage(c, d, e);
}
function draw_amount(c, g) {
    if (!sprite[SPRITE.COUNTER][c]) {
        sprite[SPRITE.COUNTER][c] = create_text(scale, "x" + c, 20, "#FFF");
    }
    var f = sprite[SPRITE.COUNTER][c];
    var d = g.info.translate.x + g.info.img[0].width - f.width - 5 * scale;
    var e = g.info.translate.y + g.info.img[0].height - f.height - 5 * scale;
    if (g.info.state == BUTTON_CLICK) {
        e += 5 * scale;
    }
    ctx.drawImage(f, d, e);
}
function draw_furnace_inventory() {
    user.furnace.amount = 0;
    user.furnace.open = false;
    var c = world.fast_units[user.uid];
    var g = WORLD.DIST_FURNACE;
    if (c) {
        for (var f = 0; f < world.units[ITEMS.FURNACE].length; f++) {
            var d = world.units[ITEMS.FURNACE][f];
            var e = Utils.dist(d, c);
            if (e < g) {
                g = e;
                user.furnace.open = true;
                user.furnace.amount = d.info;
                user.furnace.pid = d.pid;
                user.furnace.iid = d.id;
            }
        }
        if (g < WORLD.DIST_FURNACE) {
            g = sprite[SPRITE.FURNACE_SLOT];
            c = game.furnace_button;
            ctx.drawImage(g, Math.floor(c.info.translate.x + (c.info.img[0].width - g.width) / 2), Math.floor(c.info.translate.y + (c.info.img[0].height - g.height) / 2) + 3);
            if (0 < user.furnace.amount) {
                c.draw(ctx);
                g = user.furnace.amount;
                if (1 < g) {
                    draw_amount(g, c);
                }
            }
        }
    }
}
function draw_chest_inventory() {
    user.chest.id = -1;
    user.chest.open = false;
    var c = world.fast_units[user.uid];
    var g = WORLD.DIST_CHEST;
    if (c) {
        for (var f = 0; f < world.units[ITEMS.CHEST].length; f++) {
            var d = world.units[ITEMS.CHEST][f];
            var e = Utils.dist(d, c);
            if (e < g) {
                g = e;
                user.chest.open = true;
                user.chest.id = 1 >= d.action ? -1 : Math.floor(d.action / 2) - 1;
                user.chest.amount = d.info;
                user.chest.pid = d.pid;
                user.chest.iid = d.id;
            }
        }
        for (f = 0; f < world.units[ITEMS.FURNACE].length; f++) {
            e = Utils.dist(world.units[ITEMS.FURNACE][f], c);
            if (e < g) {
                g = WORLD.DIST_CHEST;
                user.chest.open = false;
                user.chest.id = -1;
                break;
            }
        }
        if (g < WORLD.DIST_CHEST) {
            g = sprite[SPRITE.CHEST_SLOT];
            c = game.chest_buttons[0];
            ctx.drawImage(g, Math.floor(c.info.translate.x + (c.info.img[0].width - g.width) / 2), Math.floor(c.info.translate.y + (c.info.img[0].height - g.height) / 2) + 3);
            if (0 <= user.chest.id) {
                c = game.chest_buttons[user.chest.id];
                c.draw(ctx);
                g = user.chest.amount;
                if (1 < g) {
                    draw_amount(g, c);
                }
            }
        }
    }
}
function draw_bigmap() {
    if (user.bigmap) {
        ctx.globalAlpha = .5;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canw, canh);
        ctx.globalAlpha = .8;
        var c = sprite[SPRITE.BIGMAP][world.time];
        var g = canw2 - c.width / 2;
        var f = canh2 - c.height / 2;
        ctx.drawImage(c, g, f);
        ctx.globalAlpha = 1;
        if (c = world.fast_units[user.uid]) {
            ctx.fillStyle = world.time ? "#fff" : "#1e8a9d";
            circle(ctx, g + (.0077 * c.x + 9) * scale * 3, f + (.0125 * c.y + 12) * scale * 3, 12 * scale);
            ctx.fill();
        }
    }
}
function draw_minimap() {
    var c = game.minimap;
    ctx.globalAlpha = .8;
    ctx.drawImage(sprite[SPRITE.MINIMAP][world.time], c.translate.x, c.translate.y);
    ctx.globalAlpha = 1;
    var g = world.fast_units[user.uid];
    if (g) {
        ctx.fillStyle = world.time ? "#fff" : "#1e8a9d";
        circle(ctx, c.translate.x + (.0077 * g.x + 9) * scale, c.translate.y + (.0125 * g.y + 12) * scale, 4 * scale);
        ctx.fill();
    }
}
function draw_auto_feed() {
    if (user.auto_feed.enabled) {
        ctx.drawImage(sprite[SPRITE.AUTO_FEED], user.auto_feed.translate.x, user.auto_feed.translate.y);
    }
}
function draw_leaderboard() {
    var c = user.ldb;
    var g = game.leaderboard;
    if (c.update) {
        c.update = false;
        var c = c.ids;
        var f = g.ctx;
        var d = world.players;
        var e = false;
        f.clearRect(0, 0, g.can.width, g.can.height);
        f.drawImage(g.img, 0, 0);
        for (var m = 0; m < c.length; m++) {
            var p = d[c[m]];
            if (world.mode != WORLD.MODE_HUNGER_GAMES || p.nickname != "spectator") {
                if (c[m] == user.id) {
                    e = true;
                    color = "#FFF";
                } else {
                    color = "#A1BDCD";
                }
                f.drawImage(create_text(scale, "" + (m + 1), 15 * scale, color), 20 * scale, (40 + 22 * m) * scale);
                if (!p.ldb_label) {
                    p.ldb_label = create_text(scale, p.nickname, 15 * scale, color, void 0, void 0, void 0, void 0, 110 * scale);
                }
                f.drawImage(p.ldb_label, 39 * scale, (40 + 22 * m) * scale);
                f.drawImage(create_text(scale, Utils.simplify_number(p.score), 15 * scale, color), 156 * scale, (40 + 22 * m) * scale);
            }
        }
        if (!e) {
            f.drawImage(sprite[SPRITE.YOUR_SCORE], 15 * scale, (46 + 22 * m) * scale);
            f.drawImage(create_text(scale, Utils.simplify_number(world.players[user.id].score), 15 * scale, "#FFF"), 100 * scale, (46 + 22 * m) * scale);
        }
    }
    ctx.drawImage(g.can, g.translate.x, g.translate.y);
}
function draw_ui_crafting() {
    var c = user.craft;
    if (!c.crafting && 0 < c.preview) {
        var g = world.fast_units[user.uid];
        ctx.save();
        ctx.translate(user.cam.x + g.x, user.cam.y + g.y);
        ctx.rotate(g.angle);
        g = sprite[c.preview][world.time];
        ctx.globalAlpha = .5;
        ctx.drawImage(g, 120 * scale + -g.width / 2, -g.height / 2);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    if (c.crafting) {
        var f = c.timeout.update();
        var g = world.fast_units[user.uid];
        ctx.save();
        ctx.translate(user.cam.x + g.x, user.cam.y + g.y);
        var g = sprite[SPRITE.GEAR];
        var d = -g.height / 2 - 125 * scale;
        ctx.drawImage(g, -g.width / 2, d);
        ctx.beginPath();
        ctx.lineWidth = 5 * scale;
        ctx.strokeStyle = SPRITE.CRAFT_LOADING[world.time];
        ctx.lineCap = "round";
        ctx.arc(0, d + g.height / 2, 25 * scale, 0, 2 * Math.PI * c.timeout.v);
        ctx.stroke();
        ctx.restore();
        for (g = 0; g < c.can_craft.length; g++) {
            d = c.can_craft[g];
            if (c.id == d.id) {
                var e = 53 * scale;
                round_rect(ctx, d.info.translate.x, d.info.translate.y + e * (1 - c.timeout.v), d.info.img[0].width, e * c.timeout.v + 17 * scale, 10 * scale);
                ctx.fillStyle = "#55B973";
                ctx.fill();
                ctx.globalAlpha = .8;
            } else {
                ctx.globalAlpha = .5;
            }
            d.draw(ctx);
            ctx.globalAlpha = 1;
        }
        if (f) {
            c.crafting = false;
            c.timeout.v = 0;
            c.timeout.o = false;
        }
    } else {
        for (g = 0; g < c.can_craft.length; g++) {
            c.can_craft[g].draw(ctx);
        }
    }
}
function draw_ui_inventory() {
    var c = user.inv;
    var g = world.fast_units[user.uid];
    for (var f = 0; f < c.can_select.length; f++) {
        var d = c.can_select[f];
        var e = false;
        if (c.id == d.id || g && g.clothe == d.id && 0 < g.clothe) {
            e = true;
            ctx.drawImage(d.info.img[2], d.info.translate.x, d.info.translate.y);
        } else {
            d.draw(ctx);
        }
        var m = user.inv.n[d.id];
        if (1 < m) {
            draw_amount(m, d);
        }
        if (0 < m) {
            draw_slot_number(f, d, e);
        }
        e = user.chest;
        if (e.open && (0 > e.id || e.id == d.id)) {
            game.plus_buttons[d.id].draw(ctx);
        }
        if (user.furnace.open && INV.WOOD == d.id) {
            game.plus_buttons[d.id].draw(ctx);
        }
    }
    if (d && f < c.max) {
        g = sprite[SPRITE.EMPTY_SLOT][2];
        x = d.info.translate.x;
        y = d.info.translate.y;
        for (j = 1; f < c.max; f++, j++) {
            ctx.drawImage(g, x + j * (g.width + 5), y);
        }
    }
}
function draw_gauges() {
    if (.25 > user.gauges.life.x) {
        ctx.globalAlpha = user.gauges.warn_life.v;
    }
    ctx.fillStyle = "#69A148";
    ctx.fillRect(this.translate.x + 66 * scale, this.translate.y + 17 * scale, 247 * user.gauges.life.x * scale, 16 * scale);
    ctx.globalAlpha = 1;
    if (.25 > user.gauges.hunger.x) {
        ctx.fillStyle = "#8F050A";
        ctx.globalAlpha = user.gauges.warn_hunger.v;
        ctx.fillRect(this.translate.x + 66 * scale, this.translate.y + 52 * scale, 247 * scale, 16 * scale);
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "#AF352A";
    ctx.fillRect(this.translate.x + 66 * scale, this.translate.y + 52 * scale, 247 * user.gauges.hunger.x * scale, 16 * scale);
    if (.25 > user.gauges.cold.x) {
        ctx.fillStyle = "#366B91";
        ctx.globalAlpha = user.gauges.warn_cold.v;
        ctx.fillRect(this.translate.x + 66 * scale, this.translate.y + 87 * scale, 247 * scale, 16 * scale);
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "#669BB1";
    ctx.fillRect(this.translate.x + 66 * scale, this.translate.y + 87 * scale, 247 * user.gauges.cold.x * scale, 16 * scale);
    ctx.drawImage(this.img, this.translate.x, this.translate.y);
}
function draw_door(c) {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    if (this.hit.update) {
        if (this.hit.anim.update() && this.hit.anim.o == 0) {
            this.hit.update = false;
        }
        var g = (1 - this.hit.anim.v) * delta * 600 * scale;
        var f = Math.cos(this.hit.angle - this.angle) * g;
        var g = Math.sin(this.hit.angle - this.angle) * g;
    } else {
        g = f = 0;
    }
    c = sprite[c][world.time];
    w = -c.width;
    h = -c.height;
    ctx.drawImage(c, -w / 2 + f, -h / 2 + g, w, h);
    ctx.restore();
}
function draw_simple_item(c) {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    if (this.hit.update) {
        if (this.hit.anim.update() && this.hit.anim.o == 0) {
            this.hit.update = false;
        }
        var g = (1 - this.hit.anim.v) * delta * 600 * scale;
        var f = Math.cos(this.hit.angle - this.angle) * g;
        var g = Math.sin(this.hit.angle - this.angle) * g;
    } else {
        g = f = 0;
    }
    img = sprite[c][world.time];
    w = -img.width;
    h = -img.height;
    ctx.drawImage(img, -w / 2 + f, -h / 2 + g, w, h);
    ctx.restore();
}
function draw_dragon() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.breath.update();
    this.rotate.update();
    c = sprite[SPRITE.DRAGON][world.time];
    w = -c.width * this.breath.v;
    h = -c.height * this.breath.v;
    ctx.drawImage(c, -w / 2, -h / 2, w, h);
    if (this.action & STATE.HURT) {
        if (this.hit.update() && this.hit.o == 0) {
            this.action -= STATE.HURT;
        }
        ctx.globalAlpha = .6 - this.hit.v;
        var c = sprite[SPRITE.HURT_DRAGON];
        ctx.drawImage(c, -w / 2, -h / 2, w, h);
        ctx.globalAlpha = 1;
    }
    c = sprite[SPRITE.WING_LEFT][world.time];
    w = -c.width * this.breath.v;
    h = -c.height * this.breath.v;
    ctx.save();
    ctx.translate(-30 * scale, 70 * scale);
    ctx.rotate(this.rotate.v);
    ctx.drawImage(c, -10 * scale, -10 * scale, w, h);
    if (this.action & STATE.HURT) {
        ctx.globalAlpha = .6 - this.hit.v;
        c = sprite[SPRITE.HURT_WING_LEFT];
        ctx.drawImage(c, -10 * scale, -10 * scale, w, h);
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    c = sprite[SPRITE.WING_RIGHT][world.time];
    ctx.save();
    ctx.translate(30 * scale, 70 * scale);
    ctx.rotate(-this.rotate.v);
    ctx.drawImage(c, 10 * scale - w, -10 * scale, w, h);
    if (this.action & STATE.HURT) {
        ctx.globalAlpha = .6 - this.hit.v;
        c = sprite[SPRITE.HURT_WING_RIGHT];
        ctx.drawImage(c, 10 * scale - w, -10 * scale, w, h);
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.restore();
}
function draw_simple_mobs(c, g) {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.breath.update();
    f = sprite[c][world.time];
    w = -f.width * this.breath.v;
    h = -f.height * this.breath.v;
    ctx.drawImage(f, -w / 2, -h / 2, w, h);
    if (this.action & STATE.HURT) {
        if (this.hit.update() && this.hit.o == 0) {
            this.action -= STATE.HURT;
        }
        ctx.globalAlpha = .6 - this.hit.v;
        var f = sprite[g];
        ctx.drawImage(f, -w / 2, -h / 2, w, h);
        ctx.globalAlpha = 1;
    }
    ctx.restore();
}
function draw_breath(c) {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.breath.update();
    img = sprite[c][world.time];
    w = -img.width * this.breath.v;
    h = -img.height * this.breath.v;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
}
function draw_seed() {
    if (!(10 > this.info)) {
        ctx.save();
        ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
        ctx.rotate(this.angle);
        if (this.hit.update) {
            if (this.hit.anim.update() && this.hit.anim.o == 0) {
                this.hit.update = false;
            }
            var c = (1 - this.hit.anim.v) * delta * 600 * scale;
            var g = Math.cos(this.hit.angle - this.angle) * c;
            var c = Math.sin(this.hit.angle - this.angle) * c;
        } else {
            c = g = 0;
        }
        this.ground.update();
        var f = sprite[SPRITE.PLANT_SEED][world.time];
        var d = -f.width * this.ground.v;
        var e = -f.height * this.ground.v;
        ctx.drawImage(f, -d / 2 + g, -e / 2 + c, d, e);
        ctx.restore();
    }
}
function draw_plant() {
    if (!(10 < this.info)) {
        ctx.save();
        ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
        ctx.rotate(this.angle);
        if (this.hit.update) {
            if (this.hit.anim.update() && this.hit.anim.o == 0) {
                this.hit.update = false;
            }
            var c = (1 - this.hit.anim.v) * delta * 600 * scale;
            var g = Math.cos(this.hit.angle - this.angle) * c;
            var c = Math.sin(this.hit.angle - this.angle) * c;
        } else {
            c = g = 0;
        }
        var f = sprite[SPRITE.PLANT_MINI][world.time];
        ctx.drawImage(f, -f.width / 2 + g, -f.width / 2 + c);
        ctx.restore();
        for (g = 0; g < this.info; g++) {
            this.fruits[g].draw(SPRITE.FRUIT);
        }
    }
}
function draw_furnace() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    if (this.hit.update) {
        if (this.hit.anim.update() && this.hit.anim.o == 0) {
            this.hit.update = false;
        }
        var c = (1 - this.hit.anim.v) * delta * 600 * scale;
        var g = Math.cos(this.hit.angle - this.angle) * c;
        var c = Math.sin(this.hit.angle - this.angle) * c;
    } else {
        c = g = 0;
    }
    img = this.action == 2 ? sprite[SPRITE.FURNACE_ON][world.time] : sprite[SPRITE.FURNACE_OFF][world.time];
    ctx.drawImage(img, -img.width / 2 + g, -img.height / 2 + c);
    ctx.restore();
}
function draw_furnace_ground() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.ground.update();
    var c = this.x > SPRITE.WINTER_BIOME_Y ? sprite[SPRITE.GROUND_FIRE_WINTER][world.time] : sprite[SPRITE.GROUND_FIRE][world.time];
    var g = -c.width * this.ground.v;
    var f = -c.height * this.ground.v;
    ctx.drawImage(c, -g / 2, -f / 2, g, f);
    ctx.restore();
}
function draw_fire_ground(c) {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.ground.update();
    var g = this.x > SPRITE.WINTER_BIOME_Y ? sprite[SPRITE.GROUND_FIRE_WINTER][world.time] : sprite[SPRITE.GROUND_FIRE][world.time];
    var f = -g.width * this.ground.v;
    var d = -g.height * this.ground.v;
    ctx.drawImage(g, -f / 2, -d / 2, f, d);
    if (this.hit.update) {
        if (this.hit.anim.update() && this.hit.anim.o == 0) {
            this.hit.update = false;
        }
        g = (1 - this.hit.anim.v) * delta * 600 * scale;
        f = Math.cos(this.hit.angle - this.angle) * g;
        d = Math.sin(this.hit.angle - this.angle) * g;
    } else {
        d = f = 0;
    }
    g = sprite[c][world.time];
    ctx.drawImage(g, -g.width / 2 + f, -g.height / 2 + d);
    ctx.restore();
}
function draw_furnace_halo() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.halo.update();
    img = sprite[SPRITE.HALO_FIRE][world.time];
    w = -img.width * this.halo.v;
    h = -img.height * this.halo.v;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
}
function draw_fire_halo() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.rotate(this.angle);
    this.fire.update();
    img = sprite[SPRITE.FIRE][world.time];
    w = -img.width * this.fire.v;
    h = -img.height * this.fire.v;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    this.halo.update();
    img = sprite[SPRITE.HALO_FIRE][world.time];
    w = -img.width * this.halo.v;
    h = -img.height * this.halo.v;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
}
function draw_player_right_stuff(c, g, f) {
    if (0 <= c) {
        switch (img = sprite[c][world.time], c) {
            case SPRITE.PICK:
            case SPRITE.PICK_GOLD:
            case SPRITE.PICK_DIAMOND:
            case SPRITE.PICK_WOOD:
            case SPRITE.PICK_AMETHYST:
                draw_image_transition(img, -img.width / 2 - scale * (45 + g), -img.height / 2 + scale * (f + 22));
                break;
            case SPRITE.SWORD:
            case SPRITE.SWORD_GOLD:
            case SPRITE.SWORD_DIAMOND:
            case SPRITE.SWORD_AMETHYST:
                draw_image_transition(img, -img.width / 2 - scale * (43 + g), -img.height / 2 + scale * (f + 52));
                break;
            case SPRITE.BOOK:
                draw_image_transition(img, -img.width / 2 - scale * (62 + g), -img.height / 2 + scale * (f + 18));
                break;
            case SPRITE.SPEAR:
            case SPRITE.GOLD_SPEAR:
            case SPRITE.DIAMOND_SPEAR:
            case SPRITE.AMETHYST_SPEAR:
                draw_image_transition(img, -img.width / 2 - scale * (41 + g), -img.height / 2 + scale * (f + 57));
                break;
            case SPRITE.HAMMER:
            case SPRITE.HAMMER_GOLD:
            case SPRITE.HAMMER_DIAMOND:
            case SPRITE.HAMMER_AMETHYST:
                draw_image_transition(img, -img.width / 2 - scale * (46 + g), -img.height / 2 + scale * (f + 35));
        }
    }
}
var draw_player_clothe = function (c) {
    if (0 < c) {
        var g = sprite[c][world.time];
        switch (c) {
            case SPRITE.EARMUFFS:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 18 * scale);
                break;
            case SPRITE.COAT:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 10 * scale);
                break;
            case SPRITE.EXPLORER_HAT:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 19 * scale);
                break;
            case SPRITE.STONE_HELMET:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 21 * scale);
                break;
            case SPRITE.GOLD_HELMET:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 5 * scale);
                break;
            case SPRITE.DIAMOND_HELMET:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 2 * scale);
                break;
            case SPRITE.CAP_SCARF:
                draw_image_transition(g, -g.width / 2, -g.height / 2 - 2 * scale);
        }
    }
};
function draw_player() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    ctx.save();
    ctx.rotate(this.angle - Math.PI / 2);
    if (!(this.action & STATE.ATTACK)) {
        if (this.action & STATE.IDLE) {
            this.idle.update();
        } else if (this.action & STATE.WALK) {
            this.walk.update();
        }
    }
    var c = this.idle.v;
    var g = this.walk.v;
    var f = sprite[SPRITE.HAND][world.time];
    shadow = sprite[SPRITE.HAND_SHADOW][world.time];
    if (this.action & STATE.ATTACK) {
        if (this.attack.update() && this.attack.o == 0) {
            this.hand = !this.hand;
            this.action -= STATE.ATTACK;
            if (this.uid == user.uid) {
                user.control.mouse = 0;
            }
        }
        if (0 <= this.right) {
            this.hand = true;
        }
        var d = this.hand ? this.attack.v : -this.attack.v / 3;
        var e = this.hand ? this.attack.v / 3 : -this.attack.v;
        ctx.save();
        ctx.rotate(d);
        draw_image_transition(shadow, -shadow.width / 2 - scale * (49 + c), -shadow.height / 2 + (15 + g) * scale);
        draw_player_right_stuff(this.right, c, g);
        draw_image_transition(f, -f.width / 2 - scale * (49 + c), -f.height / 2 + (11 + g) * scale);
        ctx.restore();
        ctx.save();
        ctx.rotate(e);
        draw_image_transition(shadow, -shadow.width / 2 + scale * (49 + c), -shadow.height / 2 + (15 + g) * scale);
        draw_image_transition(f, -f.width / 2 + scale * (49 + c), -f.height / 2 + (11 + g) * scale);
        ctx.restore();
    } else {
        draw_image_transition(shadow, -shadow.width / 2 - scale * (49 + c), -shadow.height / 2 + (15 + g) * scale);
        draw_player_right_stuff(this.right, c, g);
        draw_image_transition(f, -f.width / 2 - scale * (49 + c), -f.height / 2 + (11 + g) * scale);
        draw_image_transition(shadow, -shadow.width / 2 + scale * (49 + c), -shadow.height / 2 + (15 + g) * scale);
        draw_image_transition(f, -f.width / 2 + scale * (49 + c), -f.height / 2 + (11 + g) * scale);
    }
    if (this.bag && 1 > this.clothe) {
        var f = sprite[SPRITE.BAG][world.time];
        draw_image_transition(f, -f.width / 2, -f.height / 2 - 39 * scale);
    }
    f = sprite[SPRITE.BODY][world.time];
    draw_image_transition(f, -f.width / 2, -f.height / 2);
    if (this.action & STATE.HEAL) {
        if (this.heal.update() && this.heal.o == 0) {
            this.action -= STATE.HEAL;
        }
        ctx.globalAlpha = .6 - this.heal.v;
        f = sprite[SPRITE.HEAL];
        ctx.drawImage(f, -f.width / 2, -f.height / 2);
        ctx.globalAlpha = 1;
    }
    if (this.action & STATE.WEB) {
        if (this.web.update() && this.web.o == 0) {
            this.action -= STATE.WEB;
        }
        ctx.globalAlpha = .6 - this.web.v;
        f = sprite[SPRITE.WEB];
        ctx.drawImage(f, -f.width / 2, -f.height / 2);
        ctx.globalAlpha = 1;
    }
    if (this.action & STATE.HURT) {
        if (this.hit.update() && this.hit.o == 0) {
            this.action -= STATE.HURT;
        }
        ctx.globalAlpha = .6 - this.hit.v;
        f = sprite[SPRITE.HURT];
        ctx.drawImage(f, -f.width / 2, -f.height / 2);
        ctx.globalAlpha = 1;
    }
    if (this.action & STATE.COLD) {
        if (this.freeze.update() && this.freeze.o == 0) {
            this.action -= STATE.COLD;
        }
        ctx.globalAlpha = .6 - this.freeze.v;
        f = sprite[SPRITE.COLD];
        ctx.drawImage(f, -f.width / 2, -f.height / 2);
        ctx.globalAlpha = 1;
    }
    if (this.action & STATE.HUNGER) {
        if (this.starve.update() && this.starve.o == 0) {
            this.action -= STATE.HUNGER;
        }
        ctx.globalAlpha = .6 - this.starve.v;
        f = sprite[SPRITE.HUNGER];
        ctx.drawImage(f, -f.width / 2, -f.height / 2);
        ctx.globalAlpha = 1;
    }
    draw_player_clothe(this.clothe);
    ctx.restore();
    if (this.x > SPRITE.WINTER_BIOME_Y) {
        if (!this.player.label_winter) {
            this.player.label_winter = create_text(scale, this.player.nickname, 20, "#187484", "#000", 2);
        }
        f = this.player.label_winter;
    } else {
        if (!this.player.label) {
            this.player.label = create_text(scale, this.player.nickname, 20, "#FFF", "#000", 2);
        }
        f = this.player.label;
    }
    if (world.day == SPRITE.NIGHT) {
        ctx.globalAlpha = .5;
    }
    ctx.drawImage(f, -f.width / 2, -f.height / 2 - 70 * scale);
    ctx.globalAlpha = 1;
    ctx.restore();
}
function draw_alert(c, g) {
    if (this.text) {
        ctx.globalAlpha = this.timeout.o ? 1 - this.timeout.v : 1;
        if (!this.label) {
            this.label = create_text(scale, this.text, 40, c, null, null, g, 10);
        }
        ctx.drawImage(this.label, (can.width - this.label.width) / 2, 50 * scale);
        ctx.globalAlpha = 1;
        if (this.timeout.update() && this.timeout.o == 0) {
            this.text = "";
            this.label = null;
        }
    }
}
function draw_chat() {
    ctx.save();
    ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
    if (this.text) {
        ctx.globalAlpha = this.chat.o ? 1 - this.chat.v : 1;
        if (!this.label) {
            this.label = create_message(scale, this.text);
        }
        ctx.drawImage(this.label, -this.label.width / 2, -this.label.height / 2 - 110 * scale);
        if (this.chat.update() && this.chat.o == 0) {
            this.text = "";
            this.label = null;
        }
    }
    ctx.restore();
}
function draw_map_objects(c, g, f, d, e, m, p, n) {
    for (n = n === void 0 ? 0 : n; p >= n; p--) {
        for (var r = c; r <= g; r++) {
            for (var u = f; u <= d; u++) {
                var q = MAP.tiles[r][u];
                if (q) {
                    var q = q[m][p];
                    for (var v = 0; v < q.length; v++) {
                        var t = q[v];
                        if (t.update) {
                            if (t.hit.update() && t.hit.o == 0) {
                                t.update = false;
                            }
                            var z = (1 - t.hit.v) * delta * 600 * scale;
                            var A = Math.cos(t.angle) * z;
                            var z = Math.sin(t.angle) * z;
                        } else {
                            z = A = 0;
                        }
                        var B = sprite[e][world.time][p];
                        ctx.drawImage(B, user.cam.x + t.x - B.width / 2 + A, user.cam.y + t.y - B.height / 2 + z);
                    }
                }
            }
        }
    }
}
function draw_map_object(c, g, f, d, e, m) { }
function draw_world() {
    var c = Math.max(Math.floor(-user.cam.x / world.dw) - 2, 0);
    var g = Math.min(Math.floor((-user.cam.x + user.cam.w) / world.dw) + 2, world.nw - 1);
    var f = Math.max(Math.floor(-user.cam.y / world.dh) - 2, 0);
    var d = Math.min(Math.floor((-user.cam.y + user.cam.h) / world.dh) + 1, world.nh - 1);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.HERB, "h", 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.HERB_WINTER, "hw", 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.SNOW, "so", 6);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.DRAGON_GROUND, "dg", 6);
    var e = world.units[ITEMS.PLAYERS];
    for (var m = 0; m < e.length; m++) {
        var p = e[m];
        for (var n = 0; n < p.foot.length; n++) {
            draw_foot(p.foot[n]);
        }
    }
    n = world.units[ITEMS.FURNACE];
    for (m = 0; m < n.length; m++) {
        if (n[m].action == 2) {
            draw_bg_transition(n[m]);
        }
    }
    n = world.units[ITEMS.FIRE];
    for (m = 0; m < n.length; m++) {
        draw_bg_transition(n[m], SPRITE.WOOD_FIRE);
    }
    e = world.units[ITEMS.BIG_FIRE];
    for (m = 0; m < e.length; m++) {
        draw_bg_transition(e[m], SPRITE.BIG_FIRE_WOOD);
    }
    e = world.units[ITEMS.SEED];
    for (m = 0; m < e.length; m++) {
        draw_bg_transition(e[m]);
    }
    e = world.units[ITEMS.SEED];
    for (m = 0; m < e.length; m++) {
        draw_fg_transition(e[m]);
    }
    n = world.units[ITEMS.WOOD_DOOR];
    for (m = 0; m < n.length; m++) {
        if (n[m].info) {
            if (n[m].x < SPRITE.WINTER_BIOME_Y) {
                draw_transition(n[m], SPRITE.DOOR_WOOD_OPEN);
            } else {
                draw_transition(n[m], SPRITE.DOOR_WOOD_OPEN_WINTER);
            }
        }
    }
    n = world.units[ITEMS.STONE_DOOR];
    for (m = 0; m < n.length; m++) {
        if (n[m].info) {
            if (n[m].x < SPRITE.WINTER_BIOME_Y) {
                draw_transition(n[m], SPRITE.DOOR_STONE_OPEN);
            } else {
                draw_transition(n[m], SPRITE.DOOR_STONE_OPEN_WINTER);
            }
        }
    }
    n = world.units[ITEMS.GOLD_DOOR];
    for (m = 0; m < n.length; m++) {
        if (n[m].info) {
            if (n[m].x < SPRITE.WINTER_BIOME_Y) {
                draw_transition(n[m], SPRITE.DOOR_GOLD_OPEN);
            } else {
                draw_transition(n[m], SPRITE.DOOR_GOLD_OPEN_WINTER);
            }
        }
    }
    n = world.units[ITEMS.DIAMOND_DOOR];
    for (m = 0; m < n.length; m++) {
        if (n[m].info) {
            if (n[m].x < SPRITE.WINTER_BIOME_Y) {
                draw_transition(n[m], SPRITE.DOOR_DIAMOND_OPEN);
            } else {
                draw_transition(n[m], SPRITE.DOOR_DIAMOND_OPEN_WINTER);
            }
        }
    }
    n = world.units[ITEMS.AMETHYST_DOOR];
    for (m = 0; m < n.length; m++) {
        if (n[m].info) {
            if (n[m].x < SPRITE.WINTER_BIOME_Y) {
                draw_transition(n[m], SPRITE.DOOR_AMETHYST_OPEN);
            } else {
                draw_transition(n[m], SPRITE.DOOR_AMETHYST_OPEN_WINTER);
            }
        }
    }
    e = world.units[ITEMS.RABBIT];
    for (m = 0; m < e.length; m++) {
        draw_transition(e[m], SPRITE.RABBIT, SPRITE.HURT_RABBIT);
    }
    e = world.units[ITEMS.PLAYERS];
    if (world.mode === WORLD.MODE_PVP) {
        for (m = 0; m < e.length; m++) {
            e[m].draw();
        }
    } else if (world.mode === WORLD.MODE_HUNGER_GAMES) {
        for (m = 0; m < e.length; m++) {
            if (world.players[user.id].nickname === "spectator") {
                e[m].draw();
            } else if (e[m].player.nickname !== "spectator") {
                e[m].draw();
            }
        }
    }
    n = world.units[ITEMS.FOX];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.FOX, SPRITE.HURT_FOX);
    }
    n = world.units[ITEMS.WOLF];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.WOLF, SPRITE.HURT_WOLF);
    }
    n = world.units[ITEMS.SPIDER];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.SPIDER, SPRITE.HURT_SPIDER);
    }
    n = world.units[ITEMS.BEAR];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.BEAR, SPRITE.HURT_BEAR);
    }
    n = world.units[ITEMS.DRAGON];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.DRAGON, SPRITE.HURT_DRAGON);
    }
    n = world.units[ITEMS.CHEST];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.CHEST);
    }
    n = world.units[ITEMS.WORKBENCH];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.WORKBENCH);
    }
    n = world.units[ITEMS.FURNACE];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m]);
    }
    n = world.units[ITEMS.WOOD_DOOR];
    for (m = 0; m < n.length; m++) {
        if (!n[m].info) {
            draw_transition(n[m], SPRITE.DOOR_WOOD_CLOSE);
        }
    }
    n = world.units[ITEMS.STONE_DOOR];
    for (m = 0; m < n.length; m++) {
        if (!n[m].info) {
            draw_transition(n[m], SPRITE.DOOR_STONE_CLOSE);
        }
    }
    n = world.units[ITEMS.GOLD_DOOR];
    for (m = 0; m < n.length; m++) {
        if (!n[m].info) {
            draw_transition(n[m], SPRITE.DOOR_GOLD_CLOSE);
        }
    }
    n = world.units[ITEMS.DIAMOND_DOOR];
    for (m = 0; m < n.length; m++) {
        if (!n[m].info) {
            draw_transition(n[m], SPRITE.DOOR_DIAMOND_CLOSE);
        }
    }
    n = world.units[ITEMS.AMETHYST_DOOR];
    for (m = 0; m < n.length; m++) {
        if (!n[m].info) {
            draw_transition(n[m], SPRITE.DOOR_AMETHYST_CLOSE);
        }
    }
    n = world.units[ITEMS.WALL];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.WALL);
    }
    n = world.units[ITEMS.STONE_WALL];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.STONE_WALL);
    }
    n = world.units[ITEMS.GOLD_WALL];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.GOLD_WALL);
    }
    n = world.units[ITEMS.DIAMOND_WALL];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.DIAMOND_WALL);
    }
    n = world.units[ITEMS.AMETHYST_WALL];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.AMETHYST_WALL);
    }
    n = world.units[ITEMS.SPIKE];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.SPIKE);
    }
    n = world.units[ITEMS.STONE_SPIKE];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.STONE_SPIKE);
    }
    n = world.units[ITEMS.GOLD_SPIKE];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.GOLD_SPIKE);
    }
    n = world.units[ITEMS.DIAMOND_SPIKE];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.DIAMOND_SPIKE);
    }
    n = world.units[ITEMS.AMETHYST_SPIKE];
    for (m = 0; m < n.length; m++) {
        draw_transition(n[m], SPRITE.AMETHYST_SPIKE);
    }
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.GOLD, "g", 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.GOLD_WINTER, "gw", 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.DIAMOND, "d", 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.DIAMOND_WINTER, "dw", 2);
    draw_map_transition(draw_map_object, f, d, c, g, SPRITE.PLANT, "p", 0);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.AMETHYST, "a", 2);
    p = world.units[ITEMS.FRUIT];
    for (m = 0; m < p.length; m++) {
        for (n = 0; n < p[m].info; n++) {
            draw_transition(p[m].fruits[n], SPRITE.FRUIT);
        }
    }
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.STONES, "s", 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.STONES_WINTER, "sw", 2);
    n = world.units[ITEMS.FIRE];
    for (m = 0; m < n.length; m++) {
        draw_fg_transition(n[m]);
    }
    n = world.units[ITEMS.BIG_FIRE];
    for (m = 0; m < n.length; m++) {
        draw_fg_transition(n[m]);
    }
    n = world.units[ITEMS.FURNACE];
    for (m = 0; m < n.length; m++) {
        if (n[m].action == 2) {
            draw_fg_transition(n[m]);
        }
    }
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.TREE, "t", 5, 4);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.FIR, "f", 2, 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.TREE_BRANCH, "b", 3, 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.TREE, "t", 3, 2);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.TREE_BRANCH, "b", 1, 0);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.FIR, "f", 1, 1);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.TREE, "t", 1, 0);
    draw_map_transition(draw_map_objects, f, d, c, g, SPRITE.FIR, "f", 0, 0);
    if (world.mode === WORLD.MODE_PVP) {
        for (m = 0; m < e.length; m++) {
            e[m].draw_text();
        }
    } else if (world.mode === WORLD.MODE_HUNGER_GAMES) {
        for (m = 0; m < e.length; m++) {
            if (world.players[user.id].nickname === "spectator") {
                e[m].draw_text();
            } else if (e[m].player.nickname !== "spectator") {
                e[m].draw_text();
            }
        }
    }
}
function draw_bg_transition(c, g) {
    if (world.transition) {
        ctx.globalAlpha = 1;
        c.draw_bg(g);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1 - world.shade.v;
        c.draw_bg(g);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1;
    } else {
        c.draw_bg(g);
    }
}
function draw_fg_transition(c, g) {
    if (world.transition) {
        ctx.globalAlpha = 1;
        c.draw_fg(g);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1 - world.shade.v;
        c.draw_fg(g);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1;
    } else {
        c.draw_fg(g);
    }
}
function draw_image_transition(c, g, f) {
    if (world.transition) {
        ctx.globalAlpha = 1;
        ctx.drawImage(c, g, f);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1 - world.shade.v;
        ctx.drawImage(c, g, f);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1;
    } else {
        ctx.drawImage(c, g, f);
    }
}
function draw_foot(c) {
    ctx.save();
    ctx.translate(user.cam.x + c.x, user.cam.y + c.y);
    ctx.rotate(c.angle);
    ctx.globalAlpha = c.alpha;
    c = sprite[SPRITE.SNOW_STEP][world.time];
    ctx.drawImage(c, -c.width / 2, -c.height / 2);
    ctx.globalAlpha = 1;
    ctx.restore();
}
function draw_imgs_transition(c, g, f, d, e) {
    if (world.transition && e == 1) {
        ctx.globalAlpha = 1;
        ctx.drawImage(sprite[c][world.time][g], f, d);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1 - world.shade.v;
        ctx.drawImage(sprite[c][world.time][g], f, d);
        world.time = world.time ? 0 : 1;
    } else {
        ctx.globalAlpha = e;
        ctx.drawImage(sprite[c][world.time][g], f, d);
    }
    ctx.globalAlpha = 1;
}
function draw_transition(c, g, f) {
    if (world.transition) {
        ctx.globalAlpha = 1;
        c.draw(g, f);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1 - world.shade.v;
        c.draw(g, f);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1;
    } else {
        c.draw(g, f);
    }
}
function draw_map_transition(c, g, f, d, e, m, p, n) {
    if (world.transition) {
        ctx.globalAlpha = 1;
        c(g, f, d, e, m, p, n);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1 - world.shade.v;
        c(g, f, d, e, m, p, n);
        world.time = world.time ? 0 : 1;
        ctx.globalAlpha = 1;
    } else {
        c(g, f, d, e, m, p, n);
    }
}
function get_color_transition(c, g, f, d, e, m, p) {
    d = Math.floor(d * p + (1 - p) * c);
    c = "#" + (16 > d ? "0" + d.toString(16) : d.toString(16));
    d = Math.floor(e * p + (1 - p) * g);
    c += 16 > d ? "0" + d.toString(16) : d.toString(16);
    d = Math.floor(m * p + (1 - p) * f);
    return c += 16 > d ? "0" + d.toString(16) : d.toString(16);
}
function draw_ground() {
    if (-user.cam.x <= SPRITE.WINTER_BIOME_Y) {
        if (world.transition) {
            var c = world.time ? 1 - world.shade.v : world.shade.v;
            ctx.fillStyle = get_color_transition(3, 36, 40, 19, 58, 43, c);
        } else {
            ctx.fillStyle = SPRITE.GROUND[world.time];
        }
        c = -user.cam.x + canw - SPRITE.WINTER_BIOME_Y;
        if (0 <= c) {
            ctx.fillRect(0, 0, canw - c, canh);
        } else {
            ctx.fillRect(0, 0, canw, canh);
        }
    }
    if (-user.cam.x + canw >= SPRITE.WINTER_BIOME_Y) {
        if (world.transition) {
            c = world.time ? 1 - world.shade.v : world.shade.v;
            ctx.fillStyle = get_color_transition(19, 97, 103, 235, 242, 240, c);
        } else {
            ctx.fillStyle = SPRITE.SNOW_GROUND[world.time];
        }
        c = SPRITE.WINTER_BIOME_Y + user.cam.x;
        if (0 < c) {
            ctx.fillRect(c, 0, canw - c, canh);
        } else {
            ctx.fillRect(0, 0, canw, canh);
        }
    }
}
function draw_winter() {
    var c = user.winter;
    var g = c.flakes;
    for (var f = 0; f < g.length; f++) {
        var d = g[f];
        c.update(d);
        draw_imgs_transition(SPRITE.FLAKES, d.id, user.cam.x + d.x, user.cam.y + d.y, d.alpha);
    }
    for (f = 0; f < g.length; f++) {
        d = g[f];
        if (0 >= d.life || d.x > -user.cam.x + user.cam.w || d.x < -user.cam.x || d.y > -user.cam.y + user.cam.h) {
            g.splice(f, 1);
        }
    }
    g = -user.cam.x + user.cam.w;
    if (g >= SPRITE.WINTER_BIOME_Y) {
        c.add(g);
    }
}
function draw_world_with_effect() {
    if (world.transition) {
        var c = world.shade.update();
    }
    draw_ground();
    draw_world();
    draw_winter();
    if (world.transition && c) {
        world.transition = false;
        world.shade.v = 0;
        world.shade.o = false;
    }
}
var ANIMATION_STOP = 0;
var ANIMATION_RUN = 1;
var FOCUS_OUT = 0;
var FOCUS_IN = 1;
var ALIGN_CENTER = 0;
var ALIGN_LEFT = 1;
var STYLE_RETRO = 0;
var STYLE_FLAT = 1;
var KEYDOWN = 0;
var KEYPRESS = 1;
var GET_KEY_OUT = 0;
var GET_KEY_IN = 1;
var MOUSE_MOVE = 0;
var MOUSE_DOWN = 1;
var MOUSE_UP = 2;
var BUTTON_OUT = 0;
var BUTTON_IN = 1;
var BUTTON_CLICK = 2;
function gui_disable_antialiasing(c) {
    c.imageSmoothingEnabled = false;
    c.webkitImageSmoothingEnabled = false;
    c.mozImageSmoothingEnabled = false;
    c.msImageSmoothingEnabled = false;
    c.oImageSmoothingEnabled = false;
}
function get_mouse_pos(c, g) {
    var f = c.getBoundingClientRect();
    return { x: g.clientX - f.left, y: g.clientY - f.top };
}
function gui_create_button(c, g, f, d) {
    if (d) {
        var e = d;
    }
    var m = { width: c, height: g, img: e, state: BUTTON_OUT, translate: { x: 0, y: 0 } };
    return {
        info: m, trigger: function (c, d, e) {
            c = m.translate;
            if (d.x > c.x && d.x < c.x + m.img[m.state].width && d.y > c.y && d.y < c.y + m.img[m.state].height) {
                if (e == MOUSE_DOWN) {
                    m.state = BUTTON_CLICK;
                } else if (e == MOUSE_UP) {
                    m.state = BUTTON_IN;
                } else if (e == MOUSE_MOVE && m.state != BUTTON_CLICK) {
                    m.state = BUTTON_IN;
                }
                return true;
            }
            m.state = BUTTON_OUT;
            return false;
        }, draw: function (c) {
            c.drawImage(m.img[m.state], m.translate.x, m.translate.y);
        }
    };
}
function gui_create_image(c) {
    var g = { x: 0, y: 0 };
    return {
        img: c, translate: g, draw: function (f) {
            f.drawImage(c, g.x, g.y);
        }
    };
}
function gui_create_animation(c, g) {
    g = g === void 0 ? .033 : g;
    var f = { x: 0, y: 0 };
    var d = 0;
    var e = 0;
    var m = function () {
        e += delta;
        if (e > g) {
            d = (d + 1) % c.length;
            e -= g;
        }
        return c[d];
    };
    return {
        img: c, translate: f, draw: function (c) {
            c.drawImage(m(), f.x, f.y);
        }
    };
}
function gui_add_breath_effect(c, g, f, d, e, m, p) {
    c.end = g;
    c.start = f;
    c.speed_start = d;
    c.speed_end = e;
    c.width = c.img.width;
    c.height = c.img.height;
    c.scale = 1;
    c.breath = false;
    c.draw = function (d) {
        d.drawImage(c.img, 0, 0, c.img.width, c.img.height, c.translate.x, c.translate.y, c.width, c.height);
    };
}
function gui_breath_effect(c) {
    c.scale += c.breath ? delta / c.speed_start : -delta / c.speed_end;
    if (c.scale > c.end) {
        c.breath = false;
    } else if (c.scale < c.start) {
        c.breath = true;
    }
}
var STATE = { DELETE: 1, HURT: 2, COLD: 4, HUNGER: 8, ATTACK: 16, WALK: 32, IDLE: 64, HEAL: 128, WEB: 256 };
var CLIENT = { VERSION_NUMBER: 5, TIMEOUT_TIME: 2e3, TIMEOUT_NUMBER: 3, PING: "[13]", PING_DELAY: 6e4, ROTATE: .2, ATTACK: .2, CAM_DELAY: 50, MUTE_DELAY: 125e3, TIMEOUT_SERVER: 6e5, WAITING_FOR_SERVER: 8e3, DELAY_CONNECTION_UPDATE: 5, LAG_DISTANCE: 200, LOOSE_FOCUS: 15 };
function Client() {
    var c = this;
    this.socket = null;
    this._current_id = 0;
    this.server_list = [];
    this.xhttp = new XMLHttpRequest;
    this.xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            c.fun_after(true, 4);
        } else {
            c.fun_after(false, this.readyState);
        }
    };
    this.xhttp_get = function (c, f) {
        this.fun_after = c;
        this.xhttp.open("GET", f, true);
        this.xhttp.send();
    };
    this.store_server_list = function () {
        this.server_list = JSON.parse(this.xhttp.responseText);
    };
    this.update_server_list = function () {
        var c = 0;
        for (var f = 0; f < client.server_list.length; f++) {
            c += client.server_list[f].players.online;
        }
        c = "<option disabled>Choose a server (" + c + " players)</option>";
        for (f = 0; f < this.server_list.length; f++) {
            c += "<option>" + this.server_list[f].name + " [" + this.server_list[f].players.online + "/" + this.server_list[f].players.max + " players]</option>\n";
        }
        f = document.getElementById("region_select");
        f.innerHTML = c;
        f.selectedIndex = Math.min(Math.floor(9 * Math.random() + 1), client.server_list.length);
    };
    this.timeout_number = this.timeout_server = 0;
    this.timeout_handler = null;
    this.timeout = function () {
        c.timeout_number++;
        c.socket.close();
        if (c.timeout_number > CLIENT.TIMEOUT_NUMBER) {
            ___adsvid = 1;
            ui.error_level = CLIENT.ERROR_REFUSED;
            user.alert.text = "You cannot join this server";
            ui.waiting = false;
        } else {
            c.connect_timeout();
        }
    };
    this.kick = function (c) {
        if (this._current_id == this.socket._current_id) {
            this._current_id++;
            user.alert.text = "Kicked: " + c;
            game.quit(ui.run);
        }
    };
    this.mute = function () {
        user.alert.text = "You speak too much";
    };
    this.old_version = function () {
        clearTimeout(this.timeout_handler);
        user.alert.text = "You have an old version, you need to clear your cache";
        ui.waiting = false;
    };
    this.build_stop = function () {
        if (user.craft.id2 == INV.BAG) {
            user.inv.max = 10;
        } else {
            this.gather([0, user.craft.id2, 1]);
        }
        user.craft.restart();
    };
    this.get_focus = function () {
        this.socket.send(JSON.stringify([11]));
    };
    this.build_ok = function (c) {
        user.auto_feed.delay = 0;
        user.craft.do_craft(c);
    };
    this.survive = function () {
        user.alert.text = user.day == 0 ? "You survived 1 day" : "You survived " + (user.day + 1) + " days";
        user.alert.label = null;
        user.alert.timeout.o = false;
        user.alert.timeout.v = user.alert.timeout.max;
        user.day++;
    };
    this.full = function () {
        ___adsvid = 1;
        clearTimeout(this.timeout_handler);
        user.alert.text = "Server is full! Spam the play button!";
        ui.waiting = false;
    };
    this.new_player = function (c) {
        var f = c[1];
        var d = world.players;
        d[f].nickname = c[2];
        d[f].score = 0;
        d[f].ldb_label = null;
        d[f].label = null;
        d[f].label_winter = null;
        d[f].alive = true;
    };
    this.empty_res = function () {
        user.alert.text = "Resource is empty";
    };
    this.inv_full = function () {
        user.alert.text = "Inventory is full (right-click to empty items)";
    };
    this.gather = function (c) {
        var f = c.length;
        var d = user.inv;
        for (var e = 1; e < f; e += 2) {
            var m = c[e];
            var p = c[e + 1];
            for (var n = 0; n < d.can_select.length; n++) {
                if (d.can_select[n].id == m) {
                    d.n[m] += p;
                    break;
                }
            }
            if (n == d.can_select.length) {
                d.n[m] = p;
                d.can_select.push(game.inv_buttons[m]);
                game.update_inv_buttons();
            }
        }
        user.craft.update();
    };
    this.gauges = function (c, f, d) {
        user.gauges.l = c / 100;
        user.gauges.h = f / 100;
        user.gauges.c = d / 100;
    };
    this.get_time = function (c) {
        world.time = c;
        world.transition = true;
    };
    this.change_ground = function () {
        document.getElementById("game_body").style.backgroundColor = SPRITE.GROUND[world.time];
    };
    this.kill_player = function (c) {
        world.players[c].alive = false;
    };
    this.set_cam = function (c) {
        c = new Uint16Array(c);
        player.cam.change(c[1], c[2]);
    };
    this.recover_focus = function (c) {
        c = new Uint16Array(c);
        user.cam.change(c[1], c[2]);
    };
    this.hitten_other = function (c, f) {
        var d = new Uint16Array(f);
        var e = (c.length - 2) / 4;
        for (var m = 0; m < e; m++) {
            var p = c[5 + 4 * m] / 255 * Math.PI * 2;
            var n = world.fast_units[c[4 + 4 * m] * world.max_units + d[1 + 2 * m]];
            if (n && n.hit) {
                n.hit.angle = p;
                n.hit.update = p;
            }
        }
    };
    this.hitten = function (c) {
        c = new Uint16Array(c);
        var f = (c.length - 1) / 4;
        for (var d = 0; d < f; d++) {
            var e = 4 * d;
            var m = c[3 + e] / 255 * Math.PI * 2;
            var p = MAP.tiles[c[2 + e]][c[1 + e]];
            switch (c[4 + e]) {
                case 0:
                    p.p[0].angle = m;
                    p.p[0].update = true;
                    break;
                case 1:
                    p.s[0][0].angle = m;
                    p.s[0][0].update = true;
                    break;
                case 2:
                    p.s[1][0].angle = m;
                    p.s[1][0].update = true;
                    break;
                case 3:
                    p.s[2][0].angle = m;
                    p.s[2][0].update = true;
                    break;
                case 4:
                    p.t[0][0].angle = m;
                    p.t[0][0].update = true;
                    break;
                case 5:
                    p.t[1][0].angle = m;
                    p.t[1][0].update = true;
                    break;
                case 6:
                    p.t[2][0].angle = m;
                    p.t[2][0].update = true;
                    break;
                case 7:
                    p.t[3][0].angle = m;
                    p.t[3][0].update = true;
                    break;
                case 8:
                    p.t[4][0].angle = m;
                    p.t[4][0].update = true;
                    break;
                case 9:
                    p.t[5][0].angle = m;
                    p.t[5][0].update = true;
                    break;
                case 10:
                    p.g[0][0].angle = m;
                    p.g[0][0].update = true;
                    break;
                case 11:
                    p.g[1][0].angle = m;
                    p.g[1][0].update = true;
                    break;
                case 12:
                    p.g[2][0].angle = m;
                    p.g[2][0].update = true;
                    break;
                case 13:
                    p.d[0][0].angle = m;
                    p.d[0][0].update = true;
                    break;
                case 14:
                    p.d[1][0].angle = m;
                    p.d[1][0].update = true;
                    break;
                case 15:
                    p.d[2][0].angle = m;
                    p.d[2][0].update = true;
                    break;
                case 16:
                    p.b[0][0].angle = m;
                    p.b[0][0].update = true;
                    break;
                case 17:
                    p.b[1][0].angle = m;
                    p.b[1][0].update = true;
                    break;
                case 18:
                    p.b[2][0].angle = m;
                    p.b[2][0].update = true;
                    break;
                case 19:
                    p.b[3][0].angle = m;
                    p.b[3][0].update = true;
                    break;
                case 20:
                    p.f[0][0].angle = m;
                    p.f[0][0].update = true;
                    break;
                case 21:
                    p.f[1][0].angle = m;
                    p.f[1][0].update = true;
                    break;
                case 22:
                    p.f[2][0].angle = m;
                    p.f[2][0].update = true;
                    break;
                case 23:
                    p.sw[0][0].angle = m;
                    p.sw[0][0].update = true;
                    break;
                case 24:
                    p.sw[1][0].angle = m;
                    p.sw[1][0].update = true;
                    break;
                case 25:
                    p.sw[2][0].angle = m;
                    p.sw[2][0].update = true;
                    break;
                case 26:
                    p.gw[0][0].angle = m;
                    p.gw[0][0].update = true;
                    break;
                case 27:
                    p.gw[1][0].angle = m;
                    p.gw[1][0].update = true;
                    break;
                case 28:
                    p.gw[2][0].angle = m;
                    p.gw[2][0].update = true;
                    break;
                case 29:
                    p.dw[0][0].angle = m;
                    p.dw[0][0].update = true;
                    break;
                case 30:
                    p.dw[1][0].angle = m;
                    p.dw[1][0].update = true;
                    break;
                case 31:
                    p.dw[2][0].angle = m;
                    p.dw[2][0].update = true;
                    break;
                case 32:
                    p.a[0][0].angle = m;
                    p.a[0][0].update = true;
                    break;
                case 33:
                    p.a[1][0].angle = m;
                    p.a[1][0].update = true;
                    break;
                case 34:
                    p.a[2][0].angle = m;
                    p.a[2][0].update = true;
            }
        }
    };
    this.give_wood = function (c, f) {
        this.socket.send(JSON.stringify([12, f, c.pid, c.iid]));
    };
    this.give_item = function (c, f, d) {
        this.socket.send(JSON.stringify([8, f, d, c.pid, c.iid]));
    };
    this.take_chest = function (c) {
        this.socket.send(JSON.stringify([9, c.pid, c.iid]));
    };
    this.units = function (c, f, d) {
        c = new Uint16Array(c);
        if (d) {
            world.delete_all_units();
        }
        d = (f.length - 2) / 12;
        for (var e = 0; e < d; e++) {
            var m = 2 + 12 * e;
            var p = 1 + 6 * e;
            var n = f[m];
            var r = f[m + 1];
            var u = c[p + 4];
            var q = n * world.max_units + u;
            if (r & STATE.DELETE) {
                world.delete_units(q);
            } else {
                var v = f[m + 2];
                var t = c[p + 2];
                var z = c[p + 3];
                var p = c[p + 5];
                var m = f[m + 3] / 255 * Math.PI * 2;
                if (world.fast_units[q]) {
                    q = world.fast_units[q];
                    q.r.x = t;
                    q.r.y = z;
                    if (n != 0 && Utils.dist(q, q.r) > CLIENT.LAG_DISTANCE) {
                        q.x = t;
                        q.y = z;
                    }
                    if (q.id != user.id) {
                        q.nangle = m;
                    }
                    q.action |= r;
                    q.info = p;
                    if (q.update) {
                        q.update(r);
                    }
                } else {
                    n = new Item(v, n, u, t, z, m, r, p);
                    world.fast_units[q] = n;
                    world.units[v].push(n);
                }
            }
        }
    };
    this.leaderboard = function (c) {
        this.timeout_server = old_timestamp;
        c = new Uint16Array(c);
        user.ldb.init(c);
    };
    this.chat = function (c) {
        var f = world.fast_units[c[1] * world.max_units];
        if (f) {
            f.text = c[2];
        }
    };
    this.select_craft = function (c) {
        if (user.inv.max != user.inv.can_select.length || user.inv.find_item(RECIPES[c].id2) != -1 || user.inv.free_place(RECIPES[c].r)) {
            this.socket.send(JSON.stringify([7, c]));
        } else {
            this.inv_full();
        }
    };
    this.workbench = function (c) {
        user.craft.workbench = c;
        user.craft.update();
    };
    this.fire = function (c) {
        user.craft.fire = c;
        user.craft.update();
    };
    this.dont_harvest = function (c) {
        user.alert.text = "This is not the right tool";
    };
    this.cancel_craft = function () {
        user.craft.restart();
    };
    this.decrease_item = function (c, f) {
        user.inv.decrease(c, f, user.inv.find_item(c));
        user.craft.update();
    };
    this.accept_build = function (c) {
        user.craft.preview = -1;
        user.inv.decrease(c, 1, user.inv.find_item(c));
    };
    this.cancel_crafting = function () {
        this.socket.send(JSON.stringify([10]));
    };
    this.send_build = function () {
        this.socket.send(JSON.stringify([5, user.craft.preview]));
    };
    this.select_inv = function (c, f) {
        switch (c) {
            case INV.BANDAGE:
            case INV.PLANT:
            case INV.MEAT:
            case INV.COOKED_MEAT:
                user.craft.preview = -1;
                this.socket.send(JSON.stringify([5, c]));
                break;
            case INV.WORKBENCH:
            case INV.SPIKE:
            case INV.SEED:
            case INV.FIRE:
            case INV.WALL:
            case INV.STONE_WALL:
            case INV.GOLD_WALL:
            case INV.DIAMOND_WALL:
            case INV.BIG_FIRE:
            case INV.CHEST:
            case INV.WOOD_DOOR:
            case INV.STONE_DOOR:
            case INV.GOLD_DOOR:
            case INV.DIAMOND_DOOR:
            case INV.STONE_SPIKE:
            case INV.GOLD_SPIKE:
            case INV.DIAMOND_SPIKE:
            case INV.FURNACE:
            case INV.AMETHYST_WALL:
            case INV.AMETHYST_DOOR:
            case INV.AMETHYST_SPIKE:
                user.craft.preview = user.craft.preview == c ? -1 : c;
                break;
            case INV.SWORD:
            case INV.PICK:
            case INV.PICK_WOOD:
            case INV.PICK_GOLD:
            case INV.PICK_DIAMOND:
            case INV.HAMMER:
            case INV.HAMMER_GOLD:
            case INV.HAMMER_DIAMOND:
            case INV.SWORD_GOLD:
            case INV.SWORD_DIAMOND:
            case INV.BOOK:
            case INV.SPEAR:
            case INV.GOLD_SPEAR:
            case INV.HAMMER_AMETHYST:
            case INV.DIAMOND_SPEAR:
            case INV.SWORD_AMETHYST:
            case INV.PICK_AMETHYST:
            case INV.AMETHYST_SPEAR:
                user.craft.preview = -1;
                if (c == user.inv.id) {
                    this.socket.send(JSON.stringify([5, INV.HAND]));
                    user.inv.id = -1;
                } else {
                    this.socket.send(JSON.stringify([5, c]));
                    user.inv.id = c;
                }
                break;
            case INV.EARMUFFS:
            case INV.COAT:
            case INV.CAP_SCARF:
            case INV.EXPLORER_HAT:
            case INV.STONE_HELMET:
            case INV.GOLD_HELMET:
            case INV.DIAMOND_HELMET:
                this.socket.send(JSON.stringify([5, c]));
        }
    };
    this.delete_inv = function (c, f) {
        user.inv.delete_item(c, f);
        user.craft.update();
        this.socket.send(JSON.stringify([6, c]));
    };
    this.stop_attack = function () {
        this.socket.send(JSON.stringify([14]));
    };
    this.send_attack = function (c) {
        var f = 2 * Math.PI;
        this.socket.send(JSON.stringify([4, Math.floor((c + f) % f * 255 / f)]));
    };
    this.send_angle = function (c) {
        var f = 2 * Math.PI;
        this.socket.send(JSON.stringify([3, Math.floor((c + f) % f * 255 / f)]));
    };
    this.send_move = function (c) {
        this.socket.send(JSON.stringify([2, c]));
    };
    this.send_chat = function (c) {
        world.fast_units[user.uid].text = c;
        this.socket.send(JSON.stringify([0, c]));
    };
    this.move_units = function (c) {
        var f = player.select.units;
        if (f.length != 0) {
            var d = [2];
            var e = [];
            Utils.sub_vector(c, { x: player.cam.rx, y: player.cam.ry });
            d.push(c.x);
            d.push(c.y);
            for (c = 0; c < f.length; c++) {
                e.push(f[c].oid);
            }
            d.push(e);
            this.socket.send(JSON.stringify(d));
        }
    };
    this.cam_delay = 0;
    this.last_cam = { i: 0, j: 0 };
    this.update_cam = function () {
        if (old_timestamp - this.cam_delay > CLIENT.CAM_DELAY) {
            this.cam_delay = old_timestamp;
            var c = user.cam;
            var f = Math.floor(c.x / 100);
            var d = Math.floor(c.y / 100);
            if (this.last_cam.i != f || this.last_cam.j != d) {
                this.socket.send(JSON.stringify([1, Math.floor(-c.x), Math.floor(-c.y)]));
                this.last_cam.i = f;
                this.last_cam.j = d;
            }
        }
    };
    this.ping_delay = 0;
    this.try_ping = function () {
        if (old_timestamp - this.ping_delay > CLIENT.PING_DELAY) {
            this.ping_delay = old_timestamp;
            this.ping();
        }
    };
    this.lost = function () {
        if (this._current_id == this.socket._current_id) {
            this._current_id++;
            game.quit(ui.run);
            this.socket.close();
        }
    };
    this.killed = function (c) {
        if (this._current_id == this.socket._current_id) {
            this._current_id++;
            game.quit(ui.run);
            this.socket.close();
        }
    };
    this.ping = function () {
        this.socket.send(CLIENT.PING);
    };
    this.check_state = function () {
        if (this.socket.readyState == 3) {
            this.timeout_server -= CLIENT.TIMEOUT_SERVER;
        }
    };
    this.check_pong = function () {
        if (delta > CLIENT.LOOSE_FOCUS) {
            this.timeout_server = old_timestamp;
        }
        if (old_timestamp - this.timeout_server > CLIENT.TIMEOUT_SERVER) {
            this.timeout_server = old_timestamp;
            this.lost();
        }
    };
    this.handshake = function (c) {
        ___adsvid++;
        clearTimeout(this.timeout_handler);
        this.timeout_server = old_timestamp;
        user.gauges.cold.ed = user.gauges.cold.em;
        user.gauges.hunger.ed = user.gauges.hunger.em;
        user.gauges.l = 1;
        user.gauges.c = 1;
        user.gauges.h = 1;
        user.bigmap = false;
        user.inv.can_select = [];
        user.inv.n = [];
        user.inv.max = 8;
        user.inv.id = -1;
        user.craft.can_craft = [];
        user.craft.crafting = false;
        user.craft.can_build = false;
        user.craft.preview = -1;
        user.craft.id = -1;
        user.craft.workbench = false;
        user.craft.fire = false;
        user.craft.timeout = new Utils.LinearAnimation(false, 0, 1, 0, 1, 1);
        world.mode = c[8];
        world.time = c[7];
        world.transition = false;
        user.day = 0;
        world.units[ITEMS.PLAYERS] = [];
        world.units[ITEMS.FRUIT] = [];
        world.units[ITEMS.WORKBENCH] = [];
        world.units[ITEMS.FIRE] = [];
        world.units[ITEMS.BIG_FIRE] = [];
        world.units[ITEMS.SEED] = [];
        world.units[ITEMS.WALL] = [];
        world.units[ITEMS.STONE_WALL] = [];
        world.units[ITEMS.GOLD_WALL] = [];
        world.units[ITEMS.DIAMOND_WALL] = [];
        world.units[ITEMS.WOOD_DOOR] = [];
        world.units[ITEMS.STONE_DOOR] = [];
        world.units[ITEMS.GOLD_DOOR] = [];
        world.units[ITEMS.DIAMOND_DOOR] = [];
        world.units[ITEMS.CHEST] = [];
        world.units[ITEMS.SPIKE] = [];
        world.units[ITEMS.STONE_SPIKE] = [];
        world.units[ITEMS.GOLD_SPIKE] = [];
        world.units[ITEMS.DIAMOND_SPIKE] = [];
        world.units[ITEMS.WOLF] = [];
        world.units[ITEMS.FOX] = [];
        world.units[ITEMS.BEAR] = [];
        world.units[ITEMS.DRAGON] = [];
        world.units[ITEMS.RABBIT] = [];
        world.units[ITEMS.SPIDER] = [];
        world.units[ITEMS.FURNACE] = [];
        world.units[ITEMS.AMETHYST_WALL] = [];
        world.units[ITEMS.AMETHYST_SPIKE] = [];
        world.units[ITEMS.AMETHYST_DOOR] = [];
        world.fast_units = [];
        world.max_units = c[2];
        user.id = c[1];
        user.uid = user.id * world.max_units;
        keyboard.clear_directionnal();
        user.cam.change(c[4], c[5]);
        world.players = [];
        var f = world.players;
        for (var d = 0; d < c[6]; d++) {
            f.push(new Player(""));
        }
        d = 0;
        for (c = c[3]; d < c.length; d++) {
            var e = f[c[d].i];
            e.nickname = c[d].n;
            e.score = Utils.restore_number(c[d].p);
            e.alive = true;
        }
        user.ldb.sort();
        ui.quit(game.run);
    };
    this.connect = function () {
        this.timeout_number = 0;
        this.connect_timeout();
    };
    this.connect_timeout = function () {
        var g = ui.server_list.id.selectedIndex - 1;
        this.socket = new WebSocket((this.server_list[g].ssl ? "wss" : "ws") + "://" + this.server_list[g].ip + ":" + this.server_list[g].port);
        this.socket.binaryType = "arraybuffer";
        this.socket._current_id = this._current_id;
        this.socket.onmessage = function (f) {
            if (this._current_id == c._current_id) {
                if (typeof f.data == "string") {
                    switch (f = JSON.parse(f.data), f[0]) {
                        case 0:
                            c.chat(f);
                            break;
                        case 1:
                            c.kick(f[1]);
                            break;
                        case 2:
                            c.new_player(f);
                            break;
                        case 3:
                            c.handshake(f);
                    }
                } else {
                    var d = new Uint8Array(f.data);
                    switch (d[0]) {
                        case 0:
                            c.units(f.data, d, false);
                            break;
                        case 1:
                            c.units(f.data, d, true);
                            break;
                        case 2:
                            c.killed(d[1]);
                            break;
                        case 3:
                            c.set_cam(f.data);
                            break;
                        case 4:
                            c.mute();
                            break;
                        case 5:
                            c.full();
                            break;
                        case 6:
                            c.leaderboard(f.data);
                            break;
                        case 7:
                            c.kill_player(d[1]);
                            break;
                        case 8:
                            c.old_version();
                            break;
                        case 9:
                            c.hitten(f.data);
                            break;
                        case 10:
                            c.get_time(d[1]);
                            break;
                        case 11:
                            c.gauges(d[1], d[2], d[3]);
                            break;
                        case 12:
                            c.empty_res();
                            break;
                        case 13:
                            c.inv_full();
                            break;
                        case 14:
                            c.gather(d);
                            break;
                        case 15:
                            c.survive();
                            break;
                        case 16:
                            c.build_ok(d[1]);
                            break;
                        case 17:
                            c.build_stop();
                            break;
                        case 18:
                            c.accept_build(d[1]);
                            break;
                        case 19:
                            c.workbench(d[1]);
                            break;
                        case 20:
                            c.fire(d[1]);
                            break;
                        case 21:
                            c.dont_harvest();
                            break;
                        case 22:
                            c.hitten_other(d, f.data);
                            break;
                        case 23:
                            c.decrease_item(d[1], d[2]);
                            break;
                        case 24:
                            c.recover_focus(f.data);
                            break;
                        case 25:
                            c.cancel_craft();
                    }
                }
            }
        };
        this.socket.onopen = function () {
            clearTimeout(c.timeout_handler);
            c.socket.send(JSON.stringify([ui.nickname.input.value, CLIENT.VERSION_NUMBER]));
            c.timeout_handler = setTimeout(c.timeout, CLIENT.TIMEOUT_TIME);
        };
        this.timeout_handler = setTimeout(c.timeout, CLIENT.TIMEOUT_TIME);
    };
}
var MAP = JSON.parse('{"w":30000,"h":10000,"tiles":[[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":0,"y":21}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":418.5,"y":3}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":535.5,"y":21}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":859.5,"y":3}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":949.5,"y":18}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":1201.5,"y":30}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":1339.5,"y":30}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":1678.5,"y":12}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":1786.5,"y":27}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2047.5,"y":12}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":2200.5,"y":30}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":2545.5,"y":12}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2644.5,"y":9}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2938.5,"y":36}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":3055.5,"y":27}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3429,"y":9}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":3558,"y":21}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":3900,"y":30}],[],[{"x":3990,"y":21}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[{"x":4080,"y":84}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":4332,"y":21}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":4467,"y":30}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":4845,"y":30}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":5007,"y":27}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5349,"y":18}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":5436,"y":30}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":5778,"y":30}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":6181.5,"y":9}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":6313.5,"y":21}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[{"x":6600,"y":36}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":6649.5,"y":12}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6709.5,"y":27}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":6979.5,"y":21}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":7090.5,"y":30}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":7483.5,"y":21}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7780.5,"y":12}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":7906.5,"y":21}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":8179.5,"y":9}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":8278.5,"y":21}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":8566.5,"y":12}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":8671.5,"y":12}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":8962.5,"y":3}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9031.5,"y":18}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9348,"y":0}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":9456,"y":36}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":9696,"y":12}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9840,"y":36}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":10583.000244140625,"y":3}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":10904.000244140625,"y":12}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":11495.000244140625,"y":24},{"x":11495.000244140625,"y":24}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12020.000244140625,"y":12}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12311.000244140625,"y":18}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12938.000244140625,"y":15}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13484.000244140625,"y":39}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":13799.000244140625,"y":27}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14372.000244140625,"y":30}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":14686.00048828125,"y":42}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15100.00048828125,"y":24}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":15216,"y":72}]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":15568.00048828125,"y":18}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15875.000244140625,"y":6}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":16364.000244140625,"y":18}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":16848,"y":36}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17172,"y":12}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17508,"y":12}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":17712,"y":96}]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17982,"y":18}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":18324,"y":48}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":18750,"y":30}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19116,"y":30}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19542,"y":18}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":19812,"y":24}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":20298,"y":24}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":20868,"y":12}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":21162,"y":18}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":21774,"y":36}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22044,"y":30}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":22530,"y":30}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22854,"y":18}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":23112,"y":30}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":23622,"y":36}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":23946,"y":36}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":24036,"y":72}],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":24408,"y":36}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24666,"y":36}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":25140,"y":54}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":25506,"y":30}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":26028,"y":54}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":26376,"y":48}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26658,"y":30}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":27078,"y":30}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":27000,"y":96}],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27360,"y":18}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":27798,"y":24}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28128,"y":30}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28602,"y":42}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28896,"y":12}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29334,"y":12}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29964,"y":36}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":111}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[{"x":120,"y":132}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":3192,"y":144}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":100}],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":20748,"y":168}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":25872,"y":120}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":768,"y":276}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":7788,"y":372}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":498}],[],[],[{"x":0,"y":423}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":368,"y":464}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":5400,"y":420}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":6108,"y":456}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":1296,"y":560}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":1992,"y":588}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2100,"y":516}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2700,"y":528}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[{"x":3084,"y":576}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":4740,"y":588}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6008,"y":576}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6732,"y":588}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[{"x":7500,"y":564}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":7608,"y":516}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":8520,"y":564}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":9736,"y":528}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[{"x":10300,"y":500}],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16416,"y":592}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":720,"y":648}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1368,"y":648}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":2220,"y":660}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":3876,"y":684}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":4860,"y":684}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":6864,"y":696}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":8664,"y":696}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11880,"y":688}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13128,"y":612}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21040,"y":600}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24456,"y":600}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[{"x":29304,"y":672}],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0],[0,0,0,0,0,0,0,{"h":[[],[],[{"x":792,"y":744}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":3976,"y":752}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5472,"y":776}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":6504,"y":756}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[{"x":6768,"y":792}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":8508,"y":780}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":10896,"y":720}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14568,"y":704}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":15448,"y":760}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19080,"y":728}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":25044,"y":768}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":0,"y":804}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":696,"y":852}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":8520,"y":876}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":9048,"y":840}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":10792,"y":800}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":15576,"y":816}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":26040,"y":816}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":903}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":2376,"y":924}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":7952,"y":968}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":8724,"y":984}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":9648,"y":960}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":900}],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":18444,"y":996}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":22176,"y":912}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":22404,"y":936}],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22536,"y":936}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[{"x":27276,"y":996}],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":1716,"y":1092}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":2744,"y":1096}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3312,"y":1092}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":3420,"y":1008}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":5892,"y":1068}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9600,"y":1068}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":17112,"y":1044}]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":18372,"y":1080}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19928,"y":1088}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":20112,"y":1056}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28596,"y":1020}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":28584,"y":1008}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":0,"y":1164}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":924,"y":1104}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1032,"y":1188}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2088,"y":1160}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":4524,"y":1104}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":5700,"y":1128}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":7176,"y":1164}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12744,"y":1144}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":13824,"y":1176}]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14016,"y":1116}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17088,"y":1128}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":18512,"y":1128}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[{"x":24888,"y":1116}]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29952,"y":1116}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":1260}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":1260,"y":1248}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":4272,"y":1284}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":4980,"y":1296}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":1200}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13936,"y":1280}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":16008,"y":1296}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":20064,"y":1200}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":23712,"y":1236}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":27996,"y":1236}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":4120,"y":1328}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":7512,"y":1368}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":10640,"y":1392}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":12156,"y":1332}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15888,"y":1328}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":23652,"y":1368}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":432,"y":1476}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":7496,"y":1480}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[{"x":7656,"y":1416}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":8280,"y":1488}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":9912,"y":1440}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11328,"y":1464}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12496,"y":1480}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":26076,"y":1416}],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":26184,"y":1476}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":1539}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":520,"y":1568}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2508,"y":1584}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3552,"y":1584}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":6096,"y":1560}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6708,"y":1572}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":9252,"y":1560}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":1500}],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":21240,"y":1512}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":0,"y":1611}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1488,"y":1680}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6184,"y":1624}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6624,"y":1656}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":9144,"y":1668}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":9588,"y":1656}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11240,"y":1616}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18584,"y":1656}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21392,"y":1648}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29448,"y":1668}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29958,"y":1602}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[{"x":2376,"y":1740}]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":2592,"y":1728}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":5160,"y":1712}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":5388,"y":1752}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":8076,"y":1704}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9312,"y":1776}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":9948,"y":1716}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25488,"y":1788}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":1704,"y":1872}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":3324,"y":1884}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":4464,"y":1848}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":5484,"y":1860}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":8016,"y":1812}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[{"x":10300,"y":1800}],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14808,"y":1860}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15008,"y":1824}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27444,"y":1800}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":1953}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":360,"y":1932}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":1860,"y":1920}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":3180,"y":1980}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":4320,"y":1968}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":7188,"y":1992}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":8256,"y":1956}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":10776,"y":1944}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17680,"y":1920}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29940,"y":1914}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":2037}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":684,"y":2052}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":3684,"y":2052}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[{"x":4452,"y":2016}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":13296,"y":2028}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":14136,"y":2048}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[{"x":23076,"y":2028}],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":26676,"y":2004}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[{"x":28932,"y":2004}],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[{"x":84,"y":2184}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[{"x":828,"y":2196}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":6960,"y":2124}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":7080,"y":2124}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":2100}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":11928,"y":2104}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":13080,"y":2172}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17760,"y":2136}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":20760,"y":2124}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":22572,"y":2112}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24240,"y":2184}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":27216,"y":2124}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":28884,"y":2184}],[]]},0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":948,"y":2244}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":6060,"y":2268}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":9664,"y":2224}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":12960,"y":2244}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13272,"y":2224}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":16488,"y":2292}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":19380,"y":2256}]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19520,"y":2216}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20832,"y":2256}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22392,"y":2224}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":22644,"y":2268}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29968,"y":2264}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":2628,"y":2364}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6408,"y":2304}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":16416,"y":2388}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":16752,"y":2316}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":19392,"y":2316}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":24120,"y":2316}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":0,"y":2424}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":3000,"y":2460}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":4992,"y":2412}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":5676,"y":2448}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6520,"y":2408}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":8520,"y":2400}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":2400}],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":2547}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[{"x":7500,"y":2544}]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":8844,"y":2592}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":9072,"y":2544}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":9312,"y":2592}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":15084,"y":2508}]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":15204,"y":2544}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":18720,"y":2556}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":324,"y":2652}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":1752,"y":2628}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":4072,"y":2616}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":4140,"y":2688}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[{"x":5412,"y":2604}],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":8208,"y":2664}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9944,"y":2656}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":10920,"y":2652}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[{"x":10966.5,"y":2626.5}]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14992,"y":2688}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":18708,"y":2676}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27984,"y":2604}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":2790}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":1640,"y":2760}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":2160,"y":2796}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":2248,"y":2736}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":3108,"y":2712}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":7308,"y":2772}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":7560,"y":2772}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":8256,"y":2720}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":8388,"y":2784}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[{"x":10300,"y":2700}],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11820,"y":2748}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21848,"y":2768}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[{"x":26196,"y":2796}]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28656,"y":2772}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":0,"y":2880}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":720,"y":2844}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":3060,"y":2808}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":5172,"y":2844}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":9396,"y":2856}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":11916,"y":2820}]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12800,"y":2848}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18920,"y":2840}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25288,"y":2824}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":26472,"y":2892}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":888,"y":2904}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":1032,"y":2940}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":3744,"y":2940}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":4920,"y":2904}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":7624,"y":2912}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11808,"y":2952}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15816,"y":2936}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":816,"y":3048}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":4328,"y":3088}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":5856,"y":3056}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":6492,"y":3036}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":3000}],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13836,"y":3072}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":16928,"y":3000}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":0,"y":3198}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":1992,"y":3132}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11184,"y":3136}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":12180,"y":3144}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[{"x":21180,"y":3144}],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22848,"y":3112}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":23856,"y":3192}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27492,"y":3132}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29520,"y":3192}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29968,"y":3112}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":0,"y":3297}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":8584,"y":3288}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":8904,"y":3228}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":9720,"y":3240}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12216,"y":3288}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":27180,"y":3216}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":2304,"y":3300}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5056,"y":3376}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":6348,"y":3336}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6684,"y":3360}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":8652,"y":3360}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":3300}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":11416,"y":3352}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20184,"y":3344}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":22368,"y":3396}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":24876,"y":3300}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":25008,"y":3360}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":468,"y":3432}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":4044,"y":3444}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":5196,"y":3492}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":17688,"y":3480}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":17604,"y":3444}]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18504,"y":3480}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":20340,"y":3480}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":3573}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[{"x":3432,"y":3504}],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":5724,"y":3564}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":9156,"y":3552}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":15120,"y":3588}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":20208,"y":3564}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":22644,"y":3528}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":25020,"y":3552}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":0,"y":3648}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":1164,"y":3648}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":2568,"y":3600}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":2736,"y":3600}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":4320,"y":3636}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":7812,"y":3612}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":9396,"y":3660}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[{"x":10300,"y":3600}],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":15132,"y":3600}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16332,"y":3684}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17536,"y":3624}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":25980,"y":3672}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[{"x":28092,"y":3636}]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":1284,"y":3720}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":1920,"y":3780}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":2028,"y":3708}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":2628,"y":3708}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":3516,"y":3744}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":7080,"y":3708}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":7176,"y":3768}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":7932,"y":3780}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":10800,"y":3780}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13344,"y":3708}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":13524,"y":3792}]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":13656,"y":3720}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21152,"y":3744}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":22080,"y":3708}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26088,"y":3708}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28872,"y":3792}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":0,"y":3882}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":312,"y":3888}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":3624,"y":3888}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":5796,"y":3816}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":7068,"y":3864}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":9372,"y":3804}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[{"x":10756.80029296875,"y":3854.3999633789062}]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12704,"y":3872}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13312,"y":3872}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22048,"y":3888}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":22140,"y":3864}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":3963}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":5676,"y":3972}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":8148,"y":3936}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":8864,"y":3944}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":10016,"y":3960}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":3900}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":11808,"y":3984}],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11952,"y":3912}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":18852,"y":3972}]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":19056,"y":3936}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26984,"y":3928}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28038,"y":3948},{"x":28038,"y":3948}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":3564,"y":4044}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":4848,"y":4020}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":5760,"y":4080}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[{"x":6420,"y":4092}],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":8988,"y":4044}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":11856,"y":4008}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":15852,"y":4044}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18944,"y":4080}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,{"h":[[],[],[{"x":132,"y":4128}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":15732,"y":4140}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24456,"y":4168}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29808,"y":4112}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29944,"y":4144}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":0,"y":4248}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":708,"y":4236}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":1284,"y":4296}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":2616,"y":4236}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":4776,"y":4284}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9504,"y":4248}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":4200}],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14504,"y":4224}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":17604,"y":4260}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":25452,"y":4272}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":28432,"y":4288}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29168,"y":4208}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29280,"y":4208}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29432,"y":4296}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29720,"y":4232}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":4323}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":1836,"y":4308}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":1936,"y":4392}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":2820,"y":4368}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":7512,"y":4320}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":9372,"y":4380}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[{"x":9576,"y":4392}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":14616,"y":4320},{"x":14616,"y":4320}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":20868,"y":4392}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":23700,"y":4356}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":23736,"y":4392}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":28544,"y":4336}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28656,"y":4328}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28840,"y":4312}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":28936,"y":4360}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29096,"y":4344}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29264,"y":4352}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29600,"y":4344}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29736,"y":4344}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29864,"y":4320}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29976,"y":4328}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4168,"y":4432}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":6480,"y":4404}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6576,"y":4452}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":7848,"y":4428}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16856,"y":4440}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21048,"y":4440}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":23576,"y":4480}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26096,"y":4424}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29016,"y":4432}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29120,"y":4472}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":4740,"y":4596}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":4500}],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":10808,"y":4512}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12328,"y":4592}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":17280,"y":4536}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27320,"y":4584}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":28700,"y":4500}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29088,"y":4568}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29000,"y":4500}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29300,"y":4500}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29600,"y":4500}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29900,"y":4500}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":0,"y":4602}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":2664,"y":4632}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":4908,"y":4656}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5488,"y":4648}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":8748,"y":4656}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11384,"y":4632}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":12464,"y":4632},{"x":12464,"y":4632}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":19096,"y":4648}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":0,"y":4701}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":4464,"y":4704}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":8640,"y":4728}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15688,"y":4792}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":15804,"y":4728}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20100,"y":4740}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":26808,"y":4776}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":28520,"y":4736}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29048,"y":4712}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":696,"y":4860}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[{"x":1716,"y":4872}]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[{"x":2604,"y":4812}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":2772,"y":4800}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[{"x":3144,"y":4872}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":3684,"y":4884}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":5592,"y":4848}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":7056,"y":4848}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":8712,"y":4836}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":4800}],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":14352,"y":4884}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":18120,"y":4848}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":20196,"y":4896}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22524,"y":4824}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":26688,"y":4872}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28464,"y":4888}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":28700,"y":4800}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29096,"y":4848}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29000,"y":4800}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29300,"y":4800}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29520,"y":4816}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29600,"y":4800}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29900,"y":4800}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":4959}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[{"x":588,"y":4956}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":5844,"y":4908}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6416,"y":4984}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[{"x":7008,"y":4980}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":7188,"y":4944}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":13152,"y":4968}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":13200,"y":4968}]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":14436,"y":4920}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":15576,"y":4952}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":20376,"y":4932}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":22368,"y":4932}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":24804,"y":4980}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29064,"y":4936}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29520,"y":4920}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":5052}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2664,"y":5028}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":8336,"y":5032}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":9608,"y":5056}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17632,"y":5048}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":17820,"y":5040}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":28392,"y":5040}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28520,"y":5056}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29056,"y":5056}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29512,"y":5024}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":1248,"y":5148}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":3600,"y":5104}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":4428,"y":5136}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5080,"y":5144}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":9924,"y":5148}],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":9984,"y":5160}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[{"x":10300,"y":5100}],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24732,"y":5124}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":25920,"y":5124}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28528,"y":5192}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":28700,"y":5100}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29000,"y":5100}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29300,"y":5100}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29504,"y":5144}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29600,"y":5100}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29900,"y":5100}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":300,"y":5292}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":1128,"y":5264}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":4128,"y":5280}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":7176,"y":5244}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[{"x":8280,"y":5280}]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":10896,"y":5288}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11040,"y":5200}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":23896,"y":5272}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29072,"y":5216}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":2100,"y":5376}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":7704,"y":5364}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":9192,"y":5376}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12624,"y":5336}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":19572,"y":5328}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":19512,"y":5304}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":23776,"y":5376}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26048,"y":5352}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":28520,"y":5352}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29072,"y":5320}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29520,"y":5304}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[{"x":29968,"y":5304}],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":0,"y":5472}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1992,"y":5448}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":4212,"y":5472}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":5604,"y":5484}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":8520,"y":5484}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":5400}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":11892,"y":5472}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13912,"y":5496}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15216,"y":5456}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":16572,"y":5424}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":28528,"y":5472}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":28700,"y":5400}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29024,"y":5424}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29000,"y":5400}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29300,"y":5400}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29520,"y":5448}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29600,"y":5400}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[{"x":29992,"y":5488}],[],[]],"dg":[[{"x":29900,"y":5400}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":0,"y":5589}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":1704,"y":5592}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[{"x":2148,"y":5520}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2832,"y":5536}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6696,"y":5520}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":14080,"y":5528}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19480,"y":5504}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20960,"y":5552}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":27672,"y":5528}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28368,"y":5512}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28520,"y":5552}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29512,"y":5560}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0],[0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":948,"y":5604}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[{"x":4404,"y":5616}],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":4848,"y":5616}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[{"x":5508,"y":5640}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[{"x":5988,"y":5604}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":10032,"y":5628}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16272,"y":5628}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":16296,"y":5652}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18516,"y":5640}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[{"x":21576,"y":5688}],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":21504,"y":5628}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27112,"y":5640}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28512,"y":5688}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29520,"y":5696}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":5412,"y":5772}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6540,"y":5748}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9972,"y":5712}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[{"x":10300,"y":5700}],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":25642,"y":5704}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":28700,"y":5700}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29000,"y":5700}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29300,"y":5700}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29600,"y":5700}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[{"x":29900,"y":5700}],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":3,"y":5877}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":900,"y":5880}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":3204,"y":5892}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7472,"y":5856}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22504,"y":5848}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28440,"y":5840}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":28552,"y":5848}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28680,"y":5888}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29000,"y":5848}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29136,"y":5848}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29256,"y":5880}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29416,"y":5872}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29512,"y":5848}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29688,"y":5872}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29800,"y":5864}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29928,"y":5856}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":5958}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":804,"y":5988}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":2604,"y":5988}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":3468,"y":5988}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9360,"y":5916}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[{"x":9492,"y":5964}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28098,"y":5964}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":28600,"y":5960}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28848,"y":5904}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":29856,"y":5968}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":29960,"y":5992}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":4272,"y":6096}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":4896,"y":6096}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":5328,"y":6000}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":6744,"y":6060}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":6000}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11888,"y":6016}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12696,"y":6060}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":12864,"y":6084}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":15144,"y":6072}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17784,"y":6032}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":23316,"y":6012}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":23460,"y":6072}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":25068,"y":6072}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28956,"y":6096}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29384,"y":6032}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":29736,"y":6000}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":4152,"y":6176}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":7860,"y":6132}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":8616,"y":6120}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":11052,"y":6180}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13308,"y":6192}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":15288,"y":6180}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17872,"y":6168}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":21672,"y":6168}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[{"x":23544,"y":6192}],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2040,"y":6264}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5928,"y":6264}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":6528,"y":6264}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":6840,"y":6200}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":8220,"y":6204}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[{"x":10840.80029296875,"y":6262.7999267578125}]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":10932,"y":6252}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":14208,"y":6276}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":27120,"y":6204}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":0,"y":6384}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":6303}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":456,"y":6384}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":1668,"y":6324}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":7860,"y":6384}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":8016,"y":6312}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":8400,"y":6300}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":6300}],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":19296,"y":6384}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24440,"y":6384}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26168,"y":6352}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":27132,"y":6348}],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[{"x":28176,"y":6300}]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":1788,"y":6432}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":6468,"y":6432}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":14256,"y":6420}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17112,"y":6456}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":20340,"y":6456}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":20556,"y":6492}],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20652,"y":6444}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":26304,"y":6420}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":1260,"y":6588}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":3600,"y":6576}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":9648,"y":6512}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":13176,"y":6516}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":16464,"y":6552}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":17880,"y":6552}]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":19164,"y":6516}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20224,"y":6552}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28740,"y":6564}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29976,"y":6568}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":876,"y":6684}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[{"x":972,"y":6672}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2700,"y":6600}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":8856,"y":6648}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[{"x":10300,"y":6600}],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":11816,"y":6696}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15512,"y":6688}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":17976,"y":6684}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28392,"y":6696}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29472,"y":6648}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":0,"y":6798}],[{"x":0,"y":6714}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3192,"y":6768}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":4536,"y":6708}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[{"x":4620,"y":6768}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6132,"y":6720}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":8076,"y":6720}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9024,"y":6732}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21832,"y":6720}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":21972,"y":6756}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22608,"y":6768}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":27558,"y":6792}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":744,"y":6800}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":3336,"y":6888}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":3564,"y":6804}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":4764,"y":6816}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":5472,"y":6828}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9120,"y":6852}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":16848,"y":6828}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,{"h":[[],[],[{"x":120,"y":6912}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[{"x":2112,"y":6960}],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":5592,"y":6936}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[{"x":6876,"y":6936}],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7416,"y":6960}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":6900}],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[{"x":10648.80029296875,"y":6986.400146484375}]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":19008,"y":6972}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":0,"y":7056}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":2340,"y":7068}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":3420,"y":7020}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":5532,"y":7080}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":10584,"y":7032}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":19092,"y":7068}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":23648,"y":7088}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":24564,"y":7080}]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25644,"y":7056}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29976,"y":7088}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":7176}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":1296,"y":7116}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":1512,"y":7164}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3504,"y":7176}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":7332,"y":7152}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19160,"y":7120}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":24336,"y":7140}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28002,"y":7188}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":368,"y":7248}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":696,"y":7236}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4952,"y":7248}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":9496,"y":7232}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":7200}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":12552,"y":7284}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":16380,"y":7284}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17760,"y":7264}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20352,"y":7224}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":4128,"y":7336}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":6204,"y":7392}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":6360,"y":7368}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":8748,"y":7344}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9864,"y":7320}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":12264,"y":7332}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13448,"y":7320}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":15024,"y":7380}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":21384,"y":7344}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":28992,"y":7320}],[]]},0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2100,"y":7440}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":2952,"y":7452}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":6588,"y":7464}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":8004,"y":7416}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":8592,"y":7404}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14688,"y":7428}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":14724,"y":7464}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[{"x":27360,"y":7404}]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28116,"y":7440}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29100,"y":7440}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":1960,"y":7544}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":3156,"y":7560}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4044,"y":7500}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":5808,"y":7584}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7680,"y":7536}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":8424,"y":7536}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":7500}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":10908,"y":7572}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":14600,"y":7584}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16384,"y":7512}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21192,"y":7520}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26416,"y":7552}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":27948,"y":7524}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29984,"y":7552}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":0,"y":7623}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":4536,"y":7692}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[{"x":4704,"y":7656}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":9228,"y":7644}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13192,"y":7680}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[{"x":21348,"y":7632}],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22248,"y":7688}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":26316,"y":7680}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":26484,"y":7632}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":9,"y":7707}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":900,"y":7740}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":1080,"y":7776}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[{"x":6084,"y":7728}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9784,"y":7776}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11696,"y":7784}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19952,"y":7720}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":23136,"y":7792}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":28200,"y":7788}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":912,"y":7860}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":1500,"y":7836}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[{"x":2352,"y":7884}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":4620,"y":7884}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[{"x":10300,"y":7800}],[],[],[{"x":10348.80029296875,"y":7881.599853515625}]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":20040,"y":7872}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":23304,"y":7800}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25008,"y":7840}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29952,"y":7878}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":7992}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2328,"y":7968}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[{"x":2544,"y":7968}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":7332,"y":7920}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":23364,"y":7980}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":25188,"y":7980}],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[{"x":25308,"y":7956}]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28764,"y":7932}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":0,"y":8073}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":3864,"y":8004}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":4884,"y":8004}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":6768,"y":8088}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":15384,"y":8076}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17232,"y":8032}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17448,"y":8004}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18552,"y":8088}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":3456,"y":8184}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5568,"y":8172}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":7260,"y":8148}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":8076,"y":8124}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":8696,"y":8144}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":8100}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":11328,"y":8148}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15288,"y":8184}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":17496,"y":8148}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[{"x":23268,"y":8184}],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26844,"y":8148}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29946,"y":8190}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":440,"y":8248}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":6600,"y":8256}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":8152,"y":8200}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[{"x":8940,"y":8256}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":10944,"y":8208}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12328,"y":8208}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[{"x":19164,"y":8220}]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":19152,"y":8232}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[{"x":29136,"y":8280}],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":0,"y":8343}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":348,"y":8340}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1632,"y":8340}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":5208,"y":8304}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":5688,"y":8384}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":19512,"y":8340}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":0,"y":8445}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":2388,"y":8448}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[{"x":3108,"y":8448}]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3384,"y":8424}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[{"x":4176,"y":8484}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9708,"y":8448}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":8400}],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[{"x":13716,"y":8436}],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":13872,"y":8432}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16192,"y":8456}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19336,"y":8416}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":22008,"y":8484}],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":22128,"y":8424}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":27876,"y":8460}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":1728,"y":8556}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":4140,"y":8592}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4224,"y":8512}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":9612,"y":8544}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":16320,"y":8544}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":19908,"y":8592}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":1016,"y":8600}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[{"x":1140,"y":8628}],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9456,"y":8632}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":16272,"y":8640}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17472,"y":8628}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":0,"y":8784}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":3,"y":8712}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[{"x":10300,"y":8700}],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21348,"y":8748}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":24252,"y":8724}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28356,"y":8772}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":5028,"y":8844}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":6924,"y":8844}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7712,"y":8840}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":8976,"y":8856}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":10624,"y":8800}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[{"x":11760,"y":8892}],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":11700,"y":8820}]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":13164,"y":8892}],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":24376,"y":8864}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25476,"y":8892}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":26336,"y":8896}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":28248,"y":8832}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29970,"y":8874}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":468,"y":8988}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1368,"y":8928}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":3720,"y":8988}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":6732,"y":8964}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":7800,"y":8928}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[{"x":8340,"y":8964}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":8484,"y":8928}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":13080,"y":8976}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":14696,"y":8968}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15568,"y":8944}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[{"x":24228,"y":8904}],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":0,"y":9063}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":2460,"y":9084}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2696,"y":9016}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":3504,"y":9084}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":4356,"y":9000}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":5448,"y":9072}]],"p":[],"s":[[],[{"x":5496,"y":9024}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":6192,"y":9024}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":6744,"y":9084}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7056,"y":9012}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":9000}],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13192,"y":9088}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14532,"y":9048}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":3,"y":9138}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":2592,"y":9104}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":3780,"y":9192}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[{"x":5772,"y":9168}],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20128,"y":9128}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":26364,"y":9180}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[{"x":27588,"y":9120}],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,{"h":[[],[{"x":108,"y":9252}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[]],"p":[{"x":828,"y":9216}],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1872,"y":9224}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6012,"y":9252}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":8052,"y":9216}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":9900,"y":9288}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[{"x":10992,"y":9240}]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":16704,"y":9288}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":18492,"y":9216}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[{"x":20148,"y":9288}]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":20208,"y":9276}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22992,"y":9216}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":29958,"y":9288}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":1152,"y":9300}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":2460,"y":9384}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":9808,"y":9392}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":9300}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12368,"y":9384}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22016,"y":9336}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[{"x":29388,"y":9336}],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":0,"y":9417}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":8896,"y":9424}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":9712,"y":9408}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11544,"y":9440}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":13848,"y":9472}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28696,"y":9488}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":3,"y":9535.5}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":1596,"y":9576}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":2580,"y":9504}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":4320,"y":9528}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":4912,"y":9512}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":6808,"y":9536}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7608,"y":9540}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17656,"y":9520}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":29982,"y":9558}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}],[0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":432,"y":9636}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":2424,"y":9624}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":4056,"y":9672}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4812,"y":9600}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":6360,"y":9660}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[{"x":8376,"y":9660}]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[{"x":10300,"y":9600}],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":15696,"y":9672}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[{"x":0,"y":9742.5}]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[{"x":7524,"y":9732}],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":0,"y":9832.5}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,{"h":[[],[],[{"x":732,"y":9876}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":3036,"y":9876}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":4740,"y":9876}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":6048,"y":9864},{"x":6048,"y":9864}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[{"x":9420,"y":9876}]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[{"x":10810.80029296875,"y":9863.400146484375}]],"hw":[[],[],[]]},0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":427.5,"y":9981}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":772.5,"y":9972}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":868.5,"y":9981}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":1138.5,"y":9990}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":1258.5,"y":9981}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":1510.5,"y":9990}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":1606.5,"y":9963}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":1933.5,"y":9972}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":2056.5,"y":9993}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":2365.5,"y":9972}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":2473.5,"y":9990}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":2767.5,"y":9990}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":2869.5,"y":9990}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":3199.5,"y":9981}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":3325.5,"y":9966}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":3706.5,"y":9975}],[{"x":3793.5,"y":9981}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4183.5,"y":9954}],[],[{"x":4111.5,"y":9972}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":4498.5,"y":9972}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":4822.5,"y":9945}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":4918.5,"y":9975}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":5182.5,"y":9957}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":5268,"y":9966}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":5553,"y":9963}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[{"x":5724,"y":9981}],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":6105,"y":9988.5}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6231,"y":9979.5}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6492,"y":9967.5}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":6564,"y":9970.5}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":6876,"y":9961.5}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":6996,"y":9994.5}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":7338,"y":9976.5}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":7461,"y":9994.5}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[{"x":7803,"y":9961.5}],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":7932,"y":9934.5}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[{"x":8289,"y":9970.5}],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[{"x":8373,"y":9961.5}],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[{"x":8661,"y":9943.5}]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":8778,"y":9952.5}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[{"x":9075,"y":9970.5}],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9198,"y":9985.5}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[{"x":9540,"y":9972}],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[{"x":9870,"y":9978}],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[{"x":9987,"y":9987}],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[{"x":10300,"y":9900}],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[{"x":10585.80029296875,"y":9986.400146484375}]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":10731,"y":9984}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":11166,"y":9966}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":11775,"y":9990}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":12243,"y":9987}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12552,"y":9975}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":12978,"y":9987}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":13299,"y":9978}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":13776,"y":9975}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":14106,"y":9990}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":14472,"y":9987}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[{"x":14472,"y":9912}],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":14772,"y":9975}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15108,"y":9975}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":15447,"y":9984}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":15723,"y":9978}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":16256.000244140625,"y":9978}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":16714.00048828125,"y":9978}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":17044.00048828125,"y":9978}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":17548.00048828125,"y":9966}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":17988,"y":9972}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":18324,"y":9978}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":18810,"y":9972}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19062,"y":9984}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":19578,"y":9954}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":19956,"y":9978}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":20226,"y":9978}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":20622,"y":9936}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":20988,"y":9972}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":21240,"y":9972}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":21570,"y":9978}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":22038,"y":9978}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":22350,"y":9984}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":22788,"y":9984}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":23094,"y":9990}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":23544,"y":9996}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":23802,"y":9978}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":24288,"y":9966}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":24594,"y":9978}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25068,"y":9978}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":25302,"y":9966}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":25668,"y":9966}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":26088,"y":9966}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":26400,"y":9984}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":26910,"y":9942}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":27246,"y":9984}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":27606,"y":9996}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[{"x":27876,"y":9978}],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28302,"y":9984}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":28608,"y":9972}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[{"x":28968,"y":9960}],[],[]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29316,"y":9966}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]},0,0,0,0,0,{"h":[[],[],[]],"p":[],"s":[[],[],[]],"t":[[],[],[],[],[],[]],"g":[[],[],[]],"d":[[],[],[]],"b":[[],[],[],[]],"f":[[],[],[{"x":29964,"y":9960}]],"sw":[[],[],[]],"gw":[[],[],[]],"dw":[[],[],[]],"a":[[],[],[]],"dg":[[],[],[],[],[],[],[]],"so":[[],[],[],[],[],[],[]],"hw":[[],[],[]]}]],"nw":300,"nh":100,"lw":300,"lh":100}');
var WORLD = { SPEED: 200, SPEED_WINTER: 160, SPEED_ATTACK: 100, SPEED_COLLIDE: 100, RABBIT_SPEED: 300, WOLF_SPEED: 210, SPIDER_SPEED: 245, FOX_SPEED: 220, BEAR_SPEED: 190, DRAGON_SPEED: 200, SPIDER_SPEED: 220, ROTATE: 10, DIST_CHEST: 100, DIST_FURNACE: 100, MODE_PVP: 0, MODE_HUNGER_GAMES: 1 };
var ITEMS = { PLAYERS: 0, FIRE: 1, WORKBENCH: 2, SEED: 3, WALL: 4, SPIKE: 5, BIG_FIRE: 6, STONE_WALL: 7, GOLD_WALL: 8, DIAMOND_WALL: 9, WOOD_DOOR: 10, CHEST: 11, STONE_SPIKE: 12, GOLD_SPIKE: 13, DIAMOND_SPIKE: 14, STONE_DOOR: 15, GOLD_DOOR: 16, DIAMOND_DOOR: 17, FURNACE: 18, AMETHYST_WALL: 19, AMETHYST_SPIKE: 20, AMETHYST_DOOR: 21, RABBIT: 60, WOLF: 61, SPIDER: 62, FOX: 63, BEAR: 64, DRAGON: 65, FRUIT: 100 };
function Player(c) {
    this.nickname = c;
    this.ldb_label = this.label_winter = this.label = null;
    this.alive = false;
    this.score = 0;
}
function Item(c, g, f, d, e, m, p, n) {
    this.type = c;
    this.pid = g;
    this.id = f;
    this.x = d;
    this.y = e;
    this.nangle = this.angle = m;
    this.action = p;
    this.info = n;
    this.r = { x: d, y: e };
    if (world) {
        this.uid = g * world.max_units + f;
    }
    switch (c) {
        case ITEMS.PLAYERS:
            this.player = world.players[this.pid];
            this.foot_enable = true;
            this.foot = [];
            this.id_foot = 0;
            this.r = { x: d, y: e };
            this.draw = draw_player;
            this.hit = new Utils.LinearAnimation(false, .6, .6, 0, 5, 3);
            this.heal = new Utils.LinearAnimation(false, .6, .6, 0, 5, 3);
            this.freeze = new Utils.LinearAnimation(false, .6, .6, 0, 5, 3);
            this.starve = new Utils.LinearAnimation(false, .6, .6, 0, 5, 3);
            this.idle = new Utils.LinearAnimation(true, 0, 2.25, -1.5, 3.75, 7.5);
            this.walk = new Utils.LinearAnimation(true, 0, 7.5, -3, 22.5, 33.75);
            this.attack = new Utils.LinearAnimation(false, 0, 0, -Math.PI / 3, 6, 9);
            this.chat = new Utils.LinearAnimation(false, 1, 1, 0, 4, .25);
            this.web = new Utils.LinearAnimation(false, .6, .6, 0, 1, 3);
            this.text = "";
            this.draw_text = draw_chat;
            this.hand = true;
            this.right = -1;
            this.action = STATE.IDLE;
            this.info = INV.HAND;
            this.collide = false;
            this.bag = this.clothe = 0;
            this.update = function () {
                if (this.info & 32768) {
                    this.collide = true;
                    this.info &= -32769;
                } else {
                    this.collide = false;
                }
                if (this.info & 16384) {
                    this.info &= -16385;
                    this.bag = 1;
                } else {
                    this.bag = 0;
                }
                this.clothe = Math.floor(this.info / 128);
                this.info -= 128 * this.clothe;
                this.right = this.info == INV.HAND ? -1 : this.info;
                if (this.action & STATE.COLD && this.action & STATE.HEAL) {
                    this.action -= STATE.COLD + STATE.HEAL;
                    this.action |= STATE.WEB;
                }
            };
            this.update();
            break;
        case ITEMS.FIRE:
        case ITEMS.BIG_FIRE:
            this.draw_bg = draw_fire_ground;
            this.draw_fg = draw_fire_halo;
            this.fire = new Utils.LinearAnimation(false, 1, 1.03, .98, .3, .3);
            this.ground = new Utils.LinearAnimation(false, 1, 1.23, 1.18, .01, .01);
            this.halo = new Utils.LinearAnimation(false, 1, 1.23, 1.18, .01, .01);
            this.hit = { anim: new Utils.LinearAnimation(false, 1, 1, 0, 10, 10), update: false, angle: 0 };
            break;
        case ITEMS.SEED:
            this.draw_bg = draw_seed;
            this.draw_fg = draw_plant;
            this.ground = new Utils.LinearAnimation(false, .9, 1.05, .9, .2, .2);
            this.hit = { anim: new Utils.LinearAnimation(false, 1, 1, 0, 10, 10), update: false, angle: 0 };
            this.fruits = [];
            for (c = 0; 3 > c; c++) {
                this.fruits.push({ draw: draw_breath, breath: new Utils.LinearAnimation(false, .9 + .15 * Math.random(), 1.05, .9, .2, .2) });
            }
            this.fruits[0].x = this.x - 16.5;
            this.fruits[0].y = this.y - 15.5;
            this.fruits[1].x = this.x - 5.5;
            this.fruits[1].y = this.y + 7.5;
            this.fruits[2].x = this.x + 18;
            this.fruits[2].y = this.y - 5;
            break;
        case ITEMS.RABBIT:
        case ITEMS.WOLF:
        case ITEMS.SPIDER:
        case ITEMS.FOX:
        case ITEMS.BEAR:
            this.draw = draw_simple_mobs;
            this.breath = new Utils.LinearAnimation(false, .9 + .15 * Math.random(), 1.05, .9, .2, .2);
            this.hit = new Utils.LinearAnimation(false, .6, .6, 0, 5, 3);
            break;
        case ITEMS.DRAGON:
            this.draw = draw_dragon;
            this.breath = new Utils.LinearAnimation(false, .9 + .15 * Math.random(), 1.05, .9, .2, .2);
            this.rotate = new Utils.LinearAnimation(false, 0, 0, -Math.PI / 6, .5, 1);
            this.hit = new Utils.LinearAnimation(false, .6, .6, 0, 5, 3);
            break;
        case ITEMS.FRUIT:
            this.fruits = [];
            for (c = 0; 5 > c; c++) {
                this.fruits.push({ draw: draw_breath, breath: new Utils.LinearAnimation(false, .9 + .15 * Math.random(), 1.05, .9, .2, .2) });
            }
            switch (this.id % 3) {
                case 0:
                    this.fruits[0].x = this.x - 20.5;
                    this.fruits[0].y = this.y - 22.5;
                    this.fruits[1].x = this.x - 35.5;
                    this.fruits[1].y = this.y + 7.5;
                    this.fruits[2].x = this.x + 7.5;
                    this.fruits[2].y = this.y - 30;
                    this.fruits[3].x = this.x + 22.5;
                    this.fruits[3].y = this.y;
                    this.fruits[4].x = this.x - 7.5;
                    this.fruits[4].y = this.y + 14.5;
                    break;
                case 1:
                    this.fruits[0].x = this.x - 30.5;
                    this.fruits[0].y = this.y - 22.5;
                    this.fruits[1].x = this.x - 15.5;
                    this.fruits[1].y = this.y + 7.5;
                    this.fruits[2].x = this.x + 15.5;
                    this.fruits[2].y = this.y - 30;
                    this.fruits[3].x = this.x + 12.5;
                    this.fruits[3].y = this.y + 5;
                    this.fruits[4].x = this.x - 40.5;
                    this.fruits[4].y = this.y + 14.5;
                    break;
                case 2:
                    this.fruits[0].x = this.x - 20.5;
                    this.fruits[0].y = this.y - 20.5;
                    this.fruits[1].x = this.x - 35.5;
                    this.fruits[1].y = this.y + 15.5;
                    this.fruits[2].x = this.x + 7.5;
                    this.fruits[2].y = this.y - 17;
                    this.fruits[3].x = this.x + 22.5;
                    this.fruits[3].y = this.y + 5;
                    this.fruits[4].x = this.x - 7.5;
                    this.fruits[4].y = this.y + 1.5;
            }
            break;
        case ITEMS.SPIKE:
        case ITEMS.WALL:
        case ITEMS.STONE_WALL:
        case ITEMS.GOLD_WALL:
        case ITEMS.DIAMOND_WALL:
        case ITEMS.AMETHYST_WALL:
        case ITEMS.WORKBENCH:
        case ITEMS.STONE_SPIKE:
        case ITEMS.GOLD_SPIKE:
        case ITEMS.DIAMOND_SPIKE:
        case ITEMS.AMETHYST_SPIKE:
            this.draw = draw_simple_item;
            this.hit = { anim: new Utils.LinearAnimation(false, 1, 1, 0, 10, 10), update: false, angle: 0 };
            break;
        case ITEMS.CHEST:
            this.update = function (c) {
                this.action = c;
            };
            this.draw = draw_simple_item;
            this.hit = { anim: new Utils.LinearAnimation(false, 1, 1, 0, 10, 10), update: false, angle: 0 };
            break;
        case ITEMS.WOOD_DOOR:
        case ITEMS.STONE_DOOR:
        case ITEMS.GOLD_DOOR:
        case ITEMS.DIAMOND_DOOR:
        case ITEMS.AMETHYST_DOOR:
            this.draw = draw_door;
            this.hit = { anim: new Utils.LinearAnimation(false, 1, 1, 0, 10, 10), update: false, angle: 0 };
            break;
        case ITEMS.FURNACE:
            this.draw_bg = draw_furnace_ground;
            this.draw = draw_furnace;
            this.draw_fg = draw_furnace_halo;
            this.ground = new Utils.LinearAnimation(false, 1, 1.23, 1.18, .01, .01);
            this.halo = new Utils.LinearAnimation(false, 1, 1.23, 1.18, .01, .01);
            this.hit = { anim: new Utils.LinearAnimation(false, 1, 1, 0, 10, 10), update: false, angle: 0 };
            this.update = function (c) {
                this.action = c;
            };
    }
}
function World(c) {
    function g(c, d, f) {
        for (k = 0; k < c[d].length; k++) {
            for (l = 0; l < c[d][k].length; l++) {
                c[d][k][l].hit = f;
                c[d][k][l].update = false;
                c[d][k][l].time = 0;
                c[d][k][l].angle = 0;
            }
        }
    }
    this.mode = WORLD.MODE_PVP;
    this.max_units = c;
    this.players = [];
    this.units = [];
    this.units[ITEMS.PLAYERS] = [];
    this.units[ITEMS.FRUIT] = [];
    this.units[ITEMS.RABBIT] = [];
    this.units[ITEMS.WOLF] = [];
    this.units[ITEMS.FOX] = [];
    this.units[ITEMS.BEAR] = [];
    this.units[ITEMS.DRAGON] = [];
    this.units[ITEMS.SPIDER] = [];
    this.units[ITEMS.WORBENCH] = [];
    this.units[ITEMS.FIRE] = [];
    this.units[ITEMS.BIG_FIRE] = [];
    this.units[ITEMS.SEED] = [];
    this.units[ITEMS.SPIKE] = [];
    this.units[ITEMS.STONE_SPIKE] = [];
    this.units[ITEMS.GOLD_SPIKE] = [];
    this.units[ITEMS.DIAMOND_SPIKE] = [];
    this.units[ITEMS.AMETHYST_SPIKE] = [];
    this.units[ITEMS.WALL] = [];
    this.units[ITEMS.STONE_WALL] = [];
    this.units[ITEMS.GOLD_WALL] = [];
    this.units[ITEMS.DIAMOND_WALL] = [];
    this.units[ITEMS.AMETHYST_WALL] = [];
    this.units[ITEMS.WOOD_DOOR] = [];
    this.units[ITEMS.STONE_DOOR] = [];
    this.units[ITEMS.GOLD_DOOR] = [];
    this.units[ITEMS.DIAMOND_DOOR] = [];
    this.units[ITEMS.AMETHYST_DOOR] = [];
    this.units[ITEMS.FURNACE] = [];
    this.units[ITEMS.CHEST] = [];
    this.fast_units = [];
    this.nw = 300;
    this.dh = this.dw = this.nh = 100;
    this.w = this.nw * this.dw;
    this.h = this.nh * this.dh;
    this.shade = new Utils.LinearAnimation(false, 0, 1, 0, 1, 1);
    this.transition = false;
    for (c = 0; c < this.nh; c++) {
        for (var f = 0; f < this.nw; f++) {
            var d = MAP.tiles[c][f];
            if (d) {
                for (k = 0; k < d.p.length; k++) {
                    d.p[k].hit = new Utils.LinearAnimation(false, 1, 1, 0, 10, 10);
                    d.p[k].update = false;
                    d.p[k].time = 0;
                    d.p[k].angle = 0;
                }
                g(d, "t", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "s", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "g", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "d", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "b", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "f", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "sw", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "gw", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "dw", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
                g(d, "a", new Utils.LinearAnimation(false, 1, 1, 0, 10, 10));
            }
        }
    }
    this.time = SPRITE.DAY;
    this.delete_all_units = function () {
        this.fast_units = [];
        this.units[ITEMS.PLAYERS] = [];
        this.units[ITEMS.WORKBENCH] = [];
        this.units[ITEMS.FIRE] = [];
        this.units[ITEMS.BIG_FIRE] = [];
        this.units[ITEMS.SEED] = [];
        this.units[ITEMS.SPIKE] = [];
        this.units[ITEMS.STONE_SPIKE] = [];
        this.units[ITEMS.GOLD_SPIKE] = [];
        this.units[ITEMS.DIAMOND_SPIKE] = [];
        this.units[ITEMS.AMETHYST_SPIKE] = [];
        this.units[ITEMS.WALL] = [];
        this.units[ITEMS.STONE_WALL] = [];
        this.units[ITEMS.GOLD_WALL] = [];
        this.units[ITEMS.DIAMOND_WALL] = [];
        this.units[ITEMS.AMETHYST_WALL] = [];
        this.units[ITEMS.WOOD_DOOR] = [];
        this.units[ITEMS.STONE_DOOR] = [];
        this.units[ITEMS.GOLD_DOOR] = [];
        this.units[ITEMS.DIAMOND_DOOR] = [];
        this.units[ITEMS.AMETHYST_DOOR] = [];
        this.units[ITEMS.FURNACE] = [];
        this.units[ITEMS.CHEST] = [];
        this.units[ITEMS.FRUIT] = [];
        this.units[ITEMS.RABBIT] = [];
        this.units[ITEMS.WOLF] = [];
        this.units[ITEMS.FOX] = [];
        this.units[ITEMS.BEAR] = [];
        this.units[ITEMS.DRAGON] = [];
        this.units[ITEMS.SPIDER] = [];
    };
    this.delete_units = function (c) {
        if (this.fast_units[c]) {
            type = this.fast_units[c].type;
            this.fast_units[c] = null;
            var d = this.units[type];
            for (var f = 0; f < d.length; f++) {
                if (d[f].uid == c) {
                    d.splice(f, 1);
                    break;
                }
            }
        }
    };
    this.move_units = function (c, d, f, g, r) {
        for (var u = 0; u < c.length; u++) {
            b = c[u];
            if (b.angle != b.nangle) {
                var q = 2 * Math.PI;
                b.angle = (b.angle + q) % q;
                b.nangle = (b.nangle + q) % q;
                if (b.angle != b.nangle) {
                    var v = b.nangle - b.angle;
                    var t = Math.abs(v);
                    if (t > Math.PI) {
                        t = 2 * Math.PI - t;
                    }
                    t = t / Math.PI * 3 * WORLD.ROTATE * delta;
                    b.angle = v > Math.PI ? b.angle - t : v < -Math.PI ? b.angle + t : 0 > v ? b.angle - t : b.angle + t;
                    b.angle = (b.angle + q) % q;
                    if (Math.abs(b.angle - b.nangle) < t) {
                        b.angle = b.nangle;
                    }
                }
            }
            if (b.x != b.r.x || b.y != b.r.y) {
                if (b.action & STATE.IDLE) {
                    b.action -= STATE.IDLE;
                }
                b.action |= STATE.WALK;
                q = Utils.get_std_angle(b, b.r) + Math.PI;
                q = Utils.build_vector(f && b.action & STATE.ATTACK ? delta * f : b.collide ? delta * g : 0 < b.pid && b.r.x >= SPRITE.WINTER_BIOME_Y ? delta * r : delta * d, q);
                if (Utils.norm(q) < Utils.norm(Utils.get_vector(b, b.r))) {
                    Utils.add_vector(b, q);
                } else {
                    if (b.action & STATE.WALK) {
                        b.action -= STATE.WALK;
                    }
                    b.action |= STATE.IDLE;
                    Utils.copy_vector(b.r, b);
                }
            }
            if (b.foot_enable) {
                q = b.foot;
                v = q.length;
                if (b.x > SPRITE.WINTER_BIOME_Y + 20 * scale && (v === 0 || Utils.dist(q[v - 1], b) > SPRITE.STEP_SPACE)) {
                    b.id_foot++;
                    if (1 < Math.abs(b.x - b.r.x) && 1 < Math.abs(b.y - b.r.y)) {
                        if (b.r.x > b.x && b.r.y < b.y || b.r.x < b.x && b.r.y > b.y) {
                            if (b.id_foot % 2) {
                                var t = -11 * scale;
                                var z = -11 * scale;
                            } else {
                                z = 11 * scale;
                                t = 11 * scale;
                            }
                        } else if (b.id_foot % 2) {
                            t = 11 * scale;
                            z = -11 * scale;
                        } else {
                            z = 11 * scale;
                            t = -11 * scale;
                        }
                    } else if (b.id_foot % 2) {
                        t = 15 * Math.sin(b.angle) * scale;
                        z = 15 * Math.cos(b.angle) * scale;
                    } else {
                        t = 15 * -Math.sin(b.angle) * scale;
                        z = 15 * -Math.cos(b.angle) * scale;
                    }
                    q.push({ x: b.x + t, y: b.y + z, angle: b.angle + Math.PI / 2, alpha: 1 });
                }
                for (t = 0; t < v; t++) {
                    q[t].alpha = Math.max(0, q[t].alpha - delta / 2.85);
                }
                if (0 < q.length && q[0].alpha === 0) {
                    q.splice(0, 1);
                }
            }
        }
    };
    this.update = function () {
        this.move_units(this.units[ITEMS.PLAYERS], WORLD.SPEED, WORLD.SPEED_ATTACK, WORLD.SPEED_COLLIDE, WORLD.SPEED_WINTER);
        this.move_units(this.units[ITEMS.RABBIT], WORLD.RABBIT_SPEED);
        this.move_units(this.units[ITEMS.WOLF], WORLD.WOLF_SPEED);
        this.move_units(this.units[ITEMS.SPIDER], WORLD.SPIDER_SPEED);
        this.move_units(this.units[ITEMS.FOX], WORLD.FOX_SPEED);
        this.move_units(this.units[ITEMS.BEAR], WORLD.BEAR_SPEED);
        this.move_units(this.units[ITEMS.DRAGON], WORLD.DRAGON_SPEED);
    };
}
var CRAFT = { FIRE: 0, WORKBENCH: 1, SWORD: 2, PICK: 3, SEED: 4, PICK_GOLD: 5, PICK_DIAMOND: 6, SWORD_GOLD: 7, SWORD_DIAMOND: 8, PICK_WOOD: 9, WALL: 10, SPIKE: 11, COOKED_MEAT: 12, BIG_FIRE: 13, BANDAGE: 14, STONE_WALL: 15, GOLD_WALL: 16, DIAMOND_WALL: 17, WOOD_DOOR: 18, CHEST: 19, STONE_SPIKE: 20, GOLD_SPIKE: 21, DIAMOND_SPIKE: 22, STONE_DOOR: 23, GOLD_DOOR: 24, DIAMOND_DOOR: 25, EARMUFFS: 26, COAT: 27, SPEAR: 28, GOLD_SPEAR: 29, DIAMOND_SPEAR: 30, FURNACE: 31, EXPLORER_HAT: 32, STONE_HELMET: 33, GOLD_HELMET: 34, DIAMOND_HELMET: 35, BOOK: 36, PAPER: 37, BAG: 38, SWORD_AMETHYST: 39, PICK_AMETHYST: 40, AMETHYST_SPEAR: 41, HAMMER: 42, HAMMER_GOLD: 43, HAMMER_DIAMOND: 44, HAMMER_AMETHYST: 45, AMETHYST_WALL: 46, AMETHYST_SPIKE: 47, AMETHYST_DOOR: 48, CAP_SCARF: 49, BLUE_CORD: 50 };
var INV = { SWORD: 0, PICK: 1, STONE: 2, WOOD: 3, PLANT: 4, GOLD: 5, DIAMOND: 6, PICK_GOLD: 7, PICK_DIAMOND: 8, SWORD_GOLD: 9, SWORD_DIAMOND: 10, FIRE: 11, WORKBENCH: 12, SEED: 13, HAND: 14, PICK_WOOD: 15, WALL: 16, SPIKE: 17, MEAT: 18, COOKED_MEAT: 19, BIG_FIRE: 20, BANDAGE: 21, CORD: 22, STONE_WALL: 23, GOLD_WALL: 24, DIAMOND_WALL: 25, WOOD_DOOR: 26, CHEST: 27, STONE_SPIKE: 28, GOLD_SPIKE: 29, DIAMOND_SPIKE: 30, STONE_DOOR: 31, GOLD_DOOR: 32, DIAMOND_DOOR: 33, FUR: 34, FUR_WOLF: 35, EARMUFFS: 36, COAT: 37, SPEAR: 38, GOLD_SPEAR: 39, DIAMOND_SPEAR: 40, FURNACE: 41, EXPLORER_HAT: 42, STONE_HELMET: 43, GOLD_HELMET: 44, DIAMOND_HELMET: 45, BOOK: 46, PAPER: 47, BAG: 48, AMETHYST: 49, SWORD_AMETHYST: 50, PICK_AMETHYST: 51, AMETHYST_SPEAR: 52, HAMMER: 53, HAMMER_GOLD: 54, HAMMER_DIAMOND: 55, HAMMER_AMETHYST: 56, AMETHYST_WALL: 57, AMETHYST_SPIKE: 58, AMETHYST_DOOR: 59, CAP_SCARF: 60, FUR_WINTER: 61, BLUE_CORD: 62 };
var RECIPES = [{ r: [[3, 30], [2, 5]], w: 0, f: 0, id: CRAFT.FIRE, id2: INV.FIRE, time: .1 }, { r: [[3, 40], [2, 20]], w: 0, f: 0, id: CRAFT.WORKBENCH, id2: INV.WORKBENCH, time: 1 / 15 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, id: CRAFT.SWORD, id2: INV.SWORD, time: 1 / 15 }, { r: [[15, 1], [3, 60], [2, 20]], w: 1, f: 0, id: CRAFT.PICK, id2: INV.PICK, time: 1 / 15 }, { r: [[4, 3], [3, 20]], w: 0, f: 1, id: CRAFT.SEED, id2: INV.SEED, time: .1 }, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, id: CRAFT.PICK_GOLD, id2: INV.PICK_GOLD, time: .05 }, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, id: CRAFT.PICK_DIAMOND, id2: INV.PICK_DIAMOND, time: 1 / 30 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, id: CRAFT.SWORD_GOLD, id2: INV.SWORD_GOLD, time: .05 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, id: CRAFT.SWORD_DIAMOND, id2: INV.SWORD_DIAMOND, time: 1 / 30 }, { r: [[3, 15]], w: 0, f: 0, id: CRAFT.PICK_WOOD, id2: INV.PICK_WOOD, time: .2 }, { r: [[3, 20]], w: 1, f: 0, id: CRAFT.WALL, id2: INV.WALL, time: .2 }, { r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, id: CRAFT.SPIKE, id2: INV.SPIKE, time: .05 }, { r: [[18, 1]], w: 0, f: 1, id: CRAFT.COOKED_MEAT, id2: INV.COOKED_MEAT, time: .1 }, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, id: CRAFT.BIG_FIRE, id2: INV.BIG_FIRE, time: .1 }, { r: [[22, 3]], w: 1, f: 0, id: CRAFT.BANDAGE, id2: INV.BANDAGE, time: .2 }, { r: [[16, 1], [2, 20]], w: 1, f: 0, id: CRAFT.STONE_WALL, id2: INV.STONE_WALL, time: .2 }, { r: [[23, 1], [5, 20]], w: 1, f: 0, id: CRAFT.GOLD_WALL, id2: INV.GOLD_WALL, time: .2 }, { r: [[24, 1], [6, 20]], w: 1, f: 0, id: CRAFT.DIAMOND_WALL, id2: INV.DIAMOND_WALL, time: .2 }, { r: [[3, 60]], w: 1, f: 0, id: CRAFT.WOOD_DOOR, id2: INV.WOOD_DOOR, time: .125 }, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, id: CRAFT.CHEST, id2: INV.CHEST, time: .05 }, { r: [[23, 1], [2, 35]], w: 1, f: 0, id: CRAFT.STONE_SPIKE, id2: INV.STONE_SPIKE, time: .05 }, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, id: CRAFT.GOLD_SPIKE, id2: INV.GOLD_SPIKE, time: .05 }, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, id: CRAFT.DIAMOND_SPIKE, id2: INV.DIAMOND_SPIKE, time: .05 }, { r: [[26, 1], [2, 60]], w: 1, f: 0, id: CRAFT.STONE_DOOR, id2: INV.STONE_DOOR, time: .125 }, { r: [[31, 1], [5, 60]], w: 1, f: 0, id: CRAFT.GOLD_DOOR, id2: INV.GOLD_DOOR, time: .125 }, { r: [[32, 1], [6, 60]], w: 1, f: 0, id: CRAFT.DIAMOND_DOOR, id2: INV.DIAMOND_DOOR, time: .125 }, { r: [[34, 8], [22, 4]], w: 1, f: 0, id: CRAFT.EARMUFFS, id2: INV.EARMUFFS, time: 1 / 15 }, { r: [[36, 1], [34, 5], [35, 10], [22, 6]], w: 1, f: 0, id: CRAFT.COAT, id2: INV.COAT, time: .04 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, id: CRAFT.SPEAR, id2: INV.SPEAR, time: 1 / 15 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, id: CRAFT.GOLD_SPEAR, id2: INV.GOLD_SPEAR, time: .05 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, id: CRAFT.DIAMOND_SPEAR, id2: INV.DIAMOND_SPEAR, time: 1 / 30 }, { r: [[3, 150], [2, 100], [5, 50]], w: 1, f: 0, id: CRAFT.FURNACE, id2: INV.FURNACE, time: .05 }, { r: [[47, 3], [34, 2]], w: 1, f: 0, id: CRAFT.EXPLORER_HAT, id2: INV.EXPLORER_HAT, time: 1 / 15 }, { r: [[2, 150], [3, 100]], w: 1, f: 0, id: CRAFT.STONE_HELMET, id2: INV.STONE_HELMET, time: .05 }, { r: [[2, 180], [3, 120], [5, 100], [43, 1]], w: 1, f: 0, id: CRAFT.GOLD_HELMET, id2: INV.GOLD_HELMET, time: .025 }, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, id: CRAFT.DIAMOND_HELMET, id2: INV.DIAMOND_HELMET, time: 1 / 60 }, { r: [[47, 5], [22, 5], [35, 5]], w: 1, f: 0, id: CRAFT.BOOK, id2: INV.BOOK, time: 1 / 30 }, { r: [[3, 30]], w: 0, f: 1, id: CRAFT.PAPER, id2: INV.PAPER, time: 1 / 3 }, { r: [[22, 10], [35, 5]], w: 1, f: 0, id: CRAFT.BAG, id2: INV.BAG, time: .05 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, id: CRAFT.SWORD_AMETHYST, id2: INV.SWORD_AMETHYST, time: .025 }, { r: [[6, 60], [5, 90], [49, 30], [8, 1]], w: 1, f: 0, id: CRAFT.PICK_AMETHYST, id2: INV.PICK_AMETHYST, time: .025 }, { r: [[49, 50], [6, 100], [5, 120], [40, 1]], w: 1, f: 0, id: CRAFT.AMETHYST_SPEAR, id2: INV.AMETHYST_SPEAR, time: .025 }, { r: [[3, 120], [2, 60]], w: 1, f: 0, id: CRAFT.HAMMER, id2: INV.HAMMER, time: 1 / 15 }, { r: [[3, 160], [2, 120], [5, 80], [53, 1]], w: 1, f: 0, id: CRAFT.HAMMER_GOLD, id2: INV.HAMMER_GOLD, time: .05 }, { r: [[6, 80], [2, 200], [5, 150], [54, 1]], w: 1, f: 0, id: CRAFT.HAMMER_DIAMOND, id2: INV.HAMMER_DIAMOND, time: 1 / 30 }, { r: [[6, 160], [49, 60], [5, 250], [55, 1]], w: 1, f: 0, id: CRAFT.HAMMER_AMETHYST, id2: INV.HAMMER_AMETHYST, time: .025 }, { r: [[25, 1], [49, 20]], w: 1, f: 0, id: CRAFT.AMETHYST_WALL, id2: INV.AMETHYST_WALL, time: .2 }, { r: [[57, 1], [49, 20], [2, 15]], w: 1, f: 0, id: CRAFT.AMETHYST_SPIKE, id2: INV.AMETHYST_SPIKE, time: .05 }, { r: [[33, 1], [49, 60]], w: 1, f: 0, id: CRAFT.AMETHYST_DOOR, id2: INV.AMETHYST_DOOR, time: .125 }, { r: [[37, 1], [61, 20], [62, 10]], w: 1, f: 0, id: CRAFT.CAP_SCARF, id2: INV.CAP_SCARF, time: 1 / 60 }, { r: [[6, 1], [22, 1]], w: 1, f: 0, id: CRAFT.BLUE_CORD, id2: INV.BLUE_CORD, time: 1 / 3 }];
function Flakes(c, g, f) {
    this.id = c;
    this.speed = 8 * (c + 5);
    this.life = 1;
    this.x = g;
    this.y = f;
    this.alpha = 0;
}
function User() {
    this.init = function () { };
    this.furnace = { amount: 0, pid: 1, iid: -1, open: false };
    this.chest = { id: -1, amount: 0, pid: 1, iid: -1, open: false };
    this.day = this.uid = this.id = 0;
    this.cam = new Utils.Ease2d(Utils.ease_out_quad, 0, .4, 0, 0, canw2, canh2, canw2, canh2);
    this.cam.delay = 0;
    this.cam.update = function () {
        var c = world.fast_units[user.uid];
        if (c) {
            this.delay = 0;
            this.ease({ x: Math.max(Math.min(canw2 - c.x, -2), -world.w + 2 + canw), y: Math.max(Math.min(canh2 - c.y, -2), -world.h + 2 + canh) });
        } else {
            this.delay += delta;
            if (3 < this.delay) {
                this.delay = 0;
                client.get_focus();
            }
        }
    };
    this.cam.w = screen.width;
    this.cam.h = screen.height;
    this.cam.rw = this.cam.w;
    this.cam.rh = this.cam.h;
    this.cam.rx = 0;
    this.cam.ry = 0;
    this.cam.rdw = 0;
    this.cam.rdh = 0;
    this.cam.change = function (c, g) {
        this.x = -Math.min(Math.max(2 * -world.dw, c - world.dw - this.rw / 2), world.w - this.rw);
        this.y = -Math.min(Math.max(2 * -world.dh, g - (world.dh + this.rh) / 2), world.h - this.rh + world.dh);
        this.ex = this.x;
        this.ey = this.y;
    };
    this.control = {
        angle: 0, timeout: 0, previous: 0, mouse: 0, attack: 0, update: function () {
            this.mouse += delta;
            if (!mouse.state) {
                var c = world.fast_units[user.uid];
                if (c && !(c.action & STATE.ATTACK) && this.mouse > CLIENT.ATTACK) {
                    this.attack = 1;
                    this.mouse = 0;
                    client.send_attack(c.angle);
                }
            }
            var c = world.fast_units[user.uid];
            var g = Utils.get_std_angle(mouse.pos, c ? { x: user.cam.x + c.x, y: user.cam.y + c.y } : canm);
            if (c = world.fast_units[user.uid]) {
                c.angle = g;
                c.nangle = g;
            }
            this.timeout += delta;
            if (this.timeout > CLIENT.ROTATE) {
                this.timeout = 0;
                if (.005 < Math.abs(this.angle - g)) {
                    client.send_angle(g);
                    this.angle = g;
                }
            }
            if (!user.chat.open) {
                c = 0;
                if (keyboard.is_left()) {
                    c |= 1;
                }
                if (keyboard.is_right()) {
                    c |= 2;
                }
                if (keyboard.is_bottom()) {
                    c |= 4;
                }
                if (keyboard.is_top()) {
                    c |= 8;
                }
                if (this.previous != c) {
                    client.send_move(c);
                }
                this.previous = c;
            }
        }
    };
    this.gauges = {
        c: 1, l: 1, h: 1, warn_cold: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3), warn_life: new Utils.LinearAnimation(true, 0, 1, 0, 2, 2), warn_hunger: new Utils.LinearAnimation(true, 0, 1, 0, 3, 3), cold: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1), life: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1), hunger: new Utils.Ease(Utils.ease_out_quad, 0, 1, 0, 0, 1), update: function () {
            this.warn_cold.update();
            this.warn_life.update();
            this.warn_hunger.update();
            this.cold.ease(this.c);
            this.life.ease(this.l);
            this.hunger.ease(this.h);
        }
    };
    this.bigmap = false;
    this.inv = {
        max: 8, n: [], id: -1, can_select: [], free_place: function (c) {
            for (i = 0; i < c.length; i++) {
                if (this.n[c[i][0]] == c[i][1]) {
                    return true;
                }
            }
            return false;
        }, find_item: function (c) {
            for (var g = 0; g < this.can_select.length; g++) {
                if (this.can_select[g].id == c) {
                    return g;
                }
            }
            return -1;
        }, delete_item: function (c, g) {
            this.n[c] = 0;
            this.can_select.splice(g, 1);
            if (this.id == c) {
                this.id = -1;
            }
            game.update_inv_buttons();
        }, decrease: function (c, g, f) {
            update = true;
            this.n[c] = Math.max(0, this.n[c] - g);
            if (!this.n[c] && 0 <= f) {
                this.delete_item(c, f);
            }
        }
    };
    this.auto_feed = {
        enabled: false, translate: { x: 0, y: 0 }, delay: 0, update: function () {
            if (!!this.enabled && !(0 <= user.craft.id)) {
                this.delay += delta;
                if (2 < this.delay) {
                    this.delay = 0;
                    if (.25 > user.gauges.h) {
                        if (user.inv.n[INV.PLANT]) {
                            client.select_inv(INV.PLANT, user.inv.find_item(INV.PLANT));
                        } else if (user.inv.n[INV.COOKED_MEAT]) {
                            client.select_inv(INV.COOKED_MEAT, user.inv.find_item(INV.COOKED_MEAT));
                        } else if (user.inv.n[INV.MEAT]) {
                            client.select_inv(INV.MEAT, user.inv.find_item(INV.MEAT));
                        }
                    }
                }
            }
        }
    };
    this.craft = {
        id: -1, id2: -1, timeout: new Utils.LinearAnimation(false, 0, 1, 0, 1, 1), crafting: false, preview: -1, can_craft: [], workbench: false, fire: false, do_craft: function (c) {
            var g = RECIPES[c];
            this.id = c;
            this.crafting = true;
            c = world.fast_units[user.uid];
            this.timeout.max_speed = c && c.right == INV.BOOK ? 2 * g.time : g.time;
            this.id2 = g.id2;
            for (c = 0; c < g.r.length; c++) {
                var f = g.r[c];
                user.inv.decrease(f[0], f[1], user.inv.find_item(f[0]));
            }
            game.update_inv_buttons();
        }, update: function () {
            this.can_craft = [];
            for (var c in RECIPES) {
                var g = RECIPES[c];
                var f = true;
                if (g.r) {
                    for (var d = 0; d < g.r.length; d++) {
                        if (user.inv.max === 10 && g.id === CRAFT.BAG) {
                            f = false;
                            break;
                        }
                        if (g.w > this.workbench || g.f > this.fire) {
                            f = false;
                            break;
                        }
                        var e = g.r[d];
                        if (!user.inv.n[e[0]] || user.inv.n[e[0]] < e[1]) {
                            f = false;
                            break;
                        }
                    }
                    if (f) {
                        this.can_craft.push(game.craft_buttons[g.id]);
                    }
                }
            }
            game.update_craft_buttons();
            game.update_chest_buttons();
            game.update_furnace_button();
        }, restart: function () {
            this.id = -1;
            this.crafting = false;
            this.timeout.v = 0;
            this.timeout.o = false;
            this.update();
        }
    };
    this.alert = { timeout: new Utils.LinearAnimation(false, 1, 1, 0, 4, .2), text: "", label: null, draw: draw_alert };
    this.ldb = {
        can: document.createElement("canvas"), ids: [], update: true, translate: { x: 0, y: 0 }, sort: function () {
            var c = [];
            var g = world.players;
            for (var f = 0; f < g.length; f++) {
                if (g[f].alive) {
                    c.push({ id: f, s: g[f].score });
                }
            }
            c.sort(function (c, e) {
                return e.s - c.s;
            });
            this.ids = [];
            for (f = 0; f < c.length && 10 > f; f++) {
                this.ids.push(c[f].id);
            }
            this.update = true;
        }, init: function (c) {
            var g = world.players;
            for (var f = 0; f < g.length; f++) {
                g[f].score = 0;
            }
            g[user.id].score = Utils.restore_number(c[1]);
            this.ids = [];
            for (f = 2; f < c.length; f += 2) {
                this.ids.push(c[f]);
                g[c[f]].score = Utils.restore_number(c[f + 1]);
            }
            this.update = true;
        }
    };
    this.ldb.can.width = 180 * scale;
    this.ldb.can.height = 300 * scale;
    this.ldb.ctx = this.ldb.can.getContext("2d");
    this.chat = {
        open: false, input: document.getElementById("chat_input"), style: document.getElementById("chat_block").style, update: function () {
            this.style.left = Math.floor(can.width / 2 - 150) + "px";
            this.style.top = Math.floor(can.height / 2 - 15 - 110 * scale) + "px";
        }, quit: function () {
            this.open = false;
            this.style.display = "none";
            this.input.value = "";
        }, run: function () {
            if (!world.fast_units[user.uid].text) {
                if (this.open) {
                    this.open = false;
                    this.style.display = "none";
                    if (this.input.value) {
                        client.send_chat(this.input.value);
                        this.input.value = "";
                    }
                } else {
                    this.open = true;
                    this.style.display = "inline-block";
                    this.input.focus();
                }
            }
        }
    };
    this.winter = {
        flakes: [], update: function (c) {
            if (keyboard.is_bottom()) {
                c.y += delta * c.speed * 5.5;
            } else {
                c.y += delta * c.speed * 5;
            }
            c.life -= delta / 2;
            if (keyboard.is_left()) {
                c.x += 100 * delta;
            } else if (keyboard.is_right()) {
                c.x -= 130 * delta;
            } else {
                c.x -= 30 * delta;
            }
            c.alpha = .2 < c.life ? Math.min(c.alpha + 3 * delta, 1) : Math.max(c.alpha - 5 * delta, 0);
        }, add: function (c) {
            if (this.flakes.length < Math.floor(SPRITE.FLAKES_NUMBER * Math.max(Math.min(c - SPRITE.WINTER_BIOME_Y, 3e3) / 3e3, 0))) {
                this.flakes.push(new Flakes(Math.floor(Math.random() * SPRITE.FLAKES_SIZES), -user.cam.x + Math.floor(Math.random() * user.cam.w), -user.cam.y + Math.floor(400 * Math.random() * scale - 200 * scale)));
            }
        }
    };
}
var LOADER = { SERVER_INFO_URL: "servers" };
function Loader(c, g, f) {
    this.can = c;
    this.ctx = g;
    this.logo = {
        translate: { x: 0, y: 0 }, style: document.getElementById("loading").style, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.logo.style.position = "absolute";
    this.logo.style.display = "inline-block";
    this.logo.update();
    this.is_run = true;
    this.stop = function () {
        this.is_run = false;
    };
    this.loading = { total: 1 };
    var d = this;
    var e = function () { };
    var m = 0;
    this.quit_effect = function () {
        d.update();
        m++;
        if (m == 40) {
            d.stop();
            e();
        } else {
            window.setTimeout(d.quit_effect, 33);
        }
    };
    this.quit = function (c) {
        e = c;
        d.quit_effect();
    };
    var p = Object.keys(IMAGES).length;
    var n = 0;
    c = function () {
        n++;
        if (n == p) {
            create_text(1, "l", 20, "#000");
            q();
        }
    };
    var r = function (c, d) {
        if (c) {
            client.store_server_list();
            client.update_server_list();
            setTimeout(f, 100);
        }
    };
    var u = function () {
        client.xhttp_get(r, LOADER.SERVER_INFO_URL);
    };
    var q = function () {
        if (document.fonts && document.fonts.check) {
            if (document.fonts.check("1em Baloo Paaji")) {
                setTimeout(u, 100);
            } else {
                setTimeout(q, 100);
            }
        } else {
            setTimeout(u, 1e3);
        }
    };
    g = function () { };
    for (var v in IMAGES) {
        var t = IMAGES[v];
        IMAGES[v] = new Image;
        IMAGES[v].onload = c;
        IMAGES[v].onerror = g;
        IMAGES[v].src = t;
    }
    this.update = function () {
        this.logo.translate.x = (this.can.width - 500) / 2;
        this.logo.translate.y = (this.can.height - 150) / 2;
        this.logo.translate.y -= 2500 / (40 - m + 1) - 48;
        this.logo.update();
    };
    this.logo.update();
    this.draw = function () {
        draw_fake_world();
        if (!(0 >= n)) {
            this.update();
        }
    };
}
function UI(c, g) {
    this.can = c;
    this.ctx = g;
    var f = this;
    this.waiting = false;
    this.loading = {
        translate: { x: 0, y: 0 }, angle: 0, img: sprite[SPRITE.GEAR2], draw: function () {
            this.angle += 2 * delta;
            g.save();
            g.translate(this.translate.x + this.img.width / 2, this.translate.y + this.img.height / 2);
            g.rotate(this.angle);
            g.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
            g.restore();
        }
    };
    this.logo = gui_create_image(IMAGES.LOGO);
    gui_add_breath_effect(this.logo, 1.01, .99, 32, 64, this.logo.img.width, this.logo.img.height);
    this.server_list = {
        id: document.getElementById("region_select"), style: document.getElementById("region_select").style, translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.nickname = {
        id: document.getElementById("nickname_block"), style: document.getElementById("nickname_block").style, input: document.getElementById("nickname_input"), translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.nickname.id.addEventListener("keyup", function (c) {
        c.preventDefault();
        if (c.keyCode == 13 && !f.waiting) {
            f.play_game();
        }
    });
    this.nickname.input.value = Cookies.get("starve_nickname") ? Cookies.get("starve_nickname") : "";
    this.all_rights_reserved = {
        id: document.getElementById("all_rights_reserved"), style: document.getElementById("all_rights_reserved").style, translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.creation = {
        id: document.getElementById("creation"), style: document.getElementById("creation").style, translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.sidebox = {
        id: document.getElementById("sidebox"), style: document.getElementById("sidebox").style, translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.discord = {
        id: document.getElementById("discord"), style: document.getElementById("discord").style, translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.wiki = {
        id: document.getElementById("wiki"), style: document.getElementById("wiki").style, translate: { x: 0, y: 0 }, update: function () {
            this.style.left = this.translate.x + "px";
            this.style.top = Math.floor(this.translate.y) + "px";
        }
    };
    this.play = gui_create_button(0, 0, "", sprite[SPRITE.PLAY]);
    var d = 0;
    var e = function () {
        f.update();
        d++;
        if (d == 30) {
            f.add_event_listener();
            f.update();
        } else {
            window.setTimeout(e, 33);
        }
    };
    this.quit = function (c) {
        m = c;
        f.remove_event_listener();
        f.can.style.cursor = "auto";
        p = -1;
        n();
    };
    var m;
    var p = -1;
    var n = function () {
        f.update();
        p++;
        if (p == 30) {
            Cookies.set("starve_nickname", f.nickname.input.value);
            f.nickname.style.display = "none";
            f.server_list.style.display = "none";
            f.all_rights_reserved.style.display = "none";
            f.creation.style.display = "none";
            f.sidebox.style.display = "none";
            f.discord.style.display = "none";
            f.wiki.style.display = "none";
            f.stop();
            m();
        } else {
            window.setTimeout(n, 33);
        }
    };
    this.is_run = false;
    this.stop = function () {
        this.is_run = false;
    };
    this.run = function () {
        document.getElementById("game_body").style.backgroundColor = SPRITE.GROUND[fake_world.time];
        f.nickname.style.display = "inline-block";
        f.server_list.style.display = "inline-block";
        f.all_rights_reserved.style.display = "inline-block";
        f.creation.style.display = "inline-block";
        f.sidebox.style.display = "inline-block";
        f.discord.style.display = "inline-block";
        f.wiki.style.display = "inline-block";
        f.waiting = false;
        f.is_run = true;
        p = -1;
        d = 0;
        e();
    };
    this.update = function () {
        this.logo.translate.x = (this.can.width - this.logo.width) / 2 - 20;
        this.logo.translate.y = Math.max((this.can.height - this.logo.height) / 2 - 100, 20);
        this.play.info.translate.x = (this.can.width - this.play.info.img[0].width) / 2;
        this.play.info.translate.y = Math.max((this.can.height - this.logo.img.height) / 2 - 100, 20) + 380;
        this.loading.translate.x = (this.can.width - this.loading.img.width) / 2;
        this.loading.translate.y = this.play.info.translate.y - 42 * scale;
        this.nickname.translate.x = (this.can.width - 300) / 2;
        this.nickname.translate.y = this.play.info.translate.y - 95;
        this.server_list.translate.x = (this.can.width - 300) / 2;
        this.server_list.translate.y = this.play.info.translate.y - 48;
        this.all_rights_reserved.translate.x = (this.can.width - 300) / 2;
        this.all_rights_reserved.translate.y = this.can.height - 30;
        this.creation.translate.x = 10;
        this.creation.translate.y = 5;
        this.sidebox.translate.x = this.can.width - 255;
        this.sidebox.translate.y = 0;
        this.discord.translate.x = this.can.width - 447;
        this.discord.translate.y = -25;
        this.wiki.translate.x = this.can.width - 507;
        this.wiki.translate.y = -25;
        if (d != 30 || p != -1) {
            var c = 0;
            if (d != 30) {
                c = 1500 / (d + 1) - 50;
            }
            if (p != -1) {
                c = -(1750 / (30 - p + 1) - 48);
            }
            this.logo.translate.y -= c;
            this.play.info.translate.y -= c;
            this.loading.translate.y -= c;
            this.nickname.translate.y -= c;
            this.server_list.translate.y -= c;
            this.sidebox.translate.y -= c;
            this.discord.translate.y -= 0 < c ? c : -c;
            this.creation.translate.y -= 0 < c ? c : -c;
            this.wiki.translate.y -= 0 < c ? c : -c;
        }
        this.nickname.update();
        this.server_list.update();
        this.all_rights_reserved.update();
        this.creation.update();
        this.sidebox.update();
        this.discord.update();
        this.wiki.update();
    };
    this.effect = function () {
        gui_breath_effect(this.logo);
        this.logo.width = this.logo.img.width * this.logo.scale;
        this.logo.height = this.logo.img.height * this.logo.scale;
    };
    this.draw = function () {
        draw_fake_world();
        this.effect();
        this.update();
        this.logo.draw(this.ctx);
        if (f.waiting) {
            this.loading.draw();
        } else {
            this.play.draw(this.ctx);
        }
        user.alert.draw("#FFFFFF", "#4acb76");
    };
    this.trigger_mousedown = function (c) {
        c = get_mouse_pos(this.can, c);
        if (!f.waiting) {
            f.play.trigger(f.can, c, MOUSE_DOWN);
        }
    };
    this.play_game = function () {
        f.waiting = true;
        client.connect();
    };
    this.trigger_mouseup = function (c) {
        c = get_mouse_pos(this.can, c);
        if (!f.waiting && f.play.trigger(f.can, c, MOUSE_UP)) {
            f.play.info.state = BUTTON_OUT;
            f.play_game();
        }
    };
    this.trigger_mousemove = function (d) {
        d = get_mouse_pos(this.can, d);
        var e = false;
        if (!f.waiting) {
            e |= f.play.trigger(f.can, d, MOUSE_MOVE);
        }
        c.style.cursor = e ? "pointer" : "auto";
    };
    this.add_event_listener = function () {
        window.addEventListener("mousedown", this.trigger_mousedown, false);
        window.addEventListener("mouseup", this.trigger_mouseup, false);
        window.addEventListener("mousemove", this.trigger_mousemove, false);
    };
    this.remove_event_listener = function () {
        window.removeEventListener("mousedown", this.trigger_mousedown, false);
        window.removeEventListener("mouseup", this.trigger_mouseup, false);
        window.removeEventListener("mousemove", this.trigger_mousemove, false);
    };
}
function Game(c, g) {
    var f = this;
    this.can = c;
    this.ctx = g;
    this.minimap = { translate: { x: 0, y: 0 } };
    this.leaderboard = { translate: { x: 0, y: 0 }, img: sprite[SPRITE.LEADERBOARD], can: document.createElement("canvas") };
    this.leaderboard.can.width = this.leaderboard.img.width;
    this.leaderboard.can.height = this.leaderboard.img.height;
    this.leaderboard.ctx = this.leaderboard.can.getContext("2d");
    this.gauges = { translate: { x: 0, y: 0 }, img: sprite[SPRITE.GAUGES], draw: draw_gauges };
    this.furnace_button = gui_create_button(0, 0, "", sprite[SPRITE.FURNACE_BUTTON]);
    this.chest_buttons = [];
    this.chest_buttons[INV.SWORD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SWORD]);
    this.chest_buttons[INV.SWORD].id = INV.SWORD;
    this.chest_buttons[INV.PICK] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PICK]);
    this.chest_buttons[INV.PICK].id = INV.PICK;
    this.chest_buttons[INV.STONE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_STONE]);
    this.chest_buttons[INV.STONE].id = INV.STONE;
    this.chest_buttons[INV.AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_AMETHYST]);
    this.chest_buttons[INV.AMETHYST].id = INV.AMETHYST;
    this.chest_buttons[INV.WOOD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_WOOD]);
    this.chest_buttons[INV.WOOD].id = INV.WOOD;
    this.chest_buttons[INV.PLANT] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PLANT]);
    this.chest_buttons[INV.PLANT].id = INV.PLANT;
    this.chest_buttons[INV.GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_GOLD]);
    this.chest_buttons[INV.GOLD].id = INV.GOLD;
    this.chest_buttons[INV.DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DIAMOND]);
    this.chest_buttons[INV.DIAMOND].id = INV.DIAMOND;
    this.chest_buttons[INV.PICK_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PICK_GOLD]);
    this.chest_buttons[INV.PICK_GOLD].id = INV.PICK_GOLD;
    this.chest_buttons[INV.PICK_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PICK_DIAMOND]);
    this.chest_buttons[INV.PICK_DIAMOND].id = INV.PICK_DIAMOND;
    this.chest_buttons[INV.SWORD_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SWORD_GOLD]);
    this.chest_buttons[INV.SWORD_GOLD].id = INV.SWORD_GOLD;
    this.chest_buttons[INV.SWORD_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SWORD_DIAMOND]);
    this.chest_buttons[INV.SWORD_DIAMOND].id = INV.SWORD_DIAMOND;
    this.chest_buttons[INV.FIRE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FIRE]);
    this.chest_buttons[INV.FIRE].id = INV.FIRE;
    this.chest_buttons[INV.WORKBENCH] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_WORKBENCH]);
    this.chest_buttons[INV.WORKBENCH].id = INV.WORKBENCH;
    this.chest_buttons[INV.SEED] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SEED]);
    this.chest_buttons[INV.SEED].id = INV.SEED;
    this.chest_buttons[INV.WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_WALL]);
    this.chest_buttons[INV.WALL].id = INV.WALL;
    this.chest_buttons[INV.SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SPIKE]);
    this.chest_buttons[INV.SPIKE].id = INV.SPIKE;
    this.chest_buttons[INV.PICK_WOOD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PICK_WOOD]);
    this.chest_buttons[INV.PICK_WOOD].id = INV.PICK_WOOD;
    this.chest_buttons[INV.COOKED_MEAT] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_COOKED_MEAT]);
    this.chest_buttons[INV.COOKED_MEAT].id = INV.COOKED_MEAT;
    this.chest_buttons[INV.MEAT] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_MEAT]);
    this.chest_buttons[INV.MEAT].id = INV.MEAT;
    this.chest_buttons[INV.BIG_FIRE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BIG_FIRE]);
    this.chest_buttons[INV.BIG_FIRE].id = INV.BIG_FIRE;
    this.chest_buttons[INV.BANDAGE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BANDAGE]);
    this.chest_buttons[INV.BANDAGE].id = INV.BANDAGE;
    this.chest_buttons[INV.CORD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_CORD]);
    this.chest_buttons[INV.CORD].id = INV.CORD;
    this.chest_buttons[INV.STONE_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_STONE_WALL]);
    this.chest_buttons[INV.STONE_WALL].id = INV.STONE_WALL;
    this.chest_buttons[INV.GOLD_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_GOLD_WALL]);
    this.chest_buttons[INV.GOLD_WALL].id = INV.GOLD_WALL;
    this.chest_buttons[INV.DIAMOND_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DIAMOND_WALL]);
    this.chest_buttons[INV.DIAMOND_WALL].id = INV.DIAMOND_WALL;
    this.chest_buttons[INV.WOOD_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DOOR_WOOD_CLOSE]);
    this.chest_buttons[INV.WOOD_DOOR].id = INV.WOOD_DOOR;
    this.chest_buttons[INV.CHEST] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_CHEST]);
    this.chest_buttons[INV.CHEST].id = INV.CHEST;
    this.chest_buttons[INV.STONE_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_STONE_SPIKE]);
    this.chest_buttons[INV.STONE_SPIKE].id = INV.STONE_SPIKE;
    this.chest_buttons[INV.GOLD_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_GOLD_SPIKE]);
    this.chest_buttons[INV.GOLD_SPIKE].id = INV.GOLD_SPIKE;
    this.chest_buttons[INV.DIAMOND_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DIAMOND_SPIKE]);
    this.chest_buttons[INV.DIAMOND_SPIKE].id = INV.DIAMOND_SPIKE;
    this.chest_buttons[INV.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BAG]);
    this.chest_buttons[INV.BAG].id = INV.BAG;
    this.chest_buttons[INV.FUR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FUR]);
    this.chest_buttons[INV.FUR].id = INV.FUR;
    this.chest_buttons[INV.FUR_WOLF] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FUR_WOLF]);
    this.chest_buttons[INV.FUR_WOLF].id = INV.FUR_WOLF;
    this.chest_buttons[INV.EARMUFFS] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_EARMUFFS]);
    this.chest_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
    this.chest_buttons[INV.STONE_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DOOR_STONE_CLOSE]);
    this.chest_buttons[INV.STONE_DOOR].id = INV.STONE_DOOR;
    this.chest_buttons[INV.GOLD_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DOOR_GOLD_CLOSE]);
    this.chest_buttons[INV.GOLD_DOOR].id = INV.GOLD_DOOR;
    this.chest_buttons[INV.DIAMOND_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DOOR_DIAMOND_CLOSE]);
    this.chest_buttons[INV.DIAMOND_DOOR].id = INV.DIAMOND_DOOR;
    this.chest_buttons[INV.FUR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FUR]);
    this.chest_buttons[INV.FUR].id = INV.FUR;
    this.chest_buttons[INV.FUR_WOLF] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FUR_WOLF]);
    this.chest_buttons[INV.FUR_WOLF].id = INV.FUR_WOLF;
    this.chest_buttons[INV.EARMUFFS] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_EARMUFFS]);
    this.chest_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
    this.chest_buttons[INV.COAT] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_COAT]);
    this.chest_buttons[INV.COAT].id = INV.COAT;
    this.chest_buttons[INV.SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SPEAR]);
    this.chest_buttons[INV.SPEAR].id = INV.SPEAR;
    this.chest_buttons[INV.GOLD_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_GOLD_SPEAR]);
    this.chest_buttons[INV.GOLD_SPEAR].id = INV.GOLD_SPEAR;
    this.chest_buttons[INV.DIAMOND_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DIAMOND_SPEAR]);
    this.chest_buttons[INV.DIAMOND_SPEAR].id = INV.DIAMOND_SPEAR;
    this.chest_buttons[INV.FURNACE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FURNACE]);
    this.chest_buttons[INV.FURNACE].id = INV.FURNACE;
    this.chest_buttons[INV.EXPLORER_HAT] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_EXPLORER_HAT]);
    this.chest_buttons[INV.EXPLORER_HAT].id = INV.EXPLORER_HAT;
    this.chest_buttons[INV.STONE_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_STONE_HELMET]);
    this.chest_buttons[INV.STONE_HELMET].id = INV.STONE_HELMET;
    this.chest_buttons[INV.GOLD_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_GOLD_HELMET]);
    this.chest_buttons[INV.GOLD_HELMET].id = INV.GOLD_HELMET;
    this.chest_buttons[INV.DIAMOND_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DIAMOND_HELMET]);
    this.chest_buttons[INV.DIAMOND_HELMET].id = INV.DIAMOND_HELMET;
    this.chest_buttons[INV.BOOK] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BOOK]);
    this.chest_buttons[INV.BOOK].id = INV.BOOK;
    this.chest_buttons[INV.PAPER] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PAPER]);
    this.chest_buttons[INV.PAPER].id = INV.PAPER;
    this.chest_buttons[INV.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BAG]);
    this.chest_buttons[INV.BAG].id = INV.BAG;
    this.chest_buttons[INV.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BAG]);
    this.chest_buttons[INV.BAG].id = INV.BAG;
    this.chest_buttons[INV.AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_AMETHYST]);
    this.chest_buttons[INV.AMETHYST].id = INV.AMETHYST;
    this.chest_buttons[INV.SWORD_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_SWORD_AMETHYST]);
    this.chest_buttons[INV.SWORD_AMETHYST].id = INV.SWORD_AMETHYST;
    this.chest_buttons[INV.PICK_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PICK_AMETHYST]);
    this.chest_buttons[INV.PICK_AMETHYST].id = INV.PICK_AMETHYST;
    this.chest_buttons[INV.AMETHYST_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_AMETHYST_SPEAR]);
    this.chest_buttons[INV.AMETHYST_SPEAR].id = INV.AMETHYST_SPEAR;
    this.chest_buttons[INV.HAMMER] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_HAMMER]);
    this.chest_buttons[INV.HAMMER].id = INV.HAMMER;
    this.chest_buttons[INV.HAMMER_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_HAMMER_GOLD]);
    this.chest_buttons[INV.HAMMER_GOLD].id = INV.HAMMER_GOLD;
    this.chest_buttons[INV.HAMMER_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_HAMMER_DIAMOND]);
    this.chest_buttons[INV.HAMMER_DIAMOND].id = INV.HAMMER_DIAMOND;
    this.chest_buttons[INV.HAMMER_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_HAMMER_AMETHYST]);
    this.chest_buttons[INV.HAMMER_AMETHYST].id = INV.HAMMER_AMETHYST;
    this.chest_buttons[INV.AMETHYST_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_AMETHYST_WALL]);
    this.chest_buttons[INV.AMETHYST_WALL].id = INV.AMETHYST_WALL;
    this.chest_buttons[INV.AMETHYST_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_AMETHYST_SPIKE]);
    this.chest_buttons[INV.AMETHYST_SPIKE].id = INV.AMETHYST_SPIKE;
    this.chest_buttons[INV.AMETHYST_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_DOOR_AMETHYST_CLOSE]);
    this.chest_buttons[INV.AMETHYST_DOOR].id = INV.AMETHYST_DOOR;
    this.chest_buttons[INV.CAP_SCARF] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_CAP_SCARF]);
    this.chest_buttons[INV.CAP_SCARF].id = INV.CAP_SCARF;
    this.chest_buttons[INV.FUR_WINTER] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_FUR_WINTER]);
    this.chest_buttons[INV.FUR_WINTER].id = INV.FUR_WINTER;
    this.chest_buttons[INV.BLUE_CORD] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_BLUE_CORD]);
    this.chest_buttons[INV.BLUE_CORD].id = INV.BLUE_CORD;
    this.plus_buttons = [];
    for (var d = 0; 100 > d; d++) {
        this.plus_buttons[d] = gui_create_button(0, 0, "", sprite[SPRITE.CHEST_PLUS]);
    }
    this.inv_buttons = [];
    this.inv_buttons[INV.SWORD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SWORD]);
    this.inv_buttons[INV.SWORD].id = INV.SWORD;
    this.inv_buttons[INV.PICK] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PICK]);
    this.inv_buttons[INV.PICK].id = INV.PICK;
    this.inv_buttons[INV.STONE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_STONE]);
    this.inv_buttons[INV.STONE].id = INV.STONE;
    this.inv_buttons[INV.STONE].info.img[2] = this.inv_buttons[INV.STONE].info.img[0];
    this.inv_buttons[INV.AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.INV_AMETHYST]);
    this.inv_buttons[INV.AMETHYST].id = INV.AMETHYST;
    this.inv_buttons[INV.AMETHYST].info.img[2] = this.inv_buttons[INV.AMETHYST].info.img[0];
    this.inv_buttons[INV.WOOD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_WOOD]);
    this.inv_buttons[INV.WOOD].id = INV.WOOD;
    this.inv_buttons[INV.WOOD].info.img[2] = this.inv_buttons[INV.WOOD].info.img[0];
    this.inv_buttons[INV.PLANT] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PLANT]);
    this.inv_buttons[INV.PLANT].id = INV.PLANT;
    this.inv_buttons[INV.GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_GOLD]);
    this.inv_buttons[INV.GOLD].id = INV.GOLD;
    this.inv_buttons[INV.GOLD].info.img[2] = this.inv_buttons[INV.GOLD].info.img[0];
    this.inv_buttons[INV.DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DIAMOND]);
    this.inv_buttons[INV.DIAMOND].id = INV.DIAMOND;
    this.inv_buttons[INV.DIAMOND].info.img[2] = this.inv_buttons[INV.DIAMOND].info.img[0];
    this.inv_buttons[INV.PICK_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PICK_GOLD]);
    this.inv_buttons[INV.PICK_GOLD].id = INV.PICK_GOLD;
    this.inv_buttons[INV.PICK_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PICK_DIAMOND]);
    this.inv_buttons[INV.PICK_DIAMOND].id = INV.PICK_DIAMOND;
    this.inv_buttons[INV.SWORD_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SWORD_GOLD]);
    this.inv_buttons[INV.SWORD_GOLD].id = INV.SWORD_GOLD;
    this.inv_buttons[INV.SWORD_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SWORD_DIAMOND]);
    this.inv_buttons[INV.SWORD_DIAMOND].id = INV.SWORD_DIAMOND;
    this.inv_buttons[INV.FIRE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FIRE]);
    this.inv_buttons[INV.FIRE].id = INV.FIRE;
    this.inv_buttons[INV.WORKBENCH] = gui_create_button(0, 0, "", sprite[SPRITE.INV_WORK]);
    this.inv_buttons[INV.WORKBENCH].id = INV.WORKBENCH;
    this.inv_buttons[INV.SEED] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SEED]);
    this.inv_buttons[INV.SEED].id = INV.SEED;
    this.inv_buttons[INV.WALL] = gui_create_button(0, 0, "", sprite[SPRITE.INV_WALL]);
    this.inv_buttons[INV.WALL].id = INV.WALL;
    this.inv_buttons[INV.SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SPIKE]);
    this.inv_buttons[INV.SPIKE].id = INV.SPIKE;
    this.inv_buttons[INV.PICK_WOOD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PICK_WOOD]);
    this.inv_buttons[INV.PICK_WOOD].id = INV.PICK_WOOD;
    this.inv_buttons[INV.COOKED_MEAT] = gui_create_button(0, 0, "", sprite[SPRITE.INV_COOKED_MEAT]);
    this.inv_buttons[INV.COOKED_MEAT].id = INV.COOKED_MEAT;
    this.inv_buttons[INV.MEAT] = gui_create_button(0, 0, "", sprite[SPRITE.INV_MEAT]);
    this.inv_buttons[INV.MEAT].id = INV.MEAT;
    this.inv_buttons[INV.BIG_FIRE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_BIG_FIRE]);
    this.inv_buttons[INV.BIG_FIRE].id = INV.BIG_FIRE;
    this.inv_buttons[INV.BANDAGE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_BANDAGE]);
    this.inv_buttons[INV.BANDAGE].id = INV.BANDAGE;
    this.inv_buttons[INV.CORD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_CORD]);
    this.inv_buttons[INV.CORD].id = INV.CORD;
    this.inv_buttons[INV.STONE_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.INV_STONE_WALL]);
    this.inv_buttons[INV.STONE_WALL].id = INV.STONE_WALL;
    this.inv_buttons[INV.GOLD_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.INV_GOLD_WALL]);
    this.inv_buttons[INV.GOLD_WALL].id = INV.GOLD_WALL;
    this.inv_buttons[INV.DIAMOND_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DIAMOND_WALL]);
    this.inv_buttons[INV.DIAMOND_WALL].id = INV.DIAMOND_WALL;
    this.inv_buttons[INV.WOOD_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DOOR_WOOD_CLOSE]);
    this.inv_buttons[INV.WOOD_DOOR].id = INV.WOOD_DOOR;
    this.inv_buttons[INV.CHEST] = gui_create_button(0, 0, "", sprite[SPRITE.INV_CHEST]);
    this.inv_buttons[INV.CHEST].id = INV.CHEST;
    this.inv_buttons[INV.STONE_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_STONE_SPIKE]);
    this.inv_buttons[INV.STONE_SPIKE].id = INV.STONE_SPIKE;
    this.inv_buttons[INV.GOLD_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_GOLD_SPIKE]);
    this.inv_buttons[INV.GOLD_SPIKE].id = INV.GOLD_SPIKE;
    this.inv_buttons[INV.DIAMOND_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DIAMOND_SPIKE]);
    this.inv_buttons[INV.DIAMOND_SPIKE].id = INV.DIAMOND_SPIKE;
    this.inv_buttons[INV.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.INV_BAG]);
    this.inv_buttons[INV.BAG].id = INV.BAG;
    this.inv_buttons[INV.FUR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FUR]);
    this.inv_buttons[INV.FUR].id = INV.FUR;
    this.inv_buttons[INV.FUR_WOLF] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FUR_WOLF]);
    this.inv_buttons[INV.FUR_WOLF].id = INV.FUR_WOLF;
    this.inv_buttons[INV.EARMUFFS] = gui_create_button(0, 0, "", sprite[SPRITE.INV_EARMUFFS]);
    this.inv_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
    this.inv_buttons[INV.STONE_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DOOR_STONE_CLOSE]);
    this.inv_buttons[INV.STONE_DOOR].id = INV.STONE_DOOR;
    this.inv_buttons[INV.GOLD_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DOOR_GOLD_CLOSE]);
    this.inv_buttons[INV.GOLD_DOOR].id = INV.GOLD_DOOR;
    this.inv_buttons[INV.DIAMOND_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DOOR_DIAMOND_CLOSE]);
    this.inv_buttons[INV.DIAMOND_DOOR].id = INV.DIAMOND_DOOR;
    this.inv_buttons[INV.FUR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FUR]);
    this.inv_buttons[INV.FUR].id = INV.FUR;
    this.inv_buttons[INV.FUR_WOLF] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FUR_WOLF]);
    this.inv_buttons[INV.FUR_WOLF].id = INV.FUR_WOLF;
    this.inv_buttons[INV.EARMUFFS] = gui_create_button(0, 0, "", sprite[SPRITE.INV_EARMUFFS]);
    this.inv_buttons[INV.EARMUFFS].id = INV.EARMUFFS;
    this.inv_buttons[INV.COAT] = gui_create_button(0, 0, "", sprite[SPRITE.INV_COAT]);
    this.inv_buttons[INV.COAT].id = INV.COAT;
    this.inv_buttons[INV.SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SPEAR]);
    this.inv_buttons[INV.SPEAR].id = INV.SPEAR;
    this.inv_buttons[INV.GOLD_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_GOLD_SPEAR]);
    this.inv_buttons[INV.GOLD_SPEAR].id = INV.GOLD_SPEAR;
    this.inv_buttons[INV.DIAMOND_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DIAMOND_SPEAR]);
    this.inv_buttons[INV.DIAMOND_SPEAR].id = INV.DIAMOND_SPEAR;
    this.inv_buttons[INV.FURNACE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FURNACE]);
    this.inv_buttons[INV.FURNACE].id = INV.FURNACE;
    this.inv_buttons[INV.EXPLORER_HAT] = gui_create_button(0, 0, "", sprite[SPRITE.INV_EXPLORER_HAT]);
    this.inv_buttons[INV.EXPLORER_HAT].id = INV.EXPLORER_HAT;
    this.inv_buttons[INV.STONE_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.INV_STONE_HELMET]);
    this.inv_buttons[INV.STONE_HELMET].id = INV.STONE_HELMET;
    this.inv_buttons[INV.GOLD_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.INV_GOLD_HELMET]);
    this.inv_buttons[INV.GOLD_HELMET].id = INV.GOLD_HELMET;
    this.inv_buttons[INV.DIAMOND_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DIAMOND_HELMET]);
    this.inv_buttons[INV.DIAMOND_HELMET].id = INV.DIAMOND_HELMET;
    this.inv_buttons[INV.BOOK] = gui_create_button(0, 0, "", sprite[SPRITE.INV_BOOK]);
    this.inv_buttons[INV.BOOK].id = INV.BOOK;
    this.inv_buttons[INV.PAPER] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PAPER]);
    this.inv_buttons[INV.PAPER].id = INV.PAPER;
    this.inv_buttons[INV.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.INV_BAG]);
    this.inv_buttons[INV.BAG].id = INV.BAG;
    this.inv_buttons[INV.AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.INV_AMETHYST]);
    this.inv_buttons[INV.AMETHYST].id = INV.AMETHYST;
    this.inv_buttons[INV.SWORD_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.INV_SWORD_AMETHYST]);
    this.inv_buttons[INV.SWORD_AMETHYST].id = INV.SWORD_AMETHYST;
    this.inv_buttons[INV.PICK_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.INV_PICK_AMETHYST]);
    this.inv_buttons[INV.PICK_AMETHYST].id = INV.PICK_AMETHYST;
    this.inv_buttons[INV.AMETHYST_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_AMETHYST_SPEAR]);
    this.inv_buttons[INV.AMETHYST_SPEAR].id = INV.AMETHYST_SPEAR;
    this.inv_buttons[INV.HAMMER] = gui_create_button(0, 0, "", sprite[SPRITE.INV_HAMMER]);
    this.inv_buttons[INV.HAMMER].id = INV.HAMMER;
    this.inv_buttons[INV.HAMMER_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_HAMMER_GOLD]);
    this.inv_buttons[INV.HAMMER_GOLD].id = INV.HAMMER_GOLD;
    this.inv_buttons[INV.HAMMER_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.INV_HAMMER_DIAMOND]);
    this.inv_buttons[INV.HAMMER_DIAMOND].id = INV.HAMMER_DIAMOND;
    this.inv_buttons[INV.HAMMER_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.INV_HAMMER_AMETHYST]);
    this.inv_buttons[INV.HAMMER_AMETHYST].id = INV.HAMMER_AMETHYST;
    this.inv_buttons[INV.AMETHYST_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.INV_AMETHYST_WALL]);
    this.inv_buttons[INV.AMETHYST_WALL].id = INV.AMETHYST_WALL;
    this.inv_buttons[INV.AMETHYST_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.INV_AMETHYST_SPIKE]);
    this.inv_buttons[INV.AMETHYST_SPIKE].id = INV.AMETHYST_SPIKE;
    this.inv_buttons[INV.AMETHYST_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.INV_DOOR_AMETHYST_CLOSE]);
    this.inv_buttons[INV.AMETHYST_DOOR].id = INV.AMETHYST_DOOR;
    this.inv_buttons[INV.CAP_SCARF] = gui_create_button(0, 0, "", sprite[SPRITE.INV_CAP_SCARF]);
    this.inv_buttons[INV.CAP_SCARF].id = INV.CAP_SCARF;
    this.inv_buttons[INV.FUR_WINTER] = gui_create_button(0, 0, "", sprite[SPRITE.INV_FUR_WINTER]);
    this.inv_buttons[INV.FUR_WINTER].id = INV.FUR_WINTER;
    this.inv_buttons[INV.BLUE_CORD] = gui_create_button(0, 0, "", sprite[SPRITE.INV_BLUE_CORD]);
    this.inv_buttons[INV.BLUE_CORD].id = INV.BLUE_CORD;
    this.craft_buttons = [];
    this.craft_buttons[CRAFT.SWORD] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SWORD]);
    this.craft_buttons[CRAFT.SWORD].id = CRAFT.SWORD;
    this.craft_buttons[CRAFT.PICK] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_PICK]);
    this.craft_buttons[CRAFT.PICK].id = CRAFT.PICK;
    this.craft_buttons[CRAFT.FIRE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_FIRE]);
    this.craft_buttons[CRAFT.FIRE].id = CRAFT.FIRE;
    this.craft_buttons[CRAFT.WORKBENCH] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_WORK]);
    this.craft_buttons[CRAFT.WORKBENCH].id = CRAFT.WORKBENCH;
    this.craft_buttons[CRAFT.WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_WALL]);
    this.craft_buttons[CRAFT.WALL].id = CRAFT.WALL;
    this.craft_buttons[CRAFT.SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SPIKE]);
    this.craft_buttons[CRAFT.SPIKE].id = CRAFT.SPIKE;
    this.craft_buttons[CRAFT.SEED] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SEED]);
    this.craft_buttons[CRAFT.SEED].id = CRAFT.SEED;
    this.craft_buttons[CRAFT.PICK_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_PICK_GOLD]);
    this.craft_buttons[CRAFT.PICK_GOLD].id = CRAFT.PICK_GOLD;
    this.craft_buttons[CRAFT.PICK_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_PICK_DIAMOND]);
    this.craft_buttons[CRAFT.PICK_DIAMOND].id = CRAFT.PICK_DIAMOND;
    this.craft_buttons[CRAFT.SWORD_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SWORD_GOLD]);
    this.craft_buttons[CRAFT.SWORD_GOLD].id = CRAFT.SWORD_GOLD;
    this.craft_buttons[CRAFT.SWORD_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SWORD_DIAMOND]);
    this.craft_buttons[CRAFT.SWORD_DIAMOND].id = CRAFT.SWORD_DIAMOND;
    this.craft_buttons[CRAFT.PICK_WOOD] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_PICK_WOOD]);
    this.craft_buttons[CRAFT.PICK_WOOD].id = CRAFT.PICK_WOOD;
    this.craft_buttons[CRAFT.COOKED_MEAT] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_COOKED_MEAT]);
    this.craft_buttons[CRAFT.COOKED_MEAT].id = CRAFT.COOKED_MEAT;
    this.craft_buttons[CRAFT.BIG_FIRE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_BIG_FIRE]);
    this.craft_buttons[CRAFT.BIG_FIRE].id = CRAFT.BIG_FIRE;
    this.craft_buttons[CRAFT.BANDAGE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_BANDAGE]);
    this.craft_buttons[CRAFT.BANDAGE].id = CRAFT.BANDAGE;
    this.craft_buttons[CRAFT.STONE_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_STONE_WALL]);
    this.craft_buttons[CRAFT.STONE_WALL].id = CRAFT.STONE_WALL;
    this.craft_buttons[CRAFT.GOLD_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_GOLD_WALL]);
    this.craft_buttons[CRAFT.GOLD_WALL].id = CRAFT.GOLD_WALL;
    this.craft_buttons[CRAFT.DIAMOND_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DIAMOND_WALL]);
    this.craft_buttons[CRAFT.DIAMOND_WALL].id = CRAFT.DIAMOND_WALL;
    this.craft_buttons[CRAFT.WOOD_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DOOR_WOOD_CLOSE]);
    this.craft_buttons[CRAFT.WOOD_DOOR].id = CRAFT.WOOD_DOOR;
    this.craft_buttons[CRAFT.CHEST] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_CHEST]);
    this.craft_buttons[CRAFT.CHEST].id = CRAFT.CHEST;
    this.craft_buttons[CRAFT.STONE_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_STONE_SPIKE]);
    this.craft_buttons[CRAFT.STONE_SPIKE].id = CRAFT.STONE_SPIKE;
    this.craft_buttons[CRAFT.GOLD_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_GOLD_SPIKE]);
    this.craft_buttons[CRAFT.GOLD_SPIKE].id = CRAFT.GOLD_SPIKE;
    this.craft_buttons[CRAFT.DIAMOND_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DIAMOND_SPIKE]);
    this.craft_buttons[CRAFT.DIAMOND_SPIKE].id = CRAFT.DIAMOND_SPIKE;
    this.craft_buttons[CRAFT.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_BAG]);
    this.craft_buttons[CRAFT.BAG].id = CRAFT.BAG;
    this.craft_buttons[CRAFT.EARMUFFS] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_EARMUFFS]);
    this.craft_buttons[CRAFT.EARMUFFS].id = CRAFT.EARMUFFS;
    this.craft_buttons[CRAFT.STONE_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DOOR_STONE_CLOSE]);
    this.craft_buttons[CRAFT.STONE_DOOR].id = CRAFT.STONE_DOOR;
    this.craft_buttons[CRAFT.GOLD_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DOOR_GOLD_CLOSE]);
    this.craft_buttons[CRAFT.GOLD_DOOR].id = CRAFT.GOLD_DOOR;
    this.craft_buttons[CRAFT.DIAMOND_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DOOR_DIAMOND_CLOSE]);
    this.craft_buttons[CRAFT.DIAMOND_DOOR].id = CRAFT.DIAMOND_DOOR;
    this.craft_buttons[CRAFT.EARMUFFS] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_EARMUFFS]);
    this.craft_buttons[CRAFT.EARMUFFS].id = CRAFT.EARMUFFS;
    this.craft_buttons[CRAFT.COAT] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_COAT]);
    this.craft_buttons[CRAFT.COAT].id = CRAFT.COAT;
    this.craft_buttons[CRAFT.SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SPEAR]);
    this.craft_buttons[CRAFT.SPEAR].id = CRAFT.SPEAR;
    this.craft_buttons[CRAFT.GOLD_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_GOLD_SPEAR]);
    this.craft_buttons[CRAFT.GOLD_SPEAR].id = CRAFT.GOLD_SPEAR;
    this.craft_buttons[CRAFT.DIAMOND_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DIAMOND_SPEAR]);
    this.craft_buttons[CRAFT.DIAMOND_SPEAR].id = CRAFT.DIAMOND_SPEAR;
    this.craft_buttons[CRAFT.FURNACE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_FURNACE]);
    this.craft_buttons[CRAFT.FURNACE].id = CRAFT.FURNACE;
    this.craft_buttons[CRAFT.EXPLORER_HAT] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_EXPLORER_HAT]);
    this.craft_buttons[CRAFT.EXPLORER_HAT].id = CRAFT.EXPLORER_HAT;
    this.craft_buttons[CRAFT.STONE_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_STONE_HELMET]);
    this.craft_buttons[CRAFT.STONE_HELMET].id = CRAFT.STONE_HELMET;
    this.craft_buttons[CRAFT.GOLD_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_GOLD_HELMET]);
    this.craft_buttons[CRAFT.GOLD_HELMET].id = CRAFT.GOLD_HELMET;
    this.craft_buttons[CRAFT.DIAMOND_HELMET] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DIAMOND_HELMET]);
    this.craft_buttons[CRAFT.DIAMOND_HELMET].id = CRAFT.DIAMOND_HELMET;
    this.craft_buttons[CRAFT.BOOK] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_BOOK]);
    this.craft_buttons[CRAFT.BOOK].id = CRAFT.BOOK;
    this.craft_buttons[CRAFT.PAPER] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_PAPER]);
    this.craft_buttons[CRAFT.PAPER].id = CRAFT.PAPER;
    this.craft_buttons[CRAFT.BAG] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_BAG]);
    this.craft_buttons[CRAFT.BAG].id = CRAFT.BAG;
    this.craft_buttons[CRAFT.SWORD_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_SWORD_AMETHYST]);
    this.craft_buttons[CRAFT.SWORD_AMETHYST].id = CRAFT.SWORD_AMETHYST;
    this.craft_buttons[CRAFT.PICK_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_PICK_AMETHYST]);
    this.craft_buttons[CRAFT.PICK_AMETHYST].id = CRAFT.PICK_AMETHYST;
    this.craft_buttons[CRAFT.AMETHYST_SPEAR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_AMETHYST_SPEAR]);
    this.craft_buttons[CRAFT.AMETHYST_SPEAR].id = CRAFT.AMETHYST_SPEAR;
    this.craft_buttons[CRAFT.HAMMER] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_HAMMER]);
    this.craft_buttons[CRAFT.HAMMER].id = CRAFT.HAMMER;
    this.craft_buttons[CRAFT.HAMMER_GOLD] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_HAMMER_GOLD]);
    this.craft_buttons[CRAFT.HAMMER_GOLD].id = CRAFT.HAMMER_GOLD;
    this.craft_buttons[CRAFT.HAMMER_DIAMOND] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_HAMMER_DIAMOND]);
    this.craft_buttons[CRAFT.HAMMER_DIAMOND].id = CRAFT.HAMMER_DIAMOND;
    this.craft_buttons[CRAFT.HAMMER_AMETHYST] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_HAMMER_AMETHYST]);
    this.craft_buttons[CRAFT.HAMMER_AMETHYST].id = CRAFT.HAMMER_AMETHYST;
    this.craft_buttons[CRAFT.AMETHYST_WALL] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_AMETHYST_WALL]);
    this.craft_buttons[CRAFT.AMETHYST_WALL].id = CRAFT.AMETHYST_WALL;
    this.craft_buttons[CRAFT.AMETHYST_SPIKE] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_AMETHYST_SPIKE]);
    this.craft_buttons[CRAFT.AMETHYST_SPIKE].id = CRAFT.AMETHYST_SPIKE;
    this.craft_buttons[CRAFT.AMETHYST_DOOR] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_DOOR_AMETHYST_CLOSE]);
    this.craft_buttons[CRAFT.AMETHYST_DOOR].id = CRAFT.AMETHYST_DOOR;
    this.craft_buttons[CRAFT.CAP_SCARF] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_CAP_SCARF]);
    this.craft_buttons[CRAFT.CAP_SCARF].id = CRAFT.CAP_SCARF;
    this.craft_buttons[CRAFT.BLUE_CORD] = gui_create_button(0, 0, "", sprite[SPRITE.CRAFT_BLUE_CORD]);
    this.craft_buttons[CRAFT.BLUE_CORD].id = CRAFT.BLUE_CORD;
    this.update_craft_buttons = function () {
        var c = user.craft.can_craft;
        var d = 10;
        var e = 10;
        for (var f = 0; f < c.length; f++) {
            if (0 < f && !(f % 4)) {
                d += c[0].info.img[0].width + 10;
                e = 10;
            }
            c[f].info.translate.x = d;
            c[f].info.translate.y = e;
            e += 10 + c[f].info.img[0].height;
        }
    };
    this.update_chest_buttons = function () {
        var c = Math.floor(Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.chest_buttons[0].info.img[0].width) + 35);
        for (var d = 0; d < this.chest_buttons.length; d++) {
            if (this.chest_buttons[d]) {
                this.chest_buttons[d].info.translate.x = c;
                this.chest_buttons[d].info.translate.y = 22;
            }
        }
    };
    this.update_furnace_button = function () {
        this.furnace_button.info.translate.x = Math.floor(Math.floor((3 + user.craft.can_craft.length) / 4) * (10 + this.furnace_button.info.img[0].width) + 35);
        this.furnace_button.info.translate.y = 22;
    };
    this.update_inv_buttons = function () {
        var d = user.inv.can_select;
        for (var e = 0; e < d.length; e++) {
            d[e].info.translate.x = (d[e].info.img[0].width + 10) * e + this.gauges.img.width + 10;
            d[e].info.translate.y = c.height - d[e].info.img[0].width - 10;
            this.plus_buttons[d[e].id].info.translate.x = d[e].info.translate.x + 18;
            this.plus_buttons[d[e].id].info.translate.y = d[e].info.translate.y - this.plus_buttons[d[e].id].info.img[0].height - 6;
        }
    };
    var e = 0;
    var m = function () {
        f.update();
        e++;
        if (e == 30) {
            f.add_event_listener();
            f.update();
        } else {
            window.setTimeout(m, 33);
        }
    };
    this.quit = function (c) {
        if (user.chat.open) {
            user.chat.quit();
        }
        p = c;
        f.remove_event_listener();
        f.can.style.cursor = "auto";
        n = -1;
        r();
    };
    var p;
    var n = -1;
    var r = function () {
        f.update();
        n++;
        if (n == 30) {
            f.stop();
            p();
        } else {
            window.setTimeout(r, 33);
        }
    };
    this.is_run = false;
    this.stop = function () {
        this.is_run = false;
    };
    this.run = function () {
        client.change_ground();
        f.is_run = true;
        n = -1;
        e = 0;
        m();
    };
    this.update = function () {
        this.leaderboard.translate.x = this.can.width - this.leaderboard.img.width;
        this.leaderboard.translate.y = 0;
        user.auto_feed.translate.x = this.leaderboard.translate.x - sprite[SPRITE.AUTO_FEED].width - 10;
        user.auto_feed.translate.y = 10;
        this.minimap.translate.x = this.can.width - 3 - sprite[SPRITE.MINIMAP][0].width;
        this.minimap.translate.y = this.can.height - 3 - sprite[SPRITE.MINIMAP][0].height;
        this.gauges.translate.x = 0;
        this.gauges.translate.y = this.can.height - this.gauges.img.height;
        this.update_craft_buttons();
        this.update_inv_buttons();
        this.update_chest_buttons();
        this.update_furnace_button();
        user.chat.update();
        var c = 0;
        if (e != 30) {
            c = 1500 / (e + 1) - 50;
        }
        if (n != -1) {
            c = -(1500 / (30 - n + 1) - 48);
        }
        this.leaderboard.translate.y -= 0 < c ? c : -c;
        user.auto_feed.translate.y -= 0 < c ? c : -c;
        this.gauges.translate.y -= 0 > c ? c : -c;
        this.minimap.translate.y -= 0 > c ? c : -c;
    };
    this.draw_UI = function () {
        draw_minimap();
        draw_leaderboard();
        draw_auto_feed();
        this.gauges.draw();
        draw_ui_crafting();
        draw_ui_inventory();
        draw_chest_inventory();
        draw_furnace_inventory();
        draw_bigmap();
        user.alert.draw("#FFF");
    };
    this.update_scene = function () {
        user.cam.update();
        user.gauges.update();
        user.control.update();
        user.auto_feed.update();
        world.update();
    };
    this.draw_scene = function () {
        draw_world_with_effect();
    };
    this.update_connection = function () {
        client.check_state();
        client.check_pong();
        client.try_ping();
        client.update_cam();
    };
    this.draw = function () {
        this.update_connection();
        this.update_scene();
        this.draw_scene();
        this.draw_UI();
    };
    this.trigger_keyup = function (c) {
        if (user.chat.open && c.keyCode == 27) {
            user.chat.quit();
        } else if (c.keyCode == 13) {
            user.chat.run();
        } else if (!user.chat.open) {
            if (c.keyCode == 82) {
                user.auto_feed.enabled = !user.auto_feed.enabled;
            } else if (49 <= c.keyCode && 57 >= c.keyCode) {
                if (0 > user.craft.id) {
                    var d = c.keyCode - 49;
                    var e = user.inv.can_select[d];
                    if (e) {
                        client.select_inv(e.id, d);
                    }
                }
            } else if (c.keyCode == 89) {
                user.bigmap = !user.bigmap;
            }
        }
        keyboard.up(c);
    };
    this.trigger_keydown = function (c) {
        keyboard.down(c);
        if (c.keyCode == 8 && !user.chat.open) {
            c.preventDefault();
        }
    };
    this.trigger_mousedown = function (c) {
        mouse.pos = get_mouse_pos(this.can, c);
        c = false;
        var d = user.chest;
        if (0 > user.craft.id && 0 <= d.id) {
            c |= f.chest_buttons[user.chest.id].trigger(f.can, mouse.pos, MOUSE_DOWN);
        }
        if (0 > user.craft.id) {
            var e = user.inv.can_select;
            for (var g = 0; g < e.length; g++) {
                c |= e[g].trigger(f.can, mouse.pos, MOUSE_DOWN);
                if (d.open && (0 > d.id || d.id == e[g].id) || user.furnace.open && e[g].id == INV.WOOD) {
                    c |= f.plus_buttons[e[g].id].trigger(f.can, mouse.pos, MOUSE_DOWN);
                }
            }
        }
        if (0 > user.craft.id && 0 > user.craft.preview) {
            e = user.craft.can_craft;
            for (g = 0; g < e.length; g++) {
                c |= e[g].trigger(f.can, mouse.pos, MOUSE_DOWN);
            }
        }
        if (!c) {
            if (0 <= user.craft.preview) {
                client.send_build();
            } else {
                mouse.down();
            }
        }
    };
    this.trigger_mouseup = function (c) {
        mouse.pos = get_mouse_pos(this.can, c);
        mouse.up();
        var d = user.chest;
        var e = user.furnace;
        if (user.control.attack) {
            user.control.attack = 0;
            client.stop_attack();
        }
        if (0 > user.craft.id && 0 <= d.id) {
            var g = f.chest_buttons[user.chest.id].trigger(f.can, mouse.pos, MOUSE_UP);
            if (g) {
                client.take_chest(d);
            }
        }
        if (0 > user.craft.id) {
            var m = user.inv.can_select;
            for (var n = 0; n < m.length; n++) {
                if (g = m[n].trigger(f.can, mouse.pos, MOUSE_UP)) {
                    if (c.which == 1) {
                        client.select_inv(m[n].id, n);
                    } else if (c.which == 3 && 0 > user.craft.preview) {
                        client.delete_inv(m[n].id, n);
                    }
                } else if (d.open && (0 > d.id || d.id == m[n].id)) {
                    if ((g = f.plus_buttons[m[n].id].trigger(f.can, mouse.pos, MOUSE_UP)) && 0 > user.craft.preview) {
                        client.give_item(d, m[n].id, c.shiftKey ? 10 : 1);
                    }
                } else if (e.open && m[n].id == INV.WOOD && (g = f.plus_buttons[m[n].id].trigger(f.can, mouse.pos, MOUSE_UP)) && 0 > user.craft.preview) {
                    client.give_wood(e, c.shiftKey ? 10 : 1);
                }
            }
        }
        if (0 > user.craft.id && 0 > user.craft.preview) {
            m = user.craft.can_craft;
            for (n = 0; n < m.length; n++) {
                if (g = m[n].trigger(f.can, mouse.pos, MOUSE_UP)) {
                    client.select_craft(m[n].id);
                }
            }
        }
        if (user.craft.crafting && c.which == 3) {
            client.cancel_crafting();
        }
    };
    this.trigger_mousemove = function (d) {
        mouse.pos = get_mouse_pos(this.can, d);
        d = false;
        var e = user.chest;
        if (0 > user.craft.id && 0 <= e.id) {
            d |= f.chest_buttons[e.id].trigger(f.can, mouse.pos, MOUSE_MOVE);
        }
        if (0 > user.craft.id) {
            var g = user.inv.can_select;
            for (var m = 0; m < g.length; m++) {
                d |= g[m].trigger(f.can, mouse.pos, MOUSE_MOVE);
                if (e.open && (0 > e.id || e.id == g[m].id) || user.furnace.open && g[m].id == INV.WOOD) {
                    d |= f.plus_buttons[g[m].id].trigger(f.can, mouse.pos, MOUSE_MOVE);
                }
            }
        }
        if (0 > user.craft.id && 0 > user.craft.preview) {
            g = user.craft.can_craft;
            for (m = 0; m < g.length; m++) {
                d |= g[m].trigger(f.can, mouse.pos, MOUSE_MOVE);
            }
        }
        c.style.cursor = d ? "pointer" : "auto";
    };
    this.add_event_listener = function () {
        window.addEventListener("mousedown", this.trigger_mousedown, false);
        window.addEventListener("mouseup", this.trigger_mouseup, false);
        window.addEventListener("mousemove", this.trigger_mousemove, false);
        window.addEventListener("keyup", this.trigger_keyup, false);
        window.addEventListener("keydown", this.trigger_keydown, false);
    };
    this.remove_event_listener = function () {
        window.removeEventListener("mousedown", this.trigger_mousedown, false);
        window.removeEventListener("mouseup", this.trigger_mouseup, false);
        window.removeEventListener("mousemove", this.trigger_mousemove, false);
        window.removeEventListener("keyup", this.trigger_keyup, false);
        window.removeEventListener("keydown", this.trigger_keydown, false);
    };
}
var fake_world = { time: Math.floor(2 * Math.random()), items: [] };
init_fake_world();
var ui;
var game = { is_run: false };
var world;
var user;
window.onbeforeunload = function () {
    if (game.is_run) {
        return "Are you sure you want quit starve.io ;-; ?";
    }
};
var client = new Client;
var keyboard = new Keyboard;
var mouse = new Mouse;
var delta = 0;
var old_timestamp = 0;
var fps = { img: false, counter: 0, delay: 0, cycle: 60, display: true };
var loader = new Loader(can, ctx, function () {
    create_images();
    game = new Game(can, ctx);
    ui = new UI(can, ctx);
    world = new World;
    user = new User;
    loader.quit(function () {
        loader.logo.style.display = "none";
        ui.run();
    });
});
function draw(c) {
    window.requestAnimationFrame(draw);
    delta = (c - old_timestamp) / 1e3;
    old_timestamp = c;
    delta = 1 < delta ? 1 : delta;
    if (game.is_run) {
        game.draw();
    } else {
        ctx.clearRect(0, 0, can.width, can.height);
        if (loader.is_run) {
            loader.draw();
        } else if (ui.is_run) {
            ui.draw();
        }
    }
}
resize_canvas();
draw(0);
function getScript(c, g) {
    var f = document.head || document.getElementsByTagName("head")[0];
    var d = document.createElement("script");
    var e = true;
    d.async = "async";
    d.type = "text/javascript";
    d.charset = "UTF-8";
    d.src = c;
    d.onload = d.onreadystatechange = function () {
        if (!!e && (!d.readyState || !!/loaded|complete/.test(d.readyState))) {
            e = false;
            g();
            d.onload = d.onreadystatechange = null;
        }
    };
    f.appendChild(d);
}
var ___adsvid = 1;
