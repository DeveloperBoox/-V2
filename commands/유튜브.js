const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "유튜브",
    description: "YouTube Together 세션을 시작합니다.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["yt"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {require("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다!**");
        if(!message.member.voice.channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE"))return client.sendTime(message.channel, "❌ | **Bot doesn't have Create Invite Permission**");

        let Invite = await message.member.voice.channel.activityInvite("755600276941176913")//Made using discordjs-activity package
        let embed = new MessageEmbed()
        .setAuthor("YouTube Together", "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1")
        .setColor("#FF0000")
        .setDescription(`
        **YouTube Together**를 사용하면 친구들과 음성 채널로 유튜브를 시청할 수 있습니다. *YouTube Together 가입*을 클릭하여 참여!

        __**[YouTube Together 가입](https://discord.com/invite/${Invite.code})**__
        
        ⚠ **TIP!:** 데스크톱에서만 사용할 수 있습니다.
        `)
        message.channel.send(embed)
    },
    SlashCommand: {
        options: [
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
            if(!member.voice.channel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE"))return client.sendTime(interaction, "❌ | **Bot doesn't have Create Invite Permission**");

            let Invite = await member.voice.channel.activityInvite("755600276941176913")//Made using discordjs-activity package
            let embed = new MessageEmbed()
            .setAuthor("유튜브 투게더", "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1")
            .setColor("#FF0000")
            .setDescription(`
            **YouTube Together**를 사용하면 친구들과 음성 채널로 유튜브를 시청할 수 있습니다. *YouTube Together 가입*을 클릭하여 참여!

__**[YouTube Together 가입](https://discord.com/invite/${Invite.code})**__

⚠ **TIP!:** 데스크톱에서만 사용할 수 있습니다.
`)
            interaction.send(embed.toJSON())
        },
    },
};
