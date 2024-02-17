export async function load({ cookies }) {
    return {
        jwt: await cookies.get("jwt")
    }
}