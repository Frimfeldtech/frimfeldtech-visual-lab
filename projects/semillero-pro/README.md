# 🌱 SEMILLERO PRO - MVP

**Plataforma de Scouting de Fútbol LATAM con Tokens de Rendimiento**

Invierte en activos digitales (NFTs) basados en el rendimiento estadístico de jugadores promesa de fútbol latinoamericano.

---

## 🎯 VISIÓN DEL PROYECTO

SEMILLERO PRO revoluciona el scouting de fútbol permitiendo a usuarios invertir en "Tokens de Rendimiento" de jugadores promesa. **IMPORTANTE:** Cumplimos estrictamente con las normativas FIFA - los tokens representan activos digitales coleccionables, NO derechos económicos sobre jugadores (TPO prohibido).

### Características Principales

✅ **Compliance FIFA Total**: Sistema legal robusto que bloquea acceso hasta aceptar descargo TPO  
✅ **Billetera Multi-Divisa**: Soporta USD, ARS, BRL, MXN, EUR (base de datos en USD)  
✅ **Scraping Avanzado**: Extracción robusta de datos desde Transfermarkt con anti-bloqueo  
✅ **Tokens de Jugadores**: Sistema NFT/activo digital negociable basado en estadísticas  
✅ **Portfolio en Tiempo Real**: Tracking de inversiones con métricas de ganancia/pérdida  

---

## 🏗️ ARQUITECTURA

```
semillero-pro/
├── backend/                    # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── models/
│   │   │   └── models.py      # ⚠️ CRÍTICO: User, Wallet, Transaction, PlayerToken
│   │   ├── services/
│   │   │   └── scraper.py     # 🕷️ Scraping con User-Agent rotation
│   │   ├── routers/
│   │   │   ├── legal.py       # 🔒 Compliance FIFA
│   │   │   ├── wallet.py      # 💰 Multi-divisa + conversiones
│   │   │   └── players.py     # ⚽ CRUD jugadores + tokens
│   │   ├── schemas/
│   │   │   └── schemas.py     # Validación Pydantic
│   │   ├── config.py          # Configuración global
│   │   ├── database.py        # SQLAlchemy setup
│   │   └── main.py            # App principal
│   └── requirements.txt
│
├── frontend/                   # React + Next.js + TailwindCSS
│   └── src/
│       └── components/
│           ├── LegalModal.tsx     # ⚖️ Modal legal obligatorio
│           ├── LegalModal.css
│           ├── PlayerCard.tsx     # 🃏 Tarjeta NFT con flip
│           └── PlayerCard.css
│
└── DESIGN_PROMPTS.md          # 🎨 Prompts para generar assets
```

---

## 🚀 INSTALACIÓN Y SETUP

### Prerrequisitos

- Python 3.10+
- PostgreSQL 14+
- Node.js 18+
- npm/yarn

### 1️⃣ Backend (FastAPI)

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear base de datos
# Conectarse a PostgreSQL y ejecutar:
# CREATE DATABASE semillero_pro;

# Iniciar servidor
python -m app.main
# O con uvicorn:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**API disponible en:** `http://localhost:8000`  
**Documentación interactiva:** `http://localhost:8000/docs`

### 2️⃣ Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**App disponible en:** `http://localhost:3000`

---

## 📊 MODELOS DE BASE DE DATOS

### UserConsent (Compliance FIFA)

```python
- fifa_tpo_disclaimer_accepted: bool  # ⚠️ OBLIGATORIO
- fifa_disclaimer_text: text          # Guarda texto exacto aceptado
- ip_address: str                     # Trazabilidad
- accepted_at: datetime
```

### Wallet (Billetera)

```python
- balance_usd: float                  # ⚠️ SIEMPRE en USD
# Frontend convierte a moneda preferida del usuario
```

### Transaction (Trazabilidad Fintech)

```python
- currency_used: str                  # ARS, BRL, USD, etc.
- original_amount: float              # Monto original
- exchange_rate: float                # Tasa al momento
- final_amount_usd: float             # Convertido a USD
```

### PlayerToken (NFT/Activo Digital)

```python
- token_symbol: str                   # Ej: "MESSI-01"
- total_supply: int                   # Emisión total
- current_value_usd: float            # Precio actual
- available_supply: int               # Disponibles
```

---

## 🔌 ENDPOINTS PRINCIPALES

### Legal & Compliance

- `POST /api/legal/accept-terms` - Aceptar términos (bloqueo de acceso)
- `GET /api/legal/compliance-status` - Verificar estado legal
- `GET /api/legal/fifa-disclaimer` - Obtener texto descargo FIFA

### Wallet

- `GET /api/wallet/balance` - Consultar saldo (USD + moneda preferida)
- `POST /api/wallet/deposit` - Depositar fondos (simula pasarela)
- `GET /api/wallet/transactions` - Historial de transacciones
- `GET /api/wallet/exchange-rates` - Tasas de cambio actuales

### Players & Tokens

- `POST /api/players/scrape` - Scrapear jugador desde Transfermarkt
- `GET /api/players/search?query=messi` - Buscar jugadores
- `POST /api/players/tokens` - Crear token de jugador
- `GET /api/players/tokens/` - Listar tokens disponibles
- `POST /api/players/tokens/purchase` - Comprar tokens
- `GET /api/players/portfolio/me` - Ver portfolio con métricas

---

## 🕷️ SCRAPING ROBUSTO

### Características Anti-Bloqueo

