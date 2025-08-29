client = MongoClient(MONGO_URI)
db = client["gestion_documents"]

# Création forcée des collections si besoin
if "factures" not in db.list_collection_names():
    db.create_collection("factures")
if "bdcs" not in db.list_collection_names():
    db.create_collection("bdcs")

collection_factures = db["factures"]
collection_bdcs = db["bdcs"]
