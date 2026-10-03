// Global

let ON_VAULT = false;
let allResults = [];
let currentIndex = 0;
let pageSizeValue = 8;

// Imported Functions

import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts, fetchLatestLego } from "./api.js";
import { createContainer } from "./ui.js";


// Buttons & Inputs

const loadMoreBtn = document.getElementById("load-more-btn");
const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");
const goToVaultBtn = document.getElementById("go-to-vault-btn");

// Elements

const searchMenu = document.querySelector(".search-menu");
const resultsContainer = document.querySelector(".results-container");
const resultsCount = document.getElementById("results-count");
const resultsHeader = document.getElementById("results-header");
const pageSize = document.getElementById("page-size");
const resultsHeaderFilters = document.querySelector(".results-screen-filters");


// Local Storage

export const savedSets = JSON.parse(localStorage.getItem("savedSets")) || [];

// Main Code

function renderSkeletons() {
    resultsContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.className = "skeleton-card";
        skeletonCard.innerHTML = 
        `
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
        `;
        resultsContainer.appendChild(skeletonCard);
    }
}

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
    renderSkeletons();

    const data = await fetchLatestLego();

    resultsContainer.innerHTML = "";
    allResults = data.results;
    currentIndex = 0;
    pageSizeValue = Number(pageSize.value) || 8;
    loadMoreBtn.classList.remove("hidden");
    
    loadMoreSets();
}

async function search(query) {
    
    const activeBtn = searchMenu.querySelector(".search-type-btn.active");
    const searchType = activeBtn ? activeBtn.dataset.action : "search-name";
    
    renderSkeletons();

    if (searchType === "search-name") {
        resultsContainer.innerHTML = "";
        resultsHeader.textContent = "Search Results";

        pageSize.classList.remove("hidden");

        const data = await fetchLegoSet(query);
        resultsContainer.innerHTML = "";

        allResults = data.results;
        currentIndex = 0;
        pageSizeValue = Number(pageSize.value) || 8;

        resultsCount.textContent = `Found: ${data.count}`;
        loadMoreBtn.classList.remove("hidden");

        loadMoreSets();

    } else if (searchType === "search-details") {
        resultsHeader.textContent = "Set Details";
        pageSize.classList.add("hidden");
        resultsCount.textContent = "";

        const data = await fetchLegoSetDetails(query);
        resultsContainer.innerHTML = "";
        resultsContainer.appendChild(createContainer(data, "search-details"));
        loadMoreBtn.classList.add("hidden");
    } else if (searchType === "search-parts") {
        loadMoreBtn.classList.add("hidden");
        resultsHeader.textContent = "Set Parts";
        pageSize.classList.add("hidden");
        
        let currentPage = 1;

        let data = await fetchLegoSetParts(query, currentPage);
        resultsContainer.innerHTML = "";

        data.results.forEach(part => {
            resultsContainer.appendChild(createContainer(part, "search-parts"));
        });

        while (data.next !== null) { // Gets all the parts of a set
            currentPage ++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Timeout for the API Calls

            data = await fetchLegoSetParts(query, currentPage);
            
            data.results.forEach(part => {
                resultsContainer.appendChild(createContainer(part, "search-parts"));
            });
        }        
        
        resultsCount.textContent = `Total Parts: ${data.count}`;
    }
}

function loadMoreSets() {
    const nextBatch = allResults.slice(currentIndex, currentIndex + pageSizeValue);

    nextBatch.forEach(set => {
        resultsContainer.appendChild(createContainer(set, "search-name"));
    });

    currentIndex += pageSizeValue;

    if (currentIndex >= allResults.length) {
        loadMoreBtn.classList.add("hidden");
    } else {
        loadMoreBtn.classList.remove("hidden");
    }
}

showLatestSets();

async function displayVault() {
    if (savedSets.length === 0) {
        resultsContainer.innerHTML = `<p id="empty-vault-msg">Your Vault is Empty!</p>`;
        return;
    }

    renderSkeletons();

    const setPromises = savedSets.map(setId => fetchLegoSetDetails(setId));
    const fetchedSets = await Promise.all(setPromises);

    resultsContainer.innerHTML = "";    
    fetchedSets.forEach(set => {
        resultsContainer.appendChild(createContainer(set, "search-name"));
    });
}

loadMoreBtn.addEventListener("click", loadMoreSets);

pageSize.addEventListener("change", (e) => {
    const newPageSize = Number(e.target.value);
    pageSizeValue = newPageSize;
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

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
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
    if (!addToVaultBtn) {
        return;
    }
    const bookmarkIcon = addToVaultBtn.querySelector("i");
    if (savedSets.includes(addToVaultBtn.id)) {
        const itemToRemove = savedSets.indexOf(addToVaultBtn.id);
        savedSets.splice(itemToRemove, 1);
        bookmarkIcon.classList.replace("fa-solid", "fa-regular");
    } else {
        savedSets.push(addToVaultBtn.id);
        bookmarkIcon.classList.replace("fa-regular", "fa-solid");
    }
    localStorage.setItem("savedSets", JSON.stringify(savedSets));
    if (ON_VAULT) {
        displayVault();
    }
});