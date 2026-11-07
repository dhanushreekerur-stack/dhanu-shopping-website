
// Get HTML Elements

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");
const cartSection = document.getElementById("cartSection");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const noProducts = document.getElementById("noProducts");
const checkoutBtn = document.getElementById("checkoutBtn");


// Store Products and Cart

let products = [];

let cart = [];


// Load Products Using Fetch API

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productContainer.innerHTML =
            "<p class='loading'>Failed to load products. Please run the project using a local server.</p>";

        console.error(error);

    }

}


// Display Products Dynamically

function displayProducts(productList) {

    productContainer.innerHTML = "";

    noProducts.hidden = productList.length !== 0;

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "rating";
        rating.textContent =
            "★".repeat(Math.round(product.rating)) +
            "☆".repeat(5 - Math.round(product.rating)) +
            " (" + product.rating + ")";

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "price";
        price.textContent = "₹" + product.price.toLocaleString("en-IN");

        const button = document.createElement("button");
        button.className = "add-cart";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.appendChild(price);
        bottom.appendChild(button);

        info.appendChild(category);
        info.appendChild(name);
        info.appendChild(rating);
        info.appendChild(bottom);

        card.appendChild(imageBox);
        card.appendChild(info);

        productContainer.appendChild(card);

    });

}


// Search Products

function searchProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);

}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("input", searchProducts);


// Add Products to Cart

function addToCart(productId) {

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        const product = products.find(
            item => item.id === productId
        );

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}


// Update Shopping Cart

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p class='empty-cart'>Your cart is empty!</p>";

    }

    cart.forEach(item => {

        total += item.price * item.quantity;
        totalItems += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            "₹" + (item.price * item.quantity).toLocaleString("en-IN");

        const quantityBox = document.createElement("div");
        quantityBox.className = "cart-quantity";

        const minusButton = document.createElement("button");
        minusButton.textContent = "-";

        minusButton.addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";

        plusButton.addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        quantityBox.appendChild(minusButton);
        quantityBox.appendChild(quantity);
        quantityBox.appendChild(plusButton);

        details.appendChild(name);
        details.appendChild(price);
        details.appendChild(quantityBox);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.textContent = "✕";
        removeButton.setAttribute("aria-label", "Remove " + item.name);

        removeButton.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItem.appendChild(image);
        cartItem.appendChild(details);
        cartItem.appendChild(removeButton);

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalItems;

    cartTotal.textContent =
        "₹" + total.toLocaleString("en-IN");

}


// Change Product Quantity

function changeQuantity(productId, change) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(productId);

    } else {

        updateCart();

    }

}


// Remove Product From Cart

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    updateCart();

}


// Open Shopping Cart

function openCart() {

    cartSection.classList.add("active");
    overlay.classList.add("active");

}


// Close Shopping Cart

function hideCart() {

    cartSection.classList.remove("active");
    overlay.classList.remove("active");

}

cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

overlay.addEventListener("click", hideCart);


// Checkout Button

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping at ShopZone! " +
        "Your total is " + cartTotal.textContent
    );

    cart = [];

    updateCart();

    hideCart();

});


// Initialize Website

loadProducts();

updateCart();
