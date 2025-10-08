// محصولات نمونه
const products = [
    {
        id: 1,
        title: 'گوشی موبایل سامسونگ Galaxy S23 Ultra',
        price: 45000000,
        oldPrice: 52000000,
        rating: 4.5,
        discount: 15,
        icon: '📱',
        category: 'mobile',
        brand: 'samsung'
    },
    {
        id: 2,
        title: 'لپ تاپ اپل MacBook Pro 14',
        price: 85000000,
        oldPrice: 95000000,
        rating: 5,
        discount: 10,
        icon: '💻',
        category: 'laptop',
        brand: 'apple'
    },
    {
        id: 3,
        title: 'هدفون بی سیم Sony WH-1000XM5',
        price: 12000000,
        oldPrice: 15000000,
        rating: 4.8,
        discount: 20,
        icon: '🎧',
        category: 'audio',
        brand: 'sony'
    },
    {
        id: 4,
        title: 'تبلت اپل iPad Pro 12.9',
        price: 38000000,
        oldPrice: 42000000,
        rating: 4.7,
        discount: 10,
        icon: '📱',
        category: 'tablet',
        brand: 'apple'
    },
    {
        id: 5,
        title: 'ساعت هوشمند اپل Watch Series 9',
        price: 18000000,
        oldPrice: 22000000,
        rating: 4.6,
        discount: 18,
        icon: '⌚',
        category: 'wearable',
        brand: 'apple'
    },
    {
        id: 6,
        title: 'کنسول بازی PlayStation 5',
        price: 28000000,
        oldPrice: 32000000,
        rating: 4.9,
        discount: 12,
        icon: '🎮',
        category: 'gaming',
        brand: 'sony'
    },
    {
        id: 7,
        title: 'دوربین دیجیتال Canon EOS R6',
        price: 65000000,
        oldPrice: 75000000,
        rating: 4.8,
        discount: 13,
        icon: '📷',
        category: 'camera',
        brand: 'canon'
    },
    {
        id: 8,
        title: 'گوشی شیائومی Redmi Note 13 Pro',
        price: 8500000,
        oldPrice: 11000000,
        rating: 4.3,
        discount: 23,
        icon: '📱',
        category: 'mobile',
        brand: 'xiaomi'
    },
    {
        id: 9,
        title: 'مانیتور گیمینگ ASUS ROG 27"',
        price: 15000000,
        oldPrice: 18000000,
        rating: 4.7,
        discount: 17,
        icon: '🖥️',
        category: 'monitor',
        brand: 'asus'
    },
    {
        id: 10,
        title: 'کیبورد مکانیکی Razer BlackWidow',
        price: 5500000,
        oldPrice: 7000000,
        rating: 4.5,
        discount: 21,
        icon: '⌨️',
        category: 'accessory',
        brand: 'razer'
    },
    {
        id: 11,
        title: 'موس گیمینگ Logitech G Pro',
        price: 3200000,
        oldPrice: 4000000,
        rating: 4.6,
        discount: 20,
        icon: '🖱️',
        category: 'accessory',
        brand: 'logitech'
    },
    {
        id: 12,
        title: 'پاوربانک Anker 20000mAh',
        price: 1800000,
        oldPrice: 2500000,
        rating: 4.4,
        discount: 28,
        icon: '🔋',
        category: 'accessory',
        brand: 'anker'
    }
];

// سبد خرید
let cart = [];

// وضعیت احراز هویت
let isLoggedIn = false;
let currentUser = null;

// تابع فرمت قیمت به تومان
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان";
}

// تابع نمایش محصولات
function displayProducts(productsToShow = products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = `
            <div class="product-card" onclick="showProductDetail(${product.id})">
                <div class="product-image">
                    ${product.icon}
                    ${product.discount ? `<span class="discount-badge">${product.discount}٪</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-rating">
                        ${'⭐'.repeat(Math.floor(product.rating))}
                        <span>(${product.rating})</span>
                    </div>
                    <div class="product-price">
                        <span class="price">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        افزودن به سبد خرید
                    </button>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
}

// تابع افزودن به سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showSuccessMessage('محصول به سبد خرید اضافه شد');
}

