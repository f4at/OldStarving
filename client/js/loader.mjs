import ModdedStarving from "./moddedstarving.mjs";
ModdedStarving.initialize().then(() => {
    console.log(`Loaded ${ModdedStarving.mods.length} mods!`);
    import("./client.mjs").then(client => client.start(ModdedStarving));
});