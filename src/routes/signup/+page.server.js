import { pingServer } from "$lib/pingServer.js";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
    await pingServer(cookies);
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const dataObj = {
            username: data.get("username"),
            password: data.get("password")
        }

        const res = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(dataObj),
            headers: {
                "content-type": "application/json"
            }
        })

        if(res.status === 200) {
            redirect(307, "/login");
        }
        
    }
}