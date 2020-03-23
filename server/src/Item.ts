export default class Item {
    id: number;

    constructor(id: number) {
        this.id = id;
    }
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
    constructor(id: number, range: number, range2: number, damage: Damage) {
        super(id, range, range2, damage);
    }
}

export class Armor extends Item {
    coldProtection: number;
    damageProtection: Damage;

    constructor(id: number, damageProtection: Damage, coldProtection: number = 0) {
        super(id);
        this.damageProtection = damageProtection;
        this.coldProtection = coldProtection;
    }
}

export class Items {
    static STONE_SWORD = new Tool(0, 75, 25, { pvp: 19, pve: 2 });
    static HAND = new Pickaxe(14, 50, 25, { pvp: 5, pve: 1 });
    static WOOD_WALL = new Item(16);
    static AMETHYST_SWORD = new Tool(50, 80, 25, { pvp: 30, pve: 10 });
    static DIAMOND_HELMET = new Armor(45, { pvp: 5, pve: 19 });
    static AMETHYST_HELMET = new Armor(81, { pvp: 6, pve: 23 });
}