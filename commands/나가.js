const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "나가",
  description: "음악을 멈추고 음성 채널을 떠납니다.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하여 음성 채널에 있어야 합니다.**");
    if (!player) return client.sendTime(message.channel,"❌ | **지금은 아무것도 틀고있지 않아요...**");
    await client.sendTime(message.channel,":notes: | **연결 해제됨!**");
    await message.react("✅");
    player.destroy();
  },

  SlashCommand: {
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

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다..**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `❌ | **당신은 ${guild.me.voice.channel} 에 들어가야 명령을 이용하실 수 있습니다..**`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **지금은 아무것도 틀고있지 않아요...**"
        );
      player.destroy();
      client.sendTime(
        interaction,
        ":notes: | **연결 해제됨!**"
      );
    },
  },
};
