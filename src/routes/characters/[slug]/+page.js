import { baseUrl } from "$lib/stores.js";

export async function load({ params, fetch }) {
    const res = await fetch(baseUrl + `api/characters/${params.slug}`, {
        headers: {
            Authorization: "Bearer " + window.localStorage.getItem("accessToken")
        }
    })
    if(res.status !== 200) {
        throw error(res.status);
    }

    const json = await res.json();

    return {
        character: json.character,
        owner: json.userId == window.localStorage.getItem("id")
    }
}