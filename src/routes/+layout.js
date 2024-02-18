import { browser } from "$app/environment";

export async function load() {
    if(browser) {
        return {
            token: localStorage.getItem("accessToken")
        }
    }
}