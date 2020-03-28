import Discord, { Client } from 'discord.js';

export default class DiscordBot {
    client: Discord.Client;

    start() {
        this.client = new Discord.Client();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.login('NjkyMDY2MzY0MjU2NjgyMDM0.XnpcFA.MgOj1ZNs_2NiTUA2CdBv1iiKMIo');
    }

    async checkUser(id: string | number) {
        const guild = this.client.guilds.resolve("692062782656348250");
        const member = await guild.members.fetch(id.toString());
        return member.roles.cache.has("692090005522219020");
    }
};