// Imported Functions

import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts, fetchLatestLego } from "./api.js";
import { createContainer } from "./ui.js";

// Buttons & Inputs

const loadMoreBtn = document.getElementById("load-more-btn");
const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");

// Elements

const setNameContainer = document.createElement("p");
setNameContainer.classList.add("set-name-p");
const searchMenu = document.querySelector(".search-menu");
const resultsContainer = document.querySelector(".results-container");
const resultsCount = document.getElementById("results-count");

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
    resultsContainer.innerHTML = `<h1>Latest Sets</h1>`;
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
        const data = await fetchLegoSet(query);
        resultsCount.textContent = `Found: ${data.count}`;
        data.results.forEach(set => {
            resultsContainer.appendChild(createContainer(set, "search-name"));
        });
        loadMoreBtn.classList.remove("hidden");
    } else if (searchType === "search-details") {
        resultsCount.textContent = "";
        const data = await fetchLegoSetDetails(query);
        resultsContainer.appendChild(createContainer(data, "search-details"));
        loadMoreBtn.classList.add("hidden");
    } else if (searchType === "search-parts") {
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
