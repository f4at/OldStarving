import Discord from 'discord.js';
import * as config from "../config.json";

export default class DiscordBot {
    client: Discord.Client;

    start() {
        this.client = new Discord.Client();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.login(config.token);
    }

    async checkUser(id: string | number) {
        const guild = this.client.guilds.resolve(config.guildId);
        if (!guild)
            return false;
        const member = await guild.members.fetch(id.toString());
        if (!member)
            return false;
        return member.roles.cache.has(config.roleId);
    }
};