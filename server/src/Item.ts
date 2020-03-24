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

    constructor(id: number, range: number, range2: number, damage: Damage) {
        super(id);
        this.range = range;
        this.range2 = range2;
        this.damage = damage;
    }
}

export class Pickaxe extends Tool {
    tier: number;

    constructor(id: number, range: number, range2: number, damage: Damage, tier: number) {
        super(id, range, range2, damage);
        this.tier = tier;
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

    constructor(id: number, numberOfSides: number = -1, raduis: number, hp: number, type: EntityType, special: any) {
        super(id);
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

    constructor(id: number, food: number, temp: number, hp: number, regen: number) {
        super(id);
        this.food = food;
        this.temp = temp;
        this.hp = hp;
        this.regen = regen;
    }
}


export class Items {
    //recipes = [{ r: [new ItemStack(3, 30), new ItemStack(2, 5)], w: 0, f: 0, id: this.items.FIRE, time: .1 }, { r: [new ItemStack(3, 40), new ItemStack(2, 20)], w: 0, f: 0, id: this.items.WORKBENCH, time: 1 / 15 }, { r: [new ItemStack(3, 60), new ItemStack(2, 30)], w: 1, f: 0, id: this.items.SWORD, time: 1 / 15 }, , { r: [new ItemStack(4, 3), new ItemStack(3, 20)], w: 0, f: 1, id: this.items.SEED, time: .1 }, { r: [new ItemStack(3, 60), new ItemStack(5, 30), new ItemStack(2, 40), new ItemStack(1, 1)], w: 1, f: 0, id: this.items.PICK_GOLD, time: .05 }, { r: [new ItemStack(6, 30), new ItemStack(5, 60), new ItemStack(2, 100), new ItemStack(7, 1)], w: 1, f: 0, id: this.items.PICK_DIAMOND, time: 1 / 30 }, { r: [new ItemStack(3, 80), new ItemStack(5, 50), new ItemStack(2, 60), new ItemStack(0, 1)], w: 1, f: 0, id: this.items.SWORD_GOLD, time: .05 }, { r: [new ItemStack(6, 50), new ItemStack(5, 80), new ItemStack(2, 100), new ItemStack(9, 1)], w: 1, f: 0, id: this.items.SWORD_DIAMOND, time: 1 / 30 }, { r: [new ItemStack(3, 15)], w: 0, f: 0, id: this.items.PICK_WOOD, time: .2 }, { r: [new ItemStack(3, 20)], w: 1, f: 0, id: this.items.WALL, time: .2 }, { r: [new ItemStack(16, 1), new ItemStack(3, 20), new ItemStack(2, 15)], w: 1, f: 0, id: this.items.SPIKE, time: .05 }, { r: [new ItemStack(18, 1)], w: 0, f: 1, id: this.items.COOKED_MEAT, time: .1 }, { r: [new ItemStack(11, 1), new ItemStack(3, 40), new ItemStack(2, 10)], w: 0, f: 0, id: this.items.BIG_FIRE, time: .1 }, { r: [new ItemStack(22, 3)], w: 1, f: 0, id: this.items.BANDAGE, time: .2 }, { r: [new ItemStack(16, 1), new ItemStack(2, 20)], w: 1, f: 0, id: this.items.STONE_WALL, time: .2 }, { r: [new ItemStack(23, 1), new ItemStack(5, 20)], w: 1, f: 0, id: this.items.GOLD_WALL, time: .2 }, { r: [new ItemStack(24, 1), new ItemStack(6, 20)], w: 1, f: 0, id: this.items.DIAMOND_WALL, time: .2 }, { r: [new ItemStack(3, 60)], w: 1, f: 0, id: this.items.WOOD_DOOR, time: .125 }, { r: [new ItemStack(3, 60), new ItemStack(2, 20), new ItemStack(5, 10)], w: 1, f: 0, id: this.items.CHEST, time: .05 }, { r: [new ItemStack(23, 1), new ItemStack(2, 35)], w: 1, f: 0, id: this.items.STONE_SPIKE, time: .05 }, { r: [new ItemStack(24, 1), new ItemStack(5, 20), new ItemStack(2, 15)], w: 1, f: 0, id: this.items.GOLD_SPIKE, time: .05 }, { r: [new ItemStack(25, 1), new ItemStack(6, 20), new ItemStack(2, 15)], w: 1, f: 0, id: this.items.DIAMOND_SPIKE, time: .05 }, { r: [new ItemStack(26, 1), new ItemStack(2, 60)], w: 1, f: 0, id: this.items.STONE_DOOR, time: .125 }, { r: [new ItemStack(31, 1), new ItemStack(5, 60)], w: 1, f: 0, id: this.items.GOLD_DOOR, time: .125 }, { r: [new ItemStack(32, 1), new ItemStack(6, 60)], w: 1, f: 0, id: this.items.DIAMOND_DOOR, time: .125 }, { r: [new ItemStack(34, 8), new ItemStack(22, 4)], w: 1, f: 0, id: this.items.EARMUFFS, time: 1 / 15 }, { r: [new ItemStack(36, 1), new ItemStack(34, 5), new ItemStack(35, 10), new ItemStack(22, 6)], w: 1, f: 0, id: this.items.COAT, time: .04 }, { r: [new ItemStack(3, 80), new ItemStack(2, 20)], w: 1, f: 0, id: this.items.SPEAR, time: 1 / 15 }, { r: [new ItemStack(3, 120), new ItemStack(5, 40), new ItemStack(2, 50), new ItemStack(38, 1)], w: 1, f: 0, id: this.items.GOLD_SPEAR, time: .05 }, { r: [new ItemStack(3, 250), new ItemStack(6, 50), new ItemStack(5, 80), new ItemStack(39, 1)], w: 1, f: 0, id: this.items.DIAMOND_SPEAR, time: 1 / 30 }, { r: [new ItemStack(3, 150), new ItemStack(2, 100), new ItemStack(5, 50)], w: 1, f: 0, id: this.items.FURNACE, time: .05 }, { r: [new ItemStack(47, 3), new ItemStack(34, 2)], w: 1, f: 0, id: this.items.EXPLORER_HAT, time: 1 / 15 }, { r: [new ItemStack(2, 150), new ItemStack(3, 100)], w: 1, f: 0, id: this.items.STONE_HELMET, time: .05 }, { r: [new ItemStack(2, 180), new ItemStack(3, 120), new ItemStack(5, 100), new ItemStack(43, 1)], w: 1, f: 0, id: this.items.GOLD_HELMET, time: .025 }, { r: [new ItemStack(2, 200), new ItemStack(5, 100), new ItemStack(6, 160), new ItemStack(44, 1)], w: 1, f: 0, id: this.items.DIAMOND_HELMET, time: 1 / 60 }, { r: [new ItemStack(47, 5), new ItemStack(22, 5), new ItemStack(35, 5)], w: 1, f: 0, id: this.items.BOOK, time: 1 / 30 }, { r: [new ItemStack(3, 30)], w: 0, f: 1, id: this.items.PAPER, time: 1 / 3 }, { r: [new ItemStack(22, 10), new ItemStack(35, 5)], w: 1, f: 0, id: this.items.BAG, time: .05 }, { r: [new ItemStack(6, 80), new ItemStack(5, 130), new ItemStack(49, 50), new ItemStack(10, 1)], w: 1, f: 0, id: this.items.SWORD_AMETHYST, time: .025 }, { r: [new ItemStack(6, 60), new ItemStack(5, 90), new ItemStack(49, 30), new ItemStack(8, 1)], w: 1, f: 0, id: this.items.PICK_AMETHYST, time: .025 }, { r: [new ItemStack(49, 50), new ItemStack(6, 100), new ItemStack(5, 120), new ItemStack(40, 1)], w: 1, f: 0, id: this.items.AMETHYST_SPEAR, time: .025 }, { r: [new ItemStack(3, 120), new ItemStack(2, 60)], w: 1, f: 0, id: this.items.HAMMER, time: 1 / 15 }, { r: [new ItemStack(3, 160), new ItemStack(2, 120), new ItemStack(5, 80), new ItemStack(53, 1)], w: 1, f: 0, id: this.items.HAMMER_GOLD, time: .05 }, { r: [new ItemStack(6, 80), new ItemStack(2, 200), new ItemStack(5, 150), new ItemStack(54, 1)], w: 1, f: 0, id: this.items.HAMMER_DIAMOND, time: 1 / 30 }, { r: [new ItemStack(6, 160), new ItemStack(49, 60), new ItemStack(5, 250), new ItemStack(55, 1)], w: 1, f: 0, id: this.items.HAMMER_AMETHYST, time: .025 }, { r: [new ItemStack(25, 1), new ItemStack(49, 20)], w: 1, f: 0, id: this.items.AMETHYST_WALL, time: .2 }, { r: [new ItemStack(57, 1), new ItemStack(49, 20), new ItemStack(2, 15)], w: 1, f: 0, id: this.items.AMETHYST_SPIKE, time: .05 }, { r: [new ItemStack(33, 1), new ItemStack(49, 60)], w: 1, f: 0, id: this.items.AMETHYST_DOOR, time: .125 }, { r: [new ItemStack(37, 1), new ItemStack(61, 20), new ItemStack(62, 10)], w: 1, f: 0, id: this.items.CAP_SCARF, time: 1 / 60 }, { r: [new ItemStack(6, 1), new ItemStack(22, 1)], w: 1, f: 0, id: this.items.BLUE_CORD, time: 1 / 3 }];
    static STONE_SWORD = new Tool(0, 75, 25, { pvp: 19, pve: 6 });
    static PICK_STONE = new Pickaxe(1, 55, 25, { pvp: 1, pve: 0 }, 2);
    static STONE = new Item(2);
    static WOOD = new Item(3);
    static PLANT = new Usable(4, 5, 0, 0, 1);
    static GOLD = new Item(5);
    static DIAMOND = new Item(6);
    static PICK_GOLD = new Pickaxe(7, 55, 25, { pvp: 3, pve: 1 }, 3);
    static PICK_DIAMOND = new Pickaxe(8, 55, 25, { pvp: 4, pve: 1 }, 4);
    static SWORD_GOLD = new Tool(9, 75, 25, { pvp: 22, pve: 7 });
    static SWORD_DIAMOND = new Tool(10, 75, 25, { pvp: 24, pve: 8 });
    static FIRE = new Item(11);
    static WORKBENCH = new Item(12);
    static SEED = new Item(13);
    static HAND = new Pickaxe(14, 40, 25, { pvp: 5, pve: 1 }, 0);
    static PICK_WOOD = new Pickaxe(15, 50, 25, { pvp: 5, pve: 1 }, 1);
    static WOOD_WALL = new Item(16);
    static WOOD_SPIKE = new Item(17);
    static MEAT = new Usable(18, 25, 0, -10, -5);
    static COOKED_MEAT = new Usable(19, 20, 0, 0, 5);
    static BIG_FIRE = new Item(20);
    static BANDAGE = new Usable(21, 25, 0, -10, -5);
    static CORD = new Item(22);
    static STONE_WALL = new Item(23);
    static GOLD_WALL = new Item(24);
    static DIAMOND_WALL = new Item(25);
    static WOOD_DOOR = new Item(26);
    static CHEST = new Item(27);
    static STONE_SPIKE = new Item(28);
    static GOLD_SPIKE = new Item(29);
    static DIAMOND_SPIKE = new Item(30);
    static STONE_DOOR = new Item(31);
    static GOLD_DOOR = new Item(32);
    static DIAMOND_DOOR = new Item(33);
    static FUR = new Item(34);
    static FUR_WOLF = new Item(35);
    static EARMUFFS = new Clothes(36, { pvp: 0, pve: 1 }, 2);
    static COAT = new Clothes(37, { pvp: 1, pve: 2 }, 2);
    static STONE_SPEAR = new Tool(38, 100, 35, { pvp: 14, pve: 4 });
    static GOLD_SPEAR = new Tool(39, 100, 35, { pvp: 14, pve: 4 });
    static DIAMOND_SPEAR = new Tool(40, 100, 35, { pvp: 14, pve: 4 });

    static GOLD_HELMET = new Clothes(44, { pvp: 4, pve: 13 }, 0);
    static DIAMOND_HELMET = new Clothes(45, { pvp: 5, pve: 19 }, 0);
    static AMETHYST = new Item(49);
    static AMETHYST_SWORD = new Tool(50, 80, 25, { pvp: 30, pve: 10 });

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

Items.STONE_SWORD.recipe = { ingredients: [new ItemStack(Items.WOOD, 60), new ItemStack(Items.WOOD, 30)], requireWorkbench: true, requireFire: false, time: 1 / 15 };
Items.PICK_STONE.recipe = { ingredients: [new ItemStack(Items.PICK_WOOD, 1), new ItemStack(Items.WOOD, 60), new ItemStack(Items.STONE, 20)], requireWorkbench: true, requireFire: false, time: 1 / 15 };
Items.PICK_GOLD.recipe = { ingredients: [new ItemStack(Items.WOOD, 60), new ItemStack(Items.GOLD, 30), new ItemStack(Items.STONE, 40), new ItemStack(Items.PICK_STONE, 1)], requireWorkbench: true, requireFire: false, time: .05 };
Items.PICK_DIAMOND.recipe = { ingredients: [new ItemStack(Items.DIAMOND, 30), new ItemStack(Items.GOLD, 60), new ItemStack(Items.STONE, 100), new ItemStack(Items.PICK_GOLD, 1)], requireWorkbench: true, requireFire: false, time: 1 / 30 };
Items.SWORD_GOLD.recipe = { ingredients: [new ItemStack(Items.WOOD, 80), new ItemStack(Items.GOLD, 50), new ItemStack(Items.STONE, 60), new ItemStack(Items.STONE_SWORD, 1)], requireWorkbench: true, requireFire: false, time: .05 };
Items.SWORD_DIAMOND.recipe = { ingredients: [new ItemStack(Items.DIAMOND, 50), new ItemStack(Items.GOLD, 80), new ItemStack(Items.STONE, 100), new ItemStack(Items.SWORD_GOLD, 1)], requireWorkbench: true, requireFire: false, time: 1 / 30 };
Items.FIRE.recipe = { ingredients: [new ItemStack(Items.WOOD, 30), new ItemStack(Items.STONE, 5)], requireWorkbench: false, requireFire: false, time: .1 };
Items.WORKBENCH.recipe = { ingredients: [new ItemStack(Items.WOOD, 40), new ItemStack(Items.STONE, 20)], requireWorkbench: false, requireFire: false, time: 1 / 15 };
Items.SEED.recipe = { ingredients: [new ItemStack(Items.PLANT, 3), new ItemStack(Items.WOOD, 20)], requireWorkbench: false, requireFire: true, time: .1 };
Items.PICK_WOOD.recipe = { ingredients: [new ItemStack(Items.WOOD, 15)], requireWorkbench: false, requireFire: false, time: .2 };
Items.WOOD_WALL.recipe = { ingredients: [new ItemStack(Items.WOOD, 20)], requireWorkbench: true, requireFire: false, time: .2 };
Items.WOOD_SPIKE.recipe = { ingredients: [new ItemStack(Items.WOOD_WALL, 1), new ItemStack(Items.WOOD, 20), new ItemStack(Items.STONE, 15)], requireWorkbench: true, requireFire: false, time: .05 };
Items.BIG_FIRE.recipe = { ingredients: [new ItemStack(Items.FIRE, 1), new ItemStack(Items.WOOD, 40), new ItemStack(Items.STONE, 10)], requireWorkbench: false, requireFire: false, time: .1 };
Items.BANDAGE.recipe = { ingredients: [new ItemStack(Items.CORD, 3)], requireWorkbench: true, requireFire: false, time: .2 };
Items.STONE_WALL.recipe = { ingredients: [new ItemStack(Items.WOOD_WALL, 1), new ItemStack(Items.STONE, 20)], requireWorkbench: true, requireFire: false, time: .2 };
Items.GOLD_WALL.recipe = { ingredients: [new ItemStack(Items.STONE_WALL, 1), new ItemStack(Items.GOLD, 20)], requireWorkbench: true, requireFire: false, time: .2 };
Items.DIAMOND_WALL.recipe = { ingredients: [new ItemStack(Items.GOLD_WALL, 1), new ItemStack(Items.DIAMOND, 20)], requireWorkbench: true, requireFire: false, time: .2 };
Items.WOOD_DOOR.recipe = { ingredients: [new ItemStack(Items.WOOD, 60)], requireWorkbench: true, requireFire: false, time: .125 };
Items.CHEST.recipe = { ingredients: [new ItemStack(Items.WOOD, 60), new ItemStack(Items.STONE, 20), new ItemStack(Items.GOLD, 10)], requireWorkbench: true, requireFire: false, time: .05 };
Items.STONE_SPIKE.recipe = { ingredients: [new ItemStack(Items.STONE_WALL, 1), new ItemStack(Items.STONE, 35)], requireWorkbench: true, requireFire: false, time: .05 };
Items.GOLD_SPIKE.recipe = { ingredients: [new ItemStack(Items.GOLD_WALL, 1), new ItemStack(Items.GOLD, 20), new ItemStack(Items.STONE, 15)], requireWorkbench: true, requireFire: false, time: .05 };
Items.DIAMOND_SPIKE.recipe = { ingredients: [new ItemStack(Items.DIAMOND_WALL, 1), new ItemStack(Items.DIAMOND, 20), new ItemStack(Items.STONE, 15)], requireWorkbench: true, requireFire: false, time: .05 };
Items.STONE_DOOR.recipe = { ingredients: [new ItemStack(Items.WOOD_DOOR, 1), new ItemStack(Items.STONE, 60)], requireWorkbench: true, requireFire: false, time: .125 };
Items.GOLD_DOOR.recipe = { ingredients: [new ItemStack(Items.STONE_DOOR, 1), new ItemStack(Items.GOLD, 60)], requireWorkbench: true, requireFire: false, time: .125 };
Items.DIAMOND_DOOR.recipe = { ingredients: [new ItemStack(Items.GOLD_DOOR, 1), new ItemStack(Items.DIAMOND, 60)], requireWorkbench: true, requireFire: false, time: .125 };
Items.EARMUFFS.recipe = { ingredients: [new ItemStack(Items.FUR, 8), new ItemStack(Items.CORD, 4)], requireWorkbench: true, requireFire: false, time: 1 / 15 };
Items.COAT.recipe = { ingredients: [new ItemStack(Items.EARMUFFS, 1), new ItemStack(Items.FUR, 5), new ItemStack(Items.FUR_WOLF, 10), new ItemStack(Items.CORD, 6)], requireWorkbench: true, requireFire: false, time: .04 };
Items.STONE_SPEAR.recipe = { ingredients: [new ItemStack(Items.WOOD, 80), new ItemStack(Items.STONE, 20)], requireWorkbench: true, requireFire: false, time: 1 / 15 };
Items.GOLD_SPEAR.recipe = { ingredients: [new ItemStack(Items.WOOD, 120), new ItemStack(Items.GOLD, 40), new ItemStack(Items.STONE, 50), new ItemStack(Items.STONE_SPEAR, 1)], requireWorkbench: true, requireFire: false, time: .05 };
Items.DIAMOND_SPEAR.recipe = { ingredients: [new ItemStack(Items.WOOD, 250), new ItemStack(Items.DIAMOND, 50), new ItemStack(Items.GOLD, 80), new ItemStack(Items.GOLD_SPEAR, 1)], requireWorkbench: true, requireFire: false, time: 1 / 30 };
Items.DIAMOND_HELMET.recipe = { ingredients: [new ItemStack(Items.STONE, 200), new ItemStack(Items.GOLD, 100), new ItemStack(Items.DIAMOND, 160), new ItemStack(Items.GOLD_HELMET, 1)], requireWorkbench: true, requireFire: false, time: 1 / 60 };
Items.AMETHYST_SWORD.recipe = { ingredients: [new ItemStack(Items.DIAMOND, 80), new ItemStack(Items.GOLD, 130), new ItemStack(Items.AMETHYST, 50), new ItemStack(Items.SWORD_DIAMOND, 1)], requireWorkbench: true, requireFire: false, time: .025 };