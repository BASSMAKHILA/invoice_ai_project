from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base
from datetime import datetime

class Facture(Base):
    __tablename__ = 'factures'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    raw_content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class BDC(Base):
    __tablename__ = 'bdcs'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    raw_content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
