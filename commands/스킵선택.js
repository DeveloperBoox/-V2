const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "스킵선택",
  description: `대기열에 있는 노래로 건너뛰기`,
  usage: "<number>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });

    if (!player) return client.sendTime(message.channel, "❌ | **지금은 아무것도 틀고있지 않아요...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다.!**");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");

    try {
      if (!args[0]) return client.sendTime(message.channel, `**사용법**: \`${GuildDB.prefix}스킵선택 [number]\``);
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size) return client.sendTime(message.channel, `❌ | 그 노래는 큐에 없어요! 다시 시도하십시오.!`);
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop();
      //Send Success Message
      return client.sendTime(message.channel, `⏭ 스킵되었습니다. \`${Number(args[0] - 1)}\` 곡.`);
    } catch (e) {
      console.log(String(e.stack).bgRed);
      client.sendError(message.channel, "뭔가 잘못됐어.");
    }
  },
  SlashCommand: {
    options: [
      {
        name: "position",
        value: "[position]",
        type: 4,
        required: true,
        description: "대기열에 있는 특정 노래로 건너뛰기",
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
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다..**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `:x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**`);
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(interaction, "❌ | **라발링크 노드가 연결되지 않음**");
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

      try {
        if (!interaction.data.options) return client.sendTime(interaction, `**사용법**: \`${GuildDB.prefix}skipto <number>\``);
        let skipTo = interaction.data.options[0].value;
        //if the wished track is bigger then the Queue Size
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return client.sendTime(interaction, `❌ | That song is not in the queue! Please try again!`);

        player.stop(skipTo);
        //Send Success Message
        return client.sendTime(interaction, `⏭ 스킵 \`${Number(skipTo)}\` 곡`);
      } catch (e) {
        console.log(String(e.stack).bgRed);
        client.sendError(interaction, "뭔가 잘못되었습니다..");
      }
    },
  },
};
