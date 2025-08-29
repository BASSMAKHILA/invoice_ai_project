import React from 'react';
import { saveParsedData } from '../services/api';

const ExtractionResult = ({ data }) => {
  const handleSave = async () => {
    try {
      await saveParsedData(data);
      alert('Document sauvegardé !');
    } catch {
      alert('Erreur lors de la sauvegarde.');
    }
  };

  return (
    <div>
      <h3>Résultat de l'extraction</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={handleSave}>Sauvegarder</button>
    </div>
  );
};

export default ExtractionResult;
