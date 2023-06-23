const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { randomColor } = require("./randomColor");

let skillDesc;

function writeSkill(raw) {
    for (let content of raw.content) {
        
        if (content.value) {
            skillDesc += content.value;
            continue;
        }
        
        if (content.content) writeSkill(content);
    }
}

async function skillEmbed(name) {
    const response = await fetch(`https://www.prydwen.gg/page-data/black-clover/skill-page/${name.replace(/ /g, "-")}/page-data.json`);
    
    // Send suggestion if can't find the character
    if (response.status != 200) return false;

    // JSONify
    let json = await response.json();
    json = json.result.data.currentUnit.nodes[0];

    // * Title
    let title = `[${RARITIES[json.rarity]}] `;
    if (json.class !== 'Any') title += `[${CLASSES[json.class]}] `;
    title += `${json.name}`

    // * Passive
    let passive = JSON.parse(json.passive.raw);
    let passiveDesc = '```ini\n';
    passive.content[0].content.forEach( text => {
        passiveDesc += text.value;
    })
    passiveDesc += '```';

    // Create embed
    let skill = new EmbedBuilder()
        .setTitle(title)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/black-clover/skill-page/${name.trim().replace(/ /g, "-").toLowerCase()})`)
        .setThumbnail(`https://prydwen.gg${json.image.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setColor(randomColor())
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields({ name: 'PASSIVE', value: passiveDesc })

    // Skill
    if (json.character) {
        let char = json.character;
        skillDesc = '';
        skillDesc += `**Character: ${char.name}**\n`;
    
        skillDesc += '```ini\n'
    
        let target = char.skills.filter(skill => skill.hasEnhancedVersion);
        let enhancedRaw = JSON.parse(target[0].descriptionEnhanced.raw);
    
        writeSkill(enhancedRaw);
    
        skillDesc += '```';

        skill.addFields({ name: 'SKILL UPGRADE', value: skillDesc });
    }

    return skill;
}


module.exports = { skillEmbed };


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