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
let hotelURL = "http://localhost:5000/Hotel";
let bookingURL = "http://localhost:2000/Booking";
const hotellocation = localStorage.getItem("Tour Location");
const role2 = localStorage.getItem("role");
console.log(role2);
class AllHotelOperations {
    constructor() {
        this.hotelList = [];
    }
    displayhotels() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(hotelURL);
            this.hotelList = yield response.json();
            if (role2 === "admin") {
                console.log("Admin add hotels");
                const addtouradm = document.getElementById("addhotelbtn");
                addtouradm.style.display = "block";
                addtouradm.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.adminhotel();
                });
            }
            const hotelDiv = document.querySelector(".availhotellst");
            if (hotelDiv) {
                this.hotelList.forEach((hotel) => {
                    const hotelElement = document.createElement("div");
                    hotelElement.classList.add("availhotel");
                    // for hotel name
                    const hotelNameElement = document.createElement("p");
                    hotelNameElement.textContent = `Hotel Name: ${hotel.name}`;
                    hotelElement.appendChild(hotelNameElement);
                    // for hotel location
                    const hotelLocElement = document.createElement("p");
                    hotelLocElement.textContent = `Hotel Location: ${hotel.location}`;
                    hotelElement.appendChild(hotelLocElement);
                    // for hotel star rating
                    const hotelRateElement = document.createElement("p");
                    hotelRateElement.textContent = `Hotel Rating: ${hotel.userrating}`;
                    hotelElement.appendChild(hotelRateElement);
                    const bookHotelbtn = document.createElement("button");
                    bookHotelbtn.textContent = "Book Hotel";
                    bookHotelbtn.id = `book-${hotel.id}`;
                    sessionStorage.setItem("hotelid", `${hotel.id}`);
                    hotelElement.classList.add("bookhotel");
                    hotelElement.appendChild(bookHotelbtn);
                    console.log("Reading book button");
                    bookHotelbtn.addEventListener("click", () => {
                        console.log("Hotel Booked");
                    });
                    console.log(role2);
                    if (role2 === 'admin') {
                        // update button for admins
                        const updateHotelbtn = document.createElement("button");
                        updateHotelbtn.textContent = "Update";
                        updateHotelbtn.id = `update-${hotel.id}`;
                        hotelElement.appendChild(updateHotelbtn);
                        console.log("Reading update button");
                        updateHotelbtn.addEventListener("click", (e) => {
                            this.showupform(hotel);
                        });
                        // delete hotel button for admins
                        const deleteHotelbtn = document.createElement("button");
                        deleteHotelbtn.textContent = "Delete";
                        deleteHotelbtn.id = `delete-${hotel.id}`;
                        hotelElement.appendChild(deleteHotelbtn);
                        deleteHotelbtn.addEventListener("click", (e) => {
                            this.deleteHotel(hotel.id);
                        });
                    }
                    hotelDiv.appendChild(hotelElement);
                });
            }
        });
    }
    adminhotel() {
        console.log("Adding button working");
        if (role2 == "admin") {
            const addForm = document.getElementById("addhotelForm");
            addForm.style.display = "block";
            const addHotelBtn = document.getElementById("submitAddHotel");
            addHotelBtn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                // Take values from form
                const hotelNameInput = document.getElementById("addHotelName");
                const hotelLocationInput = document.getElementById("addHotelLocation");
                const hotelRatingInput = document.getElementById("addHotelRating");
                const addformerr = document.getElementById("addHotelMessage");
                // console.log("trial1")
                const addedHotel = {
                    id: Math.floor(Math.random() * 1000),
                    name: hotelNameInput.value,
                    location: hotelLocationInput.value,
                    userrating: hotelRatingInput.value
                };
                const response = yield fetch(hotelURL, {
                    method: 'POST',
                    body: JSON.stringify(addedHotel)
                });
                if (response) {
                    console.log(`Hotel added successfully`);
                    addformerr.innerHTML = `<p>Hotel added successfully</p>`;
                    addformerr.style.display = "block";
                    addformerr.style.backgroundColor = "green";
                    window.location.reload();
                    setTimeout(() => {
                        addformerr.style.display = "none";
                    }, 700000);
                    window.location.reload();
                }
                else {
                    console.log(`Failed to add hotel`);
                    addformerr.innerHTML = `<p>Failed to add tour</p>`;
                    addformerr.style.display = "block";
                    addformerr.style.backgroundColor = "red";
                    setTimeout(() => {
                        addformerr.style.display = "none";
                    }, 700000);
                }
            }));
        }
    }
    deleteHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const err = document.getElementById("hotelmessage");
            const response = yield fetch(`${hotelURL}/${id}`, {
                method: 'DELETE'
            });
            console.log(id);
            if (response) {
                console.log(`Hotel with ID ${id} deleted successfully`);
                err.innerHTML = `<p>Hotel deleted successfully</p>`;
                err.style.display = "Block";
                err.style.backgroundColor = "green";
                this.hotelList = this.hotelList.filter(hotel => hotel.id !== id);
                setTimeout(() => {
                    err.style.display = "none";
                }, 700000);
                window.location.reload();
            }
            else {
                console.log(`Failed to delete tour with ID ${id}`);
            }
        });
    }
    showupform(hotel) {
        if (role2 == "admin") {
            const updateForm = document.getElementById("updateHotelForm");
            updateForm.style.display = "block";
            const hotelIdInput = document.getElementById("updateHotelId");
            const hotelNameInput = document.getElementById("updatedHotelName");
            const hotelLocationInput = document.getElementById("updatedTourLocation");
            const hotelRatingInput = document.getElementById("updatedHotelRating");
            hotelIdInput.value = hotel.id.toString();
            hotelNameInput.value = hotel.name;
            hotelLocationInput.value = hotel.location;
            hotelRatingInput.value = hotel.userrating;
            const submitUpdateHotelBtn = document.getElementById("submitUpdate");
            submitUpdateHotelBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.updateHotel();
            });
        }
    }
    updateHotel() {
        return __awaiter(this, void 0, void 0, function* () {
            const hotelIdInput = document.getElementById("updateHotelId");
            const hotelNameInput = document.getElementById("updatedHotelName");
            const hotelLocationInput = document.getElementById("updatedTourLocation");
            const hotelRatingInput = document.getElementById("updatedHotelRating");
            const updatedHotel = {
                id: parseInt(hotelIdInput.value),
                name: hotelNameInput.value,
                location: hotelLocationInput.value,
                userrating: hotelRatingInput.value
            };
            const response = yield fetch(`${hotelURL}/${updatedHotel.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedHotel)
            });
            const err = document.getElementById("updateHotelMessage");
            if (response) {
                console.log(`Hotel with ID ${updatedHotel.id} updated successfully`);
                err.innerHTML = `<p>Tour updated successfully</p>`;
                err.style.display = "block";
                err.style.backgroundColor = "green";
                setTimeout(() => {
                    console.log("response", response);
                    err.style.display = "none";
                }, 18000);
                const index = this.hotelList.findIndex(hotel => hotel.id === updatedHotel.id);
                if (index !== -1) {
                    this.hotelList[index] = updatedHotel;
                }
                window.location.reload();
            }
            else {
                console.log(`Failed to update tour with ID ${updatedHotel.id}`);
                err.innerHTML = `<p>Failed to update tour</p>`;
                err.style.display = "block";
                err.style.backgroundColor = "red";
                setTimeout(() => {
                    err.style.display = "none";
                }, 700000);
            }
        });
    }
    wholebookform() {
        const hotelID = sessionStorage.getItem("hotelid");
        if (hotelID) {
            const userbookname = sessionStorage.getItem("username");
            let tourdet = sessionStorage.getItem("tourdetlist");
            const tourdetails = JSON.parse(tourdet);
            const bookallbtn = document.getElementById("booktourhotel");
            bookallbtn.addEventListener("click", (e) => {
                console.log("You're about to book");
                // console.log(tourdet)
                console.log(hotelID, userbookname, tourdetails);
                this.takeBookInfo(hotelID, userbookname, tourdetails);
            });
        }
    }
    takeBookInfo(hotelID, userbookname, tourdetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const noofdays = document.getElementById("noofdays");
            const errme = document.querySelector(".hotelmessage");
            if (!noofdays.value) {
                errme.innerHTML = `<p>Fill in all the details</p>`;
                errme.style.display = "block";
                errme.style.backgroundColor = "red";
            }
            const personaldet = {
                id: Math.floor(Math.random() * 1000),
                user: userbookname,
                tour: tourdetails,
                hotel: hotelID,
                date: noofdays.value
            };
            console.log(personaldet);
            const response = yield fetch(bookingURL, {
                method: 'POST',
                body: JSON.stringify(personaldet)
            });
            if (response) {
                console.log(`Tour booked successfully`);
                errme.innerHTML = `<p>Tour booked successfully</p>`;
                errme.style.display = "block";
                errme.style.backgroundColor = "green";
                window.location.reload();
                setTimeout(() => {
                    errme.style.display = "none";
                }, 700000);
                window.location.reload();
            }
            else {
                console.log(`Failed to book tour`);
                errme.innerHTML = `<p>Failed to book tour</p>`;
                errme.style.display = "block";
                errme.style.backgroundColor = "red";
                setTimeout(() => {
                    errme.style.display = "none";
                }, 700000);
            }
        });
    }
}
const allhoteloperations = new AllHotelOperations();
allhoteloperations.displayhotels();
allhoteloperations.wholebookform();
