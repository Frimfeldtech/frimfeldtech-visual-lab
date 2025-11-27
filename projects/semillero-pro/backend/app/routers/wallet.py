"""
SEMILLERO PRO - Router Wallet (Billetera Multi-Divisa)
Endpoints para manejo de depósitos, retiros y consulta de saldo
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.schemas.schemas import (
    DepositRequest, 
    TransactionResponse, 
    WalletResponse
)
from app.models.models import Wallet, Transaction, User, TransactionType
from app.config import settings
from app.database import get_db
from app.routers.legal import get_current_user

router = APIRouter(prefix="/api/wallet", tags=["Wallet & Transactions"])


@router.get("/balance", response_model=WalletResponse)
async def get_wallet_balance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el balance de la billetera del usuario.
    
    - **balance_usd**: Siempre en USD (base de datos)
    - **balance_in_preferred_currency**: Convertido a la moneda preferida del usuario
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet:
        # Crear billetera si no existe
        wallet = Wallet(user_id=current_user.id, balance_usd=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    # Convertir a moneda preferida del usuario
    balance_converted = wallet.get_balance_in_currency(
        current_user.preferred_currency,
        settings.EXCHANGE_RATES
    )
    
    response = WalletResponse(
        id=wallet.id,
        user_id=wallet.user_id,
        balance_usd=wallet.balance_usd,
        balance_in_preferred_currency=balance_converted,
        preferred_currency=current_user.preferred_currency,
        created_at=wallet.created_at,
        last_transaction_at=wallet.last_transaction_at
    )
    
    return response


@router.post("/deposit", response_model=TransactionResponse, status_code=201)
async def deposit_funds(
    deposit_data: DepositRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    **SIMULACIÓN DE PASARELA DE PAGO**
    
    Recibe un depósito en cualquier moneda soportada y lo convierte a USD.
    
    **Lógica de Negocio:**
    1. Recibe monto en moneda original (ej: 100,000 ARS)
    2. Obtiene tasa de cambio del momento
    3. Convierte a USD (ej: 100,000 ARS / 1000 = 100 USD)
    4. Actualiza balance de la billetera
    5. Registra transacción con trazabilidad completa
    
    **En Producción:**
    - Integrar con Mercado Pago, Stripe, etc.
    - Usar API real de tasas de cambio (ej: exchangerate-api.com)
    - Implementar webhooks para confirmación de pago
    """
    
    # Validar moneda soportada
    if deposit_data.currency.value not in settings.SUPPORTED_CURRENCIES:
        raise HTTPException(
            status_code=400,
            detail=f"Moneda no soportada. Use: {', '.join(settings.SUPPORTED_CURRENCIES)}"
        )
    
    # Obtener tasa de cambio
    exchange_rate = settings.EXCHANGE_RATES.get(deposit_data.currency.value, 1.0)
    
    # Convertir a USD
    # Fórmula: amount_usd = original_amount / exchange_rate
    # Ejemplo: 100,000 ARS / 1000 = 100 USD
    final_amount_usd = deposit_data.amount / exchange_rate
    
    # Obtener o crear billetera
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = Wallet(user_id=current_user.id, balance_usd=0.0)
        db.add(wallet)
        db.flush()
    
    # Actualizar balance
    wallet.balance_usd += final_amount_usd
    wallet.last_transaction_at = datetime.utcnow()
    
    # Crear registro de transacción
    transaction = Transaction(
        user_id=current_user.id,
        wallet_id=wallet.id,
        transaction_type=TransactionType.DEPOSIT,
        currency_used=deposit_data.currency.value,
        original_amount=deposit_data.amount,
        exchange_rate=exchange_rate,
        final_amount_usd=final_amount_usd,
        description=f"Depósito de {deposit_data.amount} {deposit_data.currency.value}",
        status="completed",
        payment_gateway=deposit_data.payment_gateway,
        payment_gateway_id=deposit_data.payment_gateway_id or f"SIM-{datetime.utcnow().timestamp()}"
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return transaction


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transaction_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el historial de transacciones del usuario.
    """
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.created_at.desc()).limit(limit).all()
    
    return transactions


@router.get("/exchange-rates")
async def get_exchange_rates():
    """
    Obtiene las tasas de cambio actuales.
    
    **En Producción:** Conectar a API externa (exchangerate-api.com, currencyapi.com, etc.)
    """
    return {
        "base_currency": "USD",
        "rates": settings.EXCHANGE_RATES,
        "last_updated": datetime.utcnow().isoformat(),
        "note": "Tasas simuladas - En producción usar API externa"
    }


@router.post("/withdrawal")
async def withdraw_funds(
    amount_usd: float,
    currency: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    **RETIRO DE FONDOS (MVP Simplificado)**
    
    Permite al usuario retirar fondos de su billetera.
    """
    if amount_usd <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor a 0")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet or wallet.balance_usd < amount_usd:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")
    
    # Validar moneda
    if currency not in settings.SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=400, detail="Moneda no soportada")
    
    exchange_rate = settings.EXCHANGE_RATES.get(currency, 1.0)
    
    # Actualizar balance
    wallet.balance_usd -= amount_usd
    wallet.last_transaction_at = datetime.utcnow()
    
    # Crear transacción
    transaction = Transaction(
        user_id=current_user.id,
        wallet_id=wallet.id,
        transaction_type=TransactionType.WITHDRAWAL,
        currency_used=currency,
        original_amount=amount_usd * exchange_rate,
        exchange_rate=exchange_rate,
        final_amount_usd=-amount_usd,  # Negativo para retiros
        description=f"Retiro de {amount_usd} USD a {currency}",
        status="completed"
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return {
        "message": "Retiro procesado exitosamente",
        "transaction": transaction,
        "new_balance_usd": wallet.balance_usd
    }
