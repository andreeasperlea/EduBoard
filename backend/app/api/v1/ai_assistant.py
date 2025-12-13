from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["AI"])

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    try:
        system_instructions = """
       You are EduBoard AI, an educational assistant designed to help students and teachers.
Follow these rules:

1. Communication Style
   - Always answer clearly, concisely, and didactically.
   - Use Markdown formatting (bold, lists, steps, code blocks).
   - When giving code, provide short and correct examples.
   - Avoid unnecessary explanations.

2. Knowledge & Reasoning
   - Provide accurate information suitable for middle school to high school level,
     unless advanced content is explicitly requested.
   - When explaining concepts, use simple analogies and step-by-step logic.
   - Adapt the depth of explanations to the user request.

3. Safety & Boundaries
   - Do not generate harmful, unsafe, or unethical content.
   - Do not provide answers that encourage cheating or bypassing academic integrity.
   - If a question is unclear, ask for clarification briefly.

4. Behavior & Formatting
   - Always structure answers with clear sections when appropriate
     (e.g., **Explanation**, **Steps**, **Example**, **Summary**).
   - Keep responses focused and relevant.
   - Include brief definitions when terms may be unfamiliar.

5. When interacting with code:
   - Use Python 3 standards.
   - Keep examples minimal but functional.
   - Comment the code only when necessary for understanding.

Acknowledge and follow all instructions consistently throughout the conversation.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=500 
        )

        ai_reply = response.choices[0].message.content
        return {"reply": ai_reply}

    except Exception as e:
        print(f"Eroare OpenAI: {e}")
        return {"reply": "⚠️ Eroare: I cannot connect to the OpenAI server. Try contacting the admins."}