import re

def parse_invoice_data(raw_text: str) -> dict:
    data = {}

    # Normalisation basique du texte
    raw_text = raw_text.replace('\r\n', '\n').replace('\r', '\n')

    # Détection type document
    if re.search(r"\bbon\s*de\s*commande\b", raw_text, re.IGNORECASE):
        data['type_document'] = 'bon_de_commande'
    elif re.search(r"\bfacture\b", raw_text, re.IGNORECASE):
        data['type_document'] = 'facture'
    else:
        data['type_document'] = None

    if data['type_document'] == 'facture':
        data['numero_facture'] = None
        data['date_facture'] = None
        data['total_ht'] = None
        data['tva'] = None
        data['total_ttc'] = None
        data['client_nom'] = "Client Inconnu"
        data['adresse_client'] = None

        # Numéro facture
        match_num = re.search(r"(Num[eé]ro\s*de\s*facture|Facture\s*N°|N°\s*facture|Invoice\s*Number)\s*[:\-]?\s*(\S+)", raw_text, re.IGNORECASE)
        if match_num:
            data['numero_facture'] = match_num.group(2)

        # Date facture
        match_date = re.search(r"(Date\s*de\s*facture|Date)\s*[:\-]?\s*(\d{2}[\/\-\.\s]\d{2}[\/\-\.\s]\d{2,4})", raw_text, re.IGNORECASE)
        if match_date:
            data['date_facture'] = match_date.group(2)

        # Total HT
        match_total_ht = re.search(r"(Total\s*(HT|Hors\s*Taxe))\s*[:\-]?\s*([\d\s,.]+)", raw_text, re.IGNORECASE)
        if match_total_ht:
            data['total_ht'] = match_total_ht.group(3).strip()

        # TVA
        match_tva = re.search(r"(TVA|Taxe)\s*[:\-]?\s*([\d\s,.]+)", raw_text, re.IGNORECASE)
        if match_tva:
            data['tva'] = match_tva.group(2).strip()

        # Total TTC
        match_total_ttc = re.search(r"(Total\s*TTC|Total\s*Toutes\s*Taxes\s*Comprises)\s*[:\-]?\s*([\d\s,.]+)", raw_text, re.IGNORECASE)
        if match_total_ttc:
            data['total_ttc'] = match_total_ttc.group(2).strip()

        # Client
        match_client = re.search(r"(Client|Factur[ée] à|Bill\s*To)\s*[:\-]?\s*(.+)", raw_text, re.IGNORECASE)
        if match_client:
            data['client_nom'] = match_client.group(2).strip()

        # Adresse client (optionnel)
        match_adresse = re.search(r"(Adresse|Address)\s*[:\-]?\s*(.+)", raw_text, re.IGNORECASE)
        if match_adresse:
            data['adresse_client'] = match_adresse.group(2).strip()

    elif data['type_document'] == 'bon_de_commande':
        data['numero_bdc'] = None
        data['date_bdc'] = None
        data['client_nom'] = "Inconnu"
        data['adresse_client'] = None
        data['total_bdc'] = ""

        # Numéro BDC
        match_num_bdc = re.search(r"Num[eé]ro\s*[:\-]?\s*(\S+)", raw_text, re.IGNORECASE)
        if match_num_bdc:
            data['numero_bdc'] = match_num_bdc.group(1)

        # Date BDC (ex: 25 juillet 2025)
        match_date_bdc = re.search(r"Date\s*[:\-]?\s*([\d]{1,2}\s*[a-zA-Zéû]+\s*[\d]{4})", raw_text, re.IGNORECASE)
        if match_date_bdc:
            data['date_bdc'] = match_date_bdc.group(1)

        # Client / Fournisseur
        match_client = re.search(r"(Client|Fournisseur|Bill\s*To|Factur[ée] à)\s*[:\-]?\s*(.+)", raw_text, re.IGNORECASE)
        if match_client:
            data['client_nom'] = match_client.group(2).strip()

        # Adresse client (optionnel)
        match_adresse = re.search(r"(Adresse|Address)\s*[:\-]?\s*(.+)", raw_text, re.IGNORECASE)
        if match_adresse:
            data['adresse_client'] = match_adresse.group(2).strip()

        # Total BDC (optionnel)
        match_total_bdc = re.search(r"Total\s*[:\-]?\s*([\d\s,.]+)", raw_text, re.IGNORECASE)
        if match_total_bdc:
            data['total_bdc'] = match_total_bdc.group(1).strip()

    else:
        # Document non reconnu
        data.update({
            'numero_facture': None,
            'date_facture': None,
            'total_ht': None,
            'tva': None,
            'total_ttc': None,
            'client_nom': "Inconnu",
            'adresse_client': None,
            'numero_bdc': None,
            'date_bdc': None,
            'total_bdc': "",
        })

    return data
