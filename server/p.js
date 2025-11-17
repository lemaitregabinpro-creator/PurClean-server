const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const reservationsPath = path.join(__dirname, "reservations.json");
const configPath = path.join(__dirname, "config.json");

app.get("/", (req, res) => {
  res.send("PurClean API is running");
});

// GET all reservations
app.get("/reservations", async (req, res) => {
  try {
    let data = [];
    if (await fs.pathExists(reservationsPath)) {
      data = await fs.readJSON(reservationsPath);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to load reservations" });
  }
});

// POST new reservation
app.post("/reservations", async (req, res) => {
  try {
    const newReservation = { id: Date.now(), ...req.body };

    let data = [];
    if (await fs.pathExists(reservationsPath)) {
      data = await fs.readJSON(reservationsPath);
    }

    data.push(newReservation);

    await fs.writeJSON(reservationsPath, data, { spaces: 2 });

    res.json({ success: true, message: "Reservation added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to save reservation" });
  }
});

app.listen(PORT, () => {
  console.log("API PurClean running on port " + PORT);
});
