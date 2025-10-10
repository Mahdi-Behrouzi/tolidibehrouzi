const firebaseConfig = {
  apiKey: "🔑 API KEY",
  authDomain: "tolidibehrouzi.firebaseapp.com",
  databaseURL: "https://tolidibehrouzi-e1ae3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tolidibehrouzi",
  storageBucket: "tolidibehrouzi.appspot.com",
  messagingSenderId: "🔢",
  appId: "🆔"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// تعویض فرم‌ها
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

btnLogin.addEventListener("click", () => {
  btnLogin.classList.add("active");
  btnSignup.classList.remove("active");
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
});

btnSignup.addEventListener("click", () => {
  btnSignup.classList.add("active");
  btnLogin.classList.remove("active");
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
});

// ثبت‌نام
signupForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (username && email && password) {
    db.ref("users").push({ username, email, password });
    document.getElementById("signupMessage").textContent = "ثبت‌نام با موفقیت انجام شد!";
  } else {
    document.getElementById("signupMessage").textContent = "لطفاً همه فیلدها را پر کنید.";
  }
});

// ورود
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  db.ref("users").once("value")
    .then(snapshot => {
      let found = false;
      snapshot.forEach(child => {
        const data = child.val();
        if (data.username === username && data.password === password) {
          found = true;
        }
      });

      document.getElementById("loginMessage").textContent = found
        ? "ورود موفق!"
        : "نام کاربری یا رمز اشتباه است.";
    })
    .catch(error => {
      console.error("خطا در اتصال:", error);
      document.getElementById("loginMessage").textContent = "خطا در اتصال به سرور.";
    });
});
