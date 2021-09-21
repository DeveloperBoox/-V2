const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "저장",
  description: "현재 노래를 디엠으로 저장합니다.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
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
  if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
   message.author.send(new MessageEmbed()
   .setAuthor(`노래 저장`, client.user.displayAvatarURL({
    dynamic: true
  }))
  .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
  .setURL(player.queue.current.uri)
  .setColor("RANDOM")
  .setTitle(`**${player.queue.current.title}**`)
  .addField(`⌛ 영상 길이: `, `\`${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}\``, true)
  .addField(`🎵 업로더: `, `\`${player.queue.current.author}\``, true)
  .addField(`▶ 플레이하고싶다면:`, `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
  }play ${player.queue.current.uri}\``)
  .addField(`🔎 사용된곳:`, `<#${message.channel.id}>`)
  .setFooter(`노래를 튼 사람: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
    dynamic: true
  }))
    ).catch(e=>{
      return message.channel.send("**:x: DM이 비활성화되었습니다.**")
    })    

    client.sendTime(message.channel, "✅ | **DM을 확인하세요!**")
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
    const user = client.users.cache.get(interaction.member.user.id);
    const member = guild.members.cache.get(interaction.member.user.id);
    let player = await client.Manager.get(interaction.guild_id);
    if (!player) return client.sendTime(interaction, "❌ | **지금은 아무것도 틀고있지 않아요...**");
    if (!member.voice.channel) return client.sendTime(interaction, "❌ | **이 명령을 사용하려면 음성 채널에 있어야 합니다..**");
    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **이 명령을 사용하려면 봇과 동일한 음성 채널에 있어야 합니다.!**");
    try{
    let embed = new MessageEmbed()
      .setAuthor(`노래 저장: `, client.user.displayAvatarURL())
      .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .setURL(player.queue.current.uri)
      .setColor("RANDOM")
      .setTimestamp()
      .setTitle(`**${player.queue.current.title}**`)
      .addField(`⌛ 영상 길이: `, `\`${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}\``, true)
      .addField(`🎵 업로더: `, `\`${player.queue.current.author}\``, true)
      .addField(`▶ 플레이하고싶다면:`, `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
        }play ${player.queue.current.uri}\``)
      .addField(`🔎 사용된곳:`, `<#${interaction.channel_id}>`)
      .setFooter(`노래를 튼 사람: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
        dynamic: true
      }))
      user.send(embed);
    }catch(e) {
      return client.sendTime(interaction, "**:x: DM이 비활성화되었습니다**")
    }

    client.sendTime(interaction, "✅ | **DM을 확인하세요!**")
  },
  },
};
