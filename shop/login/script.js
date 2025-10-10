// دکمه‌های تعویض فرم
document.getElementById("showLogin").addEventListener("click", function() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
});

document.getElementById("showSignup").addEventListener("click", function() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
});
// تنظیمات Firebase
const firebaseConfig = {
  apiKey: "اینجا API KEY خودتو بذار",
  authDomain: "tolidibehrouzi.firebaseapp.com",
  databaseURL: "https://tolidibehrouzi-e1ae3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tolidibehrouzi",
  storageBucket: "tolidibehrouzi.appspot.com",
  messagingSenderId: "شماره فرستنده",
  appId: "شناسه اپلیکیشن"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ثبت‌نام
document.getElementById("signupForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  db.ref("users").push({
    username: username,
    email: email,
    password: password
  });

  document.getElementById("signupMessage").textContent = "ثبت‌نام با موفقیت انجام شد!";
});

// ورود
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  db.ref("users").once("value", function(snapshot) {
    let found = false;
    snapshot.forEach(function(child) {
      const data = child.val();
      if (data.username === username && data.password === password) {
        found = true;
      }
    });

    if (found) {
      document.getElementById("loginMessage").textContent = "ورود موفق!";
    } else {
      document.getElementById("loginMessage").textContent = "نام کاربری یا رمز اشتباه است.";
    }
  });
});
