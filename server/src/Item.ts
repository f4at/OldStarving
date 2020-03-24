export default class Item {
    id: number;
    recipe : any;
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

    constructor(id: number, range: number, range2: number, damage: Damage, recipe: any) {
        super(id, recipe);
        this.range = range;
        this.range2 = range2;
        this.damage = damage;
    }
}

export class Pickaxe extends Tool {
    tier: number;

    constructor(id: number, range: number, range2: number, damage: Damage, tier: number, recipe: any) {
        super(id, range, range2, damage, recipe);
        this.tier = tier;
    }
}

export class Clothes extends Item {
    coldProtection: number;
    damageProtection: Damage;

    constructor(id: number, damageProtection: Damage, coldProtection: number, recipe: any) {
        super(id, recipe);
        this.damageProtection = damageProtection;
        this.coldProtection = coldProtection;
    }
}

export enum EntityType {
    WALL = 0,
    DOOR = 1,
    SPIKE = 2,
    FIRE = 3,
    WATER = 4,
    MINE = 5,
    MOB = 6
}

export class Entity extends Item { //use it to create entities later :3
    numberOfSides: number; // -1 for circles
    raduis: number; //distance between center and middle of sides.
    hp: number; //
    type: EntityType;
    special: {};
    onhit: {};
    physical: {};
    movement: {};

