const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const cors = require("cors"); // Import the CORS package

// MongoDB connection
const uri =
  "mongodb+srv://JakobFerguson:XbdHM2FJsjg4ajiO@trinitycapitalproductio.1yr5eaa.mongodb.net/?retryWrites=true&w=majority&appName=TrinityCapitalProduction";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, salesCollection, subscriptionsCollection;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("TradeWindsPrototype");
    salesCollection = db.collection("Sales");
    subscriptionsCollection = db.collection("Subscriptions");
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

// Create the server and socket.io
const app = express();
const server = http.createServer(app);

// Enable CORS for the server
app.use(
  cors({
    origin: "http://127.0.0.1:8080", // Allow this origin
    methods: ["GET", "POST"], // Allowed methods
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:8080", // Allow this origin for Socket.IO
    methods: ["GET", "POST"], // Allowed methods for Socket.IO
  },
});

// Serve the frontend
app.use(express.static("public"));

// Connect to MongoDB when the server starts
connectDB();

// Counters to increment customer names
let salesCustomerCounter = 1;
let subscriptionsCustomerCounter = 1;

// Sales Simulation (this function will be called on start button click)
const generateSalesData = () => {
  const salesData = [
    {
      amount: Math.floor(Math.random() * 100) + 1,
      date: new Date(),
      customerName: `Customer ${salesCustomerCounter++}`,
    },
  ];

  salesData.forEach((sale) => {
    salesCollection.insertOne(sale);
  });
  console.log("Generated a sale!");
};

// Subscription Simulation
const generateSubscriptionData = () => {
  const subscriptions = [
    {
      customerName: `Customer ${subscriptionsCustomerCounter++}`,
      subscriptionAmount: Math.floor(Math.random() * 100) + 1,
      nextBillingDate: new Date(),
      isPaid: Math.random() > 0.5,
    },
  ];

  subscriptions.forEach((subscription) => {
    subscriptionsCollection.insertOne(subscription);
  });
  console.log("Generated a subscription!");
};

// Function to generate random sales and subscriptions at random intervals
const startRandomGeneration = () => {
  // Generate random sales at random intervals between 1 minute and 1 hour
  setInterval(() => {
    generateSalesData();
  }, Math.floor(Math.random() * (60 * 60 * 1000)) + 60 * 1000);

  // Generate random subscriptions at random intervals between 1 minute and 1 hour
  setInterval(() => {
    generateSubscriptionData();
  }, Math.floor(Math.random() * (60 * 60 * 1000)) + 60 * 1000);
};

// Schedule the spreadsheet generation and email at 11:59 PM
cron.schedule("59 23 * * *", async () => {
  // Generate the spreadsheet
  const doc = new GoogleSpreadsheet("<Your Google Sheet ID>");
  await doc.useServiceAccountAuth(require("./google-credentials.json"));
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]; // Assuming the first sheet

  const sales = await salesCollection.find({}).toArray();
  const rows = sales.map((sale) => ({
    customerName: sale.customerName,
    amount: sale.amount,
    date: sale.date,
  }));

  await sheet.addRows(rows);
  console.log("Added sales data to spreadsheet!");

  // Send email with the spreadsheet link
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "trinitycapitalsim@gmail.com",
      pass: "Jakeagle02!", // You should use environment variables here for better security
    },
  });

  let mailOptions = {
    from: "trinitycapitalsim@gmail.com",
    to: "trinitycapitalsim@gmail.com",
    subject: "Daily Sales Report",
    text: "Please find the attached daily sales report.",
    attachments: [
      {
        filename: "SalesReport.xlsx",
        path: "path/to/your/sales-report.xlsx",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("startSimulation", () => {
    console.log("Starting TradeWinds simulation...");
    socket.emit("simulationStarted", "TradeWinds is now running!");

    // Start generating random sales and subscriptions at random intervals
    startRandomGeneration();
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
