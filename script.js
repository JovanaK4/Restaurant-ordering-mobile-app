import { menuArray } from './data.js'

const productsDiv = document.querySelector(".products")
const orderedProductsDiv = document.querySelector(".ordered-products")
const orderDiv = document.querySelector(".order")
const pTotalPrice = document.querySelector(".total-price p")
const paymentDetails = document.querySelector('.payment-details')
const successfulOrder = document.querySelector('.successful-order')
const nameInput = document.querySelector("input[name='userName']")
const starsContainer = document.querySelector(".body-modal-rating div")
const modalRating = document.querySelector(".modal-rating")
const bodyModalRating = document.querySelector(".body-modal-rating")

function renderProducts(products) {
    let productsArr = ""
    for (let product of products) {
        productsArr += `
            <div class="product">
                <p>${product.emoji}</p>
                <div class="product-info">
                    <h2 id="${product.id}">${product.name}</h2>
                    <p>${product.ingredients}</p>
                    <p>${product.price}</p>
                </div>
                <p data-add="${product.id}">+</p>
            </div>`
    }
    productsDiv.innerHTML = productsArr
}

renderProducts(menuArray)

let orderedProductsArray = []

document.addEventListener('click', function (e) {
    if (e.target.dataset.add) {
        successfulOrder.classList.add("hidden")
        orderDiv.classList.remove("hidden")
        addProductToOrder(e.target.dataset.add)
        totalPrice()
    } else if (e.target.dataset.remove) {
        removeOrderedProduct(e.target.dataset.remove)
        totalPrice()
    } else if (e.target.dataset.completeOrder) {
        paymentDetails.style.display = 'flex'
    } else if (e.target.dataset.pay) {
        paymentDetails.style.display = 'none'
        orderDiv.classList.add("hidden")
        successfulOrder.classList.remove("hidden")
        successfulOrder.innerHTML = `<p>Thanks, ${nameInput.value}! Your order is on its way.</p>`
        successfulOrder.style.background = "#FEF3C7"
        setTimeout(() => {
            modalRating.classList.remove("hidden")
        }, 2000)
    } else if (e.target.classList.contains("fa-star")) {
        const clickedIndex = parseInt(e.target.dataset.index)
        const stars = starsContainer.querySelectorAll(".fa-star")
        stars.forEach((star) => {
            const starIndex = parseInt(star.dataset.index)
            if (starIndex <= clickedIndex) {
                star.classList.add("filled")
            } else {
                star.classList.remove("filled")
            }
        });
    } else if (e.target.dataset.exit) {
        modalRating.classList.add("hidden")
    } else if (e.target.dataset.rateBtn) {
        bodyModalRating.innerHTML = `<p>Thanks for rating us!</p>`
        modalRating.style.height = "15%"
    }
});

function addProductToOrder(productId) {
    const targetProductObj = menuArray.find(function (objectProduct) {
        return objectProduct.id == productId
    })

    if (targetProductObj) { //Provera da li već postoji proizvod u narudžbini
        const existingProduct = orderedProductsArray.find(product => product.id == productId)

        if (existingProduct) {
            existingProduct.quantity += 1
        } else {
            orderedProductsArray.push({ ...targetProductObj, quantity: 1 })
        }
        renderOrderedProducts()
    }
}

function renderOrderedProducts() {
    orderedProductsDiv.innerHTML = ""
    orderedProductsArray.forEach(function (product) {
        if (product) {
            orderedProductsDiv.innerHTML += `
                <div class="ordered-product">
                    <div>
                        <p>${product.name} x${product.quantity}</p>
                        <button id="remove-btn" data-remove="${product.id}">Remove</button>
                    </div>
                    <p>$${(product.price * product.quantity).toFixed(2)}</p>
                </div>`
        }
    });
}

function removeOrderedProduct(removedProduct) {
    for (let i = 0; i < orderedProductsArray.length; i++) {
        if (orderedProductsArray[i].id == removedProduct) {
            if (orderedProductsArray[i].quantity > 1) {
                //Ako je količina veća od 1, smanjujem je
                orderedProductsArray[i].quantity -= 1
            } else {
                //Ako je količina 1, uklanjam proizvod
                orderedProductsArray.splice(i, 1)
            }
            break; 
        }
    }

    if (orderedProductsArray.length == 0) {
        orderDiv.classList.add("hidden")
    } else {
        renderOrderedProducts()
    }
}

function totalPrice() {
    let total = orderedProductsArray.reduce(function (total, currValue) {
        return total + (currValue.price * currValue.quantity)
    }, 0)
    pTotalPrice.textContent = "$" + total.toFixed(2); //Prikazivanje ukupne cene sa 2 decimale
}

function displayYear() {
    const year = new Date().getFullYear()
    const footerText = `Developed by Jovana Kljajić ${year}`
    document.getElementById('footer').textContent = footerText
}

displayYear()
