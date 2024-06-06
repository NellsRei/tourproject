const userlink = 'http://localhost:3000/Users'



enum Role { "Admin" = "admin", "User" = "user" }

type User = {
    id: number,
    username: string,
    email: string,
    password: string,
    booking: [],
    role: Role
}

class Auth {
    getUserDetails() {
        const username = document.getElementById("username")! as HTMLInputElement
        const password = document.getElementById("password")! as HTMLInputElement
        const email = document.getElementById("email")! as HTMLInputElement
        const signupbtn = document.getElementById("signupbtn")! as HTMLButtonElement
        const errormessage = document.querySelector(".errormessage")! as HTMLDivElement

        if (signupbtn) {
            signupbtn.addEventListener('click', async (e) => {
                e.preventDefault()

                if (!username.value || !password.value || !email.value) {
                    errormessage.innerHTML = `<p>Fill in all the boxes</p>`
                    errormessage.style.display = "block"
                    errormessage.style.backgroundColor = "red"
                } else {
                    const userExists = await this.checkUserExists(username.value)
                    if (userExists) {
                        errormessage.innerHTML = `<p>Username Already Exists</p><p>If you already have an account, log in</p>`
                        errormessage.style.display = "block"
                        errormessage.style.backgroundColor = "red"
                    } else {
                        errormessage.innerHTML = `<p>Registration Successful</p>`
                        errormessage.style.display = "block"
                        errormessage.style.backgroundColor = "green"
                        window.location.href = "login.html"
                        await this.AddUser(username.value, password.value, email.value)
                        setTimeout(() => {
                            errormessage.style.display = "none"
                        }, 700000);
                        window.location.href = "login.html"
                    }
                }
            })
        }
    }

    // For creating a new user
    public async AddUser(username: string, password: string, email: string) {
        const userExists = await this.checkUserExists(username)
        if (userExists) {
            console.log("Username already exists. Try another name")
            return
        }

        const id = await this.generateId()
        const role = await this.assignRole(id)

        const newUser: User = {
            id: id,
            username: username,
            email: email,
            password: password,
            booking: [], 
            role: role
        }

        const response = await fetch(userlink, {
            method: 'POST',
            body: JSON.stringify(newUser)
        })

        if (!response) {
            console.log("Failed to add user")
        }
    }

    // Checks if a username already exists
    private async checkUserExists(username: string): Promise<boolean> {
        const response = await fetch(userlink)
        if (response) {
            const users: User[] = await response.json()
            return users.some(user => user.username === username)
        }
        return false
    }

    // Generate a new unique ID for a user
    private async generateId(): Promise<number> {
        const response = await fetch(userlink)
        if (response.ok) {
            const users: User[] = await response.json()
            const lastUser = users[users.length - 1]
             //ternary operator that executes the firt part if the codition is true and the second part if false
            return lastUser ? lastUser.id + 1 : 1  
        }
        return 1
    }

    // Assign role based on user ID
    private async assignRole(id: number): Promise<Role> {
        return id <= 3 ? Role.Admin : Role.User
    }

    // For the login users
    loginAuth() {
        const loginUsername = document.getElementById("logusername")! as HTMLInputElement
        const loginPassword = document.getElementById("logpassword")! as HTMLInputElement
        const loginBtn = document.getElementById("loginbtn")! as HTMLButtonElement
        const loginErrorMessage = document.querySelector(".errormessage") as HTMLDivElement

        if (loginBtn) {
            console.log("Event listener attached")
            loginBtn.addEventListener("click", async (e) => {
                e.preventDefault()

                const logUsername: string = loginUsername.value
                const logPassword: string = loginPassword.value

                if (!logUsername || !logPassword) {
                    loginErrorMessage.innerHTML = `<p>Fill in all the boxes</p>`
                    loginErrorMessage.style.display = "block"
                    loginErrorMessage.style.backgroundColor = "red"
                } else {
                    const user = await this.validateUser(logUsername, logPassword)
                    if (user) {
                        console.log("Login Successful")
                        sessionStorage.setItem("username", logUsername)
                        sessionStorage.setItem("userID", `${user.id}`)
                        console.log(user.id)
                        localStorage.setItem("role", `${user.role}`)
                        console.log(user.role)
                        const pUsername = document.querySelector(".username") as HTMLParagraphElement
                        if (pUsername) {
                            pUsername.textContent = logUsername || " "
                        }
                        loginErrorMessage.innerHTML = `<p>Login Successful</p>`
                        loginErrorMessage.style.display = "block"
                        loginErrorMessage.style.backgroundColor = "green"
                        setTimeout(() => {
                            loginErrorMessage.style.display = "none"
                        }, 700000)
                        window.location.href = "tour.html"
                    } else {
                        loginErrorMessage.innerHTML = `<p>Invalid username or password</p>`
                        loginErrorMessage.style.display = "block";
                        loginErrorMessage.style.backgroundColor = "red"
                    }
                }
            })
        }
    }

    private async validateUser(logUsername: string, logPassword: string): Promise<User | null> {
        const response = await fetch(userlink)
        if (response) {
            const users: User[] = await response.json()
            return users.find(user => user.username === logUsername && user.password === logPassword) || null
        }
        return null
    }
    // public deleteuser(){
    //     const deleteAccountButton = document.getElementById("deleteuser")! as HTMLButtonElement
    //     deleteAccountButton.addEventListener("click", async (e)=>{
    //         e.preventDefault
    //         console.log("Delete Account button pressed")
    //     })
    // }
}

const authUsers = new Auth()
authUsers.getUserDetails()
authUsers.loginAuth()
