export function load({ cookies }) {
    return {
        jwt: cookies.get("jwt")
    }
}