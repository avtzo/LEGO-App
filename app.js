// Imported Functions

import { fetchLegoSet, fetchLegoSetDetails, fetchLegoSetParts } from "./api.js";

// Buttons & Inputs

const searchBtn = document.getElementById("search-btn");
const userInput = document.getElementById("user-input");

// Elements

const searchMenu = document.querySelector(".search-menu");

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
