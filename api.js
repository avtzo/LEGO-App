const apiKey = "YOUR_API_KEY_HERE";
const baseURL = "https://rebrickable.com/api/v3/lego";

function normalizeSetId(setId) {
    const value = String(setId).trim();
    return value.includes("-") ? value : `${value}-1`;
}

export async function fetchLegoSet(query) {
    try {
        const response = await fetch(`${baseURL}/sets/?search=${encodeURIComponent(query)}&min_parts=50`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.error(`Error: ${error.message}`);
    }
}

export async function fetchLegoSetDetails(setId) {
    try {
        const normalizedSetId = normalizeSetId(setId);
        const response = await fetch(`${baseURL}/sets/${normalizedSetId}/`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.error(error.message);
    }
}

export async function fetchLegoSetParts(setId, page) {
    try {
        const normalizedSetId = normalizeSetId(setId);
        const response = await fetch(`${baseURL}/sets/${normalizedSetId}/parts/?page=${page}&page_size=100`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.error(error.message);
    }
}

export async function fetchLatestLego() {
    try {
        const response = await fetch(`${baseURL}/sets/?min_year=${new Date().getFullYear()}&min_parts=150`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.error(error.message);
    }
}