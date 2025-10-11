const container = document.getElementById('container');
const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// تغییر صفحات
signUpBtn.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInBtn.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// ذخیره‌سازی کاربران
let users = JSON.parse(localStorage.getItem('users')) || {};

// ثبت‌نام
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;

    if (!name || !email || !phone || !password) {
        alert('لطفاً تمام فیلدها را پر کنید');
        return;
    }

    if (password !== confirmPassword) {
        alert('رمز عبور و تکرار آن یکسان نیستند');
        return;
    }

    if (users[email]) {
        alert('این ایمیل قبلاً ثبت شده است');
        return;
    }

    users[email] = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        cart: [],
        orders: []
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('ثبت‌نام با موفقیت انجام شد! الآن می‌توانید وارد شوید');

    registerForm.reset();
    container.classList.remove('right-panel-active');
});

// ورود
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('لطفاً ایمیل و رمز عبور را وارد کنید');
        return;
    }

    const user = users[email];

    if (!user) {
        alert('حساب کاربری یافت نشد');
        return;
    }

    if (user.password !== password) {
        alert('رمز عبور اشتباه است');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('خوش آمدید ' + user.name);
    loginForm.reset();
    
    // ریدایرکت به صفحه اصلی فروشگاه
    window.location.href = 'index.html';
});
