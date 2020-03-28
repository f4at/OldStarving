export default class Item {
    id: number;
    recipe: Recipe;

    constructor(id: number) {
        this.id = id;
    }
}

export class ItemStack {
    item: Item;
    amount: number;

    constructor(item: Item, amount: number = 1) {
        this.item = item;
        this.amount = amount;
    }
}

export class Recipe {
    ingredients: ItemStack[];
    requireWorkbench: boolean;
    requireFire: boolean;
    time: number;
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

    constructor(id: number, range: number, range2: number, damage: Damage, tier: number = 0) {
        super(id);
        this.range = range;
        this.range2 = range2;
        this.damage = damage;
        this.tier = 0;
    }
}

export class Pickaxe extends Tool {
    miningTier: number;

    constructor(id: number, range: number, range2: number, damage: Damage, miningTier: number) {
        super(id, range, range2, damage);
        this.miningTier = miningTier;
    }
}

export class Clothes extends Item {
    coldProtection: number;
    damageProtection: Damage;

    constructor(id: number, damageProtection: Damage, coldProtection: number) {
        super(id);
        this.damageProtection = damageProtection;
        this.coldProtection = coldProtection;
    }
}

export enum EntityType {
    WALL = 0,
    DOOR = 1,
    SPIKE = 2,
    FIRE = 3,
    WORKBENCH = 4,
    HARVESTABLE = 5,
    MOB = 6,
    CHEST = 7,
    PLAYER
}

export class EntityItem extends Item { //use it to create entities later :3
    sid: number;
    numberOfSides: number; // special cases: 0 for circle,  1 for line,  2 for 2 parrallel lines eg: '| |'
    radius: number; //distance between center and middle of sides.
    XtoYfactor: number; //important to make rectanges(instead of squares only) + other shapes
    hp: number; //
    type: EntityType;
    special: any;

    constructor(id: number, sid: number, numberOfSides: number = -1, radius: number, XtoYfactor: number, hp: number, type: EntityType, special: any) {
        super(id);
        this.sid = sid,
        this.numberOfSides = numberOfSides;
        this.radius = radius;
        this.XtoYfactor = XtoYfactor;
        this.hp = hp;
        this.type = type;
        this.special = special;
    }
}

export class Usable extends Item {
    food: number;
    temp: number;
    hp: number;
    regeneration: number;

    constructor(id: number, food: number, temp: number, hp: number, regeneration: number) {
        super(id);
        this.food = food;
        this.temp = temp;
        this.hp = hp;
        this.regeneration = regeneration;
    }
}

