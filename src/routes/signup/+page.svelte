<script>
    const signup = (e) => {
        e.preventDefault();
    }

//     export const actions = {
//     default: async ({ request, cookies }) => {
//         const data = await request.formData();
//         const dataObj = {
//             username: data.get("username"),
//             password: data.get("password")
//         }

//         const res = await fetch("http://localhost:8080/api/auth/signup", {
//             method: "POST",
//             body: JSON.stringify(dataObj),
//             headers: {
//                 "content-type": "application/json"
//             }
//         })

//         if(res.status === 200) {
//             redirect(307, "/login");
//         }
        
//     }
// }
</script>

<h1>Sign Up</h1>
<form method="POST" on:submit={signup}>
	<label>Username:<input name="username" /></label><br />
	<label>Password:<input name="password" type="password" /></label><br />
	<input type="submit" value="Sign Up" />
</form>
<style>
    form > * {
        margin-left: 1em;
        margin-bottom: .5em;
    }
    label > input {
        margin-left: .5em;
    }
</style>