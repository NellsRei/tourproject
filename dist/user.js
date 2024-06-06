"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userlink = 'http://localhost:3000/Users';
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["User"] = "user";
})(Role || (Role = {}));
class Auth {
    getUserDetails() {
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const email = document.getElementById("email");
        const signupbtn = document.getElementById("signupbtn");
        const errormessage = document.querySelector(".errormessage");
        if (signupbtn) {
            signupbtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                if (!username.value || !password.value || !email.value) {
                    errormessage.innerHTML = `<p>Fill in all the boxes</p>`;
                    errormessage.style.display = "block";
                    errormessage.style.backgroundColor = "red";
                }
                else {
                    const userExists = yield this.checkUserExists(username.value);
                    if (userExists) {
                        errormessage.innerHTML = `<p>Username Already Exists</p><p>If you already have an account, log in</p>`;
                        errormessage.style.display = "block";
                        errormessage.style.backgroundColor = "red";
                    }
                    else {
                        errormessage.innerHTML = `<p>Registration Successful</p>`;
                        errormessage.style.display = "block";
                        errormessage.style.backgroundColor = "green";
                        window.location.href = "login.html";
                        yield this.AddUser(username.value, password.value, email.value);
                        setTimeout(() => {
                            errormessage.style.display = "none";
                        }, 700000);
                        window.location.href = "login.html";
                    }
                }
            }));
        }
    }
    // For creating a new user
    AddUser(username, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.checkUserExists(username);
            if (userExists) {
                console.log("Username already exists. Try another name");
                return;
            }
            const id = yield this.generateId();
            const role = yield this.assignRole(id);
            const newUser = {
                id: id,
                username: username,
                email: email,
                password: password,
                booking: [],
                role: role
            };
            const response = yield fetch(userlink, {
                method: 'POST',
                body: JSON.stringify(newUser)
            });
            if (!response) {
                console.log("Failed to add user");
            }
        });
    }
    // Checks if a username already exists
    checkUserExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(userlink);
            if (response) {
                const users = yield response.json();
                return users.some(user => user.username === username);
            }
            return false;
        });
    }
    // Generate a new unique ID for a user
    generateId() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(userlink);
            if (response.ok) {
                const users = yield response.json();
                const lastUser = users[users.length - 1];
                //ternary operator that executes the firt part if the codition is true and the second part if false
                return lastUser ? lastUser.id + 1 : 1;
            }
            return 1;
        });
    }
    // Assign role based on user ID
    assignRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return id <= 3 ? Role.Admin : Role.User;
        });
    }
    // For the login users
    loginAuth() {
        const loginUsername = document.getElementById("logusername");
        const loginPassword = document.getElementById("logpassword");
        const loginBtn = document.getElementById("loginbtn");
        const loginErrorMessage = document.querySelector(".errormessage");
        if (loginBtn) {
            console.log("Event listener attached");
            loginBtn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const logUsername = loginUsername.value;
                const logPassword = loginPassword.value;
                if (!logUsername || !logPassword) {
                    loginErrorMessage.innerHTML = `<p>Fill in all the boxes</p>`;
                    loginErrorMessage.style.display = "block";
                    loginErrorMessage.style.backgroundColor = "red";
                }
                else {
                    const user = yield this.validateUser(logUsername, logPassword);
                    if (user) {
                        console.log("Login Successful");
                        sessionStorage.setItem("username", logUsername);
                        sessionStorage.setItem("userID", `${user.id}`);
                        console.log(user.id);
                        localStorage.setItem("role", `${user.role}`);
                        console.log(user.role);
                        const pUsername = document.querySelector(".username");
                        if (pUsername) {
                            pUsername.textContent = logUsername || " ";
                        }
                        loginErrorMessage.innerHTML = `<p>Login Successful</p>`;
                        loginErrorMessage.style.display = "block";
                        loginErrorMessage.style.backgroundColor = "green";
                        setTimeout(() => {
                            loginErrorMessage.style.display = "none";
                        }, 700000);
                        window.location.href = "tour.html";
                    }
                    else {
                        loginErrorMessage.innerHTML = `<p>Invalid username or password</p>`;
                        loginErrorMessage.style.display = "block";
                        loginErrorMessage.style.backgroundColor = "red";
                    }
                }
            }));
        }
    }
    validateUser(logUsername, logPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(userlink);
            if (response) {
                const users = yield response.json();
                return users.find(user => user.username === logUsername && user.password === logPassword) || null;
            }
            return null;
        });
    }
}
const authUsers = new Auth();
authUsers.getUserDetails();
authUsers.loginAuth();
