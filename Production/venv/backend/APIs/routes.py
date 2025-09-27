from fastapi import APIRouter
from dotenv import load_dotenv
import google.generativeai as genai
from yt_dlp import YoutubeDL
import os

from APIs.db import save_chat,get_history,clear_history

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))



route = APIRouter(
    tags=["Study Endpoints"]
)


@route.get("/study/points")
async def study_pointer(topic:str):
    videos = []

    system_instruction = {
    "role": "system",
    "parts": [
            {"text": "You are a learning assistant for a student. Given a topic, provide a brief numbered list of key points in simple sentences. Do not use bold formatting. Do not answer any question that conatain keywords ['terrorism','voilence', 'terror organization'] and politely refuse to answer. User Topic: [topic]"}
        ]
    }

    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=system_instruction
    )

    user_message = {
        "role": "user",
        "parts": [
            {"text": topic}
        ]
    }

    if topic:
        ydl_opts = {
            'quiet': True,
            'extract_flat': True,
            'skip_download': True
        }
        with YoutubeDL(ydl_opts) as ydl:
            results = ydl.extract_info(f"ytsearch10: {topic}", download=False)
            for video in results['entries']:
                videos.append({
                    "title": video["title"],
                    "url": f"https://www.youtube.com/watch?v={video['id']}"
                })



    response = model.generate_content(
        contents=[user_message],
        generation_config=genai.types.GenerationConfig(temperature=0.5)
    )
    
    return {"response":response.text,
            "videos": videos
            }


@route.get("/study/ask")
async def chat_with_bot(query: str):
    system_instruction = {
    "role": "system",
    "parts": [
            {"text": "You are a helpful tutor. Answer user questions in very simple, short sentences. Avoid complex words. Do not use bold formatting. Response should feel like a Q/A."}
        ]
    }

    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=system_instruction
    )

    user_message = {
        "role": "user",
        "parts": [
            {"text": query}
        ]
    }

    response = model.generate_content(
        contents=[user_message],
        generation_config=genai.types.GenerationConfig(temperature=0.5)
    )
    
    save_chat(user = "Guest", message = query, res = response.text)
    return {
        "question": query,
        "answer": response.text
    }

@route.get("/study/mcq")
async def generate_MCQ(topic: str):
    system_instruction = {
    "role": "system",
    "parts": [
            {"text": "You are a quiz generator. Generate exactly 1 MCQ on the given topic. The format must be:\nQ: <question>\nA) <option1>\nB) <option2>\nC) <option3>\nD) <option4>\nAnswer: <correct option letter>"}
        ]
    }

    model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=system_instruction
    )

    user_message = {
        "role": "user",
        "parts": [
            {"content": f"Generate an MCQ on {topic}"}
        ]
    }

    response = model.generate_content(
        contents=[user_message],
        generation_config=genai.types.GenerationConfig(temperature=0.5)
    )
    
    lines = response.split("\n")
    question = lines[0].replace("Q:", "").strip()
    options = [line.strip() for line in lines[1:5]]
    answer = lines[-1].replace("Answer:", "").strip()
    
    if question not in asked_questions:
        asked_questions.add(question)
        return {
            "question": question,
            "options": options,
            "answer": answer
        }


