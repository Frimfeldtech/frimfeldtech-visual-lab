/**
 * SEMILLERO PRO - Player Card Component
 * 
 * Tarjeta de jugador estilo NFT con estadísticas y opción de compra de tokens
 */

'use client';

import React, { useState } from 'react';
import './PlayerCard.css';

interface PlayerCardProps {
    player: {
        id: number;
        name: string;
        position: string;
        nationality: string;
        current_club: string;
        market_value_usd: number;
        goals: number;
        assists: number;
        minutes_played: number;
        matches_played: number;
    };
    token?: {
        id: number;
        token_symbol: string;
        current_value_usd: number;
        initial_price_usd: number;
        available_supply: number;
        total_supply: number;
        price_change_percentage: number;
        image_url?: string;
    };
    onPurchase?: (tokenId: number, quantity: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, token, onPurchase }) => {
    const [quantity, setQuantity] = useState(1);
    const [isFlipped, setIsFlipped] = useState(false);

    const priceChange = token?.price_change_percentage || 0;
    const isPriceUp = priceChange > 0;
    const supplyPercent = token ? (token.available_supply / token.total_supply) * 100 : 0;

    const handlePurchase = () => {
        if (token && onPurchase) {
            onPurchase(token.id, quantity);
        }
    };

    const getPositionEmoji = (position: string) => {
        if (position.toLowerCase().includes('delant') || position.toLowerCase().includes('attack')) return '⚡';
        if (position.toLowerCase().includes('medio') || position.toLowerCase().includes('mid')) return '🎯';
        if (position.toLowerCase().includes('defens') || position.toLowerCase().includes('defense')) return '🛡️';
        if (position.toLowerCase().includes('arque') || position.toLowerCase().includes('goal')) return '🧤';
        return '⚽';
    };

    return (
        <div
            className={`player-card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className="player-card-inner">
                <div className="player-card-front">
                    <div className="card-header">
                        <div className="position-badge">
                            <span className="position-emoji">{getPositionEmoji(player.position)}</span>
                            <span className="position-text">{player.position}</span>
                        </div>
                        <div className="nationality-flag">
                            {player.nationality}
                        </div>
                    </div>

                    <div className="player-image-container">
                        {token?.image_url ? (
                            <img src={token.image_url} alt={player.name} className="player-image" />
                        ) : (
                            <div className="player-image-placeholder">
                                <div className="player-initial">
                                    {player.name.charAt(0)}
                                </div>
                            </div>
                        )}
                        <div className="holographic-overlay"></div>
                    </div>

                    <div className="player-name-section">
                        <h3 className="player-name">{player.name}</h3>
                        <p className="player-club">{player.current_club}</p>
                    </div>

                    <div className="quick-stats">
                        <div className="stat-item">
                            <span className="stat-icon">⚽</span>
                            <span className="stat-value">{player.goals}</span>
                            <span className="stat-label">Goles</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-icon">🎯</span>
                            <span className="stat-value">{player.assists}</span>
                            <span className="stat-label">Asist.</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-icon">⏱️</span>
                            <span className="stat-value">{Math.floor(player.minutes_played / 90)}</span>
                            <span className="stat-label">Partidos</span>
                        </div>
                    </div>

                    {token && (
                        <div className="token-info">
                            <div className="token-header">
                                <span className="token-symbol">{token.token_symbol}</span>
                                <span className={`price-change ${isPriceUp ? 'up' : 'down'}`}>
                                    {isPriceUp ? '↗' : '↘'} {Math.abs(priceChange).toFixed(2)}%
                                </span>
                            </div>
                            <div className="token-price">
                                <span className="price-label">Precio actual</span>
                                <span className="price-value">${token.current_value_usd.toFixed(2)} USD</span>
                            </div>
                            <div className="token-supply">
                                <div className="supply-bar">
                                    <div
                                        className="supply-fill"
                                        data-supply-percent={supplyPercent}
                                    ></div>
                                </div>
                                <span className="supply-text">
                                    {token.available_supply} / {token.total_supply} disponibles
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="card-footer">
                        <p className="flip-hint">👆 Click para ver detalles</p>
                    </div>
                </div>

                <div className="player-card-back">
                    <div className="back-header">
                        <h4>Estadísticas Completas</h4>
                    </div>

                    <div className="detailed-stats">
                        <div className="stat-row">
                            <span className="stat-label-full">Valor de Mercado</span>
                            <span className="stat-value-full">${(player.market_value_usd / 1_000_000).toFixed(2)}M</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label-full">Goles por Partido</span>
                            <span className="stat-value-full">
                                {player.matches_played > 0 ? (player.goals / player.matches_played).toFixed(2) : '0.00'}
                            </span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label-full">Asistencias</span>
                            <span className="stat-value-full">{player.assists}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label-full">Minutos Totales</span>
                            <span className="stat-value-full">{player.minutes_played.toLocaleString()}'</span>
                        </div>
                    </div>

                    {token && onPurchase && (
                        <div className="purchase-section">
                            <h4>Comprar Tokens</h4>
                            <div className="quantity-selector">
                                <button
                                    className="qty-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setQuantity(Math.max(1, quantity - 1));
                                    }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    onClick={(e) => e.stopPropagation()}
                                    min="1"
                                    max={token.available_supply}
                                    aria-label="Cantidad de tokens a comprar"
                                />
                                <button
                                    className="qty-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setQuantity(Math.min(token.available_supply, quantity + 1));
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            <div className="total-price">
                                <span>Total:</span>
                                <span className="total-amount">
                                    ${(token.current_value_usd * quantity).toFixed(2)} USD
                                </span>
                            </div>

                            <button
                                className="btn-purchase"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePurchase();
                                }}
                                disabled={quantity < 1 || quantity > token.available_supply}
                            >
                                💎 Comprar Tokens
                            </button>
                        </div>
                    )}

                    <div className="card-footer">
                        <p className="flip-hint">👆 Click para volver</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
