let hotelURL = "http://localhost:5000/Hotel"
let bookingURL = "http://localhost:2000/Booking"

const hotellocation = localStorage.getItem("Tour Location")

const role2 = localStorage.getItem("role")
console.log(role2)

type Hotel = {
    id: number,
    name: string,
    location: string,
    userrating: string
}

type Book = {
    id:number,
    user:string,
    tour:Tour,
    hotel:[],
    date: string 
}

class AllHotelOperations {
    private hotelList: Hotel[] = []

    public async displayhotels() {
        const response = await fetch(hotelURL)
        this.hotelList = await response.json()

        if (role2 === "admin") {
            console.log("Admin add hotels")
            const addtouradm = document.getElementById("addhotelbtn")! as HTMLButtonElement
            addtouradm.style.display = "block"
            addtouradm.addEventListener("click", (e)=>{
                e.preventDefault()
                this.adminhotel()
            })
        }

        const hotelDiv = document.querySelector(".availhotellst")
        if (hotelDiv) {
            this.hotelList.forEach((hotel: Hotel) => {
                const hotelElement = document.createElement("div")
                hotelElement.classList.add("availhotel")

                // for hotel name
                const hotelNameElement = document.createElement("p")
                hotelNameElement.textContent = `Hotel Name: ${hotel.name}`
                hotelElement.appendChild(hotelNameElement)

                // for hotel location
                const hotelLocElement = document.createElement("p")
                hotelLocElement.textContent = `Hotel Location: ${hotel.location}`
                hotelElement.appendChild(hotelLocElement)

                // for hotel star rating
                const hotelRateElement = document.createElement("p")
                hotelRateElement.textContent = `Hotel Rating: ${hotel.userrating}`
                hotelElement.appendChild(hotelRateElement)

                const bookHotelbtn = document.createElement("button")
                bookHotelbtn.textContent = "Book Hotel"
                bookHotelbtn.id = `book-${hotel.id}`
                sessionStorage.setItem("hotelid", `${hotel.id}`)
                hotelElement.classList.add("bookhotel")
                hotelElement.appendChild(bookHotelbtn)
                console.log("Reading book button")

                bookHotelbtn.addEventListener("click", () => {
                    console.log("Hotel Booked")
                })
                console.log(role2)
                if (role2 === 'admin') {
                    // update button for admins
                    const updateHotelbtn = document.createElement("button")
                    updateHotelbtn.textContent = "Update"
                    updateHotelbtn.id = `update-${hotel.id}`
                    hotelElement.appendChild(updateHotelbtn)
                    console.log("Reading update button")

                    updateHotelbtn.addEventListener("click", (e) => {
                        this.showupform(hotel)
                    })

                    // delete hotel button for admins
                    const deleteHotelbtn = document.createElement("button")
                    deleteHotelbtn.textContent = "Delete"
                    deleteHotelbtn.id = `delete-${hotel.id}`
                    hotelElement.appendChild(deleteHotelbtn)

                    deleteHotelbtn.addEventListener("click", (e) => {
                        this.deleteHotel(hotel.id)
                    })
                }
                hotelDiv.appendChild(hotelElement)
            })
        }
    }
    public adminhotel() {
        console.log("Adding button working")
        if (role2 == "admin") {
            const addForm = document.getElementById("addhotelForm")! as HTMLDivElement
            addForm.style.display = "block"

            const addHotelBtn = document.getElementById("submitAddHotel")! as HTMLButtonElement
            addHotelBtn.addEventListener("click", async (e) => {
                e.preventDefault()
                // Take values from form
                const hotelNameInput = document.getElementById("addHotelName")! as HTMLInputElement
                const hotelLocationInput = document.getElementById("addHotelLocation")! as HTMLInputElement
                const hotelRatingInput = document.getElementById("addHotelRating")! as HTMLInputElement
                const addformerr = document.getElementById("addHotelMessage")! as HTMLDivElement
                // console.log("trial1")
                    const addedHotel: Hotel = {
                        id: Math.floor(Math.random() * 1000),
                        name: hotelNameInput.value,
                        location: hotelLocationInput.value,
                        userrating: hotelRatingInput.value
                    }

                    const response = await fetch(hotelURL, {
                        method: 'POST',
                        body: JSON.stringify(addedHotel)
                    })
                    if (response) {
                        console.log(`Hotel added successfully`)
                        addformerr.innerHTML = `<p>Hotel added successfully</p>`
                        addformerr.style.display = "block"
                        addformerr.style.backgroundColor = "green"
                        window.location.reload()

                        setTimeout(() => {
                            addformerr.style.display = "none"
                        }, 700000)

                        window.location.reload()
                    } else {
                        console.log(`Failed to add hotel`)
                        addformerr.innerHTML = `<p>Failed to add tour</p>`
                        addformerr.style.display = "block"
                        addformerr.style.backgroundColor = "red"

                        setTimeout(() => {
                            addformerr.style.display = "none"
                        }, 700000)
                    }
            })
        }
    }

