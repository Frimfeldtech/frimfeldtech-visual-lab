"""
SEMILLERO PRO - Schemas Pydantic
Validación de datos para las APIs
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ===== LEGAL & COMPLIANCE =====
class LegalConsentRequest(BaseModel):
    """Request para aceptar términos legales"""
    fifa_tpo_disclaimer_accepted: bool = Field(..., description="Debe ser True")
    terms_and_conditions_accepted: bool = Field(..., description="Debe ser True")
    privacy_policy_accepted: bool = Field(..., description="Debe ser True")
    user_agent: Optional[str] = None
    
    @validator('fifa_tpo_disclaimer_accepted', 'terms_and_conditions_accepted', 'privacy_policy_accepted')
    def must_be_true(cls, v, field):
        if not v:
            raise ValueError(f'{field.name} debe ser aceptado (True)')
        return v


class LegalConsentResponse(BaseModel):
    """Response después de aceptar términos"""
    user_id: int
    fifa_tpo_disclaimer_accepted: bool
    terms_and_conditions_accepted: bool
    privacy_policy_accepted: bool
    accepted_at: datetime
    is_fully_compliant: bool
    
    class Config:
        from_attributes = True


# ===== WALLET & TRANSACTIONS =====
class CurrencyEnum(str, Enum):
    """Monedas soportadas"""
    USD = "USD"
    ARS = "ARS"
    BRL = "BRL"
    MXN = "MXN"
    EUR = "EUR"


class DepositRequest(BaseModel):
    """Request para depositar fondos"""
    amount: float = Field(..., gt=0, description="Monto a depositar (debe ser > 0)")
    currency: CurrencyEnum = Field(..., description="Moneda del depósito")
    payment_gateway: Optional[str] = Field("simulation", description="Pasarela de pago")
    payment_gateway_id: Optional[str] = None


class TransactionResponse(BaseModel):
    """Response de una transacción"""
    id: int
    transaction_type: str
    currency_used: str
    original_amount: float
    exchange_rate: float
    final_amount_usd: float
    description: Optional[str]
    status: str
    created_at: datetime
    conversion_summary: str
    
    class Config:
        from_attributes = True


class WalletResponse(BaseModel):
    """Response de la billetera"""
    id: int
    user_id: int
    balance_usd: float
    balance_in_preferred_currency: Optional[float] = None
    preferred_currency: Optional[str] = None
    created_at: datetime
    last_transaction_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# ===== PLAYERS & TOKENS =====
class PlayerCreate(BaseModel):
    """Schema para crear un jugador"""
    transfermarkt_url: str = Field(..., description="URL de Transfermarkt")


class PlayerResponse(BaseModel):
    """Response de un jugador"""
    id: int
    name: str
    birth_date: Optional[datetime]
    nationality: str
    position: str
    market_value_usd: float
    current_club: str
    goals: int
    assists: int
    minutes_played: int
    matches_played: int
    transfermarkt_url: str
    last_scraped_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class TokenCreate(BaseModel):
    """Schema para crear un token de jugador"""
    player_id: int
    token_symbol: str = Field(..., min_length=3, max_length=10)
    total_supply: int = Field(..., gt=0)
    initial_price_usd: float = Field(..., gt=0)
    image_url: Optional[str] = None
    token_metadata: Optional[str] = None


class TokenResponse(BaseModel):
    """Response de un token"""
    id: int
    player_id: int
    token_symbol: str
    total_supply: int
    available_supply: int
    initial_price_usd: float
    current_value_usd: float
    price_change_percentage: float
    image_url: Optional[str]
    is_active: bool
    launched_at: datetime
    
    # Datos del jugador asociado
    player: Optional[PlayerResponse] = None
    
    class Config:
        from_attributes = True


class TokenPurchaseRequest(BaseModel):
    """Request para comprar tokens"""
    token_id: int
    quantity: int = Field(..., gt=0, description="Cantidad de tokens a comprar")


class PortfolioResponse(BaseModel):
    """Response del portfolio del usuario"""
    user_id: int
    total_invested_usd: float
    current_value_usd: float
    total_profit_loss_usd: float
    total_profit_loss_percentage: float
    tokens_owned: List[dict]  # Lista de tokens con sus métricas
    
    class Config:
        from_attributes = True


# ===== USER =====
class UserCreate(BaseModel):
    """Schema para crear usuario"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8)
    preferred_currency: CurrencyEnum = CurrencyEnum.USD


class UserResponse(BaseModel):
    """Response de usuario"""
    id: int
    email: str
    username: str
    preferred_currency: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"
