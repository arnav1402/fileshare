from fastapi import FastAPI
from app.routers import admin, access, files

app = FastAPI()

app.include_router(admin.router, prefix="/admin")
app.include_router(access.router, prefix="/auth")
app.include_router(files.router, prefix="/files")

@app.get("/")
def root():
    return {"message": "FileShare API running"}