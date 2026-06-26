/*==========================================
        PAGE LOADER
==========================================*/

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

        setTimeout(() => {

            loader.style.display = "none";

        },600);

    }

});


/*==========================================
        STICKY HEADER
==========================================*/

const header = document.querySelector(".header");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 80){

        header.classList.add("sticky");

    }else{

        header.classList.remove("sticky");

    }

});


/*==========================================
        MOBILE MENU
==========================================*/

const menuBtn = document.querySelector(".menu-btn");

const mobileMenu = document.querySelector(".mobile-menu");

if(menuBtn){

menuBtn.onclick = ()=>{

mobileMenu.classList.toggle("active");

}

}


/*==========================================
        SEARCH POPUP
==========================================*/

const searchBtn = document.querySelector(".search-btn");

const searchPopup = document.querySelector(".search-popup");

if(searchBtn){

searchBtn.onclick = ()=>{

searchPopup.classList.toggle("active");

}

}

window.addEventListener("click",(e)=>{

if(

searchPopup &&
!searchPopup.contains(e.target) &&
!searchBtn.contains(e.target)

){

searchPopup.classList.remove("active");

}

});


/*==========================================
        BACK TO TOP
==========================================*/

const backTop = document.querySelector(".back-to-top");

window.addEventListener("scroll",()=>{

if(window.scrollY > 500){

backTop.style.display="flex";

}else{

backTop.style.display="none";

}

});

backTop.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};


/*==========================================
        HERO COUNTER
==========================================*/

const counters=document.querySelectorAll(".hero-stats h2");

let counterStarted=false;

function runCounter(){

if(counterStarted) return;

counterStarted=true;

counters.forEach(counter=>{

const target=parseInt(counter.innerText);

let count=0;

const speed=target/80;

const update=()=>{

count+=speed;

if(count<target){

counter.innerText=Math.floor(count)+"+";

requestAnimationFrame(update);

}else{

counter.innerText=target+"+";

}

}

update();

});

}

window.addEventListener("scroll",()=>{

if(window.scrollY>150){

runCounter();

}

});
/*==========================================
        SCROLL REVEAL
==========================================*/

const revealItems = document.querySelectorAll(
".feature-box,.category-card,.product-card,.testimonial-card,.stat-box,.brand-item,.promo-banner,.newsletter-box"
);

const revealObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:.15
});

revealItems.forEach(item=>{

item.classList.add("hidden");

revealObserver.observe(item);

});


/*==========================================
        HERO PARALLAX
==========================================*/

const hero=document.querySelector(".hero");

window.addEventListener("mousemove",(e)=>{

const x=(window.innerWidth/2-e.clientX)/40;

const y=(window.innerHeight/2-e.clientY)/40;

const main=document.querySelector(".main-image");
const left=document.querySelector(".left-card");
const right=document.querySelector(".right-card");

if(main){

main.style.transform=`translate(${x}px,${y}px)`;

}

if(left){

left.style.transform=`translate(${x*1.5}px,${y*1.5}px) rotate(-10deg)`;

}

if(right){

right.style.transform=`translate(${-x}px,${-y}px) rotate(12deg)`;

}

});


/*==========================================
        PRODUCT 3D HOVER
==========================================*/

