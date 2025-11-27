"""
SEMILLERO PRO - Modelos de Base de Datos
Incluye: UserConsent, Wallet, Transaction, PlayerToken, User
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()


class User(Base):
    """Modelo de Usuario"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    preferred_currency = Column(String(3), default='USD')  # USD, ARS, BRL, MXN, EUR
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    consent = relationship("UserConsent", back_populates="user", uselist=False)
    wallet = relationship("Wallet", back_populates="user", uselist=False)
    transactions = relationship("Transaction", back_populates="user")
    owned_tokens = relationship("TokenOwnership", back_populates="user")


class UserConsent(Base):
    """
    Modelo de Consentimiento Legal - COMPLIANCE FIFA
    Bloquea el acceso hasta que el usuario acepte explícitamente
    """
    __tablename__ = "user_consents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Compliance FIFA
    fifa_tpo_disclaimer_accepted = Column(Boolean, default=False, nullable=False)
    fifa_disclaimer_text = Column(Text, nullable=False)  # Guardar el texto exacto aceptado
    
    # Términos generales
    terms_and_conditions_accepted = Column(Boolean, default=False, nullable=False)
    privacy_policy_accepted = Column(Boolean, default=False, nullable=False)
    
    # Metadatos
    ip_address = Column(String(45))  # IPv4 o IPv6
    user_agent = Column(String(255))
    accepted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relación
    user = relationship("User", back_populates="consent")
    
    def is_fully_compliant(self) -> bool:
        """Verifica si el usuario cumple con todos los requisitos legales"""
        return (
            self.fifa_tpo_disclaimer_accepted and
            self.terms_and_conditions_accepted and
            self.privacy_policy_accepted
        )


class Wallet(Base):
    """
    Modelo de Billetera Multi-Divisa
    IMPORTANTE: La base de datos SIEMPRE almacena en USD para estandarizar.
    La conversión a la moneda preferida del usuario se hace en el frontend.
    """
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Balance SIEMPRE en USD (moneda base)
    balance_usd = Column(Float, default=0.0, nullable=False)
    
    # Metadatos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_transaction_at = Column(DateTime(timezone=True))
    
    # Relaciones
    user = relationship("User", back_populates="wallet")
    transactions = relationship("Transaction", back_populates="wallet")
    
    def get_balance_in_currency(self, currency: str, exchange_rates: dict) -> float:
        """Convierte el balance USD a la moneda solicitada"""
        from app.config import settings
        
        if currency not in settings.SUPPORTED_CURRENCIES:
            raise ValueError(f"Moneda no soportada: {currency}")
        
        return self.balance_usd * exchange_rates.get(currency, 1.0)


class TransactionType(str, enum.Enum):
    """Tipos de transacción"""
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TOKEN_PURCHASE = "token_purchase"
    TOKEN_SALE = "token_sale"
    DIVIDEND = "dividend"  # Futura funcionalidad


class Transaction(Base):
    """
    Modelo de Transacción - Fintech Logic
    Registra TODAS las operaciones financieras con trazabilidad completa
    """
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False)
    
    # Tipo de transacción
    transaction_type = Column(Enum(TransactionType), nullable=False)
    
    # Moneda utilizada por el usuario (puede diferir de USD)
    currency_used = Column(String(3), nullable=False)  # ARS, BRL, USD, etc.
    original_amount = Column(Float, nullable=False)  # Monto en la moneda original
    
    # Conversión a USD (tasa al momento de la transacción)
    exchange_rate = Column(Float, nullable=False)  # Tasa de conversión aplicada
    final_amount_usd = Column(Float, nullable=False)  # Monto convertido a USD
    
    # Metadatos
    description = Column(String(255))
    status = Column(String(50), default='completed')  # completed, pending, failed
    payment_gateway = Column(String(100))  # Mercado Pago, Stripe, etc.
    payment_gateway_id = Column(String(255))  # ID de la transacción en la pasarela
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="transactions")
    wallet = relationship("Wallet", back_populates="transactions")
    
    @property
    def conversion_summary(self) -> str:
        """Resumen de la conversión para logging"""
        return f"{self.original_amount} {self.currency_used} @ {self.exchange_rate} = {self.final_amount_usd} USD"


class Player(Base):
    """Modelo de Jugador - Datos scrapeados"""
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Datos básicos
    name = Column(String(255), nullable=False)
    birth_date = Column(DateTime)
    nationality = Column(String(100))
    position = Column(String(50))  # Delantero, Mediocampista, Defensor, Arquero
    
    # Datos de mercado
    market_value_usd = Column(Float)  # Valor de mercado según Transfermarkt
    current_club = Column(String(255))
    
    # Estadísticas de rendimiento (última temporada)
    goals = Column(Integer, default=0)
    assists = Column(Integer, default=0)
    minutes_played = Column(Integer, default=0)
    matches_played = Column(Integer, default=0)
    
    # Scraping info
    transfermarkt_url = Column(String(500))
    last_scraped_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    tokens = relationship("PlayerToken", back_populates="player")


class PlayerToken(Base):
    """
    Modelo de Token/NFT del Jugador
    Representa el activo digital coleccionable basado en rendimiento
    """
    __tablename__ = "player_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    
    # Configuración del token
    token_symbol = Column(String(10), unique=True, nullable=False)  # Ej: MESSI-01
    total_supply = Column(Integer, nullable=False)  # Cantidad total de tokens emitidos
    available_supply = Column(Integer, nullable=False)  # Tokens disponibles para compra
    
    # Valoración
    initial_price_usd = Column(Float, nullable=False)
    current_value_usd = Column(Float, nullable=False)
    
    # Metadatos del activo digital
    token_metadata = Column(Text)  # JSON con atributos adicionales
    image_url = Column(String(500))  # URL de la imagen/NFT card
    
    # Estado
    is_active = Column(Boolean, default=True)
    launched_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    player = relationship("Player", back_populates="tokens")
    ownerships = relationship("TokenOwnership", back_populates="token")
    
    @property
    def price_change_percentage(self) -> float:
        """Calcula el cambio porcentual desde el lanzamiento"""
        if self.initial_price_usd == 0:
            return 0.0
        return ((self.current_value_usd - self.initial_price_usd) / self.initial_price_usd) * 100


class TokenOwnership(Base):
    """
    Modelo de Propiedad de Tokens
    Registra cuántos tokens de cada jugador posee cada usuario
    """
    __tablename__ = "token_ownerships"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_id = Column(Integer, ForeignKey("player_tokens.id"), nullable=False)
    
    # Cantidad de tokens poseídos
    quantity = Column(Integer, nullable=False, default=0)
    
    # Precio promedio de adquisición
    average_purchase_price_usd = Column(Float, nullable=False)
    
    # Metadatos
    first_purchased_at = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="owned_tokens")
    token = relationship("PlayerToken", back_populates="ownerships")
    
    @property
    def current_value_usd(self) -> float:
        """Valor actual de los tokens poseídos"""
        return self.quantity * self.token.current_value_usd
    
    @property
    def profit_loss_usd(self) -> float:
        """Ganancia/pérdida en USD"""
        return (self.token.current_value_usd - self.average_purchase_price_usd) * self.quantity
    
    @property
    def profit_loss_percentage(self) -> float:
        """Ganancia/pérdida en porcentaje"""
        if self.average_purchase_price_usd == 0:
            return 0.0
        return ((self.token.current_value_usd - self.average_purchase_price_usd) / self.average_purchase_price_usd) * 100
