// import { userlink } from "./user";

let tourURL = 'http://localhost:4000/Tour'

const pUsername = document.querySelector(".username")! as HTMLParagraphElement
if (pUsername) {
    const storedUsername = sessionStorage.getItem("username")
    pUsername.textContent = storedUsername ? storedUsername : " "
}
const role = localStorage.getItem("role")

type Tour = {
    id: number,
    name: string,
    destination: string,
    description: string,
    price: string,
    image: string
}

class AllTourOperations {
    private tourList: Tour[] = []

    public async displayTours() {
        const response = await fetch(tourURL)
        this.tourList = await response.json()

        if (role === "admin") {
            console.log("Admin add tours")
            const addtouradm = document.querySelector(".tourplus")! as HTMLButtonElement
            addtouradm.style.display = "block"
            addtouradm.addEventListener("click", (e)=>{
                e.preventDefault()
                this.admintour()
            })
        }

        const tourDiv = document.querySelector(".tours")
        if (tourDiv) {
            this.tourList.forEach((tour: Tour) => {
                const toursElement = document.createElement("div")
                toursElement.classList.add("tourscard")

                // for tour image
                const tourimgElement = document.createElement("img")
                tourimgElement.src = tour.image
                toursElement.appendChild(tourimgElement)

                // for tour name
                const tournameElement = document.createElement("h2")
                tournameElement.textContent = `Name: ${tour.name}`
                toursElement.appendChild(tournameElement)

                // for tour destination
                const tourdesElement = document.createElement("p")
                tourdesElement.textContent = `Destination: ${tour.destination}`
                toursElement.appendChild(tourdesElement)

                // for tour destination
                const tourdescElement = document.createElement("p")
                tourdescElement.textContent = `Description: ${tour.description}`
                toursElement.appendChild(tourdescElement)

                // for tour price
                const tourpriceElement = document.createElement("p")
                tourpriceElement.textContent = `Price: ${tour.price}`
                toursElement.appendChild(tourpriceElement)

                const bookTourbtn = document.createElement("button")
                bookTourbtn.textContent = "Book Tour"
                bookTourbtn.id = `book-${tour.id}`
                toursElement.classList.add("booktour")
                toursElement.appendChild(bookTourbtn)
                console.log("Reading book button")
                sessionStorage.setItem("Tour Location", tour.destination)

                bookTourbtn.addEventListener("click", ()=>{
                    let tourdetlist:Tour = {
                        id:tour.id,
                        image:tour.image,
                        name:tour.name,
                        destination:tour.destination,
                        description:tour.description,
                        price:tour.price
                    }
                    const Touritem = JSON.stringify(tourdetlist)
                    sessionStorage.setItem("tourdetlist",Touritem)
                    console.log(tourdetlist)
                    window.location.href = "booking.html"
                })
                console.log(role)
                if (role === 'admin') {
                    // update button for admins
                    const updateTourbtn = document.createElement("button")
                    updateTourbtn.textContent = "Update"
                    updateTourbtn.id = `update-${tour.id}`
                    toursElement.appendChild(updateTourbtn)
                    console.log("Reading update button")

                    updateTourbtn.addEventListener("click", (e) => {
                        this.showupform(tour)
                    })

                    // delete tour button for admins
                    const deleteTourbtn = document.createElement("button")
                    deleteTourbtn.textContent = "Delete"
                    deleteTourbtn.id = `delete-${tour.id}`
                    toursElement.appendChild(deleteTourbtn)

                    deleteTourbtn.addEventListener("click", (e)=>{
                        this.deleteTour(tour.id)
                    })
                    
                    
                }
                tourDiv.appendChild(toursElement)
                
            });
            
        }
    }
    public admintour() {
        console.log("Adding button working")
        if (role == "admin") {
            const addForm = document.getElementById("addTourForm")! as HTMLDivElement
            addForm.style.display = "block"

            const addTourBtn = document.getElementById("submitAddTour")! as HTMLButtonElement
            addTourBtn.addEventListener("click", async (e) => {
                e.preventDefault()
                // Take values from form
                const tourNameInput = document.getElementById("addTourName")! as HTMLInputElement
                const tourDestinationInput = document.getElementById("addTourDestination")! as HTMLInputElement
                const tourDescriptionInput = document.getElementById("addTourDescription")! as HTMLInputElement
                const tourPriceInput = document.getElementById("addTourPrice")! as HTMLInputElement
                const tourImageInput = document.getElementById("addTourImage")! as HTMLInputElement
                const addformerr = document.getElementById("addTourMessage")! as HTMLDivElement

                if(!tourNameInput.value ||!tourDestinationInput.value ||! tourDescriptionInput.value ||! tourPriceInput.value ||!tourImageInput.value){
                    addformerr.innerHTML = `<p>Fill in all the blanks</p>`
                    addformerr.style.display = "block"
                    addformerr.style.backgroundColor = "red"
                }else{
                console.log("trial1")
                    const addedTour: Tour = {
                        id: Math.floor(Math.random() * 1000),
                        name: tourNameInput.value,
                        destination: tourDestinationInput.value,
                        description: tourDescriptionInput.value,
                        price: tourPriceInput.value,
                        image: tourImageInput.value
                    }
                    console.log(addedTour.price)

                    const response = await fetch(tourURL, {
                        method: 'POST',
                        body: JSON.stringify(addedTour)
                    })
                    if (response) {
                        console.log(`Tour added successfully`)
                        addformerr.innerHTML = `<p>Tour added successfully</p>`
                        addformerr.style.display = "block"
                        addformerr.style.backgroundColor = "green"
                        window.location.reload()

                        setTimeout(() => {
                            addformerr.style.display = "none"
                        }, 700000)

                        window.location.reload()
                    } else {
                        console.log(`Failed to add tour`)
                        addformerr.innerHTML = `<p>Failed to add tour</p>`
                        addformerr.style.display = "block"
                        addformerr.style.backgroundColor = "red"

                        setTimeout(() => {
                            addformerr.style.display = "none"
                        }, 700000)
                    }
                }
            })
        }
    }
    public async deleteTour(id: number) {
        const err = document.getElementById("tourmessage")! as HTMLDivElement
        const response = await fetch(`${tourURL}/${id}`, {
            method: 'DELETE'
        })
        console.log(id)
        if (response) {
            console.log(`Tour with ID ${id} deleted successfully`)
            console.log(err)
            err.innerHTML = `<p>Tour deleted successfully</p>`
            err.style.display = "Block"
            err.style.backgroundColor = "green"

            this.tourList =this.tourList.filter(tour => tour.id !== id)
            setTimeout(() => {
                err.style.display = "none"
            }, 700000)
            window.location.reload()
        } else {
            console.log(`Failed to delete tour with ID ${id}`)
        }
    }
    
