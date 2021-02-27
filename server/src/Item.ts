import { EntityType } from "./Entity";

export default class Item {
    name: string;
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
    score: number;
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
        this.tier = tier;
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

export class EntityItem extends Item {
    entityType: EntityType;

    constructor(id: number) {
        super(id);
    }
}

export class Items {
    static SWORD_STONE = new Tool(0, 40, 25, { pvp: 19, pve: 6 });
    static AIR = new Clothes(0, { pvp: 0, pve: 0 }, 1);
    static PICK_STONE = new Pickaxe(1, 41, 10, { pvp: 1, pve: 0 }, 2);
    static STONE = new Item(2);
    static WOOD = new Item(3);
    static PLANT = new Usable(4, 10, 0, 0, 1);
    static GOLD = new Item(5);
    static DIAMOND = new Item(6);
    static PICK_GOLD = new Pickaxe(7, 42, 10, { pvp: 3, pve: 1 }, 3);
    static PICK_DIAMOND = new Pickaxe(8, 43, 10, { pvp: 4, pve: 1 }, 4);
    static SWORD_GOLD = new Tool(9, 40, 25, { pvp: 22, pve: 7 });
    static SWORD_DIAMOND = new Tool(10, 40, 25, { pvp: 24, pve: 8 });
    static FIRE = new EntityItem(11);
    static WORKBENCH = new EntityItem(12);
    static SEED = new EntityItem(13);
    static HAND = new Pickaxe(14, 22, 10, { pvp: 5, pve: 1 }, 0);
    static PICK_WOOD = new Pickaxe(15, 40, 9, { pvp: 5, pve: 1 }, 1);
    static WOOD_WALL = new EntityItem(16);
    static WOOD_SPIKE = new EntityItem(17);
    static MEAT = new Usable(18, 25, 0, -30, 0);
    static COOKED_MEAT = new Usable(19, 50, 0, 0, 0);
    static BIG_FIRE = new EntityItem(20);
    static BANDAGE = new Usable(21, 0, 0, 2, 5);
    static CORD = new Item(22);
    static STONE_WALL = new EntityItem(23);
    static GOLD_WALL = new EntityItem(24);
    static DIAMOND_WALL = new EntityItem(25);
    static WOOD_DOOR = new EntityItem(26);
    static CHEST = new EntityItem(27);
    static STONE_SPIKE = new EntityItem(28);
    static GOLD_SPIKE = new EntityItem(29);
    static DIAMOND_SPIKE = new EntityItem(30);
    static STONE_DOOR = new EntityItem(31);
    static GOLD_DOOR = new EntityItem(32);
    static DIAMOND_DOOR = new EntityItem(33);
    static FUR = new Item(34);
    static FUR_WOLF = new Item(35);
    static EARMUFFS = new Clothes(36, { pvp: 0, pve: 1 }, 0.7);
    static COAT = new Clothes(37, { pvp: 1, pve: 2 }, 0.4);
    static STONE_SPEAR = new Tool(38, 54, 34, { pvp: 14, pve: 4 });
    static GOLD_SPEAR = new Tool(39, 54, 35, { pvp: 15, pve: 5 });
    static DIAMOND_SPEAR = new Tool(40, 55, 35, { pvp: 17, pve: 5 });
    static FURNACE = new EntityItem(41);
    static EXPLORER_HAT = new Clothes(42, { pvp: 0, pve: 4 }, 1);
    static STONE_HELMET = new Clothes(43, { pvp: 2, pve: 7 }, 1);
    static GOLD_HELMET = new Clothes(44, { pvp: 4, pve: 12 }, 1);
    static DIAMOND_HELMET = new Clothes(45, { pvp: 5, pve: 16 }, 1);
    static BOOK = new Tool(46, 25, 20, { pvp: 3, pve: 1 });
    static PAPER = new Item(47);
    static BAG = new Clothes(48, { pvp: 0, pve: 0 }, 1);
    static AMETHYST = new Item(49);
    static SWORD_AMETHYST = new Tool(50, 42, 25, { pvp: 27, pve: 9 });
    static PICK_AMETHYST = new Pickaxe(51, 44, 10, { pvp: 5, pve: 2 }, 5);
    static AMETHYST_SPEAR = new Tool(52, 55, 36, { pvp: 18, pve: 6 });
    static HAMMER_STONE = new Tool(53, 33, 30, { pvp: 2, pve: 20 }, 1);
    static HAMMER_GOLD = new Tool(54, 34, 30, { pvp: 3, pve: 30 }, 2);
    static HAMMER_DIAMOND = new Tool(55, 35, 30, { pvp: 4, pve: 40 }, 3);
    static HAMMER_AMETHYST = new Tool(56, 36, 30, { pvp: 5, pve: 50 }, 4);
    static AMETHYST_WALL = new EntityItem(57);
    static AMETHYST_SPIKE = new EntityItem(58);
    static AMETHYST_DOOR = new EntityItem(59);
    static CAP_SCARF = new Clothes(60, { pvp: 0, pve: 0 }, 0.2);
    static FUR_WINTER = new Item(61);
    static BLUE_CORD = new Item(62);

