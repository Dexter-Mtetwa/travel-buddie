import os
from openai import AsyncOpenAI
from app.models.trip_request import TripExtraction
from app.services.interfaces import INLPService

from datetime import datetime

class OpenAINLPService(INLPService):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    async def extract(self, text: str) -> TripExtraction:
        current_date = datetime.now().strftime("%Y-%m-%d")
        try:
            response = await self.client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": f"You are a helpful travel assistant. Current date is {current_date}. Extract trip details from the user's message. If a field is missing, leave it as null. For dates, use YYYY-MM-DD format. For origin/destination, use IATA codes if possible, otherwise city names. For nationality, extract country name if the user mentions where they are from (e.g. 'I'm from Zimbabwe', 'as a US citizen'). If the destination is a country or broad region (e.g. Japan, Europe), set destination to null and ask for a specific city in `reply_message`. If fields are missing, generate a polite, conversational question asking for them in `reply_message`. If all fields are present, set `reply_message` to null."},
                    {"role": "user", "content": text}
                ],
                response_format=TripExtraction,
            )
            
            return response.choices[0].message.parsed
        except Exception as e:
            print(f"OpenAI NLP Error: {e}")
            # Fallback to empty extraction with error message
            return TripExtraction(
                reply_message="I'm having trouble processing your request right now. Please try again later."
            )