✅ **User-Agent Rotation**: 5+ user agents diferentes  
✅ **Delays Aleatorios**: 1.5-3.5 segundos entre requests  
✅ **Reintentos Automáticos**: Hasta 3 intentos con espera incremental  
✅ **Headers Completos**: Simula navegador real (Accept, DNT, Sec-Fetch-*)  
✅ **Manejo de Errores**: Graceful degradation si cambia HTML  

### Uso del Scraper

```python
from app.services.scraper import TransfermarktScraper

scraper = TransfermarktScraper()

# Buscar jugador
results = scraper.search_player("Lionel Messi")

# Scrapear perfil completo
player_data = scraper.scrape_transfermarkt_profile(
    "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003"
)
```

### Datos Extraídos

- ✅ Nombre completo
- ✅ Fecha de nacimiento
- ✅ Nacionalidad
- ✅ Posición
- ✅ Valor de mercado (EUR → USD)
- ✅ Club actual
- ✅ Goles de la temporada
- ✅ Asistencias
- ✅ Minutos jugados
- ✅ Partidos disputados

---

## 💰 SISTEMA DE BILLETERA MULTI-DIVISA

### Lógica de Negocio

**IMPORTANTE**: La base de datos **SIEMPRE** almacena en USD para estandarizar.

#### Flujo de Depósito (Ejemplo con ARS)

1. **Usuario deposita**: 100,000 ARS
2. **Sistema obtiene tasa**: 1 USD = 1000 ARS
3. **Conversión**: 100,000 / 1000 = 100 USD
4. **Se guarda en DB**: `balance_usd = 100.0`
5. **Frontend muestra**: Toggle entre "100 USD" y "100,000 ARS"

#### Beneficios

✅ **Un solo balance**: Evita inconsistencias  
✅ **Reportes simples**: Métricas en una sola moneda  
✅ **Flexibilidad**: Usuario ve su moneda preferida  
✅ **Compliance**: Registros auditables en moneda única  

---

## 🎨 GENERACIÓN DE ASSETS VISUALES

Ver `DESIGN_PROMPTS.md` para prompts completos optimizados para:

- 🌱 **Logo SEMILLERO PRO** (brote + balón, neón verde)
- 💳 **UI Billetera** (dark mode, glassmorphism)
- 🃏 **NFT Cards** (futuristic, holográficas)
- 📊 **Gráficos** (performance charts)
- 🏟️ **Hero images** (landing page)

### Paleta de Colores

```css
--primary: #00ff88;      /* Neon Green */
--secondary: #16213e;    /* Deep Navy */
--background: #1a1a2e;   /* Dark Purple */
--accent: #00cc6a;       /* Green Accent */
```

---

## 🔒 SEGURIDAD Y COMPLIANCE

### FIFA Compliance

⚠️ **CRÍTICO**: El sistema implementa un bloqueo total de acceso hasta que el usuario acepte explícitamente:

> "El usuario reconoce que adquiere un Activo Digital coleccionable basado en estadísticas.
> NO adquiere derechos económicos sobre el jugador (TPO), ni derechos federativos,
> cumpliendo con la normativa FIFA vigente."

### Trazabilidad

Cada aceptación de términos registra:

- IP del cliente
- User-Agent del navegador
- Timestamp exacto
- Texto completo del disclaimer aceptado

### Validaciones

- ✅ Todos los endpoints protegidos con autenticación JWT (TODO)
- ✅ Rate limiting en scraping (delays obligatorios)
- ✅ Validación Pydantic en todos los inputs
- ✅ Transactions con foreign keys + CASCADE

---

## 📈 ROADMAP MVP → V1.0

### ✅ MVP (Actual)

- [x] Modelos de base de datos completos
- [x] Endpoints de Legal, Wallet y Players
- [x] Scraper robusto de Transfermarkt
- [x] Componentes React (LegalModal, PlayerCard)
- [x] Sistema multi-divisa funcional

### 🚧 V1.0 (Próximo)

- [ ] Autenticación JWT completa
- [ ] Sistema de roles (User, Admin, Scout)
- [ ] Integración real de pasarelas (Mercado Pago, Stripe)
- [ ] API externa de tasas de cambio (exchangerate-api.com)
- [ ] Dashboard de admin para crear tokens
- [ ] Sistema de notificaciones (email/push)
- [ ] Tests unitarios + integración (pytest)
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en AWS/GCP

### 🔮 V2.0 (Futuro)

- [ ] Smart contracts en Ethereum/Polygon
- [ ] Marketplace peer-to-peer de tokens
- [ ] Sistema de dividendos por rendimiento
- [ ] ML para predicción de valores
- [ ] App móvil nativa (React Native)

---

## 🧪 TESTING

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend
npm run test
```

---

## 👥 CONTRIBUCIÓN

Este es un MVP privado. Para contribuir:

1. Fork del repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📄 LICENCIA

Copyright © 2025 SEMILLERO PRO. Todos los derechos reservados.

---

## 🆘 SOPORTE

**Issues**: GitHub Issues  
**Email**: <soporte@semilleropro.com> (placeholder)  
**Docs**: `http://localhost:8000/docs` (FastAPI Swagger)

---

## ⚠️ DISCLAIMERS

1. **Este es un MVP**: No usar en producción sin auditoría de seguridad
2. **Tasas de cambio simuladas**: En producción usar API externa
3. **Scraping**: Respetar términos de servicio de Transfermarkt
4. **Regulación**: Consultar abogados para compliance en cada jurisdicción
5. **Inversión**: Incluir avisos de riesgo según regulación local

---

**Built with ❤️ for LATAM football** ⚽🌎