// تابع به‌روزرسانی سبد خرید
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // به‌روزرسانی تعداد
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // به‌روزرسانی محتوای سبد
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><div class="empty-cart-icon">🛒</div><p>سبد خرید شما خالی است</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <span class="remove-item" onclick="removeFromCart(${item.id})">🗑️</span>
            </div>
        `).join('');
    }

    // به‌روزرسانی جمع کل
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
}

// تابع تغییر تعداد محصول
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// تابع حذف از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showSuccessMessage('محصول از سبد خرید حذف شد');
}

// تابع نمایش/مخفی کردن سبد خرید
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// تابع نمایش پیام موفقیت
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
                              }
// تابع باز کردن مودال ورود/ثبت‌نام
function openModal(type) {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
}

// تابع بستن مودال
function closeModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
}

// تابع تغییر بین ورود و ثبت‌نام
let isLoginMode = true;
function switchAuthMode() {
    isLoginMode = !isLoginMode;
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const switchText = document.getElementById('switchText');
    const switchLink = document.getElementById('switchLink');
    const nameGroup = document.getElementById('nameGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');

    if (isLoginMode) {
        modalTitle.textContent = 'ورود به حساب کاربری';
        submitBtn.textContent = 'ورود';
        switchText.textContent = 'حساب کاربری ندارید؟';
        switchLink.textContent = 'ثبت نام کنید';
        nameGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
    } else {
        modalTitle.textContent = 'ثبت نام';
        submitBtn.textContent = 'ثبت نام';
        switchText.textContent = 'حساب کاربری دارید؟';
        switchLink.textContent = 'وارد شوید';
        nameGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
    }
}

// مدیریت فرم ورود/ثبت‌نام
document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');
    
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (isLoginMode) {
                // ورود
                if (username && password) {
                    isLoggedIn = true;
                    currentUser = { username };
                    closeModal();
                    showSuccessMessage('با موفقیت وارد شدید');
                    updateAuthButton();
                }
            } else {
                // ثبت‌نام
                const fullName = document.getElementById('fullName').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    alert('رمز عبور و تکرار آن یکسان نیستند');
                    return;
                }
                
                if (username && password && fullName) {
                    isLoggedIn = true;
                    currentUser = { username, fullName };
                    closeModal();
                    showSuccessMessage('ثبت نام با موفقیت انجام شد');
                    updateAuthButton();
                }
            }
        });
    }
    
    // نمایش محصولات اولیه
    displayProducts();
    
    // جستجوی محصولات
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.title.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        });
    }
    
    // فیلتر قیمت
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange) {
        priceRange.addEventListener('input', function(e) {
            const maxPrice = parseInt(e.target.value);
            priceValue.textContent = `تا ${formatPrice(maxPrice)}`;
            
            const filteredProducts = products.filter(product => 
                product.price <= maxPrice
            );
            displayProducts(filteredProducts);
        });
    }
    
    // بستن مودال با کلیک بیرون از آن
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('authModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // بستن سبد خرید با کلیک بیرون از آن
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !e.target.closest('.action-btn')) {
            toggleCart();
        }
    });
});

// تابع به‌روزرسانی دکمه ورود
function updateAuthButton() {
    const authBtn = document.querySelector('.auth-btn');
    if (isLoggedIn && currentUser) {
        authBtn.textContent = `👤 ${currentUser.fullName || currentUser.username}`;
        authBtn.onclick = showUserMenu;
    }
}

// تابع نمایش منوی کاربر
function showUserMenu() {
    // اینجا می‌توانید منوی کاربری را نمایش دهید
    alert('منوی کاربری - در حال توسعه');
}

// تابع تکمیل خرید
function checkout() {
    if (cart.length === 0) {
        alert('سبد خرید شما خالی است');
        return;
    }
    
    if (!isLoggedIn) {
        toggleCart();
        setTimeout(() => {
            openModal('login');
        }, 300);
        alert('لطفا ابتدا وارد حساب کاربری خود شوید');
        return;
    }
    
    // اینجا باید به صفحه پرداخت منتقل شوید
    alert('در حال انتقال به درگاه پرداخت...\n(این قسمت در نسخه نهایی پیاده‌سازی می‌شود)');
    
    // نمایش اطلاعات سفارش
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('اطلاعات سفارش:', {
        items: cart,
        total: total,
        user: currentUser
    });
}

// تابع نمایش جزئیات محصول
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    alert(`جزئیات محصول:\n\n${product.title}\n\nقیمت: ${formatPrice(product.price)}\n\n(صفحه جزئیات محصول در حال توسعه است)`);
}

// تابع مرتب‌سازی محصولات
function sortProducts(sortType) {
    let sortedProducts = [...products];
    
    switch(sortType) {
        case 'newest':
            // مرتب‌سازی بر اساس جدیدترین (فرض: id بالاتر = جدیدتر)
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        case 'cheapest':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'expensive':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    displayProducts(sortedProducts);
}

// اضافه کردن event listener برای select مرتب‌سازی
document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change',
