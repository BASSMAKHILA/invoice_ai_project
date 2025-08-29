import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ResultSection = ({ extractedText }) => {
  
  // Fonction pour télécharger en CSV
  const downloadCSV = () => {
    const blob = new Blob([extractedText], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "texte_extrait.csv");
  };

  // Fonction pour télécharger en Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([["Texte Extrait"], [extractedText]]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "texte_extrait.xlsx");
  };

  return (
    <div className="p-6 mt-6 bg-white shadow-lg rounded-xl">
      <h2 className="mb-4 text-lg font-bold">📄 Texte extrait :</h2>
      <pre className="p-4 overflow-x-auto bg-gray-100 rounded-lg">{extractedText}</pre>

      <div className="flex gap-3 mt-4">
        <button
          onClick={downloadCSV}
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          ⬇ Télécharger CSV
        </button>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          ⬇ Télécharger Excel
        </button>
      </div>
    </div>
  );
};

export default ResultSection;
