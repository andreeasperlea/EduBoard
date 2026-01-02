from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
from datetime import datetime

from app.models.conversation import Conversation
from app.models.user import User
from app.api.deps import get_current_user

load_dotenv()

router = APIRouter(tags=["AI"])

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

class ChatRequest(BaseModel):

    message: str 

@router.get("/history")
async def get_chat_history(current_user: User = Depends(get_current_user)):
    """am schimbat functionalitatea astfel incat sa salvam in baza de date inclusiv conversatia cu api-ul"""
    conv = await Conversation.find_one(Conversation.user_id == str(current_user.id))
    if not conv:
        return []
    return conv.messages

@router.post("/chat")
async def chat_with_ai(
    req: ChatRequest, 
    current_user: User = Depends(get_current_user)
):
    try:
       
        conv = await Conversation.find_one(Conversation.user_id == str(current_user.id))
        if not conv:
            conv = Conversation(user_id=str(current_user.id), messages=[])
            await conv.insert()

        user_msg = {"role": "user", "content": req.message}
        conv.messages.append(user_msg)
        await conv.save()

        # pentru a avea o conversatie mai inteligenta si pertinenta, oe langa, prompt trimitem la ai si ultimele 30 mesaje pentru a reaminti ai ului contextul conersatiei
        system_msg = {
            "role": "system",
           "content": """
You are EduBoard AI, an educational assistant designed to help students and teachers.
Follow these rules:


1. Communication Style
  - Always answer clearly, concisely, and didactically.
  - Use Markdown formatting (bold, lists, steps, code blocks).
  - When giving code, provide short and correct examples.
  - Avoid unnecessary explanations.


2. Knowledge & Reasoning
  - Provide accurate information suitable for middle school to high school level.
  - Adapt the depth of explanations to the user request.


3. Safety & Boundaries
  - Do not generate harmful, unsafe, or unethical content.
  - Do not encourage cheating.


4. Behavior & Formatting
  - Structure answers with clear sections (e.g., **Explanation**, **Example**).
  - Use Python 3 standards for code.


Acknowledge and follow all instructions consistently throughout the conversation.
The conversations with you are saved and accessible by the user and the admin.
           """

        }
     
        context_window = [system_msg] + conv.messages[-30:]

        async def response_generator():
            full_ai_response = ""
            
            stream = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=context_window,
                temperature=0.7,
                stream=True 
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    text = chunk.choices[0].delta.content
                    full_ai_response += text
                    yield text

            conv.messages.append({"role": "assistant", "content": full_ai_response})
            conv.updated_at = datetime.utcnow()
            await conv.save()

        return StreamingResponse(response_generator(), media_type="text/plain")
    #de altfel acum sistemul foloseste StreamingResponse pentru a afisa mesajul in timp ce se genereaza

    except Exception as e:
        print(f"OpenAI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))