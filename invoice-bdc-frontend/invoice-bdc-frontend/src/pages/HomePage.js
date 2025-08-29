import React, { useState } from 'react';
import { uploadFile } from '../services/api';

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadFile(formData);
      setResult(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du traitement.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Importer une Facture</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Envoyer</button>
      </form>

      {result && (
        <pre className="result">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
