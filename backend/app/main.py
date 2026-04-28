from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import admin, access, files

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://file-sharev2.vercel.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router, prefix="/admin")
app.include_router(access.router, prefix="/auth")
app.include_router(files.router, prefix="/files")

@app.get("/")
def root():
    return {"message": "FileShare API running"}