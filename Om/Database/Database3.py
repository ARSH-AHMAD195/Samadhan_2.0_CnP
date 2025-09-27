from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import pytz

# Load environment variables
load_dotenv()
conn_username = os.getenv("MongoDB_UserName")
conn_pass = os.getenv("MongoDb_Pass")

uri = f"mongodb+srv://{conn_username}:{conn_pass}@learningapp222.ttccv4n.mongodb.net/"

# Timezone
IST = pytz.timezone("Asia/Kolkata")

# Database engine
class TopicDBEngine:
    def __init__(self, uri, db_name="topic_db", collection="chats"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection]

    def save_chat(self, user, message, response):
        chat_doc = {
            "user": user,
            "message": message,
            "response": response,
            "timestamp": datetime.now(IST)
        }
        result = self.collection.insert_one(chat_doc)
        return str(result.inserted_id)

    def get_chat_history(self, user, limit=5):
        query = {"user": user}
        chats = self.collection.find(query).sort("timestamp", -1).limit(limit)
        return [
            {
                "message": c["message"],
                "response": c["response"],
                "timestamp": c["timestamp"].strftime("%Y-%m-%d %H:%M:%S %Z")
            }
            for c in chats
        ]

    def clear_chats(self, user):
        query = {"user": user}
        result = self.collection.delete_many(query)
        return result.deleted_count


# FastAPI app
app3 = FastAPI()

app3.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)

engine = TopicDBEngine(uri)


# Request models
class ChatRequest(BaseModel):
    user: str
    message: str
    response: str

class UserQuery(BaseModel):
    user: str
    limit: int = 5


# Endpoints
@app3.post("/save_chat")
async def save_chat(chat: ChatRequest):
    chat_id = engine.save_chat(chat.user, chat.message, chat.response)
    return {"status": "success", "id": chat_id}


@app3.post("/get_history")
async def get_history(query: UserQuery):
    chats = engine.get_chat_history(query.user, limit=query.limit)
    return {"history": chats}


@app3.delete("/clear_chats")
async def clear_chats(query: UserQuery):
    deleted = engine.clear_chats(query.user)
    return {"status": "success", "deleted_count": deleted}
