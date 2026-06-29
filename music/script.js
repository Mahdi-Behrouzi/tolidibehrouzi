// راه‌اندازی آیکون‌های Lucide
lucide.createIcons();

// ==========================================
// ۱. منطق نوار پیشرفت مطالعه
// ==========================================
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
    // محاسبه درصد اسکرول صفحه
    const scrollTotal = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // جلوگیری از تقسیم بر صفر در صفحات کوتاه
    if (height > 0) {
        const scrollPercentage = scrollTotal / height;
        // اعمال مقیاس با ترانسفورم برای پرفورمنس بالاتر
        progressBar.style.transform = scaleX(${scrollPercentage});
    }
});

// ==========================================
// ۲. منطق رابط کاربری چت‌بات (UI Interactions)
// ==========================================
const aiToggleBtn = document.getElementById('ai-toggle-btn');
const aiCloseBtn = document.getElementById('ai-close-btn');
const aiSidebar = document.getElementById('ai-sidebar');
const overlay = document.getElementById('overlay');

function toggleSidebar() {
    const isOpen = aiSidebar.classList.contains('open');
    if (isOpen) {
        // بستن سایدبار
        aiSidebar.classList.remove('open');
        overlay.classList.remove('active');
        aiToggleBtn.classList.remove('hidden');
    } else {
        // باز کردن سایدبار
        aiSidebar.classList.add('open');
        overlay.classList.add('active');
        aiToggleBtn.classList.add('hidden');
        
        // فوکوس خودکار روی ورودی متن پس از باز شدن
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 400);
    }
}

// متصل کردن رویدادهای کلیک
aiToggleBtn.addEventListener('click', toggleSidebar);
aiCloseBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar); // بستن با کلیک روی پس‌زمینه محو

// ==========================================
// ۳. منطق ارسال و دریافت پیام (Chat Logic)
// ==========================================
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatArea = document.getElementById('chat-area');

// تابع سازنده حباب پیام‌ها
function createMessageElement(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    return msgDiv;
}

// تابع اسکرول نرم به آخرین پیام
function scrollToBottom() {
    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: 'smooth'
    });
}

// مدیریت ارسال فرم
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return; // جلوگیری از ارسال پیام خالی

    // ۱. اضافه کردن پیام کاربر به صفحه
    const userMsg = createMessageElement(text, 'user');
    chatArea.appendChild(userMsg);
    chatInput.value = '';
    scrollToBottom();

    // ۲. شبیه‌سازی مکث و پاسخ هوش مصنوعی
    setTimeout(() => {
        const aiResponse = "این یک پاسخ دمو است. در اینجا کدهای ارتباط با سرور (Fetch API) قرار می‌گیرد تا پاسخ واقعی به کاربر داده شود.";
        const aiMsg = createMessageElement(aiResponse, 'ai');
        chatArea.appendChild(aiMsg);
        scrollToBottom();
    }, 1200); // 1.2 ثانیه تاخیر برای طبیعی‌تر شدن
});
