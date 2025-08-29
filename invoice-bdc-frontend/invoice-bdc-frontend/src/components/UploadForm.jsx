import React, { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage("Erreur : " + (errorData.detail || response.statusText));
        return;
      }

      const data = await response.json();
      setMessage(`Succès : ${data.message || "Fichier envoyé avec succès"}`);
    } catch (error) {
      setMessage("Erreur réseau ou serveur.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>📄 Analyse Facture & BDC</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        <button type="submit" style={{ marginTop: 10 }}>
          Envoyer
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: 15,
            padding: 10,
            borderRadius: 5,
            backgroundColor: message.startsWith("Succès") ? "#d4edda" : "#f8d7da",
            color: message.startsWith("Succès") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
