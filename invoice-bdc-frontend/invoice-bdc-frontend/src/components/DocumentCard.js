import React from 'react';

const DocumentCard = ({ doc }) => {
  return (
    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h4>{doc.file_name}</h4>
      <p>Date : {doc.date}</p>
      <pre>{JSON.stringify(doc.extracted_data, null, 2)}</pre>
    </div>
  );
};

export default DocumentCard;
