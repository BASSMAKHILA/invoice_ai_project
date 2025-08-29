# app/services/test_data_extractor.py

from data_extractor import parse_invoice_data

texte_exemple = """
Facture N° : 12345
Date : 01/08/2025
Total HT : 1000,00 €
TVA : 200,00 €
Total TTC : 1200,00 €
Client : Société Exemple
"""

result = parse_invoice_data(texte_exemple)
print(result)
