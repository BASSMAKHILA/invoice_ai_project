import React, { useState } from 'react';
import axios from 'axios';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'upload : ' + err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="upload-container">
      <h1>📄 Analyse Facture & BDC</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Envoyer</button>

      {error && <p className="error">{error}</p>}

      {response && (
        <div className="response">
          <h2>✅ Réponse :</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadFile;
