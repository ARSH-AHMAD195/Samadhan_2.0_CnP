# Samadhan 2.0 UPLYFT

This project is an AI-powered Student support platform with helps the transition of student from high schools to college easier.

## 👥 Contributors:
👨‍💻 Arsh Ahmad - (Endpoints and FastAPI integration) <br>
👨‍💻 Ajay Mishra - (Frontend) <br>
👨‍💻 Om Anand - (Database integration) <br>


## 🛠️ Setup Instructions
### 🔧 Backend Setup
```
1. Create a virtual environment.
    python -m venv venv 
    # On Windows: .\venv\Scripts\activate
2. Create the given file structure.
3. Copy source code files according to the file structure.
4. Now install all the dependencies in terminal using
    pip install -r requirements.txt
```
### 📁 File Structure
```
Production
 ├── frontend
 │      ├── components
 │      │    ├── AskBot.jsx
 │      │    ├── McqGenerator.jsx
 │      │    ├── StudyPoints.jsx
 │      ├── App.jsx
 │      ├── index.css
 │      └── main.jsx 
 ├── APIs
 │      ├── db.py
 │      └── routes.py
 ├── core
 │      └── config.py
 ├── .env
 ├── README.md
 └── requirements.txt
```

### 🔐 Update .env with your keys: 
```
# Google Gemini API Key (required)
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"

MONGODB_USERNAME = "YOUR_MONGODB_USERNAME" 
MONGODB_PASS = "YOUR_MONGODB_PASS"

Note: Create this .env file and add your keys above mentioned.
```


### Requirements.txt: 
```
annotated-types==0.7.0
anyio==4.11.0
cachetools==5.5.2
certifi==2025.8.3
charset-normalizer==3.4.3
click==8.3.0
colorama==0.4.6
distro==1.9.0
dnspython==2.8.0
fastapi==0.117.1
google-ai-generativelanguage==0.6.15
google-api-core==2.25.1
google-api-python-client==2.183.0
google-auth==2.40.3
google-auth-httplib2==0.2.0
google-genai==1.39.1
google-generativeai==0.8.5
googleapis-common-protos==1.70.0
groq==0.31.1
grpcio==1.75.1
grpcio-status==1.71.2
h11==0.16.0
httpcore==1.0.9
httplib2==0.31.0
httpx==0.28.1
idna==3.10
proto-plus==1.26.1
protobuf==5.29.5
pyasn1==0.6.1
pyasn1_modules==0.4.2
pydantic==2.11.9
pydantic_core==2.33.2
pymongo==4.15.1
pyparsing==3.2.5
python-dotenv==1.1.1
requests==2.32.5
rsa==4.9.1
sniffio==1.3.1
starlette==0.48.0
tenacity==9.1.2
tqdm==4.67.1
typing-inspection==0.4.1
typing_extensions==4.15.0
uritemplate==4.2.0
urllib3==2.5.0
uvicorn==0.37.0
yt-dlp==2025.9.26
```
