export default class Item {
    id: number;
    recipe: any;

    constructor(id: number, recipe: any) {
        this.id = id;
        this.recipe = recipe;
    }
}

export enum DamageType {
    PvP = "pvp",
    PvE = "pve"
}

export class Damage {
    pvp: number;
    pve: number;
}

export class Tool extends Item {
    range: number;
    range2: number;
    damage: Damage;
    tier: number;
    constructor(id: number, range: number, range2: number, damage: Damage, recipe: any,tier: number = 0) {
        super(id, recipe);
        this.range = range;
        this.range2 = range2;
        this.damage = damage;
        this.tier = 0;
    }
}

export class Pickaxe extends Tool {
    ftier: number;

    constructor(id: number, range: number, range2: number, damage: Damage, ftier: number, recipe: any) {
        super(id, range, range2, damage, recipe);
        this.ftier = ftier;
    }
}

export class Clothes extends Item {
    coldProtection: number;
    damageProtection: Damage;

    constructor(id: number, damageProtection: Damage, coldProtection: number,recipe:any) {
        super(id,recipe);
        this.damageProtection = damageProtection;
        this.coldProtection = coldProtection;
    }
}

export enum EntityType {
    WALL = 0,
    DOOR = 1,
    SPIKE = 2,
    FIRE = 3,
    WORKEBENCH = 4,
    MINE = 5,
    MOB = 6,
    CHEST = 7,
    PLAYER
}

export class Entityitem extends Item { //use it to create entities later :3
    sid: number;
    numberOfSides: number; // special cases: 0 for circle,  1 for line,  2 for 2 parrallel lines eg: '| |'
    raduis: number; //distance between center and middle of sides.
    XtoYfac: number; //important to make rectanges(instead of squares only) + other shapes
    hp: number; //
    type: EntityType;
    special: {};

    constructor(id: number, sid: number, numberOfSides: number = -1, raduis: number, XtoYfac: number, hp:number, type:EntityType, special:any, recipe: any) {
        super(id, recipe);
        this.sid = sid,
        this.numberOfSides = numberOfSides;
        this.raduis = raduis;
        this.XtoYfac = XtoYfac;
        this.hp = hp;
        this.type = type;
        this.special = special;
    }
}

export class Usable extends Item {
    food: number;
    temp: number;
    hp: number;
    regen: number;

    constructor(id: number, food: number, temp: number, hp: number, regen: number, recipe: any) {
        super(id, recipe);
        this.food = food;
        this.temp = temp;
        this.hp = hp;
        this.regen = regen;
    }
}

