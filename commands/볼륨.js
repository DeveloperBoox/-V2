const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "볼륨",
    description: "현재 볼륨 확인 또는 변경",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **지금은 아무것도 틀고있지 않아요...**");
        if (!args[0]) return client.sendTime(message.channel, `🔉 | Current volume \`${player.volume}\`.`);
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다.!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
        if (!parseInt(args[0])) return client.sendTime(message.channel, `**숫자 중 하나를 선택하십시오.** \`1 - 100\``);
        let vol = parseInt(args[0]);
        if(vol < 0 || vol > 100){
          return  client.sendTime(message.channel, "❌ | **숫자 중 하나를 선택하십시오. `1-100`**");
        }
        else{
        player.setVolume(vol);
        client.sendTime(message.channel, `🔉 | **볼륨 설정:** \`${player.volume}\``);
        }
    },
    SlashCommand: {
        options: [
            {
                name: "amount",
                value: "amount",
                type: 4,
                required: false,
                description: "1~100 사이의 볼륨을 입력합니다. 기본값은 100입니다.",
            },
        ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | 이 명령을 사용하려면 음성 채널에 있어야 합니다..");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **지금은 아무것도 틀고있지 않아요...**");
            if (!args[0].value) return client.sendTime(interaction, `🔉 | 현재 볼륨 \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `**다음 중에서 숫자를 선택하십시오.** \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | 볼륨 설정: \`${player.volume}\``);
        },
    },
};
