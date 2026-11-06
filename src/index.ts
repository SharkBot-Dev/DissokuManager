import { ChannelType, Client, Collection, Colors, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import cron from "node-cron";

config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

const tasks = new Collection();

cron.schedule('*/15 * * * * *', () => {
    tasks.forEach((value: any, key: any, map: any) => {
        if (Date.now() >= value.targetTime) {
            const channel = client.channels.cache.get(value.channelId);
            if (!channel) return;
            if (channel.type != ChannelType.GuildText) return;
            tasks.delete(key);
            channel.send({
                embeds: [new EmbedBuilder().setTitle("ディス速のUpが可能です！").setDescription("</up:1363739182672904354> でUp可能です。").setColor(Colors.Green)]
            })
        }
    })
});

client.on("messageCreate", async (message) => {
    if (message.author.id == "761562078095867916") {
        if (message.interaction?.commandName == "up") {
            if (!message.interactionMetadata?.user) {
                return;
            }

            if (message.channel.type != ChannelType.GuildText) return;

            const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
            const targetTime = Date.now() + TWO_HOURS_IN_MS;

            tasks.set(message.guildId, {
                channelId: message.channelId,
                targetTime: targetTime
            })

            await message.channel.send({
                embeds: [new EmbedBuilder().setTitle("ディス速のUpを検知しました").setDescription("2時間後に通知されます。").setAuthor({
                    name: message.interactionMetadata?.user.displayName,
                    iconURL: message.interactionMetadata?.user.displayAvatarURL()
                }).setColor(Colors.Green)]
            })
        }
    }
})

client.login(process.env.DISCORD_TOKEN as string)