"""
SEMILLERO PRO - Main Application
FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import legal, wallet, players
from app.database import init_db
from app.config import settings

# Crear aplicación
app = FastAPI(
    title="SEMILLERO PRO API",
    description="Plataforma de Scouting de Fútbol LATAM con Tokens de Rendimiento",
    version="1.0.0-MVP"
)

# CORS (permitir frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(legal.router)
app.include_router(wallet.router)
app.include_router(players.router)


@app.on_event("startup")
async def startup_event():
    """Inicializar base de datos al iniciar"""
    init_db()
    print("✅ Base de datos inicializada")
    print(f"✅ Monedas soportadas: {', '.join(settings.SUPPORTED_CURRENCIES)}")


@app.get("/")
async def root():
    """Endpoint de bienvenida"""
    return {
        "message": "🌱 SEMILLERO PRO API",
        "version": "1.0.0-MVP",
        "docs": "/docs",
        "supported_currencies": settings.SUPPORTED_CURRENCIES,
        "fifa_compliance": "Activo ✅"
    }


@app.get("/health")
async def health_check():
    """Health check para monitoreo"""
    return {
        "status": "healthy",
        "service": "semillero-pro-backend"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
