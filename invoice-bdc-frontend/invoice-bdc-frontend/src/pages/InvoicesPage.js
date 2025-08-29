import React, { useEffect, useState } from 'react';
import api from '../services/api';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des factures :', error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>Liste des Factures</h2>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            {invoice.client_name} - {invoice.invoice_number} - {invoice.total} MAD
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoicesPage;
