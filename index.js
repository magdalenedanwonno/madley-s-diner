import { menuArray } from "./data.js"

const menuEl = document.getElementById("menu")
const orderItemsEl = document.getElementById("order-items")
const totalEl = document.getElementById("total")
const completeOrderBtn = document.getElementById("complete-order-btn")
const modal = document.getElementById("modal")
const paymentForm = document.getElementById("payment-form")

let orderArray = []

renderMenu()

document.addEventListener("click", function(e){

    if(e.target.dataset.add){
        addItem(e.target.dataset.add)
    }

    if(e.target.dataset.remove){
        removeItem(e.target.dataset.remove)
    }
    
    if(e.target.classList.contains("star")){
    const rating = Number(e.target.dataset.rate)

    const stars = document.querySelectorAll(".star")

    stars.forEach(star => {
        if(Number(star.dataset.rate) <= rating){
            star.classList.add("selected")
        } else {
            star.classList.remove("selected")
        }
    })

    document.getElementById("rating-result").textContent =
        `You rated us ${rating} star${rating > 1 ? "s" : ""}. Thank you!`
}


})

completeOrderBtn.addEventListener("click", function(){
    if(orderArray.length > 0){
        modal.classList.remove("hidden")
    }
})

paymentForm.addEventListener("submit", function(e){
    e.preventDefault()

    const name = document.getElementById("name").value

    modal.classList.add("hidden")
    completeOrderBtn.textContent = "Order completed"
    

    orderItemsEl.innerHTML = `
        <div class="thank-you">
            Thanks, ${name}! Your order is on its way!
        </div>

        <div id="rating-box">
            <p>Rate your experience</p>
            <div class="stars">
    <span class="star" data-rate="1">⭐</span>
    <span class="star" data-rate="2">⭐</span>
    <span class="star" data-rate="3">⭐</span>
    <span class="star" data-rate="4">⭐</span>
    <span class="star" data-rate="5">⭐</span>
</div>
            <p id="rating-result"></p>
        </div>
    `

    totalEl.innerHTML = ""
    orderArray = []
})

function renderMenu(){

    let menuHtml = ""

    menuArray.forEach(item => {
        menuHtml += `
            <div class="menu-item">

                <div class="menu-left">
                    <div class="menu-emoji">${item.emoji}</div>

                    <div>
                        <p class="menu-title">${item.name}</p>
                        <p class="menu-package">
                            ${item.package.join(", ")}
                        </p>
                        <p class="menu-price">$${item.price}</p>
                    </div>
                </div>

                <button class="add-btn" data-add="${item.id}">+</button>

            </div>
        `
    })

    menuEl.innerHTML = menuHtml
}

function addItem(id){

    const targetItem = menuArray.find(item => item.id == id)

    orderArray.push(targetItem)

    renderOrder()
}

function removeItem(id){

    const index = orderArray.findIndex(item => item.id == id)

    if(index > -1){
        orderArray.splice(index, 1)
    }

    renderOrder()
}
function renderOrder(){

    let orderHtml = ""
    let total = 0

    orderArray.forEach(item => {

        total += item.price

        orderHtml += `
            <div class="order-row">
                <div>
                    ${item.name}
                    <span class="remove-btn" data-remove="${item.id}">
                        remove
                    </span>
                </div>
                <div>$${item.price}</div>
            </div>
        `
    })

    let discount = 0

    // 👉 meal deal: 10% off for 3 or more items
    if(orderArray.length >= 3){
        discount = total * 0.1
        total = total - discount
    }

    orderItemsEl.innerHTML = orderHtml

    totalEl.innerHTML = `
        ${discount > 0 ? `<p>Meal deal discount: -$${discount.toFixed(2)}</p>` : ""}
        <h3>Total price: $${total.toFixed(2)}</h3>
    `
}