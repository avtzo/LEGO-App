import { savedSets } from "./app.js";

const LEGO_THEMES = {
    1: "Technic",
    22: "Creator / Creator Expert",
    52: "City / Town",
    126: "Space",
    147: "Pirates",
    158: "Star Wars",
    186: "Castle",
    207: "Trains",
    246: "Harry Potter",
    324: "Bionicle",
    435: "Ninjago",
    494: "Friends",
    501: "Collectible Minifigures",
    503: "Marvel Super Heroes",
    504: "DC Super Heroes",
    505: "Architecture",
    507: "DUPLO / Educational",
    576: "LEGO Ideas / CUUSOO",
    598: "Seasonal / Promotional",
    605: "Classic",
    608: "Friends (New)",
    609: "The LEGO Movie",
    610: "BrickHeadz",
    621: "Speed Champions",
    688: "Minecraft",
    694: "BrickLink Designer Program",
    737: "Botanical Collection"
};

export function createContainer(item, searchType) {
    const container = document.createElement("div");
    container.classList.add("container");
    const setTheme = item.theme_id; 
    
    const isSaved = savedSets.includes(item.set_num);
    const iType = isSaved ? "solid" : "regular";

    if (searchType === "search-name") {
        container.innerHTML = 
        ` 
            <img src="${item.set_img_url}" class="container-img">
            <h1 class="set-name">${item.name}</h1>
            <h2 class="set-theme">Theme: ${LEGO_THEMES[setTheme] || "Unknown Theme"}</h2>
            <div>
                <p>Set Number: ${item.set_num.split("-")[0]}</p>
                <button type="button" class="add-to-vault-btn" id="${item.set_num}"><i class="fa-${iType} fa-bookmark"></i></button>
            </div>
            `;
    } else if (searchType === "search-details") {
        container.innerHTML =
        `
            <img src="${item.set_img_url}" class="container-img">
            <h1 class="set-name">${item.name}</h1>
            <h2 class="set-theme">${LEGO_THEMES[setTheme] || "Unknown Theme"}</h2>
            <p>Set Number: ${item.set_num.split("-")[0]}</p>
            <p id="set-parts">Parts: ${item.num_parts}</p>
            <p id="set-release">Release Date: ${item.year}</p>
        `;
        container.style.width = "250px";
    } else if (searchType === "search-parts") {
        container.innerHTML = 
        `
            <img src="${item.part.part_img_url}" alt="${item.part.name}" class="container-img">
            <h1 class="part-id">${item.part.part_num}</h1>
            <h3 class="part-quantity">Quantity: ${item.quantity}</h3>
        `;
    }

    return container;
}