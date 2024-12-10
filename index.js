const socket = io("http://localhost:3000");

// Get the button element and the status display
const startButton = document.getElementById("startButton");
const statusDisplay = document.getElementById("statusDisplay");

// Event listener for the "Start TradeWinds" button
startButton.addEventListener("click", () => {
  // Emit event to start the simulation on the backend
  socket.emit("startSimulation");

  // Update the status display while the simulation is running
  statusDisplay.textContent = "TradeWinds simulation is running...";
  statusDisplay.style.color = "green";
});

// Listen for the "simulationStarted" event from the backend
socket.on("simulationStarted", (message) => {
  statusDisplay.textContent = message;
  statusDisplay.style.color = "green";
});

// Optional: You can listen for more events if needed, such as updates for data generation, etc.
socket.on("dataGenerated", (message) => {
  statusDisplay.textContent = message;
  statusDisplay.style.color = "blue";
});
