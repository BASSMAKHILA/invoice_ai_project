import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./UploadDocument.css";

const API_URL = "http://127.0.0.1:8000";

export default function UploadDocument() {
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState({ factures: [], bdcs: [] });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const dropRef = useRef(null);

  // -------------------- Fetch documents --------------------
  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // -------------------- Drag & Drop --------------------
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // -------------------- Upload --------------------
  const uploadFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(`${API_URL}/upload/`, formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles((prev) =>
              prev.map((f, idx) => (idx === i ? { ...f, progress: percent } : f))
            );
          },
        });
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, uploaded: true } : f))
        );
      } catch (err) {
        console.error(err);
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, error: true } : f))
        );
      }
    }
    fetchDocuments();
    setFiles([]);
  };

  // -------------------- Select document --------------------
  const selectDoc = (doc) => setSelectedDoc(doc);

  const saveText = async () => {
    if (!selectedDoc) return;
    try {
      await axios.post(`${API_URL}/update/${selectedDoc._id}`, { modified_text: selectedDoc.extracted_text });
      alert("Texte mis à jour ✅");
      fetchDocuments();
      setSelectedDoc(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour ❌");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <div>
          <h1>🚀 Innovatech Upload Dashboard</h1>
          <p>Application Upload Facture / BDC</p>
        </div>
      </header>

      <section
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={dropRef}
      >
        <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
        />
      </section>

      {files.length > 0 && (
        <section className="upload-list">
          <h2>Fichiers à uploader</h2>
          {files.map((f, idx) => (
            <div key={idx} className="file-item">
              <span>{f.name}</span>
              <div className="progress-bar">
                <div
                  className={`progress ${f.uploaded ? "success" : f.error ? "error" : ""}`}
                  style={{ width: `${f.progress || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
          <button className="upload-btn" onClick={uploadFiles}>
            ⬆️ Upload Tous
          </button>
        </section>
      )}

      <section className="tables-section">
        <div className="table-container">
          <h2>Factures</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.factures?.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.filename}</td>
                  <td>{new Date(doc.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => selectDoc(doc)}>Voir / Modifier</button>
                    <a href={`${API_URL}/download/facture/${doc._id}`} target="_blank" rel="noreferrer">
                      Télécharger
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>BDC</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.bdcs?.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.filename}</td>
                  <td>{new Date(doc.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => selectDoc(doc)}>Voir / Modifier</button>
                    <a href={`${API_URL}/download/bdc/${doc._id}`} target="_blank" rel="noreferrer">
                      Télécharger
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedDoc && (
        <section className="editor-section">
          <h2>Texte extrait / Modification</h2>
          <textarea
            value={selectedDoc.extracted_text}
            onChange={(e) =>
              setSelectedDoc({ ...selectedDoc, extracted_text: e.target.value })
            }
          />
          <button onClick={saveText}>Sauvegarder</button>
        </section>
      )}
    </div>
  );
}
