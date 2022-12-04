let darkBtn = document.querySelector(".dark-btn");
const icon = document.querySelector(".dark-btn img");
let mode = localStorage.getItem("mode");

darkBtn.addEventListener("click",(e)=>{
   mode = mode === "dark" ? "light" : "dark";
   localStorage.setItem("mode", mode);
   changeMode()
})

function changeMode(){
  if (mode === "dark") {
    document.body.classList.add("dark");
    icon.src = "images/icon-sun.svg";
  } else {
    document.body.classList.remove("dark");
     icon.src = "images/icon-moon.svg";
  }
}
changeMode();