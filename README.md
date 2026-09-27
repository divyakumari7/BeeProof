# BeeProof — National Honey Traceability & Apiculture Governance Platform
### Complete End-to-End Enterprise Implementation (Phases 1 to 7)

BeeProof is an enterprise-grade agricultural and food-safety technology platform that establishes immutable honey provenance, empowers registered beekeepers under the Khadi and Village Industries Commission (KVIC), integrates biological IoT hive monitoring, leverages machine learning for predictive yield and colony health diagnostics, enforces accredited NABL laboratory testing, and enables consumers to cryptographically verify honey batches on an EVM blockchain.

---

## 1. System Architecture & Monorepo Structure

```
BeeProof/
├── frontend/                  # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/        # PublicBatchModal, AuthModal, QrCodeDisplay, HiveIotTelemetry,
│   │   │                      # HiveAiInsightsPanel, ClusterMapVisualizer, ClusterDrilldownModal
│   │   ├── context/           # AuthContext (JWT, user state, RBAC role guards)
│   │   ├── pages/             # LandingPage, AdminPortal, BeekeeperPortal, ProcessorPortal,
│   │   │                      # QualityLabPortal, DistributorPortal, UnauthorizedPage
│   │   ├── services/          # api.ts (Full REST client with Bearer token injection)
│   │   └── types/             # Strongly typed interfaces matching backend DTOs
│   ├── Dockerfile             # Multi-stage production container
│   └── package.json           # React 18, Vite 6, Tailwind CSS, Lucide icons
│
├── backend/                   # Spring Boot 3.4.3 + Spring Security + Spring Data JPA
│   ├── src/main/java/com/beeproof/
│   │   ├── config/            # SecurityConfig, CorsConfig, OpenApiConfig
│   │   ├── data/              # DataSeeder (seeds roles, admin, beekeepers, clusters, hives)
│   │   ├── domain/            # 20 JPA entities (HoneyBatch, Hive, Sensor, Alert, Nabl, etc.)
│   │   ├── dto/               # Strongly typed Request / Response DTOs
│   │   ├── exception/         # GlobalExceptionHandler & structured API responses
│   │   ├── repository/        # 21 Spring Data JPA repositories
│   │   ├── security/          # JwtAuthenticationFilter, JwtTokenProvider, UserPrincipal
│   │   ├── service/           # AuthService, VerificationService, BatchManagementService,
│   │   │                      # BlockchainService, QrCodeService, SupplyChainService,
│   │   │                      # IotService, AiService, AdminService, AuditService
│   │   └── controller/        # Auth, PublicVerification, Beekeeper, Processor, QualityLab,
│   │                          # Logistics, IoT, AI, and Admin/KVIC controllers
│   ├── src/main/resources/
│   │   ├── application.yml    # Root config
│   │   ├── application-dev.yml# Dev profile (H2 PostgreSQL-compatibility mode)
│   │   └── application-prod.yml# Production profile (PostgreSQL 16)
│   ├── pom.xml                # Maven configuration with Springdoc OpenAPI
│   └── Dockerfile             # Multi-stage container
│
├── blockchain/                # EVM Smart Contracts & Hardhat Environment
│   ├── contracts/             # HoneyBatchTraceability.sol
│   ├── scripts/               # deploy.js
│   ├── test/                  # HoneyBatchTraceability.test.js
│   ├── deployments/           # localhost.json (deployed contract address)
│   ├── hardhat.config.js      # Hardhat node & EVM configuration
│   └── Dockerfile             # Alpine container for local node
│
├── ai-service/                # Python FastAPI Machine Learning Microservice
│   ├── models.py              # Pydantic telemetry & yield schemas
│   ├── ml_engine.py           # Colony health classifier, yield regressor, pest inference
│   ├── main.py                # FastAPI REST endpoints (/predict/hive-health, /predict/productivity)
│   ├── test_ai_service.py     # Pytest test suite (100% passing)
│   ├── requirements.txt       # fastapi, uvicorn, scikit-learn, pandas, numpy
│   └── Dockerfile             # Python 3.11 slim container
│
├── docker-compose.yml         # 5-Service Orchestration (Postgres, Blockchain, AI, Backend, Frontend)
├── test-complete-regression.ps1# Master End-to-End Regression Suite (Phases 1-7)
├── test-phase2.ps1            # Phase 2 Traceability MVP verification script
├── test-phase3.ps1            # Phase 3 Supply Chain verification script
├── test-phase4.ps1            # Phase 4 IoT Telemetry & Anomaly script
├── test-phase5.ps1            # Phase 5 AI Analytics verification script
├── test-phase6.ps1            # Phase 6 Admin / KVIC Analytics script
└── README.md                  # Documentation manual
```