    constructor(id: number, numberOfSides: number = -1, raduis: number, hp:number, type:EntityType, special:any, recipe: any) {
        super(id, recipe);
        this.numberOfSides = numberOfSides;
        this.raduis = raduis;
        this.hp = hp;
        this.type = type;
        this.special = special;
        /*
        this.onhit = special.onhit ? special.onhit : (d,p) => {};
        this.physical = special.physical ? special.physical : false;
        this.damage = special.damage ? special.damage : () => {};
        this.movement = special.movement ? special.movement : () => {};
        */
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
    //recipes = [{ r: [[3, 30], [2, 5]], w: 0, f: 0, id: this.items.FIRE, time: .1 }, { r: [[3, 40], [2, 20]], w: 0, f: 0, id: this.items.WORKBENCH, time: 1 / 15 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, id: this.items.SWORD, time: 1 / 15 }, , { r: [[4, 3], [3, 20]], w: 0, f: 1, id: this.items.SEED, time: .1 }, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, id: this.items.PICK_GOLD, time: .05 }, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, id: this.items.PICK_DIAMOND, time: 1 / 30 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, id: this.items.SWORD_GOLD, time: .05 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, id: this.items.SWORD_DIAMOND, time: 1 / 30 }, { r: [[3, 15]], w: 0, f: 0, id: this.items.PICK_WOOD, time: .2 }, { r: [[3, 20]], w: 1, f: 0, id: this.items.WALL, time: .2 }, { r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, id: this.items.SPIKE, time: .05 }, { r: [[18, 1]], w: 0, f: 1, id: this.items.COOKED_MEAT, time: .1 }, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, id: this.items.BIG_FIRE, time: .1 }, { r: [[22, 3]], w: 1, f: 0, id: this.items.BANDAGE, time: .2 }, { r: [[16, 1], [2, 20]], w: 1, f: 0, id: this.items.STONE_WALL, time: .2 }, { r: [[23, 1], [5, 20]], w: 1, f: 0, id: this.items.GOLD_WALL, time: .2 }, { r: [[24, 1], [6, 20]], w: 1, f: 0, id: this.items.DIAMOND_WALL, time: .2 }, { r: [[3, 60]], w: 1, f: 0, id: this.items.WOOD_DOOR, time: .125 }, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, id: this.items.CHEST, time: .05 }, { r: [[23, 1], [2, 35]], w: 1, f: 0, id: this.items.STONE_SPIKE, time: .05 }, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, id: this.items.GOLD_SPIKE, time: .05 }, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, id: this.items.DIAMOND_SPIKE, time: .05 }, { r: [[26, 1], [2, 60]], w: 1, f: 0, id: this.items.STONE_DOOR, time: .125 }, { r: [[31, 1], [5, 60]], w: 1, f: 0, id: this.items.GOLD_DOOR, time: .125 }, { r: [[32, 1], [6, 60]], w: 1, f: 0, id: this.items.DIAMOND_DOOR, time: .125 }, { r: [[34, 8], [22, 4]], w: 1, f: 0, id: this.items.EARMUFFS, time: 1 / 15 }, { r: [[36, 1], [34, 5], [35, 10], [22, 6]], w: 1, f: 0, id: this.items.COAT, time: .04 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, id: this.items.SPEAR, time: 1 / 15 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, id: this.items.GOLD_SPEAR, time: .05 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, id: this.items.DIAMOND_SPEAR, time: 1 / 30 }, { r: [[3, 150], [2, 100], [5, 50]], w: 1, f: 0, id: this.items.FURNACE, time: .05 }, { r: [[47, 3], [34, 2]], w: 1, f: 0, id: this.items.EXPLORER_HAT, time: 1 / 15 }, { r: [[2, 150], [3, 100]], w: 1, f: 0, id: this.items.STONE_HELMET, time: .05 }, { r: [[2, 180], [3, 120], [5, 100], [43, 1]], w: 1, f: 0, id: this.items.GOLD_HELMET, time: .025 }, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, id: this.items.DIAMOND_HELMET, time: 1 / 60 }, { r: [[47, 5], [22, 5], [35, 5]], w: 1, f: 0, id: this.items.BOOK, time: 1 / 30 }, { r: [[3, 30]], w: 0, f: 1, id: this.items.PAPER, time: 1 / 3 }, { r: [[22, 10], [35, 5]], w: 1, f: 0, id: this.items.BAG, time: .05 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, id: this.items.SWORD_AMETHYST, time: .025 }, { r: [[6, 60], [5, 90], [49, 30], [8, 1]], w: 1, f: 0, id: this.items.PICK_AMETHYST, time: .025 }, { r: [[49, 50], [6, 100], [5, 120], [40, 1]], w: 1, f: 0, id: this.items.AMETHYST_SPEAR, time: .025 }, { r: [[3, 120], [2, 60]], w: 1, f: 0, id: this.items.HAMMER, time: 1 / 15 }, { r: [[3, 160], [2, 120], [5, 80], [53, 1]], w: 1, f: 0, id: this.items.HAMMER_GOLD, time: .05 }, { r: [[6, 80], [2, 200], [5, 150], [54, 1]], w: 1, f: 0, id: this.items.HAMMER_DIAMOND, time: 1 / 30 }, { r: [[6, 160], [49, 60], [5, 250], [55, 1]], w: 1, f: 0, id: this.items.HAMMER_AMETHYST, time: .025 }, { r: [[25, 1], [49, 20]], w: 1, f: 0, id: this.items.AMETHYST_WALL, time: .2 }, { r: [[57, 1], [49, 20], [2, 15]], w: 1, f: 0, id: this.items.AMETHYST_SPIKE, time: .05 }, { r: [[33, 1], [49, 60]], w: 1, f: 0, id: this.items.AMETHYST_DOOR, time: .125 }, { r: [[37, 1], [61, 20], [62, 10]], w: 1, f: 0, id: this.items.CAP_SCARF, time: 1 / 60 }, { r: [[6, 1], [22, 1]], w: 1, f: 0, id: this.items.BLUE_CORD, time: 1 / 3 }];
    static STONE_SWORD = new Tool(0, 75, 25, { pvp: 19, pve: 6 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, time: 1 / 15 });
    static PICK_STONE = new Pickaxe(1, 55, 25, {pvp: 1, pve: 0}, 2, { r: [[15, 1], [3, 60], [2, 20]], w: 1, f: 0, time: 1 / 15 });
    static STONE = new Item(2, null);
    static WOOD = new Item(3, null);
    static PLANT = new Usable(4, 5, 0, 0, 1, null);
    static GOLD = new Item(5, null);
    static DIAMOND = new Item(6, null);
    static PICK_GOLD = new Pickaxe(7, 55, 25, { pvp: 3, pve: 1 }, 3, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, time: .05 });
    static PICK_DIAMOND = new Pickaxe(8, 55, 25, { pvp: 4, pve: 1 }, 4, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, time: 1 / 30 });
    static SWORD_GOLD = new Tool(9, 75, 25, { pvp: 22, pve: 7 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, time: .05 });
    static SWORD_DIAMOND = new Tool(10, 75, 25, { pvp: 24, pve: 8 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, time: 1 / 30 });
    static FIRE = new Item(11, { r: [[3, 30], [2, 5]], w: 0, f: 0, time: .1 });
    static WORKEBENCH = new Item(12 ,{ r: [[3, 40], [2, 20]], w: 0, f: 0, time: 1 / 15 });
    static SEED = new Item(13,{ r: [[4, 3], [3, 20]], w: 0, f: 1, time: .1 });
    static HAND = new Pickaxe(14, 40, 25, { pvp: 5, pve: 1 }, 0, null);
    static PICK_WOOD = new Pickaxe(15, 50, 25, { pvp: 5, pve: 1 }, 1, { r: [[3, 15]], w: 0, f: 0, time: .2 });
    static WOOD_WALL = new Item(16, { r: [[3, 20]], w: 1, f: 0, time: .2 });
    static WOOD_SPIKE = new Item(17, { r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, time: .05 });
    static MEAT = new Usable(18, 25, 0, -10, -5, null);
    static COOKED_MEAT = new Usable(19, 20, 0, 0, 5, null);
    static BIG_FIRE = new Item(20, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, time: .1 });
    static BANDAGE = new Usable(21, 25, 0, -10, -5, { r: [[22, 3]], w: 1, f: 0, time: .2 });
    static CORD = new Item(22, null);
    static STONE_WALL = new Item(23, { r: [[16, 1], [2, 20]], w: 1, f: 0, time: .2 });
    static GOLD_WALL = new Item(24, { r: [[23, 1], [5, 20]], w: 1, f: 0, time: .2 });
    static DIAMOND_WALL = new Item(25, { r: [[24, 1], [6, 20]], w: 1, f: 0, time: .2 });
    static WOOD_DOOR = new Item(26, { r: [[3, 60]], w: 1, f: 0, time: .125 });
    static CHEST = new Item(27, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, time: .05 });
    static STONE_SPIKE = new Item(28, { r: [[23, 1], [2, 35]], w: 1, f: 0, time: .05 });
    static GOLD_SPIKE = new Item(29, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, time: .05 });
    static DIAMOND_SPIKE = new Item(30, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, time: .05 });
    static STONE_DOOR = new Item(31, { r: [[26, 1], [2, 60]], w: 1, f: 0, time: .125 });
    static GOLD_DOOR = new Item(32, { r: [[31, 1], [5, 60]], w: 1, f: 0, time: .125 });
    static DIAMOND_DOOR = new Item(33, { r: [[32, 1], [6, 60]], w: 1, f: 0, time: .125 });
    static FUR = new Item(34, null);
    static FUR_WOLF = new Item(35, null);
    static EARMUFFS = new Clothes(36, {pvp:0,pve:1}, 2, { r: [[34, 8], [22, 4]], w: 1, f: 0, time: 1 / 15 });
    static COAT = new Clothes(37, {pvp:1,pve:2}, 2, { r: [[36, 1], [34, 5], [35, 10], [22, 6]], w: 1, f: 0, time: .04 });
    static STONE_SPEAR = new Tool(38, 100, 35, { pvp: 14, pve: 4 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, time: 1 / 15 });
    static GOLD_SPEAR = new Tool(39, 100, 35, { pvp: 14, pve: 4 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, time: .05 });
    static DIAMOND_SPEAR = new Tool(40, 100, 35, { pvp: 14, pve: 4 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, time: 1 / 30 });

    static DIAMOND_HELMET = new Clothes(45, { pvp: 5, pve: 19 }, 0, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, time: 1 / 60 });
    static AMETHYST_SWORD = new Tool(50, 80, 25, { pvp: 30, pve: 10 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, time: .025 });
    
    static AMETHYST_HELMET = new Clothes(81, { pvp: 6, pve: 23 }, 0, null);
    static find(f) {
        for (let idx in this) {
            if (f(this[idx])) {return this[idx]};
        }
        return undefined;
    }
}
