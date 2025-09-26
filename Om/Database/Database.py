from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
conn_pass = os.getenv("MongoDb_Pass")

uri = f"mongodb+srv://omanan8226:{conn_pass}@learningapp.ttccv4n.mongodb.net/"

class ChatDBEngine:
    def __init__(self, uri, db_name="chat_db", collection="messages"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection]
        
    def save_messages(self, user, message, response):
        chat_doc = {
            "user": user,
            "message": message,
            "response": response,
            "timestamp": datetime.now()
        }
        result = self.collection.insert_one(chat_doc)
        return str(result.inserted_id)
    
    def get_history(self, user=None, limit=10):
        query = {"user": user} if user else {}
        chats = self.collection.find(query).sort("timestamp", -1).limit(limit)
        return [
            {
                "user": c["user"],
                "message": c["message"],
                "response": c["response"],
                "timestamp": c["timestamp"]
            }
            for c in chats
        ]
    
    def clear_history(self, user=None):
        query = {"user": user} if user else {}
        result = self.collection.delete_many(query)
        return result.deleted_count


engine = ChatDBEngine(uri)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_credentials = True,
    allow_headers = ["*"]
)


class ChatRequest(BaseModel):
    user: str
    message: str
    response: str
    
class UserQuery(BaseModel):
    user: str
    limit: int = 10
    

@app.post("/save_db")
async def save_chat(chat: ChatRequest):
    chat_id = engine.save_messages(chat.user, chat.message, chat.response)
    return {"status": "success", "id": chat_id}
    
    
@app.post("/db_history")
async def get_history(query: UserQuery):
    chats = engine.get_history(user=query.user, limit=query.limit)
    return {"history": chats}


@app.delete("/clear_history")
async def clear_history(query: UserQuery):
    deleted = engine.clear_history(user=query.user)
    return {"status": "success", "deleted_count": deleted}
