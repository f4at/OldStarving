import { Mod, ModEvent } from "../ModdedStarving";

const NAME = "AMETHYST_HELMET";
const INAME = 'INV_' + NAME;
const CNAME = 'CRAFT_' + NAME;
const CHNAME = 'CHEST_' + NAME
const ID = 63;
const SID = 313;

class AmethystHelmetMod extends Mod {
    name = "AmethystHelmet";
    version = "0.2";

    on(event: ModEvent, data: any) {

        switch (event) {
            case "load":
                console.log(`${this.name} (${this.version}) loaded`);
                break;
            case "registry_init":
                data.CRAFT[NAME] = data.INV[NAME] = ID;
                data.RECIPES.push({
                    r: [[5, 200], [49, 80], [6, 120], [45, 1]],
                    w: 1,
                    f: 0,
                    id: ID,
                    id2: ID,
                    time: 1 / 90
                });
                break;
            case "sprite":
                data.SPRITE[NAME] = SID;
                data.SPRITE[INAME] = SID + 1;
                data.SPRITE[CNAME] = SID + 2;
                data.SPRITE[CHNAME] = SID + 3;
                data.sprite[SID] = [];
                data.sprite[SID][data.SPRITE.DAY] = CTI(create_amethyst_helmet(.78, true, "#0d1b1c #8c55b7 #652d8e #79359e #5eccd1 #4badad #9e6ac6".split(" ")));
                data.sprite[SID][data.SPRITE.NIGHT] = CTI(create_amethyst_helmet(.78, true, "#0d1b1c #4e4e93 #393977 #444187 #2b9390 #277a74 #7da8db".split(" ")));

                data.sprite[data.SPRITE[INAME]] = data.create_craft_button(1, [{
                    f: create_amethyst_helmet, x: 0, y: 0, a: 1, r: 0,
                    c: "#0d1b1c #8c55b7 #652d8e #79359e #5eccd1 #4badad #9e6ac6".split(" ")
                }], .52, ["#3ba578", "#4eb687", "#3da34d"], .7);

                data.sprite[data.SPRITE[CNAME]] = data.create_craft_button(1, [{
                    f: function (c) {
                        return data.create_gear(5 * c, "#918770");
                    },
                    x: 0,
                    y: 0,
                    a: .3,
                    r: 0
                }, {
                    f: create_amethyst_helmet,
                    x: 0,
                    y: 0,
                    a: 1,
                    r: 0,
                    c: "#0d1b1c #8c55b7 #652d8e #79359e #5eccd1 #4badad #9e6ac6".split(" ")
                }], .52, ["#756e52", "#898064", "#685b40"], .8);

                data.sprite[data.SPRITE[CHNAME]] = data.create_craft_button(1, [{
                    f: create_amethyst_helmet,
                    x: 0,
                    y: 0,
                    a: 1,
                    r: 0,
                    c: "#0d1b1c #8c55b7 #652d8e #79359e #5eccd1 #4badad #9e6ac6".split(" ")
                }], .52, ["#968e55", "#b1a868", "#888046"], .7);
                break;

            case "buttons":
                data.inv_buttons[ID] = data.gui_create_button(0, 0, "", data.sprite[SID + 1]);
                data.inv_buttons[ID].id = ID;
                data.craft_buttons[ID] = data.gui_create_button(0, 0, "", data.sprite[SID + 2]);
                data.craft_buttons[ID].id = ID;
                data.chest_buttons[ID] = data.gui_create_button(0, 0, "", data.sprite[SID + 3]);
                data.chest_buttons[ID].id = ID;
                break;
            case "draw_clothe":
                if (data.c === ID) {
                    let sprite = data.sprite[SID][data.world.time];
                    data.draw_image_transition(sprite, -sprite.width / 2 + 1.5 * data.scale, -sprite.height / 2 + 1 * data.scale);
                }
                break;
            case "select_inv":
                if (data.c === ID) {
                    data.socket.send(JSON.stringify([5, data.c]));
                }
                break;
        }
    }
}

function CTI(c) {
    var g = new Image;
    g.src = c.toDataURL("image/png");
    g.width = c.width;
    g.height = c.height;
    return g;
}

