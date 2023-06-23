const { SlashCommandBuilder } = require("discord.js");
const { mageEmbed } = require("../helpers/mageEmbed");
const { bestMatch } = require('../helpers/bestMatch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mage')
        .setDescription('Displays the information of a character')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('name of the character')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();

        let character = await mageEmbed(name);

        if (!character) {
            let match = bestMatch(name, 'character');

            if (!match) {
                await interaction.editReply({ content: "Couldn't find the target!", ephemeral: true });
                return;
            }

            character = await mageEmbed(match);
            await interaction.editReply({ embeds: [character]});
            return;
        }

        await interaction.editReply({ embeds: [character] });
        return;
    }
}