# 🐝 BeeProof — National Honey Traceability, Apiculture Governance & AI Diagnostic Platform

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-339933?logo=nodedotjs&logoColor=white)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/backend)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-47A248?logo=mongodb&logoColor=white)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/backend)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=black)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/frontend)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF?logo=vite&logoColor=white)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/frontend)
[![FastAPI](https://img.shields.io/badge/AI%20Microservice-FastAPI%20%2B%20Python-009688?logo=fastapi&logoColor=white)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/ai-service)
[![YOLOv11](https://img.shields.io/badge/Computer%20Vision-Ultralytics%20YOLOv11-FF6F00)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/ai-service)
[![Solana](https://img.shields.io/badge/Blockchain-Solana%20Devnet%20%2F%20EVM-9945FF?logo=solana&logoColor=white)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/blockchain)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](file:///e:/HiveLedger/NotMine/NotMine/NotMine/LICENSE)

**BeeProof** (HiveLedger) is a comprehensive, enterprise-grade national apiculture governance and honey traceability platform. Built to support the **Khadi and Village Industries Commission (KVIC)** and registered beekeeping cooperatives across India, BeeProof eliminates honey adulteration (such as high-fructose corn syrup and C4 sugar manipulation), secures farm-to-jar provenance using dual-layer blockchain verification, provides biological IoT smart-hive telemetry, and delivers edge AI/Computer Vision diagnostics to empower beekeepers.

---

## 📑 Table of Contents

- [1. Key Innovations & Platform Features](#1-key-innovations--platform-features)
- [2. System Architecture & Monorepo Structure](#2-system-architecture--monorepo-structure)
- [3. Complete Persona Portals & User Roles](#3-complete-persona-portals--user-roles)
- [4. AI & Computer Vision Pathology Engine](#4-ai--computer-vision-pathology-engine)
- [5. Deterministic 7-Field Cryptographic Integrity Engine](#5-deterministic-7-field-cryptographic-integrity-engine)
- [6. Technology Stack Across All Tiers](#6-technology-stack-across-all-tiers)
- [7. Default Test Credentials](#7-default-test-credentials)
- [8. Local Development Quickstart](#8-local-development-quickstart)
- [9. REST API Endpoint Reference](#9-rest-api-endpoint-reference)
- [10. Automated Testing & Verification](#10-automated-testing--verification)
- [11. License & Governance](#11-license--governance)

---

## 1. Key Innovations & Platform Features

### 🍯 1. End-to-End Honey Supply Chain Traceability
- **6-Stage Verified Custody Pipeline**: `HARVESTED` → `COLLECTED` → `PROCESSING` → `QUALITY_VERIFIED` → `PACKAGED` → `DISPATCHED` → `DELIVERED`.
- **Strict Transition Gates**: Packaging is blocked until NABL laboratory quality clearance; retail handover requires confirmed logistics dispatch.
- **Dynamic QR Code Serialization**: Unique QR labels generated for bulk collection tins down to individual 500g serialized consumer jars.

### 🔒 2. Dual Blockchain Ledger & Anti-Fraud Protection
- **Solana Devnet Anchor Program** & **Hardhat EVM Smart Contract** compatibility.
- **Deterministic 7-Field SHA-256 Canonical Hashing**: Binds batch ID, yield weight, lab certificate number, moisture %, purity score, NMR spectroscopy verdict, and C4 adulteration flags into an immutable state Merkle root.
- **Live Database Tampering & Fraud Detection Simulator**: Interactive sandbox demonstrating instantaneous on-chain tamper detection if raw database records are altered.

### 👁️ 3. Computer Vision Hive & Comb Pathology Studio
- **Ultralytics YOLOv11 & Deep Learning Vision Pipeline**: Upload or capture comb photos and videos to detect colony health conditions.
- **Automated Pathogen & Health Detection**:
  - *Varroa Destructor* parasite mites adhering to nurse bees.
  - American Foulbrood (AFB) & European Foulbrood (EFB) bacterial brood rots.
  - Chalkbrood fungal mummification.
  - Wax Moth larvae and comb webbing trails.
  - Queen Bee localization, worker bee density, and pollen basket forage levels.
- **Visual Bounding Boxes & Actionable IPM Guidance**: Displays bounding boxes, confidence percentages, and Integrated Pest Management remedies in real time.

### 🧭 4. BeeProof Action Advisor
- **Prescriptive AI Advisory Module**: Guides beekeepers with prioritized recommendations based on live hive sensor data, seasonality, and regional climate.
- **Urgent Alarm Dispatch**: Immediate alerts for brood hyperthermia, moisture condensation, and impending prime swarm emergence.

### 📡 5. Biological IoT Hive Monitoring
- **Real-Time Sensor Telemetry Stream**: Captures core brood temperature (°C), relative humidity (%), colony weight (kg), and acoustic hum frequency (Hz).
- **Acoustic Swarm Detection**: Flags elevated audio frequencies (> 250 Hz) and sudden hive weight drop (> 2.0 kg) indicative of queen piping and prime swarming.
- **Environmental Simulator**: Built-in test sandbox to simulate heatwaves, humidity spikes, and weight shifts.
- **Hardware Inventory Tracker**: Manage ESP32/LoRaWAN sensor nodes, battery levels, and calibration logs.

### 🔬 6. Accredited NABL Chemical Laboratory Certification
- **Standardized Food-Safety Parameters**: Records moisture content (max 20%), Hydroxymethylfurfural (HMF < 40 mg/kg), C4 Sugar Isotope Ratio (< 7%), Pollen count, and NMR spectral analysis.
- **Cryptographically Sealed Digital Certificates**: Issues official tamper-proof inspection certificates (`BP-NABL-...`) recorded directly onto the blockchain.

### 🗺️ 7. KVIC National Apiculture Command Center
- **Interactive SVG India Geospatial Map**: Live telemetry and production hotspots across regional honey clusters (Sundarbans Mangrove, Nilgiri Shola, Kashmir Valley).
- **Hierarchical Drill-Down**: National KVIC Overview → Regional Cluster → Registered Beekeeper → Physical Hive → Harvest Batches & Blockchain Proofs.
- **Botanical Floral Distribution Analytics**: Insights across flora sources (Wild Mangrove Khalisha, Mustard, Sidr, White Acacia, Multifloral).
- **Audit Logs & Data Export**: System audit trail with one-click CSV export.

### 📄 8. High-Resolution PDF Certificate Generation
- **Server-Side PDFKit Engine**: Generates verifiable PDF Provenance Certificates complete with embedded QR codes, NABL lab parameters, logistics checkpoints, and blockchain transaction receipts.

### 🌐 9. Multilingual Beekeeper Enablement
- Native UI localization supporting **English, Hindi (हिन्दी), Bengali (বাংলা), Tamil (தமிழ்), Kannada, Marathi, Telugu, Gujarati, and Punjabi**.

---

## 2. System Architecture & Monorepo Structure

```
BeeProof/
├── frontend/                  # React 18 + TypeScript + Vite 6 + Tailwind CSS Web Application
│   ├── src/
│   │   ├── components/        # BeeProofActionAdvisor, ComputerVisionHiveHealth, DbTamperSimulation,
│   │   │                      # HiveAiInsightsPanel, HiveIotTelemetry, ClusterMapVisualizer,
│   │   │                      # ClusterDrilldownModal, IotHardwareInventory, MonthlyHoneyProductionChart,
│   │   │                      # ProcessorQrModal, PublicBatchModal, QrCodeDisplay, RegisterHiveModal
│   │   ├── context/           # AuthContext (JWT authentication, user state, RBAC role guards)
│   │   ├── pages/             # LandingPage, ConsumerVerificationPage, BlockchainProofPage,
│   │   │                      # AdminPortal, BeekeeperPortal, ProcessorPortal, QualityLabPortal,
│   │   │                      # DistributorPortal, UnauthorizedPage
│   │   ├── services/          # api.ts (Axios / Fetch REST client with Bearer token injection)
│   │   ├── types/             # Strongly typed TypeScript interfaces matching backend models
│   │   └── utils/             # beekeeperTranslations.ts (Multi-language localization dictionaries)
│   ├── index.html             # Single Page Application root
│   ├── package.json           # Frontend dependencies (React 18, Vite 6, Tailwind, Lucide)
│   └── vite.config.ts         # Vite build and proxy configuration
│
├── backend/                   # Node.js + Express.js REST API Server
│   ├── src/
│   │   ├── config/            # db.js (MongoDB / Memory Server), blockchain.js (Solana & EVM)
│   │   ├── controllers/       # Auth, Verification, Beekeeper, Processor, Lab, Logistics, IoT, AI, Admin
│   │   ├── data/              # seed.js (Automated seeding of personas, clusters, hives, genesis batch)
│   │   ├── middleware/        # authMiddleware.js (JWT validation), errorMiddleware.js
│   │   ├── models/            # 14 Mongoose Models (User, Cluster, Beekeeper, Hive, SensorReading,
│   │   │                      # HiveAlert, HoneyBatch, HarvestEvent, ProcessingEvent, QualityReport,
│   │   │                      # PackageEntity, DistributionEvent, BlockchainRecord, AuditLog)
│   │   ├── routes/            # authRoutes, verificationRoutes, beekeeperRoutes, processorRoutes,
│   │   │                      # qualityLabRoutes, distributorRoutes, iotRoutes, aiRoutes, adminRoutes
│   │   ├── services/          # blockchainService (7-Field Canonical Hash, Solana Anchor & EVM),
│   │   │                      # aiServiceClient (FastAPI client with heuristic fallback),
│   │   │                      # iotService, pdfService (PDFKit certificate generator), qrService
│   │   └── server.js          # Express app entry point on port 8080
│   ├── package.json           # Express, Mongoose, @solana/web3.js, @coral-xyz/anchor, PDFKit, QRCode
│   └── Dockerfile             # Multi-stage production Node.js container
│
├── ai-service/                # Python 3.10+ FastAPI Machine Learning & Computer Vision Microservice
│   ├── main.py                # FastAPI endpoints (/predict/hive-health, /predict/productivity,
│   │                          # /predict/disease-risk, /predict/vision-health, /predict/vision-health-base64)
│   ├── ml_engine.py           # Scikit-Learn colony health classifier, yield regressor & YOLOv11 CV engine
│   ├── models.py              # Pydantic validation schemas
│   ├── risk_engine.py         # Pathogen & pest inference models
│   ├── test_ai_service.py     # Pytest unit & regression test suite
│   ├── requirements.txt       # fastapi, uvicorn, scikit-learn, ultralytics, pandas, numpy, pillow
│   └── Dockerfile             # Python 3.11 slim container
│
├── blockchain/                # Blockchain Contracts & Environments
│   ├── contracts/             # HoneyBatchTraceability.sol (Solidity EVM smart contract)
│   ├── programs/              # Solana Anchor Rust smart contracts
│   ├── scripts/               # deploy.js
│   ├── hardhat.config.js      # Hardhat EVM local node configuration
│   └── package.json           # Hardhat, ethers.js, Anchor dependencies
│
├── run-website.bat            # One-Click Windows launcher (AI Service + Backend + Frontend)
├── docker-compose.yml         # Containerized multi-service orchestration
├── test-complete-regression.ps1# Master End-to-End PowerShell regression test suite
└── README.md                  # Comprehensive platform documentation manual
```

---

## 3. Complete Persona Portals & User Roles

| Portal | Route | Primary User Role | Key Functionalities |
| :--- | :--- | :--- | :--- |
| **Public Landing Page** | `/` | All Visitors / Consumers | Live batch search, adulteration crisis stats, 6-stage journey timeline, quick demo role switcher. |
| **Consumer Verification** | `/verify/:batchNumber` | Public Consumer / Retailer | Origin apiary lookup, NABL lab purity test results, transit map, PDF certificate download, QR sharing. |
| **Beekeeper Portal** | `/beekeeper` | `BEEKEEPER` | Multilingual UI, hive registry, live IoT telemetry, AI colony diagnostics, Action Advisor, YOLOv11 Computer Vision comb scanner, harvest batch logger & instant blockchain minting. |
| **Processor Portal** | `/processor` | `PROCESSOR` | Honey intake reception, cold-filtration temperature/mesh logging, serialized jar lot packaging, QR label printing modal. |
| **Quality Lab Portal** | `/quality-lab` | `QUALITY_LAB` | NABL testing workbench (Moisture %, HMF, C4 sugar isotope, Pollen count, NMR), digital certificate issuance, on-chain cryptographic hash sealing. |
| **Distributor Portal** | `/distributor` | `DISTRIBUTOR` | Batch dispatch logger, transporter/vehicle tracking, cold-chain in-transit temperature monitoring, retail delivery confirmation. |
| **KVIC Admin Command Center** | `/admin` | `ADMIN_KVIC` | National BI metrics, interactive SVG India Map, cluster leaderboard, multi-tier drilldown, floral distribution chart, alert resolution stream, CSV audit export, live DB tamper simulator. |
| **Blockchain Proof Auditor** | `/admin/blockchain-proof/:batchNumber` | `ADMIN_KVIC` | On-chain Solana/EVM explorer, 7-field canonical hash inspector, Merkle root verification, raw transaction receipts. |

---

## 4. AI & Computer Vision Pathology Engine

The BeeProof AI service ([`ai-service/`](file:///e:/HiveLedger/NotMine/NotMine/NotMine/ai-service)) operates as an independent FastAPI microservice on port `8000`:

```
                                  ┌───────────────────────────────┐
                                  │   BeeProof AI Microservice    │
                                  │    (FastAPI / Python 3.11)    │
                                  └───────────────┬───────────────┘
                                                  │
            ┌─────────────────────────────────────┼─────────────────────────────────────┐
            ▼                                     ▼                                     ▼
┌───────────────────────┐             ┌───────────────────────┐             ┌───────────────────────┐
│ Scikit-Learn Models   │             │   Inference Engine    │             │  Ultralytics YOLOv11  │
│ • Colony Health Score │             │ • Disease & Pest Risk │             │ • Varroa Mite Bounding│
│ • Swarming Probability│             │ • Acoustic Spectrum   │             │ • Foulbrood Pathology │
│ • Harvest Yield (kg)  │             │ • Thermal Stress Flag │             │ • Queen & Pollen Load │
└───────────────────────┘             └───────────────────────┘             └───────────────────────┘
```

### Supported Computer Vision Diagnostic Classes:
1. **Healthy Brood & Comb Pattern**: Uniform capped worker brood, glossy cell cappings, high worker density.
2. **Varroa Destructor Infestation**: Phoretic mites on bee thoraces, irregular brood cappings, wing deformities.
3. **American Foulbrood (AFB)**: Sunken, dark, perforated brood cappings with characteristic ropey larval consistency.
4. **Wax Moth (Galleria mellonella)**: Silken webbing trails, chewed beeswax foundation, and frass pellets.
5. **Chalkbrood (Ascosphaera apis)**: White/grey mummified larvae dropped onto the bottom board.
6. **Nosema & Dysentery**: Fecal streaking on frame top bars, swollen abdomens, crawling nurse bees.
7. **Queen Bee & Pollen Load**: Direct queen detection and worker corbicula pollen basket fullness.

---

## 5. Deterministic 7-Field Cryptographic Integrity Engine

To ensure unalterable integrity between the physical harvest, chemical testing, and blockchain ledgers, BeeProof generates a canonical SHA-256 state Merkle root derived from **7 critical data points**:

```
Canonical String Formula:
batchNumber=<BATCH_ID>;quantity=<QTY_KG>;certNum=<CERT_NUM>;moisture=<MOISTURE_%>;purity=<PURITY_SCORE>;nmr=<NMR_VERDICT>;c4=<C4_VERDICT>
```

```
Example Canonical Input:
batchNumber=BP-2026-SUN-001;quantity=485.50;certNum=BP-NABL-2026-00492;moisture=17.80;purity=96.20;nmr=NMR_PASS;c4=C4_NEGATIVE

Resulting SHA-256 Merkle Root:
0x8f2d9c4e1a7b63f58902dce8b7a431529df0c7e1482b5398a6c3104e76d91a2f
```

### Anti-Fraud Verification Workflow:
1. When a consumer or regulator requests verification, the backend dynamically queries the current database state and re-computes the 7-field canonical hash.
2. The hash is compared against the immutable on-chain record stored on Solana Devnet or Hardhat EVM.
3. **Match**: `VERIFIED` — Integrity confirmed with green seal.
4. **Mismatch**: `TAMPERED` — Flagged with high-visibility red anti-fraud banner detailing discrepancies.

---

## 6. Technology Stack Across All Tiers

| Tier | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite 6, Tailwind CSS | Single Page App with fast HMR, responsive styling, and modern UI components. |
| **Icons & Visuals** | Lucide React, SVG Geo-Mapping | Vector iconography, interactive India cluster map visualizer. |
| **Backend Framework** | Node.js 18+, Express.js | High-throughput REST API with centralized error handling and logging. |
| **Database & ODM** | MongoDB 6+, Mongoose 8 | Document database with automatic in-memory fallback (`mongodb-memory-server`). |
| **AI / Machine Learning** | Python 3.10+, FastAPI, Scikit-Learn, Pandas | Predictive colony diagnostics, harvest regressor, and time-series anomaly detection. |
| **Computer Vision** | Ultralytics YOLOv11, Pillow, OpenCV | Deep learning visual comb inspection, mite counting, and pathogen classification. |
| **Blockchain** | Solana Devnet (Anchor), Hardhat (Solidity 0.8.28) | Dual-ledger architecture with on-chain PDA accounts and SHA-256 state verification. |
| **Document Generation** | PDFKit, QRCode | Programmatic high-res A4 verification certificates and SVG/PNG QR barcodes. |

---

## 7. Default Test Credentials

The database is pre-seeded with 6 personas covering every role in the apiculture supply chain:

| Role | Email / Username | Password | Persona & Organization |
| :--- | :--- | :--- | :--- |
| **KVIC Admin** | `admin@beeproof.org` | `BeeProof@2026!` | Dr. Rameshwar Sharma — Khadi & Village Industries Commission |
| **Beekeeper (Lead)** | `beekeeper1@beeproof.org` | `BeeProof@2026!` | Rajesh Mandal — Sundarbans Forest Honey Cooperative |
| **Beekeeper (Associate)**| `beekeeper2@beeproof.org` | `BeeProof@2026!` | Ananya Das — Sundarbans Forest Honey Cooperative |
| **Honey Processor** | `processor@beeproof.org` | `BeeProof@2026!` | Vikram Sethi — Northern Apex Honey Processing Facility |
| **NABL Lab Chemist** | `lab@beeproof.org` | `BeeProof@2026!` | Dr. Meera Nambiar — National Agro-Food Quality & NMR Lab |
| **Logistics / Distributor**| `distributor@beeproof.org` | `BeeProof@2026!` | Amit Deshmukh — EcoLogistics Distribution Network Ltd. |
| **Public Consumer** | *No login required* | *N/A* | Public verification lookup at `/verify/BP-2026-SUN-001` |

---

## 8. Local Development Quickstart

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher (with `pip`)
- **MongoDB** *(Optional)*: Local MongoDB on `mongodb://127.0.0.1:27017/beeproof` (An embedded memory server will launch automatically if local MongoDB is not running).

---

### 🚀 Option A: One-Click Startup (Windows)
Run the root batch launcher to boot all 3 tiers simultaneously and open your browser:
```powershell
.\run-website.bat
```

---

### 🛠️ Option B: Step-by-Step Manual Startup

#### Step 1: Start Python AI & Computer Vision Service (Port 8000)
```powershell
cd ai-service
pip install -r requirements.txt
python main.py
```
- AI Service Health Check: `http://127.0.0.1:8000/health`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

#### Step 2: Start Node.js Express Backend API (Port 8080)
```powershell
cd backend
npm install
npm run dev
```
- Backend REST API Base: `http://localhost:8080/api`
- Backend Health Check: `http://localhost:8080/api/health`
- Seed Database (Manual trigger if required): `npm run seed`

#### Step 3: Start React Frontend Application (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```
- Frontend Web App: `http://localhost:5173`

---

## 9. REST API Endpoint Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate persona credentials & receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile and roles.

### 🔍 Public Verification (`/api/verify`)
- `GET /api/verify/batch/:batchNumber` — Fetch public provenance details, NABL lab tests & blockchain proof.
- `GET /api/verify/batch/:batchNumber/pdf` — Download official A4 PDF verification certificate.
- `GET /api/verify/batch/:batchNumber/qr` — Generate QR code image for batch verification.
- `GET /api/verify/blockchain-proof/:batchNumber` — Direct blockchain proof details & 7-field canonical hash.
- `POST /api/verify/tamper-demo/:batchNumber` — Simulate database tampering for live fraud demo.
- `POST /api/verify/restore-demo/:batchNumber` — Restore original authentic data for the batch.

### 🐝 Beekeeper Management (`/api/beekeeper`)
- `GET /api/beekeeper/dashboard` — Beekeeper overview, managed hives, and total harvest metrics.
- `GET /api/beekeeper/hives` — List all hives assigned to the authenticated beekeeper.
- `POST /api/beekeeper/hives` — Register a new hive with flora classification & GPS coordinates.
- `GET /api/beekeeper/batches` — List all harvested honey batches created by the beekeeper.
- `POST /api/beekeeper/batches` — Register a new harvest batch and mint on blockchain.
- `GET /api/beekeeper/alerts` — Fetch live hive alerts and anomaly notifications.

### 🏭 Honey Processor (`/api/processor`)
- `GET /api/processor/batches` — List batches eligible for intake and processing.
- `POST /api/processor/batches/:batchNumber/process` — Log cold-filtration, mesh size, and moisture check.
- `POST /api/processor/batches/:batchNumber/package` — Log serialization and packaging into consumer jars.

### 🧪 NABL Quality Laboratory (`/api/quality-lab`)
- `GET /api/quality-lab/pending-batches` — List batches awaiting quality testing.
- `POST /api/quality-lab/certify` — Submit chemical test parameters (Moisture, HMF, C4, NMR) and issue certificate.

### 🚚 Logistics & Distribution (`/api/distributor`)
- `GET /api/distributor/consignments` — List active transport consignments.
- `POST /api/distributor/dispatch` — Log vehicle dispatch and transit temperature tracking.
- `POST /api/distributor/deliver` — Record final delivery handover signoff.

### 📡 IoT Telemetry (`/api/iot`)
- `POST /api/iot/readings` — Ingest time-series sensor readings (Temp, Humidity, Weight, Acoustic).
- `GET /api/iot/hives/:hiveId/telemetry` — Retrieve recent 24-hour telemetry time-series for a hive.
- `GET /api/iot/hives/:hiveId/alerts` — Retrieve active anomaly warnings for a specific hive.

### 🧠 AI & Computer Vision (`/api/ai`)
- `GET /api/ai/hives/:hiveId/insights` — Aggregate predictive colony health and yield forecasts.
- `POST /api/ai/hives/:hiveId/refresh-predictions` — Trigger on-demand ML model re-calculation.
- `POST /api/ai/cv/diagnose` — Multipart image upload for YOLOv11 comb pathology detection.
- `POST /api/ai/predict/vision-health` — Base64 / multipart vision analysis endpoint.

### 🏛️ KVIC National Admin (`/api/admin`)
- `GET /api/admin/analytics/summary` — High-level national BI KPI cards.
- `GET /api/admin/clusters` — Retrieve all geographic apiculture clusters and production metrics.
- `GET /api/admin/beekeepers` — List all KVIC registered beekeepers across India.
- `GET /api/admin/hives` — List all registered hives and real-time health statuses.
- `GET /api/admin/batches` — List all national honey batches across all stages.
- `GET /api/admin/alerts` — Global system alert feed with inline resolution controls.
- `POST /api/admin/alerts/:alertId/resolve` — Mark alert as resolved.
- `GET /api/admin/blockchain/stats` — On-chain transaction counts, gas metrics, and block slots.
- `GET /api/admin/audit-logs` — Immutable administrative audit trail.
- `GET /api/admin/export/audit-logs` — Download audit logs as CSV.

---

## 10. Automated Testing & Verification

BeeProof includes complete end-to-end regression suites to validate all features:

### Run Master Regression Suite (PowerShell)
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\test-complete-regression.ps1
```

### Individual Verification Scripts:
- `.\test-phase2.ps1` — Phase 2 Traceability MVP & Smart Contract Minting.
- `.\test-phase3.ps1` — Phase 3 Supply Chain Workflows & State Machine Transitions.
- `.\test-phase4.ps1` — Phase 4 IoT Telemetry & Biological Anomaly Detection.
- `.\test-phase5.ps1` — Phase 5 AI Colony Health & Yield Inferences.
- `.\test-phase6.ps1` — Phase 6 KVIC National BI Analytics & Cluster Drilldown.
- `cd backend && npm test` — Backend Node.js controller & API unit tests.
- `cd ai-service && pytest` — AI & Computer Vision Pytest test suite.

---

## 11. License & Governance

Developed under the **Apache 2.0 License** for the **National Apiculture Mission & Honey Traceability Governance**, in collaboration with the **Khadi and Village Industries Commission (KVIC)**.

```
Copyright (c) 2026 BeeProof Platform Contributors.
Licensed under the Apache License, Version 2.0.
```
