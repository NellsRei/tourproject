let bookingtourcart = "http://localhost:2000/Booking"

class AllBookingDeets(){
    public async displaybookings(){
        const response = await fetch(bookingtourcart)
        let CartList = await response.json()

        const bookCart = document.getElementById("bookdiv")
        if (bookCart) {
            CartList.forEach((cart: Book) => {
                const cartElement = document.createElement("div")
                cartElement.classList.add("cartitems")

                // for user name
                const cartNameElement = document.createElement("p")
                cartNameElement.textContent = `Hotel Name: ${cart.user}`
                cartElement.appendChild(cartNameElement)

                // for tour location
                const cartLocElement = document.createElement("p")
                cartLocElement.textContent = `Hotel Location: ${cart.tour.name}`
                cartElement.appendChild(cartLocElement)

                // for hotel 
                const cartHotelElement = document.createElement("p")
                cartHotelElement.textContent = `Hotel Rating: ${cart.hotel}`
                cartHotelElement.appendChild(cartHotelElement)

                //to update

                const updatecartTbtn = document.createElement("button")
                updatecartTbtn.textContent = "Update"
                updatecartTbtn.id = `update-${cart.id}`
                cartElement.appendChild(updatecartTbtn)
                console.log("Reading update button")

                updatecartTbtn.addEventListener("click", (e) => {
                    console.log("updateeeee")
                    // this.showupform(hotel)
                })

                // delete cart tour
                const deletecartitem = document.createElement("button")
                deletecartitem.textContent = "Delete"
                deletecartitem.id = `delete-${cart.id}`
                cartElement.appendChild(deletecartitem)

                deletecartitem.addEventListener("click", (e) => {
                    // this.deleteHotel(hotel.id)
                })
                bookCart.appendChild(cartElement)
                })
                
            }
        }
}
const alltourdeets = new AllBookingDeets()
alltourdeets.