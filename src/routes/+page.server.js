
import { redirect } from "@sveltejs/kit";

export function load({ cookies }) {
    return {
        jwt: cookies.get("jwt")
    }
}

export const actions = {
    logout: async({ cookies }) => {
        await cookies.delete("jwt", { path: "/" });
        redirect(303, "/");
    }
}