export class Items {
    static STONE_SWORD = new Tool(0, 39, 25, { pvp: 19, pve: 6 });
    static AIR = new Clothes(0, { pvp: 0, pve: 0 }, 0); //can't find it using .find bc 2nd (thats good), needs to share stone_sword id :/
    static PICK_STONE = new Pickaxe(1, 29, 25, { pvp: 1, pve: 0 }, 2);
    static STONE = new Item(2);
    static WOOD = new Item(3);
    static PLANT = new Usable(4, 5, 0, 0, 1);
    static GOLD = new Item(5);
    static DIAMOND = new Item(6);
    static PICK_GOLD = new Pickaxe(7, 30, 25, { pvp: 3, pve: 1 }, 3);
    static PICK_DIAMOND = new Pickaxe(8, 31, 25, { pvp: 4, pve: 1 }, 4);
    static SWORD_GOLD = new Tool(9, 40, 25, { pvp: 22, pve: 7 });
    static SWORD_DIAMOND = new Tool(10, 41, 25, { pvp: 24, pve: 8 });
    static FIRE = new EntityItem(11, 1, 0, 30, 1, 500, EntityType.FIRE, { physical: false, Lifespan: 2 });
    static WORKBENCH = new EntityItem(12, 2, 4, 50, 1.25, 500, EntityType.WORKBENCH, { physical: true, Lifespan: 30 });
    static SEED = new EntityItem(13, 3, 0, 20, 1, 500, EntityType.HARVESTABLE, { physical: false });
    static HAND = new Pickaxe(14, 40, 25, { pvp: 5, pve: 1 }, 0);
    static PICK_WOOD = new Pickaxe(15, 28, 25, { pvp: 5, pve: 1 }, 1);
    static WOOD_WALL = new EntityItem(16, 4, 0, 50, 1, 1000, EntityType.WALL, { physical: true, Lifespan: 30, LifeUpdate: 2 });
    static WOOD_SPIKE = new EntityItem(17, 5, 0, 50, 1, 150, EntityType.SPIKE, { physical: true, Lifespan: 15, LifeUpdate: 2, hitdmg: 2, dmg: 5 });
    static MEAT = new Usable(18, 25, 0, -10, -5);
    static COOKED_MEAT = new Usable(19, 20, 0, 0, 5);
    static BIG_FIRE = new EntityItem(20, 6, 0, 35, 1, 700, EntityType.FIRE, { physical: false, Lifespan: 5, dmg: 20 });
    static BANDAGE = new Usable(21, 25, 0, -10, -5);
    static CORD = new Item(22);
    static STONE_WALL = new EntityItem(23, 7, 7, 50, 1, 1500, EntityType.WALL, { physical: true, tier: 1, Lifespan: 120, LifeUpdate: 5 });
    static GOLD_WALL = new EntityItem(24, 8, 7, 50, 1, 2000, EntityType.WALL, { physical: true, tier: 2, Lifespan: 720, LifeUpdate: 30 });
    static DIAMOND_WALL = new EntityItem(25, 9, 7, 50, 1, 2500, EntityType.WALL, { physical: true, tier: 3 });
    static WOOD_DOOR = new EntityItem(26, 10, 0, 50, 1, 3500, EntityType.DOOR, { physical: true, Lifespan: 30, LifeUpdate: 2 });
    static CHEST = new EntityItem(27, 11, 4, 25, 1.3, 300, EntityType.CHEST, { physical: true });
    static STONE_SPIKE = new EntityItem(28, 12, 7, 50, 1, 300, EntityType.SPIKE, { physical: true, tier: 1, Lifespan: 60, LifeUpdate: 5, hitdmg: 4, dmg: 10 });
    static GOLD_SPIKE = new EntityItem(29, 13, 7, 50, 1, 600, EntityType.SPIKE, { physical: true, tier: 2, Lifespan: 360, LifeUpdate: 30, hitdmg: 8, dmg: 20 });
    static DIAMOND_SPIKE = new EntityItem(30, 14, 7, 50, 1, 900, EntityType.SPIKE, { physical: true, tier: 3, hitdmg: 4, dmg: 30 });
    static STONE_DOOR = new EntityItem(31, 15, 7, 50, 1, 1500, EntityType.DOOR, { physical: true, tier: 1, Lifespan: 120, LifeUpdate: 5 });
    static GOLD_DOOR = new EntityItem(32, 16, 7, 50, 1, 2000, EntityType.DOOR, { physical: true, tier: 2, Lifespan: 720, LifeUpdate: 30 });
    static DIAMOND_DOOR = new EntityItem(33, 17, 7, 50, 1, 2500, EntityType.DOOR, { physical: true, tier: 3 });
    static FUR = new Item(34);
    static FUR_WOLF = new Item(35);
    static EARMUFFS = new Clothes(36, { pvp: 0, pve: 1 }, 2);
    static COAT = new Clothes(37, { pvp: 1, pve: 2 }, 2);
    static STONE_SPEAR = new Tool(38, 70, 34, { pvp: 14, pve: 4 });
    static GOLD_SPEAR = new Tool(39, 71, 35, { pvp: 15, pve: 5 });
    static DIAMOND_SPEAR = new Tool(40, 72, 36, { pvp: 17, pve: 5 });
    static FURNACE = new EntityItem(41, 18, 0, 60, 1, 700, EntityType.FIRE, { physical: true });
    static EXPLORER_HAT = new Clothes(42, { pvp: 0, pve: 4 }, 0);
    static STONE_HELMET = new Clothes(43, { pvp: 2, pve: 8 }, 0);
    static GOLD_HELMET = new Clothes(44, { pvp: 4, pve: 13 }, 0);
    static DIAMOND_HELMET = new Clothes(45, { pvp: 5, pve: 19 }, 0);
    static BOOK = new Tool(46, 75, 25, { pvp: 3, pve: 1 });
    static PAPER = new Item(47);
    static BAG = new Clothes(48, { pvp: 0, pve: 0 }, 0);
    static AMETHYST = new Item(49);
    static SWORD_AMETHYST = new Tool(50, 42, 25, { pvp: 27, pve: 9 });
    static PICK_AMETHYST = new Pickaxe(51, 32, 25, { pvp: 5, pve: 2 }, 5);
    static AMETHYST_SPEAR = new Tool(52, 73, 35, { pvp: 18, pve: 6 });
    static HAMMER_STONE = new Tool(53, 38, 25, { pvp: 2, pve: 20 }, 1);
    static HAMMER_GOLD = new Tool(54, 39, 25, { pvp: 3, pve: 30 }, 2);
    static HAMMER_DIAMOND = new Tool(55, 40, 25, { pvp: 4, pve: 40 }, 3);
    static HAMMER_AMETHYST = new Tool(56, 41, 25, { pvp: 5, pve: 50 }, 4);
    // TODO zero check collisions
    static AMETHYST_WALL = new EntityItem(57, 9, 7, 50, 1, 3500, EntityType.WALL, { physical: true, tier: 4 });
    static AMETHYST_SPIKE = new EntityItem(58, 14, 7, 50, 1, 2400, EntityType.SPIKE, { physical: true, tier: 4, hitdmg: 4, dmg: 50 });
    static AMETHYST_DOOR = new EntityItem(59, 17, 7, 50, 1, 2500, EntityType.DOOR, { physical: true, tier: 4 });
    static CAP_SCARF = new Clothes(60, { pvp: 0, pve: 0 }, 3);
    static FUR_WINTER = new Item(61);
    static BLUE_CORD = new Item(62);