function fill_path(c, g, f?, d?) {
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

function create_amethyst_helmet(c, g, f) {
    g = document.createElement("canvas");
    var d = g.getContext("2d");
    g.width = 145 * c * .635 / .6;
    g.height = 120 * c * .635 / .6;
    d.beginPath();
    d.scale(.635, .635);
    d.lineCap = "round";
    d.lineJoin = "round";
    d.translate(18 * c, -8 * c);
    d.moveTo(101 * c, 72 * c);
    d.bezierCurveTo(144 * c, 69 * c, 149 * c, 58 * c, 162 * c, 49 * c);
    d.bezierCurveTo(174 * c, 31 * c, 173 * c, 38 * c, 172 * c, 45 * c);
    d.bezierCurveTo(168 * c, 73 * c, 158 * c, 75 * c, 152 * c, 78 * c);
    d.bezierCurveTo(106 * c, 89 * c, 107 * c, 91 * c, 107 * c, 94 * c);
    d.bezierCurveTo(107 * c, 100 * c, 107 * c, 107 * c, 107 * c, 107 * c);
    d.bezierCurveTo(99 * c, 112 * c, 98 * c, 110 * c, 93 * c, 107 * c);
    d.bezierCurveTo(94 * c, 107 * c, 93 * c, 107 * c, 93 * c, 107 * c);
    d.bezierCurveTo(93 * c, 100 * c, 93 * c, 100 * c, 92 * c, 94 * c);
    d.bezierCurveTo(92 * c, 89 * c, 90 * c, 90 * c, 73 * c, 86 * c);
    d.bezierCurveTo(45 * c, 81 * c, 40 * c, 77 * c, 35 * c, 68 * c);
    d.bezierCurveTo(23 * c, 36 * c, 28 * c, 34 * c, 36 * c, 46 * c);
    d.bezierCurveTo(45 * c, 58 * c, 83 * c, 72 * c, 98 * c, 72 * c);
    d.closePath();
    fill_path(d, f[4], f[5], 4 * c);
    d.beginPath();
    d.scale(1.1, 1.1);
    d.lineCap = "round";
    d.lineJoin = "round";
    d.translate(-9 * c, 4 * c);
    d.moveTo(101 * c, 72 * c);
    d.bezierCurveTo(144 * c, 69 * c, 149 * c, 58 * c, 162 * c, 49 * c);
    d.bezierCurveTo(174 * c, 31 * c, 173 * c, 38 * c, 172 * c, 45 * c);
    d.bezierCurveTo(168 * c, 73 * c, 158 * c, 75 * c, 152 * c, 78 * c);
    d.bezierCurveTo(106 * c, 89 * c, 107 * c, 91 * c, 107 * c, 94 * c);
    d.bezierCurveTo(107 * c, 100 * c, 107 * c, 107 * c, 107 * c, 107 * c);
    d.bezierCurveTo(99 * c, 112 * c, 98 * c, 110 * c, 93 * c, 107 * c);
    d.bezierCurveTo(94 * c, 107 * c, 93 * c, 107 * c, 93 * c, 107 * c);
    d.bezierCurveTo(93 * c, 100 * c, 93 * c, 100 * c, 92 * c, 94 * c);
    d.bezierCurveTo(92 * c, 89 * c, 90 * c, 90 * c, 73 * c, 86 * c);
    d.bezierCurveTo(45 * c, 81 * c, 40 * c, 77 * c, 35 * c, 68 * c);
    d.bezierCurveTo(23 * c, 36 * c, 28 * c, 34 * c, 36 * c, 46 * c);
    d.bezierCurveTo(45 * c, 58 * c, 83 * c, 72 * c, 98 * c, 72 * c);
    d.closePath();
    fill_path(d, f[4], f[5], 4 * c);
    d.scale(1.1, 1.1);
    d.translate(-9 * c, 4 * c);
    d.save();
    d.translate(100 * c, 73.06874084472656 * c);
    d.rotate(0);
    round_rect(d, -61 * c, -38.5 * c, 122 * c, 40 * c, 20 * c);
    d.restore();
    fill_path(d, f[1], f[2], 4 * c);
    d.save();
    d.translate(100 * c, 71.36874389648438 * c);
    d.rotate(0);
    round_rect(d, -60.5 * c, -18 * c, 121 * c, 30 * c, 20 * c);
    d.restore();
    fill_path(d, f[3], f[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(144 * c, 80 * c);
    d.bezierCurveTo(152 * c, 100 * c, 152 * c, 101 * c, 153 * c, 102 * c);
    d.bezierCurveTo(159 * c, 100 * c, 159 * c, 100 * c, 160 * c, 100 * c);
    d.bezierCurveTo(161 * c, 84 * c, 161 * c, 84 * c, 162 * c, 68 * c);
    d.closePath();
    fill_path(d, f[2]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(57 * c, 75 * c);
    d.bezierCurveTo(48 * c, 101 * c, 53 * c, 89 * c, 48 * c, 102 * c);
    d.bezierCurveTo(44 * c, 100 * c, 44 * c, 100 * c, 39 * c, 97 * c);
    d.bezierCurveTo(39 * c, 83 * c, 39 * c, 83 * c, 39 * c, 69 * c);
    d.closePath();
    fill_path(d, f[2]);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(101 * c, 72 * c);
    d.bezierCurveTo(144 * c, 69 * c, 149 * c, 58 * c, 162 * c, 49 * c);
    d.bezierCurveTo(174 * c, 31 * c, 173 * c, 38 * c, 172 * c, 45 * c);
    d.bezierCurveTo(168 * c, 73 * c, 158 * c, 75 * c, 152 * c, 78 * c);
    d.bezierCurveTo(106 * c, 89 * c, 107 * c, 91 * c, 107 * c, 94 * c);
    d.bezierCurveTo(107 * c, 100 * c, 107 * c, 107 * c, 107 * c, 107 * c);
    d.bezierCurveTo(99 * c, 112 * c, 98 * c, 110 * c, 93 * c, 107 * c);
    d.bezierCurveTo(94 * c, 107 * c, 93 * c, 107 * c, 93 * c, 107 * c);
    d.bezierCurveTo(93 * c, 100 * c, 93 * c, 100 * c, 92 * c, 94 * c);
    d.bezierCurveTo(92 * c, 89 * c, 90 * c, 90 * c, 73 * c, 86 * c);
    d.bezierCurveTo(45 * c, 81 * c, 40 * c, 77 * c, 35 * c, 68 * c);
    d.bezierCurveTo(23 * c, 36 * c, 28 * c, 34 * c, 36 * c, 46 * c);
    d.bezierCurveTo(45 * c, 58 * c, 83 * c, 72 * c, 98 * c, 72 * c);
    d.closePath();
    fill_path(d, f[4], f[5], 4 * c);
    d.translate(0, 0);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(115.5 * c, 116.07290649414062 * c);
    d.bezierCurveTo(159.5 * c, 99.07290649414062 * c, 159.5 * c, 98.07290649414062 * c, 159.5 * c, 98.07290649414062 * c);
    d.bezierCurveTo(155.5 * c, 116.07290649414062 * c, 159.5 * c, 116.07290649414062 * c, 159.5 * c, 118.07290649414062 * c);
    d.bezierCurveTo(147.5 * c, 130.07290649414062 * c, 136.5 * c, 132.07290649414062 * c, 115.5 * c, 138.07290649414062 * c);
    d.closePath();
    fill_path(d, f[3], f[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(39.5 * c, 96.07290649414062 * c);
    d.bezierCurveTo(85.5 * c, 114.07290649414062 * c, 62.5 * c, 105.57290649414062 * c, 85.5 * c, 115.07290649414062 * c);
    d.bezierCurveTo(85.5 * c, 125.57290649414062 * c, 85.5 * c, 125.57290649414062 * c, 85.5 * c, 136.07290649414062 * c);
    d.bezierCurveTo(51.5 * c, 129.07290649414062 * c, 51.5 * c, 125.07290649414062 * c, 41.5 * c, 118.07290649414062 * c);
    d.bezierCurveTo(44.5 * c, 106.07290649414062 * c, 42.5 * c, 103.07290649414062 * c, 40.5 * c, 96.07290649414062 * c);
    d.closePath();
    fill_path(d, f[3], f[2], 4 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(86 * c, 80 * c);
    d.bezierCurveTo(97 * c, 88 * c, 106 * c, 84 * c, 112 * c, 80 * c);
    d.bezierCurveTo(112 * c, 62 * c, 106 * c, 59 * c, 99 * c, 54 * c);
    d.bezierCurveTo(86 * c, 62 * c, 86 * c, 73 * c, 86 * c, 80 * c);
    d.closePath();
    fill_path(d, f[3], f[2], 4 * c);
    d.scale(.5, .5);
    d.translate(100 * c, 71 * c);
    d.beginPath();
    d.lineCap = "round";
    d.lineJoin = "round";
    d.moveTo(86 * c, 80 * c);
    d.bezierCurveTo(97 * c, 88 * c, 106 * c, 84 * c, 112 * c, 80 * c);
    d.bezierCurveTo(112 * c, 62 * c, 106 * c, 59 * c, 99 * c, 54 * c);
    d.bezierCurveTo(86 * c, 62 * c, 86 * c, 73 * c, 86 * c, 80 * c);
    d.restore();
    fill_path(d, f[6], f[2], 4 * c);
    return g;
}

export default new AmethystHelmetMod();