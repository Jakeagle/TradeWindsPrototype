const socket = io("https://tradewindsprototype-gnbgdcg4gsd4fwb8.centralus-01.azurewebsites.net");

// DOM Elements
const statusDisplay = document.getElementById("statusDisplay");

document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("introScreen");
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const loginForm = loginScreen.querySelector("form");

  console.log("DOM loaded");
  if (introScreen) console.log("Intro screen found");
  if (loginScreen) console.log("Login screen found");

  // Show login screen after intro animation
  setTimeout(() => {
    introScreen.style.display = "none";
    console.log("Intro screen hidden");

    loginScreen.classList.add("show", "animate-slide-up");
    console.log("Login screen classes applied");
  }, 3000);

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    const username = document.getElementById("username").value;
    const password = document.getElementById("pin").value;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.status === 200) {
        console.log("Login successful:", result);
        alert("Login successful!");
        loginScreen.style.display = "none"; // Hide login screen
        dashboardScreen.classList.remove("d-none"); // Show dashboard
      } else {
        console.log("Login failed:", result.message);
        alert(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});