export class Items {
    static STONE_SWORD = new Tool(0, 39, 25, { pvp: 19, pve: 6 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, time: 1 / 15 });
    static Null = new Clothes(0, {pvp:0,pve:0}, 0, {}); //can't find it using .find bc 2nd (thats good), needs to share stone_sword id :/
    static PICK_STONE = new Pickaxe(1, 29, 25, {pvp: 1, pve: 0}, 2, { r: [[15, 1], [3, 60], [2, 20]], w: 1, f: 0, time: 1 / 15 });
    static STONE = new Item(2, null);
    static WOOD = new Item(3, null);
    static PLANT = new Usable(4, 5, 0, 0, 1, null);
    static GOLD = new Item(5, null);
    static DIAMOND = new Item(6, null);
    static PICK_GOLD = new Pickaxe(7, 30, 25, { pvp: 3, pve: 1 }, 3, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, time: .05 });
    static PICK_DIAMOND = new Pickaxe(8, 31, 25, { pvp: 4, pve: 1 }, 4, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, time: 1 / 30 });
    static SWORD_GOLD = new Tool(9, 40, 25, { pvp: 22, pve: 7 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, time: .05 });
    static SWORD_DIAMOND = new Tool(10, 41, 25, { pvp: 24, pve: 8 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, time: 1 / 30 });
    static FIRE = new Entityitem(11, 1, 0, 30, 1, 500, EntityType.FIRE, {physical:false, Lifespan: 2},{ r: [[3, 30], [2, 5]], w: 0, f: 0, time: .1 });
    static WORKEBENCH = new Entityitem(12, 2, 4, 50, 1.25, 500, EntityType.WORKEBENCH, {physical:true, Lifespan: 30} ,{ r: [[3, 40], [2, 20]], w: 0, f: 0, time: 1 / 15 });
    static SEED = new Entityitem(13, 3, 0, 20, 1, 500, EntityType.MINE, {physical:false} ,{ r: [[4, 3], [3, 20]], w: 0, f: 1, time: .1 });
    static HAND = new Pickaxe(14, 40, 25, { pvp: 5, pve: 1 }, 0, null);
    static PICK_WOOD = new Pickaxe(15, 28, 25, { pvp: 5, pve: 1 }, 1, { r: [[3, 15]], w: 0, f: 0, time: .2 });
    static WOOD_WALL = new Entityitem(16, 4, 0, 50, 1, 1000, EntityType.WALL, {physical:true,Lifespan:30,LifeUpdate:2} ,{ r: [[3, 20]], w: 1, f: 0, time: .2 });
    static WOOD_SPIKE = new Entityitem(17, 5, 0, 50, 1, 150, EntityType.SPIKE, {physical:true,Lifespan:15,LifeUpdate:2,hitdmg:2,dmg:5} ,{ r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, time: .05 });
    static MEAT = new Usable(18, 25, 0, -10, -5, null);
    static COOKED_MEAT = new Usable(19, 20, 0, 0, 5, null);
    static BIG_FIRE = new Entityitem(20, 6, 0, 35, 1, 700, EntityType.FIRE, {physcial:false, Lifespan: 5, dmg: 20}, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, time: .1 });
    static BANDAGE = new Usable(21, 25, 0, -10, -5, { r: [[22, 3]], w: 1, f: 0, time: .2 });
    static CORD = new Item(22, null);
    static STONE_WALL = new Entityitem(23, 7, 7, 50, 1, 1500, EntityType.WALL, {physcial:true,tier:1,Lifespan:120,LifeUpdate:5}, { r: [[16, 1], [2, 20]], w: 1, f: 0, time: .2 });
    static GOLD_WALL = new Entityitem(24, 8, 7, 50, 1, 2000, EntityType.WALL, {physcial:true,tier:2,Lifespan:720,LifeUpdate:30}, { r: [[23, 1], [5, 20]], w: 1, f: 0, time: .2 });
    static DIAMOND_WALL = new Entityitem(25, 9, 7, 50, 1, 2500, EntityType.WALL, {physcial:true,tier:3}, { r: [[24, 1], [6, 20]], w: 1, f: 0, time: .2 });
    static WOOD_DOOR = new Entityitem(26, 10, 0, 50, 1, 3500, EntityType.DOOR, {physcial:true,Lifespan:30,LifeUpdate:2}, { r: [[3, 60]], w: 1, f: 0, time: .125 });
    static CHEST = new Entityitem(27, 11, 4, 25, 1.3, 300, EntityType.CHEST, {physcial:true}, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, time: .05 });
    static STONE_SPIKE = new Entityitem(28, 12, 7, 50, 1, 300, EntityType.SPIKE, {physcial:true,tier:1,Lifespan:60,LifeUpdate:5,hitdmg:4,dmg:10}, { r: [[23, 1], [2, 35]], w: 1, f: 0, time: .05 });
    static GOLD_SPIKE = new Entityitem(29, 13, 7, 50, 1, 600, EntityType.SPIKE, {physcial:true,tier:2,Lifespan:360,LifeUpdate:30,hitdmg:8,dmg:20}, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, time: .05 });
    static DIAMOND_SPIKE = new Entityitem(30, 14, 7, 50, 1, 900, EntityType.SPIKE, {physcial:true,tier:3,hitdmg:4,dmg:30}, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, time: .05 });
    static STONE_DOOR = new Entityitem(31, 15, 7, 50, 1, 1500, EntityType.DOOR, {physcial:true,tier:1,Lifespan:120,LifeUpdate:5}, { r: [[26, 1], [2, 60]], w: 1, f: 0, time: .125 });
    static GOLD_DOOR = new Entityitem(32, 16, 7, 50, 1, 2000, EntityType.DOOR, {physcial:true,tier:2,Lifespan:720,LifeUpdate:30}, { r: [[31, 1], [5, 60]], w: 1, f: 0, time: .125 });
    static DIAMOND_DOOR = new Entityitem(33, 17, 7, 50, 1, 2500, EntityType.DOOR, {physcial:true,tier:3}, { r: [[32, 1], [6, 60]], w: 1, f: 0, time: .125 });
    static FUR = new Item(34, null);
    static FUR_WOLF = new Item(35, null);
    static EARMUFFS = new Clothes(36, {pvp:0,pve:1}, 2, { r: [[34, 8], [22, 4]], w: 1, f: 0, time: 1 / 15 });
    static COAT = new Clothes(37, {pvp:1,pve:2}, 2, { r: [[36, 1], [34, 5], [35, 10], [22, 6]], w: 1, f: 0, time: .04 });
    static STONE_SPEAR = new Tool(38, 70, 34, { pvp: 14, pve: 4 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, time: 1 / 15 });
    static GOLD_SPEAR = new Tool(39, 71, 35, { pvp: 15, pve: 5 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, time: .05 });
    static DIAMOND_SPEAR = new Tool(40, 72, 36, { pvp: 17, pve: 5 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, time: 1 / 30 });
    static FURNACE = new Entityitem(41, 18, 0, 60, 1, 700, EntityType.FIRE, {physcial:true}, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, time: .1 });
    static EXPLORER_HAT = new Clothes(42, {pvp:0,pve:4}, 0, { r: [[47, 3], [34, 2]], w: 1, f: 0, time: 1 / 15 });
    static STONE_HELMET = new Clothes(43, {pvp:2,pve:8}, 0, { r: [[2, 150], [3, 100]], w: 1, f: 0, time: .05 }); 
    static GOLD_HELMET =  new Clothes(44, {pvp:4,pve:13}, 0, { r: [[2, 180], [3, 120], [5, 100], [43, 1]], w: 1, f: 0, time: .025 }); 
    static DIAMOND_HELMET = new Clothes(45, { pvp: 5, pve: 19 }, 0, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, time: 1 / 60 });
    static BOOK = new Tool(46, 75, 25, { pvp: 3, pve: 1 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, time: .05 });
    static PAPER = new Item(47, { r: [[3, 30]], w: 0, f: 1, time: 1 / 3 });
    static BAG = new Clothes(48, {pvp:0,pve:0}, 0, { r: [[22, 10], [35, 5]], w: 1, f: 0, time: .05 }); 
    static AMETHYST = new Item(49, null);
    static SWORD_AMETHYST = new Tool(50, 42, 25, { pvp: 27, pve: 9 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, time: .025 });
    static PICK_AMETHYST  = new Pickaxe(51, 32, 25, { pvp: 5, pve: 2 }, 5, { r: [[6, 60], [5, 90], [49, 30], [8, 1]], w: 1, f: 0, time: .025 });
    static AMETHYST_SPEAR = new Tool(52, 73, 35, { pvp: 18, pve: 6 }, { r: [[49, 50], [6, 100], [5, 120], [40, 1]], w: 1, f: 0, time: .025 });
    static HAMMER_STONE = new Tool(53, 38, 25, { pvp: 2, pve: 20 }, { r: [[3, 120], [2, 60]], w: 1, f: 0, time: 1 / 15 }, 1);
    static HAMMER_GOLD = new Tool(54, 39, 25, { pvp: 3, pve: 30 }, { r: [[3, 160], [2, 120], [5, 80], [53, 1]], w: 1, f: 0, time: .05 }, 2);
    static HAMMER_DIAMOND = new Tool(55, 40, 25, { pvp: 4, pve: 40 }, { r: [[6, 80], [2, 200], [5, 150], [54, 1]], w: 1, f: 0, time: 1 / 30 }, 3);
    static HAMMER_AMETHYST = new Tool(56, 41, 25, { pvp: 5, pve: 50 }, { r: [[6, 160], [49, 60], [5, 250], [55, 1]], w: 1, f: 0, time: .025 }, 4);

    static RABBIT = new Entityitem(128, 60, 0, 20, 1, 60, EntityType.MOB, {physcial:false,speed:300}, null);
    static WOLF = new Entityitem(129, 61, 0, 32, 1, 300, EntityType.MOB, {physcial:false,offensive:true,dmg:40,speed:250}, null);
    static SPIDER = new Entityitem(130, 62, 0, 30, 1, 120, EntityType.MOB, {physcial:false,offensive:true,dmg:20,speed:150}, null);
    static FOX = new Entityitem(131, 63, 0, 30, 1, 300, EntityType.MOB, {physcial:false,offensive:true,dmg:25,speed:230}, null);
    static BEAR = new Entityitem(132, 63, 0, 35, 1, 900, EntityType.MOB, {physcial:false,offensive:true,dmg:60,speed:190}, null);
    static DRAGON = new Entityitem(133, 64, 0, 50, 1, 1500, EntityType.MOB, {physcial:false,offensive:true,dmg:90,speed:250}, null);

    static Fruit = new Entityitem(134, 61, 0, 10, 1, 300, EntityType.MINE, {physcial:false}, null);

    //static AMETHYST_HELMET = new Clothes(81, { pvp: 6, pve: 23 }, 0, null);
    static find(f) {
        for (let idx in this) {
            if (f(this[idx])) {return this[idx]};
        }
        return undefined;
    }
}