import ModdedStarving from "./ModdedStarving";
ModdedStarving.initialize().then(async () => {
    console.log(`Loaded ${ModdedStarving.mods.length} mods!`);
    import("./client").then(client => client.start(ModdedStarving));
});