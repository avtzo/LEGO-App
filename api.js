const apiKey = "2d9c5753a56fdc619d48907cba4edb13";
const baseURL = "https://rebrickable.com/api/v3/lego";

export async function fetchLegoSet(query) {
    try {
        const response = await fetch(`${baseURL}/sets/?search=${encodeURIComponent(query)}/`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        console.log(await response.json());
        return await response.json();
    } catch(error) {
        console.error(`Error: ${error.message}`);
    }
}

export async function fetchLegoSetDetails(setId) {
    try {
        const response = await fetch(`${baseURL}/sets/${setId}-1/`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        console.log(await response.json());
        return await response.json();
    } catch(error) {
        console.error(error.message);
    }
}

export async function fetchLegoSetParts(setId) {
    try {
        const response = await fetch(`${baseURL}/sets/${setId}-1/parts/`, { headers: { 'Authorization': `key ${apiKey}`}});
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        console.log(await response.json());
        return await response.json();
    } catch(error) {
        console.error(error.message);
    }
}