    static RABBIT = new EntityItem(128, 60, 0, 20, 1, 60, EntityType.MOB, { physical: false, speed: 300 });
    static WOLF = new EntityItem(129, 61, 0, 30, 1, 300, EntityType.MOB, { physical: false, offensive: true, dmg: 40, speed: 250 });
    static SPIDER = new EntityItem(130, 62, 0, 32, 1, 120, EntityType.MOB, { physical: false, offensive: true, dmg: 20, speed: 150 });
    static FOX = new EntityItem(131, 63, 0, 30, 1, 300, EntityType.MOB, { physical: false, offensive: true, dmg: 25, speed: 230 });
    static BEAR = new EntityItem(132, 63, 0, 35, 1, 900, EntityType.MOB, { physical: false, offensive: true, dmg: 60, speed: 190 });
    static DRAGON = new EntityItem(133, 64, 0, 50, 1, 1500, EntityType.MOB, { physical: false, offensive: true, dmg: 90, speed: 250 });

    static FRUIT = new EntityItem(134, 61, 0, 10, 1, 1, EntityType.HARVESTABLE, { physical: false });

    static AMETHYST_HELMET = new Clothes(81, { pvp: 6, pve: 23 }, 0);

    static ITEMS: Map<string, Item> = new Map();

    static get(key: number | string): Item {
        if (typeof key === "string")
            return this.ITEMS.get(key);
        return Array.from(this.ITEMS.values()).find(item => item.id === key);
    }
}

for (let name in Items) {
    Items.ITEMS.set(name, Items[name]);
}

