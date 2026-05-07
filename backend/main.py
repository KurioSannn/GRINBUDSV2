from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}

@app.get("/api/data")
async def get_data():
    return {
        "status": "success",
        "data": {
            "items": ["Next.js", "React", "FastAPI", "Tailwind CSS", "Framer Motion"],
            "description": "This is a sample response from the FastAPI backend."
        }
    }
