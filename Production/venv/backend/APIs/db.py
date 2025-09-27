from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from groq import Groq
import os


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)


password = os.getenv("MONGODB_PASS")
username = os.getenv("MONGODB_USERNAME")

uri = f"mongodb+srv://{username}:{password}@learningapp.ttccv4n.mongodb.net/"

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

def save_chat(**chat):
    chat_id = engine.save_messages(chat["user"], chat["message"], chat["res"])
    print(f"status: success, {chat_id}")
    
def get_history(**query):
    chats = engine.get_history(user=query["user"], limit=query["limit"])
    print(f"history: {chats}")


def clear_history(*query):
    deleted = engine.clear_history(user=query[0])
    print(f"status: success, deleted_count: {deleted}")