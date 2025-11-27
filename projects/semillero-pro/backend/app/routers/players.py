"""
SEMILLERO PRO - Router Players & Tokens
Endpoints para scrapear jugadores y gestionar tokens
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.schemas.schemas import (
    PlayerCreate,
    PlayerResponse,
    TokenCreate,
    TokenResponse,
    TokenPurchaseRequest,
    PortfolioResponse
)
from app.models.models import (
    Player, 
    PlayerToken, 
    User, 
    Wallet, 
    Transaction,
    TokenOwnership,
    TransactionType
)
from app.services.scraper import TransfermarktScraper, scrape_and_save_player
from app.database import get_db
from app.routers.legal import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/players", tags=["Players & Tokens"])


@router.post("/scrape", response_model=PlayerResponse, status_code=201)
async def scrape_player(
    player_data: PlayerCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    **SCRAPEA UN JUGADOR DESDE TRANSFERMARKT**
    
    Extrae datos del perfil del jugador y los almacena en la base de datos.
    El scraping se hace de forma robusta con User-Agent rotation.
    """
    # Validar URL
    if "transfermarkt" not in player_data.transfermarkt_url:
        raise HTTPException(
            status_code=400,
            detail="URL inválida. Debe ser de Transfermarkt"
        )
    
    # Verificar si ya existe
    existing_player = db.query(Player).filter(
        Player.transfermarkt_url == player_data.transfermarkt_url
    ).first()
    
    if existing_player:
        # Actualizar datos en background
        background_tasks.add_task(scrape_and_save_player, db, player_data.transfermarkt_url)
        return existing_player
    
    # Scrapear y guardar
    player = scrape_and_save_player(db, player_data.transfermarkt_url)
    
    if not player:
        raise HTTPException(
            status_code=500,
            detail="Error al scrapear el jugador. Verifica la URL o intenta más tarde."
        )
    
    return player


@router.get("/search")
async def search_players(query: str):
    """
    Busca jugadores por nombre en Transfermarkt.
    Útil para que los usuarios encuentren URLs de jugadores.
    """
    if len(query) < 3:
        raise HTTPException(
            status_code=400,
            detail="La búsqueda debe tener al menos 3 caracteres"
        )
    
    scraper = TransfermarktScraper()
    results = scraper.search_player(query)
    
    return {
        "query": query,
        "results": results,
        "count": len(results)
    }


