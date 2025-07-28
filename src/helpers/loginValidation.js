import loginService from "@/service/login";

const validation = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
        console.log("Tooooken 0 "  + loggedUserJSON)
        const token = JSON.parse(loggedUserJSON).token
        const tokenValid = await loginService.verifyToken(token)
        if (tokenValid) {
            //window.localStorage.removeItem('loggedAppUser')
            return false;
        } else {
            return true;
        }
    }


}

export default { validation }