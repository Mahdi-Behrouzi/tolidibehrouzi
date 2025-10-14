const container = document.getElementById('container');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function togglePanel() {
    container.classList.toggle('right-panel-active');
    
    const signUpPanel = document.getElementById('signUpPanel');
    const signInPanel = document.getElementById('signInPanel');
    
    if (signUpPanel.style.display === 'none') {
        signUpPanel.style.display = 'block';
        signInPanel.style.display = 'none';
    } else {
        signUpPanel.style.display = 'none';
        signInPanel.style.display = 'block';
    }
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('ایمیل و رمز عبور را وارد کنید');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
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
    window.location.href = 'shop.html';
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('تمام فیلدها را پر کنید');
        return;
    }

    if (password !== confirmPassword) {
        alert('رمز عبور مطابقت ندارد');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email]) {
        alert('این ایمیل ثبت شده است');
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
    alert('ثبت‌نام موفق! وارد شوید');

    registerForm.reset();
    
    // تاخیر کوچک قبل از تغییر
    setTimeout(() => {
        container.classList.remove('right-panel-active');
        
        document.getElementById('signUpPanel').style.display = 'block';
        document.getElementById('signInPanel').style.display = 'none';
        
        // پاک کردن فیلدها
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    }, 500);
});