    public showupform(tour:Tour){
       if(role == "admin"){
        const updateForm = document.getElementById("updateTourForm")! as HTMLDivElement
        updateForm.style.display = "block"

        const tourIdInput = document.getElementById("updateTourId")! as HTMLInputElement
        const tourNameInput = document.getElementById("updateTourName")! as HTMLInputElement
        const tourDestinationInput = document.getElementById("updateTourDestination")! as HTMLInputElement
        const tourDescriptionInput = document.getElementById("updateTourDescription")! as HTMLInputElement
        const tourPriceInput = document.getElementById("updateTourPrice")! as HTMLInputElement
        const tourImageInput = document.getElementById("updateTourImage")! as HTMLInputElement

        tourIdInput.value = tour.id.toString()
        tourNameInput.value = tour.name
        tourDestinationInput.value = tour.destination
        tourDescriptionInput.value = tour.description
        tourPriceInput.value = tour.price
        tourImageInput.value = tour.image

        const submitUpdateTourBtn = document.getElementById("submitUpdateTour")! as HTMLButtonElement
        submitUpdateTourBtn.addEventListener("click", (e) => {
            e.preventDefault()
            this.updateTour()
        })
       }
    }
    public async updateTour() {
        const tourIdInput = document.getElementById("updateTourId")! as HTMLInputElement
        const tourNameInput = document.getElementById("updateTourName")! as HTMLInputElement
        const tourDestinationInput = document.getElementById("updateTourDestination")! as HTMLInputElement
        const tourDescriptionInput = document.getElementById("updateTourDescription")! as HTMLInputElement
        const tourPriceInput = document.getElementById("updateTourPrice")! as HTMLInputElement
        const tourImageInput = document.getElementById("updateTourImage")! as HTMLInputElement

        const updatedTour: Tour = {
            id: parseInt(tourIdInput.value),
            name: tourNameInput.value,
            destination: tourDestinationInput.value,
            description: tourDescriptionInput.value,
            price: tourPriceInput.value,
            image: tourImageInput.value
        }
        console.log(updatedTour.description);
        

        const response = await fetch(`${tourURL}/${updatedTour.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTour)
        })

        const err = document.getElementById("updateTourMessage")! as HTMLDivElement
        if (response) {
            console.log(`Tour with ID ${updatedTour.id} updated successfully`)
            err.innerHTML = `<p>Tour updated successfully</p>`
            err.style.display = "block"
            err.style.backgroundColor = "green"

            setTimeout(() => {
                console.log("response", response)
                err.style.display = "none"
            }, 18000)

            const index =this.tourList.findIndex(tour => tour.id === updatedTour.id);
            if (index !== -1) {
                this.tourList[index] = updatedTour;
        }

            window.location.reload()
        } else {
            console.log(`Failed to update tour with ID ${updatedTour.id}`)
            err.innerHTML = `<p>Failed to update tour</p>`
            err.style.display = "block"
            err.style.backgroundColor = "red"

            setTimeout(() => {
                err.style.display = "none"
            }, 700000)
        }
    }
    public displaydelete(){
        const deleteAccountButton = document.getElementById("deleteuser")! as HTMLButtonElement
        if (deleteAccountButton) {
            deleteAccountButton.addEventListener("click", (e) => {
                e.preventDefault()
                console.log("Delete button clicked")  // Added log to check button click
                this.deleteuser()
            })
        } else {
            console.log("Delete button not found")  // Added log if button not found
        }
    }
    
    public async deleteuser(){
        const err = document.getElementById("tourmessage")! as HTMLDivElement
        const userId = sessionStorage.getItem("userID")
        console.log(userId)
        if (userId){
            console.log("Delete Account button pressed")
            console.log("User ID:", userId)
            // const response = await fetch(`${userlink}/${id}`, {
            //     method: 'DELETE'
            // })
            // console.log(id)
                    }
    }
    
}
const alltouroperations = new AllTourOperations()
alltouroperations.displayTours()
alltouroperations.displaydelete()