    public async deleteHotel(id: number) {
        const err = document.getElementById("hotelmessage")! as HTMLDivElement
        const response = await fetch(`${hotelURL}/${id}`, {
            method: 'DELETE'
        })
        console.log(id)
        if (response) {
            console.log(`Hotel with ID ${id} deleted successfully`)
            err.innerHTML = `<p>Hotel deleted successfully</p>`
            err.style.display = "Block"
            err.style.backgroundColor = "green"

            this.hotelList =this.hotelList.filter(hotel=> hotel.id !== id)
            setTimeout(() => {
                err.style.display = "none"
            }, 700000)
            window.location.reload()
        } else {
            console.log(`Failed to delete tour with ID ${id}`)
        }
    }
    public showupform(hotel:Hotel){
        if(role2 == "admin"){
         const updateForm = document.getElementById("updateHotelForm")! as HTMLDivElement
         updateForm.style.display = "block"
 
         const hotelIdInput = document.getElementById("updateHotelId")! as HTMLInputElement
         const hotelNameInput = document.getElementById("updatedHotelName")! as HTMLInputElement
         const hotelLocationInput = document.getElementById("updatedTourLocation")! as HTMLInputElement
         const hotelRatingInput = document.getElementById("updatedHotelRating")! as HTMLInputElement
 
         hotelIdInput.value = hotel.id.toString()
         hotelNameInput.value = hotel.name
         hotelLocationInput.value = hotel.location
         hotelRatingInput.value = hotel.userrating
 
         const submitUpdateHotelBtn = document.getElementById("submitUpdate")! as HTMLButtonElement
         submitUpdateHotelBtn.addEventListener("click", (e) => {
             e.preventDefault()
             this.updateHotel()
         })
        }
     }
     public async updateHotel() {
        const hotelIdInput = document.getElementById("updateHotelId")! as HTMLInputElement
        const hotelNameInput = document.getElementById("updatedHotelName")! as HTMLInputElement
        const hotelLocationInput = document.getElementById("updatedTourLocation")! as HTMLInputElement
        const hotelRatingInput = document.getElementById("updatedHotelRating")! as HTMLInputElement
 
         const updatedHotel: Hotel = {
             id: parseInt(hotelIdInput.value),
             name: hotelNameInput.value,
             location : hotelLocationInput.value,
             userrating: hotelRatingInput.value
         }
         
         const response = await fetch(`${hotelURL}/${updatedHotel.id}`, {
             method: 'PUT',
             body: JSON.stringify(updatedHotel)
         })
 
         const err = document.getElementById("updateHotelMessage")! as HTMLDivElement
         if (response) {
             console.log(`Hotel with ID ${updatedHotel.id} updated successfully`)
             err.innerHTML = `<p>Tour updated successfully</p>`
             err.style.display = "block"
             err.style.backgroundColor = "green"
 
             setTimeout(() => {
                 console.log("response", response)
                 err.style.display = "none"
             }, 18000)
 
             const index =this.hotelList.findIndex(hotel => hotel.id === updatedHotel.id);
             if (index !== -1) {
                 this.hotelList[index] = updatedHotel
         }
 
             window.location.reload()
         } else {
             console.log(`Failed to update tour with ID ${updatedHotel.id}`)
             err.innerHTML = `<p>Failed to update tour</p>`
             err.style.display = "block"
             err.style.backgroundColor = "red"
 
             setTimeout(() => {
                 err.style.display = "none"
             }, 700000)
         }
     }
     public wholebookform() {
        const hotelID:number = sessionStorage.getItem("hotelid") 
        if(hotelID){
        const userbookname: string = sessionStorage.getItem("username")
        let tourdet = sessionStorage.getItem("tourdetlist")
        
        const tourdetails = JSON.parse(tourdet)
        
        const bookallbtn = document.getElementById("booktourhotel")! as HTMLButtonElement;
        
        bookallbtn.addEventListener("click", (e) => {
            console.log("You're about to book");
            // console.log(tourdet)
            console.log(hotelID, userbookname, tourdetails)
            this.takeBookInfo(hotelID, userbookname, tourdetails)
        });
    }
    }
    
     public async takeBookInfo(hotelID:number,userbookname:string, tourdetails:Tour):Promise<void>{
        const noofdays = document.getElementById("noofdays")! as HTMLInputElement
        const errme = document.querySelector(".hotelmessage")! as HTMLDivElement
        if(!noofdays.value){
            errme.innerHTML = `<p>Fill in all the details</p>`
            errme.style.display = "block"
            errme.style.backgroundColor = "red" 
        }
        
        const personaldet:Book = {
            id:Math.floor(Math.random() * 1000),
            user:userbookname,
            tour:tourdetails,
            hotel: hotelID,
            date: noofdays.value
        }
        console.log(personaldet)
        const response = await fetch(bookingURL, {
            method: 'POST',
            body: JSON.stringify(personaldet)
        })
        if (response) {
            console.log(`Tour booked successfully`)
            errme.innerHTML = `<p>Tour booked successfully</p>`
            errme.style.display = "block"
            errme.style.backgroundColor = "green"
            window.location.reload()

            setTimeout(() => {
                errme.style.display = "none"
            }, 700000)

            window.location.reload()
        } else {
            console.log(`Failed to book tour`)
            errme.innerHTML = `<p>Failed to book tour</p>`
            errme.style.display = "block"
            errme.style.backgroundColor = "red"

            setTimeout(() => {
                errme.style.display = "none"
            }, 700000)
        }
     }
}

const allhoteloperations = new AllHotelOperations()
allhoteloperations.displayhotels()
allhoteloperations.wholebookform()


