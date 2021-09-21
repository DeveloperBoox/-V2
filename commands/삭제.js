const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "삭제",
  description: "서버 대기열을 지웁니다.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **지금은 아무것도 틀고있지 않아요...**"
      );

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime(message.channel, "❌ | **지금은 아무것도 틀고있지 않아요...**");
      if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다!**");
      if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
    player.queue.clear();
    await client.sendTime(message.channel, "✅ | **큐를 비웠어요!**");
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
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | 이 명령을 사용하려면 음성 채널에 있어야 합니다..");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(interaction, "❌ | **지금은 아무것도 틀고있지 않아요...**");

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime(interaction, "❌ | **지금은 아무것도 틀고있지 않아요...**");
      player.queue.clear();
      await client.sendTime(interaction, "✅ | **큐를 비웠어요!**");
    },
  },
};