const RECIPES = [{ r: [[3, 30], [2, 5]], w: 0, f: 0, result: Items.FIRE, time: .1 }, { r: [[3, 40], [2, 20]], w: 0, f: 0, result: Items.WORKBENCH, time: 1 / 15 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, result: Items.STONE_SWORD, time: 1 / 15 }, { r: [[15, 1], [3, 60], [2, 20]], w: 1, f: 0, result: Items.PICK_STONE, time: 1 / 15 }, { r: [[4, 3], [3, 20]], w: 0, f: 1, result: Items.SEED, time: .1 }, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, result: Items.PICK_GOLD, time: .05 }, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, result: Items.PICK_DIAMOND, time: 1 / 30 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, result: Items.SWORD_GOLD, time: .05 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, result: Items.SWORD_DIAMOND, time: 1 / 30 }, { r: [[3, 15]], w: 0, f: 0, result: Items.PICK_WOOD, time: .2 }, { r: [[3, 20]], w: 1, f: 0, result: Items.WOOD_WALL, time: .2 }, { r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, result: Items.STONE_SPIKE, time: .05 }, { r: [[18, 1]], w: 0, f: 1, result: Items.COOKED_MEAT, time: .1 }, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, result: Items.BIG_FIRE, time: .1 }, { r: [[22, 3]], w: 1, f: 0, result: Items.BANDAGE, time: .2 }, { r: [[16, 1], [2, 20]], w: 1, f: 0, result: Items.STONE_WALL, time: .2 }, { r: [[23, 1], [5, 20]], w: 1, f: 0, result: Items.GOLD_WALL, time: .2 }, { r: [[24, 1], [6, 20]], w: 1, f: 0, result: Items.DIAMOND_WALL, time: .2 }, { r: [[3, 60]], w: 1, f: 0, result: Items.WOOD_DOOR, time: .125 }, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, result: Items.CHEST, time: .05 }, { r: [[23, 1], [2, 35]], w: 1, f: 0, result: Items.STONE_SPIKE, time: .05 }, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, result: Items.GOLD_SPIKE, time: .05 }, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, result: Items.DIAMOND_SPIKE, time: .05 }, { r: [[26, 1], [2, 60]], w: 1, f: 0, result: Items.STONE_DOOR, time: .125 }, { r: [[31, 1], [5, 60]], w: 1, f: 0, result: Items.GOLD_DOOR, time: .125 }, { r: [[32, 1], [6, 60]], w: 1, f: 0, result: Items.DIAMOND_DOOR, time: .125 }, { r: [[34, 8], [22, 4]], w: 1, f: 0, result: Items.EARMUFFS, time: 1 / 15 }, { r: [[36, 1], [34, 5], [35, 10], [22, 6]], w: 1, f: 0, result: Items.COAT, time: .04 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, result: Items.STONE_SPEAR, time: 1 / 15 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, result: Items.GOLD_SPEAR, time: .05 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, result: Items.DIAMOND_SPEAR, time: 1 / 30 }, { r: [[3, 150], [2, 100], [5, 50]], w: 1, f: 0, result: Items.FURNACE, time: .05 }, { r: [[47, 3], [34, 2]], w: 1, f: 0, result: Items.EXPLORER_HAT, time: 1 / 15 }, { r: [[2, 150], [3, 100]], w: 1, f: 0, result: Items.STONE_HELMET, time: .05 }, { r: [[2, 180], [3, 120], [5, 100], [43, 1]], w: 1, f: 0, result: Items.GOLD_HELMET, time: .025 }, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, result: Items.DIAMOND_HELMET, time: 1 / 60 }, { r: [[47, 5], [22, 5], [35, 5]], w: 1, f: 0, result: Items.BOOK, time: 1 / 30 }, { r: [[3, 30]], w: 0, f: 1, result: Items.PAPER, time: 1 / 3 }, { r: [[22, 10], [35, 5]], w: 1, f: 0, result: Items.BAG, time: .05 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, result: Items.SWORD_AMETHYST, time: .025 }, { r: [[6, 60], [5, 90], [49, 30], [8, 1]], w: 1, f: 0, result: Items.PICK_AMETHYST, time: .025 }, { r: [[49, 50], [6, 100], [5, 120], [40, 1]], w: 1, f: 0, result: Items.AMETHYST_SPEAR, time: .025 }, { r: [[3, 120], [2, 60]], w: 1, f: 0, result: Items.HAMMER_STONE, time: 1 / 15 }, { r: [[3, 160], [2, 120], [5, 80], [53, 1]], w: 1, f: 0, result: Items.HAMMER_GOLD, time: .05 }, { r: [[6, 80], [2, 200], [5, 150], [54, 1]], w: 1, f: 0, result: Items.HAMMER_DIAMOND, time: 1 / 30 }, { r: [[6, 160], [49, 60], [5, 250], [55, 1]], w: 1, f: 0, result: Items.HAMMER_AMETHYST, time: .025 }, { r: [[25, 1], [49, 20]], w: 1, f: 0, result: Items.AMETHYST_WALL, time: .2 }, { r: [[57, 1], [49, 20], [2, 15]], w: 1, f: 0, result: Items.AMETHYST_SPIKE, time: .05 }, { r: [[33, 1], [49, 60]], w: 1, f: 0, result: Items.AMETHYST_DOOR, time: .125 }, { r: [[37, 1], [61, 20], [62, 10]], w: 1, f: 0, result: Items.CAP_SCARF, time: 1 / 60 }, { r: [[6, 1], [22, 1]], w: 1, f: 0, result: Items.BLUE_CORD, time: 1 / 3 }];
for (const recipe of RECIPES) {
    let parsedRecipe: Recipe = { time: recipe.time, requireFire: recipe.f === 1, requireWorkbench: recipe.w === 1, ingredients: recipe.r.map(ingredient => ({ item: Items.get(ingredient[0]), amount: ingredient[1] })) };
    recipe.result.recipe = parsedRecipe;
}