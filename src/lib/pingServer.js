import { baseUrl } from "./stores";

export async function pingServer(cookies) {
    if(cookies.get("jwt")) {
        const res = await fetch(baseUrl + "greeting", {
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`
            }
        });

        if(res.status === 200) {
            return true;
        }
        cookies.delete("jwt", { path: "/"});
    }
    return false;
}