---

## 2. Technology Stack Across All Tiers

| Layer | Technologies |
| :--- | :--- |
| **Frontend Web** | React 18, TypeScript, Vite 6, Tailwind CSS, Lucide React, SVG Geo-Mapping |
| **Backend REST API** | Spring Boot 3.4.3, Spring Security 6, Spring Data JPA, Hibernate ORM, JJWT (0.12.6) |
| **API Documentation** | OpenAPI 3.0, Swagger UI 5 (`springdoc-openapi-starter-webmvc-ui 2.8.5`) |
| **Blockchain / EVM** | Solidity 0.8.28, Hardhat 2.22, ethers.js, SHA-256 Merkle Roots, Local EVM Node |
| **AI / Machine Learning** | Python 3.11, FastAPI, Uvicorn, Scikit-Learn 1.4, Pandas, NumPy |
| **IoT Telemetry** | Time-series ingestion, biological threshold triggers, alert state machines |
| **Database** | PostgreSQL 16 (Production) / In-Memory PostgreSQL-compatible (Dev) |
| **Containerization** | Docker, Docker Compose (5 multi-tier microservices) |

---

## 3. Seven Phases Implemented & Verified

### Phase 1 — Foundation & Monorepo
- Monorepo structure, 20 JPA entities, Spring Security 6 stateless JWT with BCrypt password hashing.
- Role-Based Access Control (RBAC): `ADMIN_KVIC`, `BEEKEEPER`, `PROCESSOR`, `QUALITY_LAB`, `DISTRIBUTOR`.
- Automatic database seeding of 5 test personas, 3 geographic clusters (Sundarbans, Nilgiri, Kashmir), and 15 monitored hives.

### Phase 2 — Traceability MVP & Smart Contracts
- Solidity smart contract `HoneyBatchTraceability.sol` with event emissions and tamper checks.
- Batch creation endpoint (`POST /api/beekeeper/batches`), SHA-256 canonical hashing of batch parameters.
- Hardhat EVM local blockchain transaction proof recording (`txHash`, `stateMerkleRoot`, `blockNumber`).
- QR code generation linking to consumer verification modal (`/verify/{batchNumber}`).

### Phase 3 — Supply Chain Workflows & State Machine
- Complete state machine: `HARVESTED` → `COLLECTED` → `IN_PROCESSING` → `CERTIFIED` → `PACKAGED` → `DISPATCHED` → `DELIVERED`.
- Strict transition guards: packaging blocked prior to NABL laboratory certification; delivery blocked before logistics dispatch.
- Persona portals: Processor cold-filtration logging, NABL Quality Lab certificate issuance (moisture, HMF, C4 sugars, pollen count), packaging into serialized jars, and logistics dispatch & delivery confirmation.

### Phase 4 — IoT Hive Monitoring & Anomaly Detection
- Telemetry ingestion API (`POST /api/iot/readings`) capturing internal temperature, humidity, scale weight, and acoustic frequency.
- Biological anomaly detection engine:
  - Thermal brood stress (temperature > 36.5°C or < 32.0°C)
  - Moisture saturation (humidity > 70.0%)
  - Colony swarming / absconding (sudden scale weight loss > 2.0 kg or acoustic hum > 250 Hz)
- Alert lifecycle: `UNREAD` → `READ` → `RESOLVED`.
- Simulator controls for testing environmental spikes and sensor offline status with clear disclaimer: `"DEMO / SIMULATED SENSOR DATA"`.

### Phase 5 — AI Analytics & Predictive Microservice
- Python FastAPI microservice (`ai-service/` on port 8000) running Scikit-Learn models.
- Colony Health Score Classifier (0-100 score, status `HEALTHY` / `WARNING` / `CRITICAL`, swarming probability, queen loss risk).
- Honey Yield Regressor predicting harvest volume surplus in kg with confidence interval and explainability factors.
- Disease Risk Module with `"Disease Risk (Demo Inference)"` disclaimer.
- Spring Boot `AiService` HTTP client with graceful heuristic fallback in case of network timeouts.
- React frontend `HiveAiInsightsPanel` with health gauge, yield range, explainability factors, and on-demand refresh.

