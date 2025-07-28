import loginService from "@/service/login";
import socket from "@/socket";

const ValidateToken = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    let validatedUser;
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        const tokenValid = await loginService.verifyToken(user.token)
        //console.log("Tokenvalid " + tokenValid.error)
        if (tokenValid.result === "token expired") {
            window.localStorage.removeItem('loggedAppUser')
            //this.loggedUser = "";
            socket.disconnect();
            this.$router.push('/login');
            validatedUser = null;
        } else {
            console.log("+-+-+-+-+ " + tokenValid)
            //this.loggedUser = user
            validatedUser = user;
            //this.handleRecipientBookings();
            //this.handleProvider();
        }
    } else {
        console.log("No localstorage");
        validatedUser = null;
    }
    return validatedUser;
}

export default ValidateToken;