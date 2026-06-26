window.addEventListener("scroll",()=>{

const header=document.querySelector(".nav-wrapper");

if(window.scrollY>40){

header.style.background="rgba(255,255,255,.95)";

}else{

header.style.background="rgba(255,255,255,.82)";

}

});
