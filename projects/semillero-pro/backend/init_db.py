"""
SEMILLERO PRO - Script de Inicialización de Base de Datos
Crea un usuario de prueba y algunos datos de ejemplo
"""

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.database import SessionLocal, engine
from app.models.models import Base, User, Wallet, Player, PlayerToken, UserConsent
from app.config import settings


def init_database():
    """Crea todas las tablas"""
    print("🗄️  Creando tablas...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente")


def create_test_user(db: Session):
    """Crea un usuario de prueba"""
    # Verificar si ya existe
    existing_user = db.query(User).filter(User.email == "test@semilleropro.com").first()
    if existing_user:
        print("⚠️  Usuario de prueba ya existe")
        return existing_user
    
    # Crear usuario
    test_user = User(
        email="test@semilleropro.com",
        username="testuser",
        hashed_password="hashed_password_here",  # En producción usar bcrypt
        preferred_currency="USD",
        is_active=True,
        is_verified=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    # Crear billetera
    wallet = Wallet(
        user_id=test_user.id,
        balance_usd=1000.0  # $1000 USD de prueba
    )
    db.add(wallet)
    
    # Crear consentimiento legal (pre-aceptado para testing)
    consent = UserConsent(
        user_id=test_user.id,
        fifa_tpo_disclaimer_accepted=True,
        terms_and_conditions_accepted=True,
        privacy_policy_accepted=True,
        fifa_disclaimer_text=settings.FIFA_COMPLIANCE_TEXT,
        ip_address="127.0.0.1",
        user_agent="Test Script"
    )
    db.add(consent)
    
    db.commit()
    
    print(f"✅ Usuario de prueba creado: {test_user.email} (ID: {test_user.id})")
    print(f"   Billetera: ${wallet.balance_usd} USD")
    return test_user


def create_sample_players(db: Session):
    """Crea jugadores de ejemplo"""
    sample_players = [
        {
            "name": "Julián Álvarez",
            "nationality": "Argentina",
            "position": "Delantero",
            "current_club": "Manchester City",
            "market_value_usd": 90_000_000,
            "goals": 23,
            "assists": 15,
            "minutes_played": 2850,
            "matches_played": 38,
            "transfermarkt_url": "https://www.transfermarkt.com/julian-alvarez/profil/spieler/609890"
        },
        {
            "name": "Enzo Fernández",
            "nationality": "Argentina",
            "position": "Mediocampista",
            "current_club": "Chelsea FC",
            "market_value_usd": 75_000_000,
            "goals": 5,
            "assists": 12,
            "minutes_played": 2650,
            "matches_played": 32,
            "transfermarkt_url": "https://www.transfermarkt.com/enzo-fernandez/profil/spieler/683840"
        },
        {
            "name": "Endrick",
            "nationality": "Brasil",
            "position": "Delantero",
            "current_club": "Palmeiras",
            "market_value_usd": 60_000_000,
            "goals": 18,
            "assists": 8,
            "minutes_played": 1980,
            "matches_played": 25,
            "transfermarkt_url": "https://www.transfermarkt.com/endrick/profil/spieler/846815"
        }
    ]
    
    created_players = []
    for player_data in sample_players:
        # Verificar si existe
        existing = db.query(Player).filter(Player.name == player_data["name"]).first()
        if existing:
            print(f"⚠️  {player_data['name']} ya existe")
            created_players.append(existing)
            continue
        
        player = Player(**player_data)
        db.add(player)
        db.commit()
        db.refresh(player)
        created_players.append(player)
        print(f"✅ Jugador creado: {player.name}")
    
    return created_players


def create_sample_tokens(db: Session, players: list):
    """Crea tokens de ejemplo para los jugadores"""
    for player in players:
        # Verificar si ya tiene token
        existing_token = db.query(PlayerToken).filter(
            PlayerToken.player_id == player.id
        ).first()
        
        if existing_token:
            print(f"⚠️  Token para {player.name} ya existe")
            continue
        
        # Generar símbolo único
        symbol = player.name.split()[0].upper()[:4] + "-01"
        
        # Precio basado en valor de mercado
        initial_price = round(player.market_value_usd / 100000, 2)  # ~0.01% del valor
        
        token = PlayerToken(
            player_id=player.id,
            token_symbol=symbol,
            total_supply=10000,
            available_supply=10000,
            initial_price_usd=initial_price,
            current_value_usd=initial_price * random.uniform(0.95, 1.15),  # Variación ±5-15%
            image_url=None,  # TODO: Generar con generate_image
            token_metadata='{"rarity": "common", "season": "2024-2025"}',
            is_active=True
        )
        
        db.add(token)
        db.commit()
        db.refresh(token)
        
        print(f"✅ Token creado: {token.token_symbol} - ${token.current_value_usd} USD")
        print(f"   Supply: {token.available_supply}/{token.total_supply}")


def main():
    """Función principal"""
    print("\n🌱 SEMILLERO PRO - Inicialización de Base de Datos\n")
    
    # Crear tablas
    init_database()
    
    # Crear sesión
    db = SessionLocal()
    
    try:
        # Crear usuario de prueba
        test_user = create_test_user(db)
        
        # Crear jugadores de ejemplo
        players = create_sample_players(db)
        
        # Crear tokens
        create_sample_tokens(db, players)
        
        print("\n✅ Base de datos inicializada con datos de prueba")
        print("\n📝 Credenciales de prueba:")
        print("   Email: test@semilleropro.com")
        print("   Password: (implementar autenticación)")
        print("\n🚀 Inicia el servidor con: python -m app.main")
        
    except Exception as e:
        print(f"\n❌ Error durante la inicialización: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
