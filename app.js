import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts, fetchLatestLego } from "./api.js";
import { createContainer, createGenreContainers, LEGO_THEMES } from "./ui.js";

// Global State
let ON_VAULT = false;
let allResults = [];
let currentIndex = 0;
let pageSizeValue = 8;

export let savedSets = JSON.parse(localStorage.getItem("savedSets")) || [];

// DOM Elements
const loadMoreBtn = document.getElementById("load-more-btn");
const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");
const goToVaultBtn = document.getElementById("go-to-vault-btn");
const searchMenu = document.querySelector(".search-menu");
const resultsContainer = document.querySelector(".results-container");
const resultsCount = document.getElementById("results-count");
const resultsHeader = document.getElementById("results-header");
const pageSize = document.getElementById("page-size");
const sortBy = document.getElementById("sort-by");
const genreScreen = document.querySelector(".genre-select-screen");
const searchByThemesBtn = document.getElementById("search-by-genre-btn");

function renderSkeletons() {
    resultsContainer.innerHTML = Array(6).fill(`
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
        </div>
    `).join("");
}

function renderError(message = "Something went wrong. Please try again!") {
    resultsContainer.innerHTML = `<p id="empty-vault-msg">${message}</p>`;
    loadMoreBtn.classList.add("hidden");
}

// Event Listeners
document.addEventListener("click", (e) => {    
    const clickedBtn = e.target.closest(".search-type-btn");
    const clickedCard = e.target.closest(".theme-card");

    if (clickedCard) console.log(clickedCard.dataset.theme);
    
    searchMenu.querySelectorAll(".search-type-btn").forEach(btn => btn.classList.remove("active"));
    
    if (clickedBtn) {
        clickedBtn.classList.add("active");
        userInput.setAttribute("type", clickedBtn.dataset.type);
        userInput.setAttribute("placeholder", clickedBtn.dataset.placeholder);
    }
});

async function showLatestSets() {
    renderSkeletons();
    const data = await fetchLatestLego();
    
    if (!data || !data.results) return renderError("Could not fetch latest sets. <img src='images/lego-404.jpg' alt='Error Image' id='error-img'>");

    resultsContainer.innerHTML = "";
    allResults = data.results;
    currentIndex = 0;
    pageSizeValue = Number(pageSize.value) || 8;
    
    loadMoreSets();
}

async function search(query) {
    const activeBtn = searchMenu.querySelector(".search-type-btn.active");
    const searchType = activeBtn ? activeBtn.dataset.action : "search-name";
    
    renderSkeletons();

    if (searchType === "search-name") {
        resultsHeader.textContent = "Search Results";
        pageSize.classList.remove("hidden");

        const data = await fetchLegoSet(query);
        if (!data || !data.results) return renderError("No sets found. <img src='images/lego-404.jpg' alt='Error Image' id='error-img'>");

        resultsContainer.innerHTML = "";
        allResults = data.results;
        currentIndex = 0;
        pageSizeValue = Number(pageSize.value) || 8;

        resultsCount.textContent = `Found: ${data.count}`;
        loadMoreSets();

    } else if (searchType === "search-details") {
        resultsHeader.textContent = "Set Details";
        pageSize.classList.add("hidden");
        resultsCount.textContent = "";

        const data = await fetchLegoSetDetails(query);
        resultsContainer.innerHTML = "";
        if (!data) return renderError("Set not found. <img src='images/lego-404.jpg' alt='Error Image' id='error-img'>");
        
        resultsContainer.appendChild(createContainer(data, "search-details"));
        loadMoreBtn.classList.add("hidden");

    } else if (searchType === "search-parts") {
        loadMoreBtn.classList.add("hidden");
        resultsHeader.textContent = "Set Parts";
        pageSize.classList.add("hidden");
        
        const data = await fetchLegoSetParts(query, 1);
        resultsContainer.innerHTML = "";

        if (!data || !data.results) return renderError("No parts found for this set. <img src='images/lego-404.jpg' alt='Error Image' id='error-img'>");

        data.results.forEach(part => {
            resultsContainer.appendChild(createContainer(part, "search-parts"));
        });
        
        resultsCount.textContent = `Total Parts: ${data.count}`;
    }
}

function loadMoreSets() {
    const nextBatch = allResults.slice(currentIndex, currentIndex + pageSizeValue);

    nextBatch.forEach(set => {
        resultsContainer.appendChild(createContainer(set, "search-name"));
    });

    currentIndex += pageSizeValue;
    loadMoreBtn.classList.toggle("hidden", currentIndex >= allResults.length);
}

function displayThemes() {
    genreScreen.innerHTML = "";
    genreScreen.classList.remove("hidden");
    const themes = Object.values(LEGO_THEMES);

    for (let theme of themes) {
        genreScreen.appendChild(createGenreContainers(theme));
    }
}

async function displayVault() {
    if (savedSets.length === 0) {
        resultsContainer.innerHTML = `<p id="empty-vault-msg">Your Vault is Empty!</p>`;
        return;
    }

    renderSkeletons();

    const setPromises = savedSets.map(setId => fetchLegoSetDetails(setId));
    const fetchedSets = await Promise.all(setPromises);

    resultsContainer.innerHTML = "";    
    fetchedSets.filter(Boolean).forEach(set => {
        resultsContainer.appendChild(createContainer(set, "search-name"));
    });
}

// Event Bindings
loadMoreBtn.addEventListener("click", loadMoreSets);

pageSize.addEventListener("change", (e) => {
    pageSizeValue = Number(e.target.value);
    resultsContainer.innerHTML = "";
    currentIndex = 0;
    loadMoreSets();
});

searchBtn.addEventListener("click", () => {
    ON_VAULT = false;
    resultsCount.classList.remove("hidden");
    const query = userInput.value.trim();

    if (query === "") {
        resultsContainer.innerHTML = "";
        resultsHeader.textContent = "Latest Sets";
        resultsCount.classList.add("hidden");
        showLatestSets();
        return;
    }
    search(query);
});

searchByThemesBtn.addEventListener("click", () => {
    resultsContainer.classList.add("hidden");
    displayThemes();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
});

goToVaultBtn.addEventListener("click", () => {
    ON_VAULT = true;
    resultsContainer.innerHTML = "";
    resultsHeader.textContent = "The Vault";
    resultsCount.classList.add("hidden");
    loadMoreBtn.classList.add("hidden");
    displayVault();
});

resultsContainer.addEventListener("click", (e) => {
    const addToVaultBtn = e.target.closest(".add-to-vault-btn");
    if (!addToVaultBtn) return;

    const setId = addToVaultBtn.id;
    const bookmarkIcon = addToVaultBtn.querySelector("i");

    if (savedSets.includes(setId)) {
        savedSets = savedSets.filter(id => id !== setId);
        bookmarkIcon.classList.replace("fa-solid", "fa-regular");
    } else {
        savedSets.push(setId);
        bookmarkIcon.classList.replace("fa-regular", "fa-solid");
    }

    localStorage.setItem("savedSets", JSON.stringify(savedSets));
    if (ON_VAULT) displayVault();
});

// Init
showLatestSets();