export class ModdedStarving {
    version = "0.1";
    mods: Mod[] = [];

    async initialize() {
        console.log(`ModdedStarving v${this.version} initializing`);

        const promises = [];
        // promises.push(this.loadMod(await import("./mods/AmethystHelmet")));

        return Promise.all(promises);
    }

    async loadMod(module) {
        const mod = module.default;
        mod.on("load");
        this.mods.push(mod);
    }

    on(event: ModEvent, data?: any) {
        this.mods.forEach(mod => {
            switch (event) {
                case "start":
                    mod.client = data;
                    break;
            }

            mod.on(event, data);
        });
    }
}

export type ModEvent = "start" | "load" | "registry_init" | "sprite" | "draw_clothe" | "select_inv";

export abstract class Mod {
    client: any;
    abstract on(event: ModEvent, data?: any): void;
}

export default new ModdedStarving();