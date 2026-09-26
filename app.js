// Imported Functions

import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts } from "./api.js";
import { createContainer } from "./ui.js";

// Buttons & Inputs

const loadMoreBtn = document.getElementById("load-more-btn");
const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");

// Elements

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
    } else if (searchType === "search-details") {
        const data = await fetchLegoSetDetails(query);
        resultsContainer.appendChild(createContainer(data, "search-details"));
    } else if (searchType === "search-parts") {
        const data = await fetchLegoSetParts(query);
        resultsCount.textContent = `Total Parts: ${data.count}`;
        data.results.forEach(part => {
            resultsContainer.appendChild(createContainer(part, "search-parts"));
        });
    }
}

searchBtn.addEventListener("click", () => {
    const query = userInput.value.trim();

    if (query === "") {
        alert("Please enter a set");
        return;
    }

    search(query);
});
