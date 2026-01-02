import uuid 
from beanie import Document
from typing import List, Dict
from pydantic import Field
from datetime import datetime


#adaugat clasa COnversation pentru a putea salva conversatiile cu ai ul folosind o lista de dictioanre care salveaza cine trimite mesajul si mesajul
class Conversation(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str

    messages: List[Dict[str, str]] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "conversations"
