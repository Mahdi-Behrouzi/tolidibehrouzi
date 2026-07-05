(function(){
  const toFa = n => String(n).replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const timeAgo = ts => {
    const s = Math.floor((Date.now()-ts)/1000);
    if(s<60) return "چند لحظه پیش";
    if(s<3600) return toFa(Math.floor(s/60)) + " دقیقه پیش";
    if(s<86400) return toFa(Math.floor(s/3600)) + " ساعت پیش";
    return toFa(Math.floor(s/86400)) + " روز پیش";
  };
  const initials = name => (name||"?").trim().slice(0,2);

  async function sha256(text){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
  }
  function randHex(len){
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  let sessionToken = null;

  // نظرات از همان bin که سایت اصلی (comments.js) به آن می‌نویسد خوانده و ذخیره می‌شوند
  const JSONBIN_URL = "https://api.jsonbin.io/v3/b/6a48fe01da38895dfe2d06dd";
  const JSONBIN_KEY  = "$2a$10$KHZy8R1Fpm5H8eDgoB9uaOXIHP0BowiquBPfSI7JcGJwmMaFxZhja";

  // خواندن/نوشتن کل رکورد bin (شامل هم نظرات و هم تنظیمات مدیر)
  async function fetchRecord(){
    const res = await fetch(JSONBIN_URL + "/latest", { headers: { "X-Master-Key": JSONBIN_KEY } });
    if(!res.ok) throw new Error("bad status " + res.status);
    const data = await res.json();
    return data.record || {};
  }
  async function putRecord(record){
    const res = await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_KEY },
      body: JSON.stringify(record)
    });
    if(!res.ok) throw new Error("bad status " + res.status);
  }

  // آمار بازدید فقط محلی است (روی همین مرورگر) و نیازی به سرور ندارد
  function loadStats(){
    try{ return JSON.parse(localStorage.getItem("didebaan_stats")) || { visits:0 }; }
    catch(e){ return { visits:0 }; }
  }
  function saveStats(s){
    try{ localStorage.setItem("didebaan_stats", JSON.stringify(s)); return true; }
    catch(e){ return false; }
  }

  // خواندن نظرات از jsonbin.io — بازگشت null یعنی خطای اتصال
  async function loadComments(){
    try{
      const record = await fetchRecord();
      const raw = record.comments || [];
      return raw.map((c, idx) => ({
        idx,
        name: c.name || "ناشناس",
        text: c.message || "",
        contact: c.email || "",
        rating: c.rating ? parseInt(c.rating) : null,
        approved: !!c.approved,
        createdAt: c.createdAt ? new Date(c.createdAt).getTime() : Date.now()
      }));
    }catch(e){
      console.error("jsonbin load failed", e);
      return null;
    }
  }

  // نوشتن آرایه‌ی نظرات روی jsonbin.io بدون پاک‌کردن تنظیمات مدیر (adminConfig)
  async function saveComments(list){
    const raw = list.map(c => ({
      name: c.name,
      email: c.contact || "",
      message: c.text,
      rating: c.rating || 5,
      approved: !!c.approved,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString()
    }));
    try{
      const record = await fetchRecord();
      record.comments = raw;
      await putRecord(record);
      return true;
    }catch(e){
      console.error("jsonbin save failed", e);
      return false;
    }
  }

  // ---------- GATE LOGIC ----------
  // رمز ورود ثابت و از پیش تعیین‌شده — برای تغییرش همین مقدار را عوض کن
  const ADMIN_PASSWORD = "Didebaan@2026";

  const setupForm = document.getElementById("setupForm");
  const loginForm = document.getElementById("loginForm");
  const gate = document.getElementById("gate");
  const app = document.getElementById("app");

  function initGate(){
    setupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  }

  document.getElementById("loginBtn").addEventListener("click", () => {
    const pass = document.getElementById("loginPass").value;
    const msg = document.getElementById("loginMsg");
    msg.className = "gate-msg";
    if(pass === ADMIN_PASSWORD){
      sessionToken = randHex(12);
      msg.textContent = "رمز درست است. در حال ورود...";
      msg.classList.add("ok");
      setTimeout(enterApp, 300);
    } else {
      msg.textContent = "رمز عبور اشتباه است.";
      msg.classList.add("err");
    }
  });

  document.getElementById("loginPass").addEventListener("keydown", e => {
    if(e.key === "Enter") document.getElementById("loginBtn").click();
  });

  function enterApp(){
    gate.style.display = "none";
    app.classList.add("show");
    document.getElementById("sessionChip").textContent = "توکن نشست: " + sessionToken;
    boot();
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionToken = null;
    app.classList.remove("show");
    gate.style.display = "flex";
    document.getElementById("loginPass").value = "";
    document.getElementById("loginMsg").textContent = "";
  });

  // ---------- NAV ----------
  document.querySelectorAll(".nav-item[data-view]").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item[data-view]").forEach(i=>i.classList.remove("active"));
      item.classList.add("active");
      const v = item.dataset.view;
      document.querySelectorAll(".view").forEach(el=>el.classList.remove("active"));
      document.getElementById("view-"+v).classList.add("active");
      const titles = {
        dashboard:["داشبورد","نمای کلی وضعیت سایت و نظرات"],
        comments:["مدیریت نظرات","تأیید یا حذف نظرات ثبت‌شده"],
        embed:["فرم نمایشی و کد","تست ثبت نظر و کد اتصال"]
      };
      document.getElementById("viewTitle").textContent = titles[v][0];
      document.getElementById("viewSub").textContent = titles[v][1];
      if(v === "comments") renderComments();
      if(v === "dashboard") renderDashboard();
    });
  });

  // ---------- DASHBOARD ----------
  function drawActivity(list){
    const svg = document.getElementById("activitySvg");
    const buckets = new Array(24).fill(0);
    const now = Date.now();
    list.forEach(c => {
      const hrsAgo = (now - c.createdAt) / 3600000;
      if(hrsAgo >= 0 && hrsAgo < 24){
        buckets[23 - Math.floor(hrsAgo)]++;
      }
    });
    const max = Math.max(1, ...buckets);
    const w = 700, h = 64, bw = w/24;
    let bars = "";
    buckets.forEach((v,i) => {
      const bh = (v/max) * (h-8);
      bars += `<rect x="${i*bw+2}" y="${h-bh-2}" width="${bw-4}" height="${Math.max(bh,2)}" rx="2" fill="${v>0?'#4FD1C5':'#212B44'}" opacity="${v>0?0.9:1}"></rect>`;
    });
    svg.innerHTML = bars;
    document.getElementById("lastActivity").textContent = "۲۴ ساعت گذشته";
  }

  async function renderDashboard(){
    const comments = await loadComments();
    const stats = await loadStats();

    if(comments === null){
      document.getElementById("recentList").innerHTML = '<div class="empty">اتصال به سرور نظرات (jsonbin.io) برقرار نشد. اتصال اینترنت یا اعتبار کلید API را بررسی کن.</div>';
      document.getElementById("statVisits").textContent = toFa(stats.visits||0);
      ["statPending","statApproved","statTotal","pendingBadge"].forEach(id => document.getElementById(id).textContent = "—");
      return;
    }

    const pending = comments.filter(c=>!c.approved).length;
    const approved = comments.filter(c=>c.approved).length;
    document.getElementById("statVisits").textContent = toFa(stats.visits||0);
    document.getElementById("statPending").textContent = toFa(pending);
    document.getElementById("statApproved").textContent = toFa(approved);
    document.getElementById("statTotal").textContent = toFa(comments.length);
    document.getElementById("pendingBadge").textContent = toFa(pending);
    drawActivity(comments);

    const recent = [...comments].sort((a,b)=>b.createdAt-a.createdAt).slice(0,4);
    const box = document.getElementById("recentList");
    if(recent.length===0){
      box.innerHTML = '<div class="empty">هنوز نظری ثبت نشده است.</div>';
    } else {
      box.innerHTML = recent.map(c => `
        <div class="comment-row">
          <div class="comment-top">
            <div class="comment-who">
              <div class="avatar">${initials(c.name)}</div>
              <div>
                <div class="comment-name">${escapeHtml(c.name)}</div>
                <div class="comment-time">${timeAgo(c.createdAt)}${c.contact?' · '+escapeHtml(c.contact):''}</div>
              </div>
            </div>
            <span class="status-badge ${c.approved?'status-approved':'status-pending'}">${c.approved?'تأییدشده':'در انتظار'}</span>
          </div>
          <div class="comment-text" style="padding-right:0;">${escapeHtml(c.text)}</div>
        </div>
      `).join("");
    }
  }

  function escapeHtml(str){
    return String(str||"").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  }

  // ---------- COMMENTS VIEW ----------
  let currentFilter = "pending";
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      renderComments();
    });
  });

  async function renderComments(){
    const box = document.getElementById("commentsList");
    const comments = await loadComments();
    if(comments === null){
      box.innerHTML = '<div class="empty">اتصال به سرور نظرات (jsonbin.io) برقرار نشد. اتصال اینترنت یا اعتبار کلید API را بررسی کن.</div>';
      return;
    }

    const pending = comments.filter(c=>!c.approved);
    const approved = comments.filter(c=>c.approved);
    document.getElementById("tabCntPending").textContent = toFa(pending.length);
    document.getElementById("tabCntApproved").textContent = toFa(approved.length);
    document.getElementById("tabCntAll").textContent = toFa(comments.length);

    let list = comments;
    if(currentFilter==="pending") list = pending;
    if(currentFilter==="approved") list = approved;
    list = [...list].sort((a,b)=>b.createdAt-a.createdAt);

    if(list.length===0){
      box.innerHTML = '<div class="empty">نظری در این بخش وجود ندارد.</div>';
      return;
    }
    box.innerHTML = list.map(c => `
      <div class="comment-row" data-idx="${c.idx}">
        <div class="comment-top">
          <div class="comment-who">
            <div class="avatar">${initials(c.name)}</div>
            <div>
              <div class="comment-name">${escapeHtml(c.name)}</div>
              <div class="comment-time">${timeAgo(c.createdAt)}${c.contact?' · '+escapeHtml(c.contact):''}</div>
            </div>
          </div>
          <span class="status-badge ${c.approved?'status-approved':'status-pending'}">${c.approved?'تأییدشده':'در انتظار'}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        <div class="comment-actions">
          ${!c.approved ? `<button class="act-btn approve" data-act="approve" data-idx="${c.idx}">تأیید</button>` : ""}
          <button class="act-btn reject" data-act="delete" data-idx="${c.idx}">حذف</button>
        </div>
      </div>
    `).join("");

    box.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.idx);
        const act = btn.dataset.act;
        btn.disabled = true;
        btn.textContent = "...";
        const fresh = await loadComments();
        if(fresh === null){ alert("اتصال به سرور نظرات برقرار نشد. دوباره تلاش کن."); renderComments(); return; }
        let updated = fresh;
        if(act === "approve"){
          updated = fresh.map(c => c.idx===idx ? {...c, approved:true} : c);
        } else if(act === "delete"){
          updated = fresh.filter(c => c.idx!==idx);
        }
        const ok = await saveComments(updated);
        if(!ok) alert("ذخیره‌ی تغییرات با خطا مواجه شد. دوباره تلاش کن.");
        renderComments();
        renderDashboard();
      });
    });
  }

  // ---------- DEMO SUBMIT (می‌نویسد روی همان bin واقعی سایت) ----------
  document.getElementById("demoSubmit").addEventListener("click", async () => {
    const name = document.getElementById("demoName").value.trim();
    const text = document.getElementById("demoText").value.trim();
    const msg = document.getElementById("demoMsg");
    const btn = document.getElementById("demoSubmit");
    if(!name || !text){ msg.style.color="var(--danger)"; msg.textContent = "نام و متن نظر را وارد کن."; return; }
    btn.disabled = true; btn.textContent = "در حال ارسال...";
    const list = await loadComments();
    if(list === null){
      btn.disabled = false; btn.textContent = "ارسال نظر";
      msg.style.color="var(--danger)"; msg.textContent = "اتصال به سرور نظرات برقرار نشد.";
      return;
    }
    list.push({ idx:-1, name, text, contact:"", rating:5, approved:false, createdAt: Date.now() });
    const ok = await saveComments(list);
    btn.disabled = false; btn.textContent = "ارسال نظر";
    if(!ok){ msg.style.color="var(--danger)"; msg.textContent = "ارسال با خطا مواجه شد."; return; }
    document.getElementById("demoName").value = "";
    document.getElementById("demoText").value = "";
    msg.style.color = "var(--success)";
    msg.textContent = "نظر ثبت شد و در «مدیریت نظرات» در انتظار بررسی است.";
    renderDashboard();
  });

  // ---------- BOOT ----------
  async function boot(){
    const stats = await loadStats();
    stats.visits = (stats.visits||0) + 1;
    await saveStats(stats);
    renderDashboard();
    renderComments();
  }

  initGate();
})();