    static AMETHYST_HELMET = new Clothes(63, { pvp: 6, pve: 20 }, 1);

    static ITEMS: Map<string, Item> = new Map();

    static get(key: number | string): Item {
        if (typeof key === "string")
            return this.ITEMS.get(key);
        return Array.from(this.ITEMS.values()).find(item => item.id === key);
    }
}


for (let name in Items) {
    const item = Items[name];

    if (item) {
        item.name = name;
        Items.ITEMS.set(name, item);
    }
}

const RECIPES = [{ r: [[5, 200], [49, 80], [6, 120], [45, 1]], w: 1, f: 0, result: Items.AMETHYST_HELMET, time: 1 / 90, score: 2000 }, { r: [[3, 30], [2, 5]], w: 0, f: 0, result: Items.FIRE, time: .1, score: 15 }, { r: [[3, 40], [2, 20]], w: 0, f: 0, result: Items.WORKBENCH, time: 1 / 15, score: 30 }, { r: [[3, 60], [2, 30]], w: 1, f: 0, result: Items.SWORD_STONE, time: 1 / 15, score: 60 }, { r: [[15, 1], [3, 60], [2, 20]], w: 1, f: 0, result: Items.PICK_STONE, time: 1 / 15, score: 50 }, { r: [[4, 3]], w: 0, f: 1, result: Items.SEED, time: .1, score: 10 }, { r: [[3, 60], [5, 30], [2, 40], [1, 1]], w: 1, f: 0, result: Items.PICK_GOLD, time: .05, score: 100 }, { r: [[6, 30], [5, 60], [2, 100], [7, 1]], w: 1, f: 0, result: Items.PICK_DIAMOND, time: 1 / 30, score: 200 }, { r: [[3, 80], [5, 50], [2, 60], [0, 1]], w: 1, f: 0, result: Items.SWORD_GOLD, time: .05, score: 120 }, { r: [[6, 50], [5, 80], [2, 100], [9, 1]], w: 1, f: 0, result: Items.SWORD_DIAMOND, time: 1 / 30, sword: 240 }, { r: [[3, 15]], w: 0, f: 0, result: Items.PICK_WOOD, time: .2, score: 10 }, { r: [[3, 20]], w: 1, f: 0, result: Items.WOOD_WALL, time: .2, score: 12 }, { r: [[16, 1], [3, 20], [2, 15]], w: 1, f: 0, result: Items.WOOD_SPIKE, time: .05, score: 30 }, { r: [[18, 1]], w: 0, f: 1, result: Items.COOKED_MEAT, time: .1, score: 30 }, { r: [[11, 1], [3, 40], [2, 10]], w: 0, f: 0, result: Items.BIG_FIRE, time: .1, score: 30 }, { r: [[22, 3]], w: 1, f: 0, result: Items.BANDAGE, time: .2, score: 80 }, { r: [[16, 1], [2, 20]], w: 1, f: 0, result: Items.STONE_WALL, time: .2, score: 30 }, { r: [[23, 1], [5, 20]], w: 1, f: 0, result: Items.GOLD_WALL, time: .2, score: 50 }, { r: [[24, 1], [6, 20]], w: 1, f: 0, result: Items.DIAMOND_WALL, time: .2, score: 100 }, { r: [[3, 60]], w: 1, f: 0, result: Items.WOOD_DOOR, time: .125, score: 50 }, { r: [[3, 60], [2, 20], [5, 10]], w: 1, f: 0, result: Items.CHEST, time: .05, score: 30 }, { r: [[23, 1], [2, 35]], w: 1, f: 0, result: Items.STONE_SPIKE, time: .05, score: 50 }, { r: [[24, 1], [5, 20], [2, 15]], w: 1, f: 0, result: Items.GOLD_SPIKE, time: .05, score: 100 }, { r: [[25, 1], [6, 20], [2, 15]], w: 1, f: 0, result: Items.DIAMOND_SPIKE, time: .05, score: 200 }, { r: [[26, 1], [2, 60]], w: 1, f: 0, result: Items.STONE_DOOR, time: .125, score: 100 }, { r: [[31, 1], [5, 60]], w: 1, f: 0, result: Items.GOLD_DOOR, time: .125, score: 150 }, { r: [[32, 1], [6, 60]], w: 1, f: 0, result: Items.DIAMOND_DOOR, time: .125, score: 200 }, { r: [[34, 6], [22, 4]], w: 1, f: 0, result: Items.EARMUFFS, time: 1 / 15, score: 400 }, { r: [[36, 1], [35, 10], [22, 6]], w: 1, f: 0, result: Items.COAT, time: .04, score: 1000 }, { r: [[3, 80], [2, 20]], w: 1, f: 0, result: Items.STONE_SPEAR, time: 1 / 15, score: 60 }, { r: [[3, 120], [5, 40], [2, 50], [38, 1]], w: 1, f: 0, result: Items.GOLD_SPEAR, time: .05, score: 120 }, { r: [[3, 250], [6, 50], [5, 80], [39, 1]], w: 1, f: 0, result: Items.DIAMOND_SPEAR, time: 1 / 30, score: 240 }, { r: [[3, 150], [2, 100], [5, 50]], w: 1, f: 0, result: Items.FURNACE, time: .05, score: 150 }, { r: [[47, 3], [34, 2]], w: 1, f: 0, result: Items.EXPLORER_HAT, time: 1 / 15, score: 200 }, { r: [[2, 150], [3, 100]], w: 1, f: 0, result: Items.STONE_HELMET, time: .05, score: 100 }, { r: [[2, 180], [3, 120], [5, 100], [43, 1]], w: 1, f: 0, result: Items.GOLD_HELMET, time: .025, score: 200 }, { r: [[2, 200], [5, 100], [6, 160], [44, 1]], w: 1, f: 0, result: Items.DIAMOND_HELMET, time: 1 / 60, score: 400 }, { r: [[47, 5], [22, 5], [35, 5]], w: 1, f: 0, result: Items.BOOK, time: 1 / 30, score: 250 }, { r: [[3, 30]], w: 0, f: 1, result: Items.PAPER, time: 1 / 3, score: 10 }, { r: [[22, 5], [35, 5]], w: 1, f: 0, result: Items.BAG, time: .05, score: 250 }, { r: [[6, 80], [5, 130], [49, 50], [10, 1]], w: 1, f: 0, result: Items.SWORD_AMETHYST, time: .025, score: 800 }, { r: [[6, 60], [5, 90], [49, 30], [8, 1]], w: 1, f: 0, result: Items.PICK_AMETHYST, time: .025, score: 500 }, { r: [[49, 50], [6, 100], [5, 120], [40, 1]], w: 1, f: 0, result: Items.AMETHYST_SPEAR, time: .025, score: 800 }, { r: [[3, 120], [2, 60]], w: 1, f: 0, result: Items.HAMMER_STONE, time: 1 / 15, score: 100 }, { r: [[3, 160], [2, 120], [5, 80], [53, 1]], w: 1, f: 0, result: Items.HAMMER_GOLD, time: .05, score: 200 }, { r: [[6, 80], [2, 200], [5, 150], [54, 1]], w: 1, f: 0, result: Items.HAMMER_DIAMOND, time: 1 / 30, score: 400 }, { r: [[6, 160], [49, 60], [5, 250], [55, 1]], w: 1, f: 0, result: Items.HAMMER_AMETHYST, time: .025, score: 1000 }, { r: [[25, 1], [49, 20]], w: 1, f: 0, result: Items.AMETHYST_WALL, time: .2, score: 300 }, { r: [[57, 1], [49, 20], [2, 15]], w: 1, f: 0, result: Items.AMETHYST_SPIKE, time: .05, score: 600 }, { r: [[33, 1], [49, 60]], w: 1, f: 0, result: Items.AMETHYST_DOOR, time: .125, score: 600 }, { r: [[37, 1], [61, 20], [62, 10]], w: 1, f: 0, result: Items.CAP_SCARF, time: 1 / 60, score: 1500 }, { r: [[6, 1], [22, 1]], w: 1, f: 0, result: Items.BLUE_CORD, time: 1 / 3, score: 25 }];
for (const recipe of RECIPES) {
    let parsedRecipe: Recipe = { time: recipe.time, requireFire: recipe.f === 1, requireWorkbench: recipe.w === 1, ingredients: recipe.r.map(ingredient => ({ item: Items.get(ingredient[0]), amount: ingredient[1] })), score: recipe.score };
    recipe.result.recipe = parsedRecipe;
}