import { pingServer } from "$lib/pingServer.js";
import { redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";

export async function load({ fetch }) {
    if(browser) {
        const token = window.localStorage.getItem("accessToken")
        const loggedIn = await pingServer(token, fetch);
        if(loggedIn) throw redirect(303, "/");
    }
}