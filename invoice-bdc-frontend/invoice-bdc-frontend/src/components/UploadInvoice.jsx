import React, { useState } from 'react';

function UploadInvoice() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
    setResponse(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erreur lors de l'envoi.");
      }

      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      console.error("Erreur :", err);
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div className="upload-container">
      <label className="file-label">
        📁 Importer une facture ou un BDC
        <input type="file" onChange={handleFileChange} />
      </label>

      <button className="upload-button" onClick={handleUpload}>
        📤 Envoyer
      </button>

      {error && <div className="error-message">❌ {error}</div>}
      {response && (
        <div className="success-message">
          ✅ Réponse : <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadInvoice;
