import { pingServer } from "$lib/pingServer.js";
import { redirect } from "@sveltejs/kit";
import { baseUrl } from "../../lib/stores.js";

export async function load({ cookies }) {
    const loggedIn = await pingServer(cookies);
    if(loggedIn) throw redirect(303, "/");
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const dataObj = {
            username: data.get("username"),
            password: data.get("password")
        }

        const res = await fetch(baseUrl + "api/auth/signin", {
            method: "POST",
            body: JSON.stringify(dataObj),
            headers: {
                "content-type": "application/json"
            }
        })

        if(res.status === 200) {
            const json = await res.json();
            cookies.set("jwt", json.accessToken, { path: "/" });
            throw redirect(303, "/");
        }
        
    }
}