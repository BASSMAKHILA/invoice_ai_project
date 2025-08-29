import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/api';

export default function HistoryPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    getHistory().then((res) => {
      setInvoices(res.data);
    }).catch((err) => {
      console.error('Erreur lors de la récupération:', err);
    });
  }, []);

  return (
    <div className="container">
      <h1>Historique des Factures</h1>
      {invoices.length === 0 ? (
        <p>Aucune facture trouvée.</p>
      ) : (
        <ul>
          {invoices.map((inv, i) => (
            <li key={i}>
              <strong>Numéro :</strong> {inv.numero} — <strong>Client :</strong> {inv.client}
              <br />
              <strong>Montant :</strong> {inv.montant} MAD — <strong>Date :</strong> {inv.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
