const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

  module.exports = {
    name: "리무브",
    description: `대기열에서 노래 제거`,
    사용법: "[number]",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["rm"],

    /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    const song = player.queue.slice(args[0] - 1, 1); 
    if (!player) return client.sendTime(message.channel, "❌ | **지금은 아무것도 틀고있지 않아요...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다.!**");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
        
    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("큐에 제거할 항목이 없습니다.");
    let rm = new MessageEmbed()
      .setDescription(`✅ **|** 큐에서 트랙을 제거했습니다. **\`${Number(args[0])}\`**!`)
      .setColor("GREEN")
      if (isNaN(args[0]))rm.setDescription(`**사용법 - **${client.botconfig.prefix}\`제거 [트랙]\``);
      if (args[0] > player.queue.length)
      rm.setDescription(`대기열에는 다음 항목만 있습니다. ${player.queue.length} 곡!`);
    await message.channel.send(rm);
    player.queue.remove(Number(args[0]) - 1);
  },

  SlashCommand: {
    options: [
      {
          name: "track",
          value: "[track]",
          type: 4,
          required: true,
          description: "대기열에서 노래 제거",
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
      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const song = player.queue.slice(args[0] - 1, 1);
      if (!player) return client.sendTime(interaction, "❌ | **지금은 아무것도 틀고있지 않아요...**");
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다..**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
  
      if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime("❌ | **지금은 아무것도 틀고있지 않아요...**");
      let rm = new MessageEmbed()
        .setDescription(`✅ | **제거된 트랙** \`${Number(args[0])}\``)
        .setColor("GREEN")
      if (isNaN(args[0])) rm.setDescription(`**사용법:** \`${GuildDB.prefix}제거 [track]\``);
      if (args[0] > player.queue.length)
        rm.setDescription(`대기열에는 다음 항목만 있습니다. ${player.queue.length} 곡!`);
      await interaction.send(rm);
      player.queue.remove(Number(args[0]) - 1);
    },
  }
};
