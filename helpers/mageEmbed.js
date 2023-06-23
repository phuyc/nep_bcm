const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { randomColor } = require("./randomColor");

let skillDesc = '', raw, skills;

function writeSkill(raw) {
    for (let content of raw.content) {
        
        if (content.value) {
            skillDesc += content.value;
            continue;
        }
        
        if (content.content) writeSkill(content);
    }
}

async function mageEmbed(name) {
    const response = await fetch(`https://www.prydwen.gg/page-data/black-clover/characters/${name.replace(/ /g, "-")}/page-data.json`);
    
    // Send suggestion if can't find the character
    if (response.status != 200) return false;

    // JSONify
    let json = await response.json();
    json = json.result.data.currentUnit.nodes[0];

    // Create embed
    let mage = new EmbedBuilder()
        .setTitle(`[${RARITIES[json.rarity]}] [${CLASSES[json.class]}] [${ATTRIBUTES[json.attribute]}] ${json.name}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/black-clover/characters/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setThumbnail(`https://prydwen.gg${json.imageSmall.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setColor(randomColor())
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields(
            // Field 1 (Ratings)
            { name: 'RATINGS', value: `**PVE:** ${RATINGS[json.ratings.pve]} **PVP:** ${RATINGS[json.ratings.pvp]}` },

            // Field 2.1 (Stats)
            { name: 'STATS (LVL 100)', value: `<:stat_atk:1121091795720347718>: **${json.stats.atk}**\n<:stat_matk:1121091826456207440>: **${json.stats.matk}**`
                + `\n<:stat_def:1121091813298683924>: **${json.stats.def}**\n<:stat_hp:1121091822832332800>: **${json.stats.hp}**`, inline: true },

            // Field 2.2
            { name: '\u200b', value: `<:stat_acc:1121091791102414939>: **${json.stats.acc}**\n<:stat_dmgres:1121091816394068051>: **${json.stats.dmgres}**` 
                + `\n<:stat_crit:1121091800254398547>: **${json.stats.crit}%**\n<:stat_critdmg:1121091807623786526>: **${json.stats.critdmg}%**`, inline: true },

            // Field 2.3
            { name: '\u200b', value: `<:stat_critres:1121091809389596672>: **${json.stats.critres}%**\n<:stat_speed:1121091745279639572>: **${json.stats.speed}**`
                + `\n<:stat_pen:1121091739428597804>: **${json.stats.pen}**\n<:stat_end:1121091820462538862>: **${json.stats.end}**`, inline: true }
        )

    // Skills
    skills = json.skills;
    skills.forEach((skill, index) => {

        // Reset skillDesc
        skillDesc = '';

        // Title
        skillDesc += `**${skill.name.toUpperCase()}**\n`
        skillDesc += `\`${skill.type}\` `;

        if (skill.target) `\`${skill.target}\` ` 

        if (skill.cooldown) skillDesc += `\`${skill.cooldown} turns\` `;

        if (skill.atk) skillDesc += `\`ATK: ${skill.atk}%\` `;

        if (skill.matk) skillDesc += `\`M.ATK: ${skill.matk}%\`\n `
        
        // Start block
        skillDesc += '```ini\n';
        
        raw = JSON.parse(skill.description.raw);

        writeSkill(raw);

        // End block
        skillDesc += '```\n';

        // * Field 3.index (Skills)
        mage.addFields({ name: index === 0 ? 'SKILLS' : '\u200b', value: skillDesc });
    });
            
    return mage;
}


module.exports = { mageEmbed };


const RATINGS = {
    "1": "?",
    "4": "<:F_:1037311733833928704>",
    "5": "<:D_:1024285330217640038>",
    "6": "<:C_:1024285328246313041>",
    "7": "<:B_:1024285326270808094>",
    "8": "<:A_:1024285324345622529>",
    "9": "<:S_:1024285317643108383>",
    "10": "<:SS:1024285320268746762>",
    "11": "<:SSS:1024285322433015858>",
};

const ATTRIBUTES = {
    All: '<:atr_all:1121091748823834644> All',
    Power: '<:atr_power:1121091752321888281> Power',
    Sense: '<:atr_sense:1121091757032079451> Sense',
    Tech: '<:atr_tech:1121091759204745287> Tech'
}

const RARITIES = {
    R: '<:grade_r:1121091779496775740>',
    SR: '<:grade_sr:1121091781413568563>',
    SSR: '<:grade_ssr:1121091784978739250>',
    UR: '<:grade_ur:1121091788787171431>'
}

const CLASSES = {
    All: '<:class_all:1121091762581151754> All',
    Attacker: '<:class_attacker:1121091764573458432> Attacker',
    Debuffer: '<:class_debuffer:1121091767937273968> Debuffer',
    Defender: '<:class_defender:1121091771225612308> Defender',
    Healer: '<:class_healer:1121091774430068736> Healer'
}