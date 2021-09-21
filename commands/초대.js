const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "초대",
  description: "나를 서버로 초대하려면",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["inv"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let embed = new MessageEmbed()
      .setAuthor(
        "Invite " + client.user.tag + " to your server!",
        client.user.displayAvatarURL()
      )
      .setColor("BLUE")
      .setDescription(
        `텍스트를 클릭하여 초대할 수 있습니다. [here](https://discord.com/api/oauth2/authorize?client_id=886507330370437191&permissions=8&scope=bot{
          client.botconfig.ClientID
        }&permissions=${
          client.botconfig.Permissions
        }&scope=bot%20${client.botconfig.Scopes.join("%20")}&redirect_url=${
          client.botconfig.Website
        }${client.botconfig.CallbackURL}&response_type=code)`
      );
    message.channel.send(embed);
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
    let embed = new MessageEmbed()
      .setAuthor(
        "Invite " + client.user.tag + " to your server!",
        client.user.displayAvatarURL()
      )
      .setColor("BLUE")
      .setDescription(
        `텍스트를 클릭하여 초대할 수 있습니다 [here](https://discord.com/api/oauth2/authorize?client_id=886507330370437191&permissions=8&scope=bot{
          client.botconfig.ClientID
        }&permissions=${
          client.botconfig.Permissions
        }&scope=bot%20${client.botconfig.Scopes.join("%20")}&redirect_url=${
          client.botconfig.Website
        }${client.botconfig.CallbackURL}&response_type=code)`
      );
    interaction.send(embed);
  },
  },
};

