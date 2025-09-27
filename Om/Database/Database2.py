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
class FoodDBEngine:
    def __init__(self, uri, db_name="food_db", collection="food"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection]

    def save_food(self, food, calories, category, user):
        food_doc = {
            "food": food,
            "calories": calories,
            "category": category,
            "user": user,
            "timestamp": datetime.now(IST)
        }
        result = self.collection.insert_one(food_doc)
        return str(result.inserted_id)

    def get_food_history(self, user=None, limit=10):
        query = {"user": user} if user else {}
        items = self.collection.find(query).sort("timestamp", -1).limit(limit)
        return [
            {
                "food": f["food"],
                "calories": f["calories"],
                "category": f["category"],
                "user": f["user"],
                "timestamp": f["timestamp"].strftime("%Y-%m-%d %H:%M:%S %Z")
            }
            for f in items
        ]

    def clear_food_history(self, user=None):
        query = {"user": user} if user else {}
        result = self.collection.delete_many(query)
        return result.deleted_count


app2 = FastAPI()

app2.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)

engine = FoodDBEngine(uri)


class FoodRequest(BaseModel):
    food: str
    calories: int
    category: str
    user: str

class UserQuery(BaseModel):
    user: str
    limit: int = 10


@app2.post("/add_food")
async def add_food(item: FoodRequest):
    food_id = engine.save_food(item.food, item.calories, item.category, item.user)
    return {"status": "success", "id": food_id}


@app2.post("/food_history")
async def food_history(query: UserQuery):
    items = engine.get_food_history(user=query.user, limit=query.limit)
    return {"history": items}


@app2.delete("/clear_food")
async def clear_food(query: UserQuery):
    deleted = engine.clear_food_history(user=query.user)
    return {"status": "success", "deleted_count": deleted}
