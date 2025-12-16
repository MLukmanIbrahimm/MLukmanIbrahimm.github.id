const products = [
    {
        id: 1,
        name: "Tegek",
        price: 100000,
        image: "images/tegek.jpg"
    },
    {
        id: 2,
        name: "Kail Pancing",
        price: 10000,
        image: "images/kail pancing.jpeg"
    },
    {
        id: 3,
        name: "Senar Pancing",
        price: 30000,
        image: "images/senar_pancing.jpg"
    }
];

let cart = [];

const productGrid = document.querySelector('.product-grid');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.querySelector('.modal');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cart-total-amount');
const cartIcon = document.querySelector('.cart-icon');
const closeBtn = document.querySelector('.close-btn');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize Products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
    <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
            </div>
    </div>
    `).join('');
}

// Cart Logic
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    // alert('Produk ditambahkan ke keranjang!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update Modal Content
    cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
            <div class="cart-item-details">
                <strong>${item.name}</strong><br>
                Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}
            </div>
            <div class="cart-item-total">
                Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
            </div>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</span>
        </div>
    `).join('');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#666;">Keranjang kosong.</p>';
    }

    // Update Total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `Rp ${totalAmount.toLocaleString('id-ID')} `;
}

// Checkout Logic
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda kosong.');
        return;
    }

    const phoneNumber = '6285712262301'; // 085712262301 formatted
    let message = 'Halo Anggler Store, saya ingin memesan:\n\n';

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} (${item.quantity}x) : Rp ${itemTotal.toLocaleString('id-ID')} \n`;
        total += itemTotal;
    });

    message += `\nTotal Belanja: Rp ${total.toLocaleString('id-ID')} `;
    message += '\n\nMohon info selanjutnya.';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.onclick = function (event) {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
}

checkoutBtn.addEventListener('click', checkout);

// Initial Load
document.addEventListener('DOMContentLoaded', renderProducts);
