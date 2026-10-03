# 🧱 LEGO Vault - Web Application

A responsive, single-page web application built with **Vanilla JavaScript** that allows users to search for LEGO sets using the **Rebrickable API**, view set details, and save their favorite builds into a persistent local collection ("Vault") using **LocalStorage**.

---

## 🌟 Key Features

- **Dynamic LEGO Search:** Query thousands of official LEGO sets in real-time powered by Rebrickable's public REST API.
- **Personal Vault Collection:** Save and remove sets from your personal collection without requiring a backend database.
- **Client-Side Persistence:** LocalStorage integration preserves user data across browser sessions.
- **Fully Responsive Design:** Custom-crafted layout optimized across mobile devices, portrait/landscape tablets, and laptops.
- **Optimized Performance:** Debounced inputs, event delegation, and lazy image loading for smooth UI rendering.

---

## 🛠️ Tech Stack & Architecture

- **JavaScript:** ES6+ Modules (Vanilla JS, No External Frameworks)
- **Styling:** CSS3 (Flexbox, Grid, Media Queries)
- **API:** [Rebrickable API v3](https://rebrickable.com/api/)
- **Data Persistence:** Browser `window.localStorage`

---

## 📱 Responsive Breakpoints

The application utilizes strict media query logic to prevent coverage gaps across devices:

| Device Target | Breakpoint / Criteria | Layout Key Adjustments |
| :--- | :--- | :--- |
| **Mobile / Phone** | `max-width: 768px` | Single-column header, stacked inputs, optimized touch targets. |
| **Tablet (Portrait)** | `min-width: 769px` & `max-width: 1194px` (`orientation: portrait`) | Expanded search bar (70% width), horizontal menu layout. |
| **Tablet (Landscape)** | `min-width: 769px` & `max-width: 1194px` (`orientation: landscape`) | Split header (`flex-direction: row`), 40% search bar width. |
| **Laptop / Desktop** | `min-width: 1195px` & `max-width: 1440px` | Full multi-column grid, spaced controls, enlarged UI buttons. |

---

## 🚀 Getting Started

### Prerequisites

You need a web browser and a Rebrickable API Key.

1. Sign up for a free account at [Rebrickable](https://rebrickable.com/).
2. Generate an API Key under **Account Settings -> API**.

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avtzo/LEGO-App.git
   ```
2. **Configure your API Key**
    - Open **api.js** and replace the placeholder with your key:
      ```const apiKey = 'YOUR_API_KEY_HERE';``` 
