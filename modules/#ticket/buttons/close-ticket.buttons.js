const {Button, InteractionsOptions} = require('../../../libs/core')
const {ButtonInteraction, MessageEmbed, MessageActionRow} = require('discord.js');

const button = new Button({
    custom_id: "close-ticket",
    style: "DANGER",
    label: "Close a Ticket",
    emoji: "📩"
})

/**
 * @param {InteractionsOptions} options
 * @param {ButtonInteraction} interaction
 */
button.execute = (options, interaction) => {
    const db = options.databaseModel.database;
    setupDatabase(options.databaseModel, db);
    db['#ticket']['tickets'] = db['#ticket']['tickets'].filter(ticket => ticket.channelID !== interaction.channel.id);
    saveData(options.databaseModel, db);
    interaction.reply({
        embeds: [
            new MessageEmbed().setColor(options.config.colorEmbed).setDescription(`Your ticket will be deleted in ${options.config.ticket.timeBeforeDeletion}s !`)
        ],
    })
    setTimeout(() => interaction.channel.delete(), options.config.ticket.timeBeforeDeletion * 1000)
}

const setupDatabase = (databaseModel, db) => {
    if (!db['#ticket']) db['#ticket'] = {};
    if (!db['#ticket']['tickets']) db['#ticket']['tickets'] = [];
    saveData(databaseModel, db);
}

const saveData = (databaseModel, db) => {
    databaseModel.database = db;
    databaseModel.save();
}

const sendError = (interaction, message) => {
    interaction.reply({
        embeds: [
            new MessageEmbed().setColor('#ff423c').setDescription(message),
        ],
        ephemeral: true
    })
}

module.exports = button;