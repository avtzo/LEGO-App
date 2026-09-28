// Imported Functions

import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts, fetchLatestLego } from "./api.js";
import { createContainer } from "./ui.js";

// Buttons & Inputs

const loadMoreBtn = document.getElementById("load-more-btn");
const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");
const goToVaultBtn = document.getElementById("go-to-vault-btn");

// Elements

const setNameContainer = document.createElement("p");
setNameContainer.classList.add("set-name-p");
const searchMenu = document.querySelector(".search-menu");
const resultsContainer = document.querySelector(".results-container");
const resultsCount = document.getElementById("results-count");
const resultsHeader = document.getElementById("results-header");

// Local Storage

const savedSets = JSON.parse(localStorage.getItem("savedSets")) || [];

// Main Code

document.addEventListener("click", (e) => {
    const clickedBtn = e.target.closest(".search-type-btn");
    if (!clickedBtn) return;

    const menuBtns = searchMenu.querySelectorAll(".search-type-btn");
    menuBtns.forEach((btn) => {
        btn.classList.remove("active");
    });

    clickedBtn.classList.add("active");

    userInput.setAttribute("type", clickedBtn.dataset.type);
    userInput.setAttribute("placeholder", clickedBtn.dataset.placeholder);
});

async function showLatestSets() {
    const data = await fetchLatestLego();
    data.results.forEach(set => {
        resultsContainer.appendChild(createContainer(set, "search-name"));
    });
    loadMoreBtn.classList.remove("hidden");
}

async function search(query) {
    const activeBtn = searchMenu.querySelector(".search-type-btn.active");
    const searchType = activeBtn ? activeBtn.dataset.action : "search-name";
    resultsContainer.innerHTML = "";

    if (searchType === "search-name") {
        resultsHeader.textContent = "Search Results";

        const data = await fetchLegoSet(query);
        resultsCount.textContent = `Found: ${data.count}`;

        data.results.forEach(set => {
            resultsContainer.appendChild(createContainer(set, "search-name"));
        });
        loadMoreBtn.classList.remove("hidden");
    } else if (searchType === "search-details") {
        resultsHeader.textContent = "Set Details";

        resultsCount.textContent = "";

        const data = await fetchLegoSetDetails(query);
        resultsContainer.appendChild(createContainer(data, "search-details"));
        loadMoreBtn.classList.add("hidden");
    } else if (searchType === "search-parts") {
        resultsHeader.textContent = "Set Parts";

        const data = await fetchLegoSetParts(query);
        resultsCount.textContent = `Total Parts: ${data.count}`;
        setNameContainer.textContent = `Set Number: ${data.results[0].set_num}`;

        resultsContainer.appendChild(setNameContainer);

        data.results.forEach(part => {
            resultsContainer.appendChild(createContainer(part, "search-parts"));
        });
        loadMoreBtn.classList.remove("hidden");
    }
}

showLatestSets();



searchBtn.addEventListener("click", () => {
    const query = userInput.value.trim();

    if (query === "") {
        resultsContainer.innerHTML = "";
        resultsHeader.textContent = "Latest Sets";
        showLatestSets();
        return;
    }

    search(query);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

goToVaultBtn.addEventListener("click", () => {
    resultsContainer.innerHTML = "";
    resultsHeader.textContent = "The Vault";
    loadMoreBtn.classList.add("hidden");
});

resultsContainer.addEventListener("click", (e) => {
    const addToVaultBtn = e.target.closest(".add-to-vault-btn");
    if (!addToVaultBtn) {
        return;
    }
    // Local Storage Save Logic
});