### Phase 6 — Admin & KVIC National Analytics
- National BI Analytics Dashboard: total production kg, authenticity rate (100%), active/warning/critical hive breakdown, blockchain verification counter.
- Cluster Performance Leaderboard ranking top honey-producing clusters with production metrics.
- Floral Source Botanical Distribution (Wild Mangrove Khalisha, Mustard, Sidr, Acacia, Multifloral).
- Interactive Geographic Map Visualizer of India with cluster pins, coordinates, and `"DEMO / APPROXIMATE GEOGRAPHIC LOCATIONS"` badge.
- Hierarchical Drill-down Modal: KVIC National -> Honey Cluster -> Beekeepers -> Hives -> Batches & Blockchain Proofs.
- CSV Audit Trail Export (`/api/admin/export/audit-logs`).

### Phase 7 — Production Hardening & Documentation
- Security hardening: zero secret leakage, role-based method guards, exception sanitization via `GlobalExceptionHandler`.
- OpenAPI 3.0 specification (`/v3/api-docs`) and Swagger UI (`/swagger-ui/index.html`).
- Multi-service Docker Compose configuration orchestrating all 5 tiers.
- Master automated regression test suite (`test-complete-regression.ps1`) verifying all 7 phases end-to-end.

---

## 4. Test Credentials Table

| Role | Username / Email | Password | Full Name & Organization |
| :--- | :--- | :--- | :--- |
| **KVIC Admin** | `admin@beeproof.org` | `BeeProof@2026!` | Dr. Rameshwar Sharma (KVIC Director) |
| **Beekeeper 1** | `beekeeper1@beeproof.org` | `BeeProof@2026!` | Rajesh Mandal (Sundarbans Co-op) |
| **Beekeeper 2** | `beekeeper2@beeproof.org` | `BeeProof@2026!` | Ananya Das (Sundarbans Co-op) |
| **Honey Processor** | `processor@beeproof.org` | `BeeProof@2026!` | Vikram Sethi (Apex Processing) |
| **NABL Lab Chemist** | `lab@beeproof.org` | `BeeProof@2026!` | Dr. Meera Nambiar (NABL Quality Lab) |
| **Logistics / Distributor** | `distributor@beeproof.org` | `BeeProof@2026!` | Amit Deshmukh (EcoLogistics) |
| **Public Consumer** | *No login required* | *N/A* | Public batch search at `/verify/{batchNumber}` |

---

## 5. Local Development Quickstart

### Prerequisites
- Java 21+ (OpenJDK / Eclipse Temurin)
- Maven 3.9+
- Node.js 18+ & npm
- Python 3.10+ (with pip)

### Step 1: Start Blockchain Node
```powershell
cd blockchain
npm install
npx hardhat node
# In another terminal:
npm run deploy:local
```

### Step 2: Start AI Microservice
```powershell
cd ai-service
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

### Step 3: Start Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- Backend REST API: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON Schema: `http://localhost:8080/v3/api-docs`
- H2 In-Memory Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:beeproof_db`)

### Step 4: Start React Frontend
```powershell
cd frontend
npm install
npm run dev
```
- Frontend Web App: `http://localhost:5173`

---

## 6. Docker Compose Orchestration

To run all 5 services simultaneously via Docker:
```powershell
docker-compose up --build
```

Services started:
- `beeproof-postgres`: PostgreSQL 16 on port `5432`
- `beeproof-blockchain`: Hardhat EVM node on port `8545`
- `beeproof-ai-service`: FastAPI Python ML microservice on port `8000`
- `beeproof-backend`: Spring Boot 3.4.3 backend on port `8080`
- `beeproof-frontend`: React 18 Nginx web application on port `5173`

---

## 7. Master Automated Regression Suite

To execute the complete end-to-end regression test suite verifying all 7 phases:
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\test-complete-regression.ps1
```

Individual phase tests:
- `.\test-phase2.ps1`: Phase 2 Traceability MVP & Blockchain Minting
- `.\test-phase3.ps1`: Phase 3 Supply Chain Workflows & State Machine
- `.\test-phase4.ps1`: Phase 4 IoT Telemetry & Biological Anomalies
- `.\test-phase5.ps1`: Phase 5 AI Colony Health & Yield Inferences
- `.\test-phase6.ps1`: Phase 6 KVIC National BI Analytics & Cluster Drilldown

---

## 8. License

This project is developed under the Apache 2.0 License for the National Apiculture Mission & Honey Traceability Governance.
