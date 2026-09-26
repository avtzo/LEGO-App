// Imported Functions

import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts } from "./api.js";

// Buttons & Inputs

const loadMoreBtn = document.getElementById("load-more-btn");
const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");

// Elements

const searchMenu = document.querySelector(".search-menu");
const resultsContainer = document.querySelector(".results-container");

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

    if (searchType === "search-name") {
        await fetchLegoSet(query);
    } else if (searchType === "search-details") {
        await fetchLegoSetDetails(query);
    } else if (searchType === "search-parts") {
        await fetchLegoSetParts(query);
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
