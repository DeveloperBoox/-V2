const { DiscordMusicBot } = require('../structures/DiscordMusicBot');
const { VoiceState, MessageEmbed} = require("discord.js");
/**
 *
 * @param {DiscordMusicBot} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = async (client, oldState, newState) => {
    // skip bot users, just like the message event
    if (newState.member.user.bot) return;

    // get guild and player
    let guildId = newState.guild.id;
    const player = client.Manager.get(guildId);

    // check if the bot is active (playing, paused or empty does not matter (return otherwise)
    if (!player || player.state !== "CONNECTED") return;

    // prepreoces the data
    const stateChange = {};
    // get the state change
    if (oldState.channel === null && newState.channel !== null) stateChange.type = "JOIN";
    if (oldState.channel !== null && newState.channel === null) stateChange.type = "LEAVE";
    if (oldState.channel !== null && newState.channel !== null) stateChange.type = "MOVE";
    if (oldState.channel === null && newState.channel === null) return; // you never know, right

    // move check first as it changes type
    if (stateChange.type === "MOVE") {
        if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
        if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
    }
    // double triggered on purpose for MOVE events
    if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
    if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

    // check if the bot's voice channel is involved (return otherwise)
    if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel) return;

    // filter current users based on being a bot
    stateChange.members = stateChange.channel.members.filter(member => !member.user.bot);

    switch (stateChange.type) {
        case "JOIN":
            if (stateChange.members.size === 1 && player.paused) {
                let emb = new MessageEmbed()
                    .setAuthor(`일시 중지된 대기열을 재개하는 중`, client.botconfig.IconURL)
                    .setColor("RANDOM")
                    .setDescription(`봇 혼자 남았기떄문에 다시시작합니다.`);
                await client.channels.cache.get(player.textChannel).send(emb);

                // update the now playing message and bring it to the front
                let msg2 = await client.channels.cache.get(player.textChannel).send(player.nowPlayingMessage.embeds[0])
                player.setNowplayingMessage(msg2);

                player.pause(false);
            }
            break;
        case "LEAVE":
            if (stateChange.members.size === 0 && !player.paused && player.playing) {
                player.pause(true);

                let emb = new MessageEmbed()
                    .setAuthor(`일시중지됨!`, client.botconfig.IconURL)
                    .setColor("RANDOM")
                    .setDescription(`플레이어가 모두 떠났기 때문에 일시 중지되었습니다.`);
                await client.channels.cache.get(player.textChannel).send(emb);
            }
            break;
    }
}
