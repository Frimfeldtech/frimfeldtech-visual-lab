"""
SEMILLERO PRO - Configuración Global
Monedas soportadas y tasas de cambio
"""

from typing import Dict, List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Monedas soportadas en la plataforma
    SUPPORTED_CURRENCIES: List[str] = ['USD', 'ARS', 'BRL', 'MXN', 'EUR']
    
    # Tasas de cambio fijas (en producción esto vendría de una API externa)
    EXCHANGE_RATES: Dict[str, float] = {
        'USD': 1.0,          # Base currency
        'ARS': 1000.0,       # 1 USD = 1000 ARS
        'BRL': 5.0,          # 1 USD = 5 BRL
        'MXN': 17.0,         # 1 USD = 17 MXN
        'EUR': 0.92,         # 1 USD = 0.92 EUR
    }
    
    # Base de datos
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/semillero_pro"
    
    # Configuración de scraping
    USER_AGENTS: List[str] = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    ]
    
    # Configuración de seguridad
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Compliance FIFA - Texto legal obligatorio
    FIFA_COMPLIANCE_TEXT: str = """
    El usuario reconoce que adquiere un Activo Digital coleccionable basado en estadísticas. 
    NO adquiere derechos económicos sobre el jugador (TPO - Third Party Ownership), 
    ni derechos federativos, cumpliendo con la normativa FIFA vigente.
    Este activo representa únicamente un derecho de colección y especulación 
    sobre el rendimiento estadístico del jugador.
    """
    
    class Config:
        env_file = ".env"


settings = Settings()
