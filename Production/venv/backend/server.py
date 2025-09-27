from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from APIs.routes import route
from core.config import setting

class chat:
    asked_questions = set()
    qa_history = set()

def include_route(app):
    app.include_router(route)

def app_startup():
    app = FastAPI(
        title=setting.PROJECT_NAME,
        version=setting.PROJECT_VERSION,
        description=setting.PROJECT_DESCRIPTION
    )
    include_route(app)
    return app

app = app_startup()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_credentials = True,
    allow_headers = ["*"]
)

