// تعداد محصولات در سبد خرید
let cartCount = 0;

// افزودن محصول به سبد خرید
function addToCart() {
    cartCount++;
    updateCartCount();
    
    // نمایش پیام موفقیت
    showNotification('محصول به سبد خرید اضافه شد');
}

// به‌روزرسانی تعداد سبد خرید
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cartCount;
    
    // انیمیشن برای سبد خرید
    cartCountElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 200);
}

// نمایش اعلان
function showNotification(message) {
    // حذف اعلان قبلی در صورت وجود
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // ساخت اعلان جدید
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #27ae60;
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // حذف اعلان بعد از 2 ثانیه
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// انیمیشن برای اعلان
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100px);
            opacity: 0;
        }
    }
    
    .cart-count {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// رویداد برای دکمه دسته‌بندی
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // حذف کلاس فعال از همه دکمه‌ها
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // اضافه کردن کلاس فعال به دکمه کلیک شده
            this.classList.add('active');
        });
    });
    
    // جستجو در محصولات
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const productName = product.querySelector('h4').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
    
    // رویداد برای دکمه ورود
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            alert('صفحه ورود/ثبت‌نام');
        });
    }
    
    // رویداد برای دکمه سبد خرید
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            if (cartCount === 0) {
                showNotification('سبد خرید شما خالی است');
            } else {
                showNotification(`${cartCount} محصول در سبد خرید شماست`);
            }
        });
    }
});

// اسکرول نرم برای لینک‌های فوتر
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// مدیریت نمایش دکمه‌های ورود و خروج
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn || !logoutBtn) return;

  const user = localStorage.getItem("loggedInUser");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("با موفقیت خارج شدید");
    location.reload();
  });
});
