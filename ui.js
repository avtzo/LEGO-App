import { savedSets } from "./app.js";


export const LEGO_THEMES = {
    // --- Core & Classic Themes ---
    1: "Technic",
    22: "Creator",
    52: "City",
    126: "Space",
    147: "Pirates",
    158: "Star Wars",
    186: "Castle",
    207: "Trains",
    258: "Mindstorms",
    279: "Kingdoms",
    324: "Bionicle",
    388: "Wild West",
    435: "Ninjago",
    494: "Friends",
    501: "Collectible Minifigures",
    505: "Architecture",
    507: "DUPLO",
    576: "Ideas",
    598: "Seasonal",
    605: "Classic",
    608: "Friends (New)",
    609: "The LEGO Movie",
    610: "BrickHeadz",
    621: "Speed Champions",
    694: "BrickLink Designer Program",

    // --- Super Heroes & Pop Culture ---
    503: "Marvel Super Heroes",
    504: "DC Super Heroes",
    246: "Harry Potter",
    604: "Disney",
    654: "Jurassic World",
    706: "Avatar",
    717: "Icons",
    721: "Icons",
    737: "Botanical Collection",
    750: "Wicked",
    751: "Dungeons & Dragons",

    // --- Gaming & Interactive Themes ---
    577: "Minecraft",
    695: "Super Mario",
    709: "Sonic the Hedgehog",
    746: "Animal Crossing",
    747: "Fortnite",
    748: "The Legend of Zelda",

    // --- Popular IP & Retro/Action Themes ---
    112: "Racers",
    296: "Adventurers",
    411: "Belville",
    560: "SpongeBob SquarePants",
    561: "The Lord of the Rings",
    562: "The Hobbit",
    563: "Monster Fighters",
    570: "Hero Factory",
    571: "Legends of Chima",
    575: "The Lone Ranger",
    600: "Indiana Jones",
    601: "Scooby-Doo",
    602: "Angry Birds",
    606: "Ghostbusters",
    672: "Overwatch",
    673: "Stranger Things",
    677: "Hidden Side",
    707: "Dreamzzz"
};

export function createContainer(item, type) {
    const card = document.createElement("div");
    card.className = "container";

    const imgUrl = item.set_img_url || item.part.part_img_url || "./images/no-image.png";
    const titleText = item.name || item.part.name || "Unknown LEGO Item";
    const theme = LEGO_THEMES[item.theme_id] || "N/A";

    if (type === "search-name") {
        const setNum = item.set_num ? item.set_num.split("-")[0] : "";
        const numParts = item.num_parts !== undefined ? `${item.num_parts} parts` : "";
        const isSaved = savedSets.includes(item.set_num);
        const iconClass = isSaved ? "fa-solid" : "fa-regular";

        card.innerHTML = `
            <img src="${imgUrl}" alt="${titleText}" class="container-img" loading="lazy">
            <h1>${titleText}</h1>
            <h2>${theme}</h2>
            <div class="card-footer">
                <div class="card-info">
                    <h2>#${setNum}</h2>
                    <p>${numParts}</p>
                </div>
                <button class="add-to-vault-btn" id="${item.set_num}" title="Add/Remove from Vault">
                    <i class="${iconClass} fa-bookmark"></i>
                </button>
            </div>
        `;
    } else if (type === "search-details") {
        const setNum = item.set_num ? item.set_num.split("-")[0] : "";
        const year = item.year ? `Released: ${item.year}` : "";
        const numParts = item.num_parts !== undefined ? `${item.num_parts} parts` : "";

        card.classList.add("details");
        card.innerHTML = `
            <img src="${imgUrl}" alt="${titleText}" class="container-img" loading="lazy">
            <h1>${titleText}</h1>
            
            <div class="card-footer">
                <div class="card-info">
                    <h2>#${setNum} • ${year}</h2>
                    <p>${numParts}</p>
                </div>
            </div>
        `;
    } else if (type === "search-parts") {
        const partNum = item.part?.part_num || "";
        const quantity = item.quantity ? `Qty: ${item.quantity}` : "";

        card.classList.add("parts");
        card.innerHTML = `
            <img src="${imgUrl}" alt="${titleText}" class="container-img" loading="lazy">
            <h1>${titleText}</h1>
            
            <div class="card-footer">
                <div class="card-info">
                    <h2>Part #${partNum}</h2>
                    <p>${quantity}</p>
                </div>
            </div>
        `;
    }

    return card;
}

export function createGenreContainers(theme) {
    const themeCard = document.createElement("div");
    themeCard.className = "theme-card";
    themeCard.setAttribute("data-theme", theme);
    themeCard.innerHTML =
    `
        <img class="theme-img" src="/images/covers/${theme.toLowerCase()}.jpg" alt="${theme} image" title="${theme}"></img>
        <h1 class="theme-text">${theme}</h1>
    `;

    return themeCard;
}