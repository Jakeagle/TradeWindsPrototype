const socket = io("http://localhost:3000");

// Get the button elements and the status display

const statusDisplay = document.getElementById("statusDisplay");

document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("introScreen");
  const loginScreen = document.getElementById("loginScreen");

  console.log("DOM loaded");
  if (introScreen) console.log("Intro screen found");
  if (loginScreen) console.log("Login screen found");

  setTimeout(() => {
    introScreen.style.display = "none";
    console.log("Intro screen hidden");

    loginScreen.classList.add("show", "animate-slide-up");
    console.log("Login screen classes applied");
  }, 3000);
});
