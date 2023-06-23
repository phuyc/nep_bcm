const { SlashCommandBuilder } = require("discord.js");
const { skillEmbed } = require("../helpers/skillEmbed");
const { bestMatch } = require('../helpers/bestMatch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skill')
        .setDescription('Displays the information of a skill page')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('name of the skill page')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase().trim();

        let skill = await skillEmbed(name);

        if (!skill) {
            let match = bestMatch(name, 'skill_page');

            if (!match) {
                await interaction.editReply({ content: "Couldn't find the target!", ephemeral: true });
                return;
            }

            skill = await skillEmbed(match);
            await interaction.editReply({ embeds: [skill]});
            return;
        }

        await interaction.editReply({ embeds: [skill] });
        return;
    }
}