document.querySelectorAll(".product-card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateY=(x-rect.width/2)/18;

const rotateX=-(y-rect.height/2)/18;

card.style.transform=

`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-15px)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="perspective(1000px) rotateX(0) rotateY(0)";

});

});


/*==========================================
        LAZY IMAGES
==========================================*/

const lazyImages=document.querySelectorAll("img");

const lazyObserver=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="scale(1)";

}

});

});

lazyImages.forEach(img=>{

img.style.opacity="0";

img.style.transform="scale(.94)";

img.style.transition=".8s";

lazyObserver.observe(img);

});


/*==========================================
        STATISTICS COUNTER
==========================================*/

const stats=document.querySelectorAll(".stat-box h2");

let statsPlayed=false;

function startStats(){

if(statsPlayed) return;

statsPlayed=true;

stats.forEach(item=>{

const target=parseInt(item.textContent);

let value=0;

const speed=target/100;

function update(){

value+=speed;

if(value<target){

item.textContent=Math.floor(value)+"+";

requestAnimationFrame(update);

}else{

item.textContent=target+"+";

}

}

update();

});

}

window.addEventListener("scroll",()=>{

const section=document.querySelector(".statistics");

if(section){

const top=section.offsetTop;

if(window.scrollY>top-400){

startStats();

}

}

});


/*==========================================
        RIPPLE EFFECT
==========================================*/

document.querySelectorAll("button,.btn-primary,.btn-secondary,.product-btn,.promo-btn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

const circle=document.createElement("span");

const d=Math.max(btn.clientWidth,btn.clientHeight);

circle.style.width=d+"px";

circle.style.height=d+"px";

circle.style.position="absolute";

circle.style.borderRadius="50%";

circle.style.background="rgba(255,255,255,.45)";

circle.style.left=e.offsetX-d/2+"px";

circle.style.top=e.offsetY-d/2+"px";

circle.style.pointerEvents="none";

circle.style.transform="scale(0)";

circle.style.transition=".6s";

btn.style.position="relative";

btn.style.overflow="hidden";

btn.appendChild(circle);

requestAnimationFrame(()=>{

circle.style.transform="scale(4)";

circle.style.opacity="0";

});

setTimeout(()=>{

circle.remove();

},600);

});

});
/*==========================================
        TESTIMONIAL AUTO SLIDER
==========================================*/

const testimonialSlider = document.querySelector(".testimonial-slider");

if(testimonialSlider){

let index = 0;

setInterval(()=>{

index++;

if(index > 2){

index = 0;

}

testimonialSlider.style.transform =
`translateX(${index * -100}%)`;

testimonialSlider.style.transition=".8s";

},5000);

}


/*==========================================
        CURSOR GLOW
==========================================*/

const glow=document.createElement("div");

glow.className="cursor-glow";

document.body.appendChild(glow);

window.addEventListener("mousemove",(e)=>{

glow.style.left=e.clientX+"px";

glow.style.top=e.clientY+"px";

});


/*==========================================
        HERO TITLE TYPING
==========================================*/

const heroTitle=document.querySelector(".hero-content h1");

if(heroTitle){

const text=heroTitle.innerHTML;

heroTitle.innerHTML="";

let i=0;

function type(){

if(i<text.length){

heroTitle.innerHTML+=text.charAt(i);

i++;

setTimeout(type,25);

}

}

type();

}


/*==========================================
        ACTIVE MENU
==========================================*/

const navLinks=document.querySelectorAll(".menu a");

navLinks.forEach(link=>{

link.addEventListener("click",()=>{

navLinks.forEach(item=>{

item.classList.remove("active");

});

link.classList.add("active");

});

});


/*==========================================
        CLOSE MOBILE MENU
==========================================*/

window.addEventListener("click",(e)=>{

if(

mobileMenu &&
menuBtn &&
!mobileMenu.contains(e.target) &&
!menuBtn.contains(e.target)

){

mobileMenu.classList.remove("active");

}

});


/*==========================================
        HEADER EFFECT
==========================================*/

window.addEventListener("scroll",()=>{

if(window.scrollY>150){

header.style.background="rgba(255,255,255,.96)";

header.style.boxShadow="0 15px 40px rgba(0,0,0,.08)";

}else{

header.style.background="rgba(255,255,255,.78)";

header.style.boxShadow="none";

}

});


/*==========================================
        SMOOTH LINKS
==========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});


/*==========================================
        CONSOLE MESSAGE
==========================================*/

console.log("%c Behrouzi Luxury UI ","background:#8d6b43;color:#fff;padding:12px 20px;font-size:16px;border-radius:10px;");

console.log("Designed with HTML CSS JavaScript");

/*==========================================
        END OF FILE
==========================================*/
