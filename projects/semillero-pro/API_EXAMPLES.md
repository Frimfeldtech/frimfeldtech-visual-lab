# SEMILLERO PRO - Ejemplos de Uso de API

Este archivo contiene ejemplos de requests HTTP para testing de la API.

## 📋 PREREQUISITOS

1. Backend corriendo en `http://localhost:8000`
2. Base de datos inicializada (`python backend/init_db.py`)
3. Herramienta de testing: Postman, Insomnia, curl o cualquier cliente HTTP

---

## 🔒 1. LEGAL & COMPLIANCE

### Obtener descargo FIFA (Público)

```bash
curl -X GET "http://localhost:8000/api/legal/fifa-disclaimer"
```

**Response:**

```json
{
  "disclaimer": "El usuario reconoce que adquiere un Activo Digital...",
  "title": "Descargo de Responsabilidad - Cumplimiento FIFA",
  "summary": "Este activo NO representa derechos económicos sobre el jugador..."
}
```

### Verificar estado de compliance

```bash
curl -X GET "http://localhost:8000/api/legal/compliance-status"
```

### Aceptar términos legales

```bash
curl -X POST "http://localhost:8000/api/legal/accept-terms" \
  -H "Content-Type: application/json" \
  -d '{
    "fifa_tpo_disclaimer_accepted": true,
    "terms_and_conditions_accepted": true,
    "privacy_policy_accepted": true,
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  }'
```

---

## 💰 2. BILLETERA

### Consultar balance

```bash
curl -X GET "http://localhost:8000/api/wallet/balance"
```

**Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "balance_usd": 1000.0,
  "balance_in_preferred_currency": 1000000.0,
  "preferred_currency": "ARS",
  "created_at": "2025-01-15T10:00:00Z",
  "last_transaction_at": null
}
```

### Depositar fondos (ARS → USD)

```bash
curl -X POST "http://localhost:8000/api/wallet/deposit" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100000,
    "currency": "ARS",
    "payment_gateway": "mercadopago",
    "payment_gateway_id": "MP-123456789"
  }'
```

**Response:**

```json
{
  "id": 1,
  "transaction_type": "deposit",
  "currency_used": "ARS",
  "original_amount": 100000.0,
  "exchange_rate": 1000.0,
  "final_amount_usd": 100.0,
  "description": "Depósito de 100000.0 ARS",
  "status": "completed",
  "created_at": "2025-01-15T10:30:00Z",
  "conversion_summary": "100000.0 ARS @ 1000.0 = 100.0 USD"
}
```

### Consultar tasas de cambio

```bash
curl -X GET "http://localhost:8000/api/wallet/exchange-rates"
```

**Response:**

```json
{
  "base_currency": "USD",
  "rates": {
    "USD": 1.0,
    "ARS": 1000.0,
    "BRL": 5.0,
    "MXN": 17.0,
    "EUR": 0.92
  },
  "last_updated": "2025-01-15T10:30:00Z",
  "note": "Tasas simuladas - En producción usar API externa"
}
```

### Historial de transacciones

```bash
curl -X GET "http://localhost:8000/api/wallet/transactions?limit=10"
```

---

## ⚽ 3. JUGADORES

### Buscar jugador en Transfermarkt

```bash
curl -X GET "http://localhost:8000/api/players/search?query=Messi"
```

**Response:**

```json
{
  "query": "Messi",
  "results": [
    {
      "name": "Lionel Messi",
      "url": "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003"
    },
    {
      "name": "Thiago Messi",
      "url": "https://www.transfermarkt.com/thiago-messi/profil/spieler/..."
    }
  ],
  "count": 2
}
```

### Scrapear jugador desde Transfermarkt

```bash
curl -X POST "http://localhost:8000/api/players/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "transfermarkt_url": "https://www.transfermarkt.com/julian-alvarez/profil/spieler/609890"
  }'
```

**Response:**

```json
{
  "id": 1,
  "name": "Julián Álvarez",
  "birth_date": null,
  "nationality": "Argentina",
  "position": "Delantero",
  "market_value_usd": 90000000.0,
  "current_club": "Manchester City",
  "goals": 23,
  "assists": 15,
  "minutes_played": 2850,
  "matches_played": 38,
  "transfermarkt_url": "https://www.transfermarkt.com/julian-alvarez/profil/spieler/609890",
  "last_scraped_at": "2025-01-15T10:45:00Z"
}
```

### Listar todos los jugadores

```bash
curl -X GET "http://localhost:8000/api/players/?skip=0&limit=10"
```

### Obtener jugador específico

```bash
curl -X GET "http://localhost:8000/api/players/1"
```

---

## 💎 4. TOKENS (NFTs)

### Crear token de un jugador

```bash
curl -X POST "http://localhost:8000/api/players/tokens" \
  -H "Content-Type: application/json" \
  -d '{
    "player_id": 1,
    "token_symbol": "JULI-01",
    "total_supply": 10000,
    "initial_price_usd": 9.00,
    "image_url": "https://example.com/image.png",
    "token_metadata": "{\"rarity\": \"rare\", \"season\": \"2024-2025\"}"
  }'
