const socket = io("https://tradewindsprototype-gnbgdcg4gsd4fwb8.centralus-01.azurewebsites.net");

// Get the button elements and the status display
const startButton = document.getElementById("startButton");
const testButton = document.getElementById("testButton");
const statusDisplay = document.getElementById("statusDisplay");

// Event listener for the "Start TradeWinds" button
startButton.addEventListener("click", () => {
  // Emit event to start the simulation on the backend
  socket.emit("startSimulation");

  // Update the status display while the simulation is running
  statusDisplay.textContent = "TradeWinds simulation is running...";
  statusDisplay.style.color = "green";
});

// Event listener for the "Run Test Report Now" button
testButton.addEventListener("click", () => {
  // Send a POST request to trigger the report generation and sending script
  fetch("/triggerReport", {
    method: "POST", // Assuming it's a POST request
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the status message with success
      statusDisplay.textContent = "Report sent successfully!";
      statusDisplay.style.color = "blue";
    })
    .catch((error) => {
      // Update the status message with error
      statusDisplay.textContent = "Error sending report.";
      statusDisplay.style.color = "red";
    });
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
