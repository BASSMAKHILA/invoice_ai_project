const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== MongoDB =====
mongoose.connect("mongodb://127.0.0.1:27017/upload_dashboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  extractedData: mongoose.Schema.Types.Mixed,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model("File", fileSchema);

// ===== Multer storage =====
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ===== Upload endpoint =====
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    let extractedText = "";
    let donnees_extraites = {};

    // PDF ou image OCR
    if (mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "fra");
      extractedText = result.data.text;
    } else {
      extractedText = fs.readFileSync(filePath, "utf-8");
    }

    // Parsing simple JSON si le texte contient JSON
    try {
      donnees_extraites = JSON.parse(extractedText);
    } catch {
      donnees_extraites = { text: extractedText };
    }

    const fileDoc = await File.create({
      filename: req.file.originalname,
      mimetype,
      extractedData: donnees_extraites,
      text: extractedText
    });

    res.json({ id: fileDoc._id, extracted_text: extractedText, donnees_extraites });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'upload");
  }
});

// ===== Lister les fichiers =====
app.get("/files", async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
});

// ===== Sauvegarde des modifications =====
app.post("/save", async (req, res) => {
  const { fileId, modifiedData } = req.body;
  try {
    const jsonData = typeof modifiedData === "string" ? JSON.parse(modifiedData) : modifiedData;
    await File.findByIdAndUpdate(fileId, { extractedData: jsonData });
    res.send("Données sauvegardées ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la sauvegarde");
  }
});

app.listen(8000, () => console.log("Server running on http://127.0.0.1:8000"));