```

**Response:**

```json
{
  "id": 1,
  "player_id": 1,
  "token_symbol": "JULI-01",
  "total_supply": 10000,
  "available_supply": 10000,
  "initial_price_usd": 9.0,
  "current_value_usd": 9.0,
  "price_change_percentage": 0.0,
  "image_url": "https://example.com/image.png",
  "is_active": true,
  "launched_at": "2025-01-15T11:00:00Z",
  "player": {
    "id": 1,
    "name": "Julián Álvarez",
    ...
  }
}
```

### Listar tokens disponibles

```bash
curl -X GET "http://localhost:8000/api/players/tokens/?skip=0&limit=10"
```

### Comprar tokens

```bash
curl -X POST "http://localhost:8000/api/players/tokens/purchase" \
  -H "Content-Type: application/json" \
  -d '{
    "token_id": 1,
    "quantity": 50
  }'
```

**Response:**

```json
{
  "message": "Compra exitosa",
  "tokens_purchased": 50,
  "total_cost_usd": 450.0,
  "new_balance_usd": 550.0,
  "token_symbol": "JULI-01"
}
```

### Ver portfolio personal

```bash
curl -X GET "http://localhost:8000/api/players/portfolio/me"
```

**Response:**

```json
{
  "user_id": 1,
  "total_invested_usd": 450.0,
  "current_value_usd": 475.0,
  "total_profit_loss_usd": 25.0,
  "total_profit_loss_percentage": 5.56,
  "tokens_owned": [
    {
      "token_id": 1,
      "token_symbol": "JULI-01",
      "player_name": "Julián Álvarez",
      "quantity": 50,
      "average_purchase_price_usd": 9.0,
      "current_price_usd": 9.5,
      "current_value_usd": 475.0,
      "profit_loss_usd": 25.0,
      "profit_loss_percentage": 5.56
    }
  ]
}
```

---

## 🧪 FLUJO COMPLETO DE TESTING

### 1. Usuario nuevo acepta términos

```bash
curl -X POST "http://localhost:8000/api/legal/accept-terms" \
  -H "Content-Type: application/json" \
  -d '{
    "fifa_tpo_disclaimer_accepted": true,
    "terms_and_conditions_accepted": true,
    "privacy_policy_accepted": true
  }'
```

### 2. Usuario deposita fondos (100,000 ARS = 100 USD)

```bash
curl -X POST "http://localhost:8000/api/wallet/deposit" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100000,
    "currency": "ARS"
  }'
```

### 3. Usuario busca jugador

```bash
curl -X GET "http://localhost:8000/api/players/search?query=Endrick"
```

### 4. Admin scrapea el jugador

```bash
curl -X POST "http://localhost:8000/api/players/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "transfermarkt_url": "<URL_OBTENIDA_EN_BUSQUEDA>"
  }'
```

### 5. Admin crea token del jugador

```bash
curl -X POST "http://localhost:8000/api/players/tokens" \
  -H "Content-Type: application/json" \
  -d '{
    "player_id": 3,
    "token_symbol": "ENDR-01",
    "total_supply": 10000,
    "initial_price_usd": 6.0
  }'
```

### 6. Usuario compra tokens

```bash
curl -X POST "http://localhost:8000/api/players/tokens/purchase" \
  -H "Content-Type: application/json" \
  -d '{
    "token_id": 3,
    "quantity": 10
  }'
```

### 7. Usuario verifica su portfolio

```bash
curl -X GET "http://localhost:8000/api/players/portfolio/me"
```

---

## 📊 TESTING AVANZADO

### Simular cambio de precio de token (Admin)

```python
# En consola Python con acceso a la DB
from app.database import SessionLocal
from app.models.models import PlayerToken

db = SessionLocal()
token = db.query(PlayerToken).filter(PlayerToken.id == 1).first()
token.current_value_usd = token.current_value_usd * 1.10  # +10%
db.commit()
```

### Testing de conversión multi-divisa

```bash
# Depositar en BRL
curl -X POST "http://localhost:8000/api/wallet/deposit" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "currency": "BRL"
  }'

# Equivale a: 500 BRL / 5 = 100 USD
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Autenticación**: En producción agregar header `Authorization: Bearer <JWT_TOKEN>`
2. **Rate Limiting**: Implementar límites de requests por minuto
3. **Validaciones**: La API valida automáticamente con Pydantic
4. **Errores**: Responses con status 400/404/500 incluyen `detail` explicativo
5. **CORS**: Frontend debe estar en `localhost:3000` o configurar en `main.py`

---

**Documentación interactiva:** `http://localhost:8000/docs`