@router.get("/", response_model=List[PlayerResponse])
async def get_all_players(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Obtiene todos los jugadores scrapeados"""
    players = db.query(Player).offset(skip).limit(limit).all()
    return players


@router.get("/{player_id}", response_model=PlayerResponse)
async def get_player(player_id: int, db: Session = Depends(get_db)):
    """Obtiene un jugador específico"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return player


# ===== TOKENS (NFTs) =====
@router.post("/tokens", response_model=TokenResponse, status_code=201)
async def create_player_token(
    token_data: TokenCreate,
    db: Session = Depends(get_db)
):
    """
    **CREA UN TOKEN/NFT DE UN JUGADOR**
    
    Permite tokenizar a un jugador para que los usuarios puedan invertir.
    """
    # Validar que el jugador existe
    player = db.query(Player).filter(Player.id == token_data.player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    
    # Validar que el símbolo sea único
    existing_token = db.query(PlayerToken).filter(
        PlayerToken.token_symbol == token_data.token_symbol
    ).first()
    if existing_token:
        raise HTTPException(
            status_code=400,
            detail=f"El símbolo {token_data.token_symbol} ya existe"
        )
    
    # Crear token
    new_token = PlayerToken(
        player_id=token_data.player_id,
        token_symbol=token_data.token_symbol,
        total_supply=token_data.total_supply,
        available_supply=token_data.total_supply,  # Inicialmente todos disponibles
        initial_price_usd=token_data.initial_price_usd,
        current_value_usd=token_data.initial_price_usd,  # Mismo precio al inicio
        image_url=token_data.image_url,
        token_metadata=token_data.token_metadata
    )
    
    db.add(new_token)
    db.commit()
    db.refresh(new_token)
    
    # Cargar relación con jugador
    new_token.player = player
    
    return new_token


@router.get("/tokens/", response_model=List[TokenResponse])
async def get_all_tokens(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Obtiene todos los tokens disponibles"""
    tokens = db.query(PlayerToken).filter(
        PlayerToken.is_active == True
    ).offset(skip).limit(limit).all()
    
    return tokens


@router.post("/tokens/purchase", response_model=dict)
async def purchase_tokens(
    purchase_data: TokenPurchaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    **COMPRA TOKENS DE UN JUGADOR**
    
    Lógica:
    1. Verifica que hay tokens disponibles
    2. Calcula el costo total en USD
    3. Verifica que el usuario tenga saldo suficiente
    4. Deduce el saldo de la billetera
    5. Registra la propiedad de tokens
    6. Crea transacción
    """
    # Obtener token
    token = db.query(PlayerToken).filter(PlayerToken.id == purchase_data.token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token no encontrado")
    
    if not token.is_active:
        raise HTTPException(status_code=400, detail="Token no disponible")
    
    # Verificar disponibilidad
    if token.available_supply < purchase_data.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Solo hay {token.available_supply} tokens disponibles"
        )
    
    # Calcular costo
    total_cost_usd = token.current_value_usd * purchase_data.quantity
    
    # Obtener billetera
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet or wallet.balance_usd < total_cost_usd:
        raise HTTPException(
            status_code=400,
            detail=f"Saldo insuficiente. Necesitas {total_cost_usd} USD"
        )
    
    # Deducir saldo
    wallet.balance_usd -= total_cost_usd
    wallet.last_transaction_at = datetime.utcnow()
    
    # Actualizar disponibilidad del token
    token.available_supply -= purchase_data.quantity
    
    # Registrar propiedad
    ownership = db.query(TokenOwnership).filter(
        TokenOwnership.user_id == current_user.id,
        TokenOwnership.token_id == token.id
    ).first()
    
    if ownership:
        # Actualizar propiedad existente (calcular precio promedio)
        total_tokens = ownership.quantity + purchase_data.quantity
        total_value = (ownership.average_purchase_price_usd * ownership.quantity) + \
                     (token.current_value_usd * purchase_data.quantity)
        ownership.average_purchase_price_usd = total_value / total_tokens
        ownership.quantity = total_tokens
    else:
        # Crear nueva propiedad
        ownership = TokenOwnership(
            user_id=current_user.id,
            token_id=token.id,
            quantity=purchase_data.quantity,
            average_purchase_price_usd=token.current_value_usd
        )
        db.add(ownership)
    
    # Crear transacción
    transaction = Transaction(
        user_id=current_user.id,
        wallet_id=wallet.id,
        transaction_type=TransactionType.TOKEN_PURCHASE,
        currency_used="USD",
        original_amount=total_cost_usd,
        exchange_rate=1.0,
        final_amount_usd=-total_cost_usd,  # Negativo porque es gasto
        description=f"Compra de {purchase_data.quantity} tokens {token.token_symbol}",
        status="completed"
    )
    
    db.add(transaction)
    db.commit()
    
    return {
        "message": "Compra exitosa",
        "tokens_purchased": purchase_data.quantity,
        "total_cost_usd": total_cost_usd,
        "new_balance_usd": wallet.balance_usd,
        "token_symbol": token.token_symbol
    }


@router.get("/portfolio/me", response_model=dict)
async def get_my_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    **OBTIENE EL PORTFOLIO DEL USUARIO**
    
    Muestra todos los tokens que posee con métricas de rendimiento.
    """
    ownerships = db.query(TokenOwnership).filter(
        TokenOwnership.user_id == current_user.id
    ).all()
    
    if not ownerships:
        return {
            "user_id": current_user.id,
            "total_invested_usd": 0,
            "current_value_usd": 0,
            "total_profit_loss_usd": 0,
            "total_profit_loss_percentage": 0,
            "tokens_owned": []
        }
    
    # Calcular métricas
    total_invested = sum(own.average_purchase_price_usd * own.quantity for own in ownerships)
    current_value = sum(own.current_value_usd for own in ownerships)
    profit_loss = current_value - total_invested
    profit_loss_pct = (profit_loss / total_invested * 100) if total_invested > 0 else 0
    
    tokens_data = []
    for own in ownerships:
        tokens_data.append({
            "token_id": own.token_id,
            "token_symbol": own.token.token_symbol,
            "player_name": own.token.player.name,
            "quantity": own.quantity,
            "average_purchase_price_usd": own.average_purchase_price_usd,
            "current_price_usd": own.token.current_value_usd,
            "current_value_usd": own.current_value_usd,
            "profit_loss_usd": own.profit_loss_usd,
            "profit_loss_percentage": own.profit_loss_percentage
        })
    
    return {
        "user_id": current_user.id,
        "total_invested_usd": total_invested,
        "current_value_usd": current_value,
        "total_profit_loss_usd": profit_loss,
        "total_profit_loss_percentage": profit_loss_pct,
        "tokens_owned": tokens_data
    }
