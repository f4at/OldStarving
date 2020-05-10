import Discord from 'discord.js';
import config from "../config";

export default class DiscordBot {
    client: Discord.Client;

    async start() {
        this.client = new Discord.Client();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        await this.client.login(config.token);
        this.client.user.setStatus("invisible");
    }

    async checkUser(id: string | number) {
        if (!config.guildId) return true;
        const guild = this.client.guilds.resolve(config.guildId);
        if (!guild)
            throw new Error("Guild " + config.guildId + " not found!");
        try {
            const member = await guild.members.fetch(id.toString());
            if (!member)
                return false;
            if (config.roleId.length === 0) return true;
            for (let role of config.roleId) {
                if (member.roles.cache.has(role)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("User " + id + " isn't in guild!");
            return false;
        }
    }
};