const fetch = require("node-fetch");
const Database = require("better-sqlite3");
const db = new Database("./bcm.db");

async function autoUpdate() {
    // * mage
    const CurrentChar = db.prepare("SELECT name FROM character;").all();

    let characters = await fetch("https://www.prydwen.gg/page-data/black-clover/characters/page-data.json");
    let json2 = await characters.json();
    json2 = json2.result.data.allCharacters.nodes;

    for (let i = 0; i < json2.length; i++) {
        // Add character to db
        if (!CurrentChar.some(char => char.name === json2[i].name)) {

            // Prepare SQL
            let update = db.prepare("INSERT OR IGNORE INTO character (name, slug) VALUES (?, ?);");

            // Add to DB
            update.run(json2[i].name, json2[i].slug);
        }
    }

    // * SKills
    const CurrentSkill = db.prepare("SELECT name FROM skill_page;").all();

    let skills = await fetch("https://www.prydwen.gg/page-data/black-clover/skill-pages/page-data.json");
    let json = await skills.json();
    json = json.result.data.allCharacters.nodes;

    for (let i = 0; i < json.length; i++) {
        // Add character to db
        if (!CurrentSkill.some(skill => skill.name === json[i].name)) {

            // Prepare SQL
            let update = db.prepare("INSERT OR IGNORE INTO skill_page (name, slug) VALUES (?, ?);");

            // Add to DB
            update.run(json[i].name, json[i].slug);
        }
    }
}

(async () => { await autoUpdate() })();
module.exports = { autoUpdate }