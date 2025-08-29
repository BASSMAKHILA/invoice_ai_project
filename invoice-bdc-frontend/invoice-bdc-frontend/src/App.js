import React, { useState } from "react";
import UploadDocument from "./components/UploadDocument";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function App() {
  const [extractedText, setExtractedText] = useState("");

  // Télécharger en CSV
  const downloadCSV = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "document.csv");
  };

  // Télécharger en Excel
  const downloadExcel = () => {
    if (!extractedText) return;
    const rows = extractedText.split("\n").map(line => [line]);
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Extraction");
    XLSX.writeFile(workbook, "document.xlsx");
  };

  return (
    <div style={{ backgroundColor: "#1e1e1e", minHeight: "100vh", color: "#fff", padding: "20px" }}>
      <h1 style={{ color: "#fdd835", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
        🚀 Application Upload Facture / BDC
      </h1>

      <UploadDocument onExtractedText={setExtractedText} />

      {extractedText && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={downloadCSV}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fdd835",
              color: "#1e1e1e",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = "#ffc107")}
            onMouseLeave={e => (e.target.style.backgroundColor = "#fdd835")}
          >
            📄 Télécharger CSV
          </button>

          <button
            onClick={downloadExcel}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fdd835",
              color: "#1e1e1e",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = "#ffc107")}
            onMouseLeave={e => (e.target.style.backgroundColor = "#fdd835")}
          >
            📊 Télécharger Excel
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
