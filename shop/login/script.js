const container = document.getElementById('container');

function togglePanel(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    container.classList.toggle('right-panel-active');
    
    const signUpPanel = document.getElementById('signUpPanel');
    const signInPanel = document.getElementById('signInPanel');
    
    signUpPanel.style.display = signUpPanel.style.display === 'none' ? 'block' : 'none';
    signInPanel.style.display = signInPanel.style.display === 'none' ? 'block' : 'none';
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('لطفاً تمام فیلدها را پر کنید');
        return;
    }

    if (password !== confirmPassword) {
        alert('رمز عبور و تکرار آن یکسان نیستند');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};

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
    alert('ثبت‌نام موفق! الآن وارد شوید');

    document.getElementById('registerForm').reset();
    container.classList.remove('right-panel-active');
    
    document.getElementById('signUpPanel').style.display = 'block';
    document.getElementById('signInPanel').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('لطفاً ایمیل و رمز عبور را وارد کنید');
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

    document.getElementById('loginForm').reset();
    window.location.href = 'shop.html';
}
