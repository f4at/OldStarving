export class ModdedStarving {
    version = "0.1";
    mods = [];

    initialize() {
        console.log(`ModdedStarving v${this.version} initializing`);

        const promises = [];
        promises.push(this.loadMod("./mods/AmethystHelmet.mjs"));

        return Promise.all(promises);
    }

    async loadMod(url) {
        console.log("Loading " + url);
        const module = await import(url);
        const mod = module.default;
        mod.on("load");
        this.mods.push(mod);
    }

    on(event, data) {
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

export class Mod {

}

export default new ModdedStarving();