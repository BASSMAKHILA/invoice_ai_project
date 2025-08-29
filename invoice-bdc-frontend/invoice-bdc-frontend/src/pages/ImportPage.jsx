import React from "react";
import UploadInvoice from "../components/UploadInvoice";

const ImportPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Importer une Facture</h2>
      <UploadInvoice />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
};

export default ImportPage;
