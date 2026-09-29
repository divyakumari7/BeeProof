# 🏆 BeeProof — Hackathon Demo Video Script & Walkthrough Guide

> **Official Hackathon Presentation & Video Recording Manual**  
> *A step-by-step, timestamped demonstration guide designed to showcase all platform features, technical complexity, Computer Vision comb diagnostics, and the live Blockchain Anti-Tamper demonstration to hackathon judges.*

---

## 📋 Executive Summary & Video Strategy

- **Target Video Duration**: 3 to 5 Minutes
- **Core Narrative**: Moving from India's honey adulteration crisis to a fully transparent, AI-governed, IoT-monitored, blockchain-secured honey provenance ecosystem.
- **Key Star Features Highlighted for Judges**:
  1. 👁️ **Computer Vision Comb Pathology Detection (Ultralytics YOLOv11)**: Instant pathogen/parasite detection (Varroa mites, foulbrood, chalkbrood, queen presence) with visual bounding boxes and IPM action plans.
  2. 🛡️ **Live Database Tamper & Anti-Fraud Simulator**: Modifying database records live on video to prove cryptographic 7-field SHA-256 hash mismatch and instant blockchain fraud detection.
  3. 🌾 **End-to-End Persona Workflows**: Public verification, Multilingual Beekeeper portal with IoT telemetry & Action Advisor, Processor QR generation, NABL Quality Lab testing, and KVIC National Geospatial Admin Command Center.

---

## 🛠️ Pre-Recording Preparation Checklist

Before hitting the record button, ensure your environment is fully primed:

1. **Launch All Services**:
   - Double-click [`run-website.bat`](file:///e:/HiveLedger/NotMine/NotMine/NotMine/run-website.bat) or run:
     - **AI Microservice**: `http://127.0.0.1:8000` (FastAPI + YOLOv11)
     - **Backend API**: `http://localhost:8080/api` (Node.js + MongoDB)
     - **Frontend**: `http://localhost:5173` (React 18 + Vite)
2. **Pre-seed Database**:
   - If resetting data, run `npm run seed` inside `backend/` to ensure the genesis batch `BP-2026-SUN-001` and persona accounts are fresh.
3. **Browser Setup**:
   - Zoom level set to 100% or 90% for clean visual layout.
   - Keep 2 browser tabs open:
     - **Tab 1**: `http://localhost:5173` (Main App)
     - **Tab 2**: `http://localhost:5173/admin/blockchain-proof/BP-2026-SUN-001` (Direct Blockchain Proof Inspector)
4. **Sample Images Ready for CV Upload**:
   - Have a photo of a bee comb frame ready on your desktop (or use the built-in preset samples in the UI).

---

## ⏱️ Video Timestamp & Feature Flow Overview

```
┌───────────────┬─────────────────────────────────────────────────────────────────────────────┬──────────┐
│ Time          │ Scene / Feature Displayed                                                   │ Focus    │
├───────────────┼─────────────────────────────────────────────────────────────────────────────┼──────────┤
│ 0:00 - 0:35   │ 1. The Problem Hook & Landing Page Overview                                 │ Context  │
│ 0:35 - 1:15   │ 2. Public Consumer Batch Verification & PDF Provenance Certificate           │ Trust    │
│ 1:15 - 2:10   │ 3. Beekeeper Portal: Multilingual, IoT Telemetry & Action Advisor           │ Edge IoT │
│ 2:10 - 3:05   │ 4. ⭐ STAR FEATURE 1: Live YOLOv11 Computer Vision Comb Diagnosis           │ AI / CV  │
│ 3:05 - 3:45   │ 5. Supply Chain Handoff: Processor QR Labels & NABL Quality Lab Certification│ Workflows│
│ 3:45 - 4:40   │ 6. ⭐ STAR FEATURE 2: KVIC Admin Map & Live Database Tamper Simulation     │ Security │
│ 4:40 - 5:00   │ 7. Architecture Summary & Closing Pitch                                     │ Impact   │
└───────────────┴─────────────────────────────────────────────────────────────────────────────┴──────────┘
```

---

## 🎬 Step-by-Step Recording Script & Voiceover

---

### 📍 Scene 1: The Problem Hook & Landing Page (0:00 – 0:35)

#### 🖥️ On-Screen Action:
- Open `http://localhost:5173`.
- Scroll smoothly down the **Landing Page**.
- Hover over the **National Ticker Counters** (Verified Batches, Monitored Hives, 100% Authenticity Rate).
- Hover over the **6-Stage Honey Journey Timeline** (`Harvest` → `Collection` → `Processing` → `Lab Certification` → `Packaging` → `Delivery`).
- Point the cursor at the central search bar: *"Enter Honey Batch ID..."*.

#### 🎙️ Voiceover Script:
> *"Did you know that over 70% of commercial honey sold today fails adulteration tests due to added high-fructose corn syrups and C4 sugar syrups? Meanwhile, millions of indigenous beekeepers struggle with colony diseases like Varroa mites and lack access to transparent markets.*
> 
> *Welcome to **BeeProof** — the National Apiculture Governance, IoT Biological Hive Monitoring, AI Diagnostics, and Dual-Blockchain Honey Traceability Platform built for the Khadi and Village Industries Commission (KVIC).*
> 
> *BeeProof connects every stakeholder—from rural beekeepers to NABL laboratories, processors, distributors, and consumers—into one unified, tamper-proof ecosystem."*

---

### 📍 Scene 2: Public Consumer Verification & Instant PDF Certificate (0:35 – 1:15)

#### 🖥️ On-Screen Action:
- Click on the search bar on the landing page (pre-filled with `BP-2026-SUN-001`) or click **"Verify Batch"** in the top navigation bar.
- On the **Consumer Verification Page**:
  - Point to the **Green Verification Seal**: *"Provenance Verified — Blockchain Integrity Confirmed"*.
  - Show the **Origin Cluster Details**: Sundarbans Mangrove Reserve, Beekeeper *Rajesh Mandal*, Flora *Wild Mangrove Khalisha & Goran*.
  - Expand the **NABL Laboratory Test Card**: Highlight Moisture (17.8%), HMF (14.2 mg/kg), C4 Sugar (<7% Negative), and NMR Spectroscopy (PASS).
  - Scroll through the **Custody Timeline** with GPS checkpoints.
  - Click **"Download Official PDF Certificate"** button (shows instantaneous PDF generation).
  - Show the **QR Code display** for consumer sharing.

#### 🎙️ Voiceover Script:
> *"When a consumer buys a jar of BeeProof honey, they can simply scan the QR code on the bottle. Instantly, they see the complete farm-to-table journey.*
> 
> *Here, for Batch `BP-2026-SUN-001`, we see the exact forest coordinates in the Sundarbans, the harvesting date, and the NABL-accredited chemical breakdown—proving zero C4 sugar adulteration and passed NMR spectroscopy.*
> 
> *With a single click, consumers or export regulators can download an official, cryptographically signed PDF provenance certificate."*

---

### 📍 Scene 3: Beekeeper Portal, IoT Telemetry & Action Advisor (1:15 – 2:10)

#### 🖥️ On-Screen Action:
- Click **"Login"** or use the top Demo Persona quick-switch to log in as **Beekeeper** (`beekeeper1@beeproof.org`).
- **Language Switch**: Click the language dropdown and switch to **हिन्दी (Hindi)** or **বাংলা (Bengali)** for 3 seconds to demonstrate localization, then switch back to English.
- Show the **Hive Dashboard**:
  - Select hive `SUN-HIVE-001`.
  - Point to the **Real-Time IoT Telemetry Gauges**: Internal Temperature (34.8°C), Humidity (58%), Hive Weight (42.5 kg), and Acoustic Hum Frequency (185 Hz).
- Show the **AI Insights & Colony Health Panel**:
  - Point to Health Score (92/100 Healthy), Swarming Probability (4%), and Predicted Honey Yield (+14.2 kg surplus).
- Scroll down to the **BeeProof Action Advisor**:
  - Highlight the prescriptive actionable cards (e.g., *"Honey-flow period: Monitor weight for upcoming harvest"*, *"Pre-Harvest: Prepare food-grade containers"*).

#### 🎙️ Voiceover Script:
> *"Now let's step into the shoes of Rajesh Mandal, a registered KVIC beekeeper in the Sundarbans. Our portal is natively localized into 9 regional languages like Hindi and Bengali.*
> 
> *Rajesh can monitor his smart hives in real time. Our IoT hardware streams core brood temperature, relative humidity, scale weight, and acoustic hum frequency.*
> 
> *Our machine learning engine continuously analyzes this telemetry—predicting colony health, swarming risk, and projected honey yield. Below, the **BeeProof Action Advisor** provides intelligent, seasonal guidance to prevent colony loss."*

---

### 📍 Scene 4: ⭐ STAR FEATURE 1 — YOLOv11 Computer Vision Live Comb Diagnosis (2:10 – 3:05)

#### 🖥️ On-Screen Action:
- In the Beekeeper Portal, scroll to the **"Computer Vision Hive & Comb Pathology Studio"** component.
- Click **"Upload / Select Comb Photo"** or choose one of the live pathology presets (e.g., *Varroa Destructor Mites* or *American Foulbrood*).
- Click **"Run AI Vision Diagnosis"**.
- Watch the AI response render in real time (< 500ms):
  - **Visual Bounding Boxes**: Show the detected parasite mites or infected brood cells highlighted with color-coded bounding boxes on the comb photo.
  - **Pathology Risk Badge**: Show the detected condition (e.g., *"Varroa Destructor Mites — 96% Confidence (HIGH RISK)"*).
  - **Pathology Description**: Detailed symptoms explanation.
  - **Integrated Pest Management (IPM) Action Plan**: Formic/oxalic acid treatment recommendations and quarantine protocols.
- Next, switch to the **"Harvest Honey Batch"** logger:
  - Enter quantity (e.g., `45.0 kg`), select flora, and click **"Create & Mint Batch on Blockchain"**.
  - Show the generated QR code and blockchain transaction hash.

#### 🎙️ Voiceover Script:
> *"Here is one of our most powerful innovations: our **Computer Vision Comb Pathology Studio**, powered by an Ultralytics YOLOv11 deep learning model running on our FastAPI microservice.*
> 
> *Beekeepers simply take a photo of their hive frame on their phone. In under 500 milliseconds, our model identifies microscopic Varroa destructor mites, Foulbrood bacterial rots, or chalkbrood mummification.*
> 
> *The AI overlays precision bounding boxes, calculates infection severity, and immediately prescribes an Integrated Pest Management protocol.*
> 
> *Once healthy honey is extracted, the beekeeper logs the harvest, which is instantly hashed and registered on the blockchain."*

---

### 📍 Scene 5: Processor QR Packaging & NABL Quality Lab Certification (3:05 – 3:45)

#### 🖥️ On-Screen Action:
- Use the quick switcher to jump to **Processor Portal** (`processor@beeproof.org`):
  - Show the batch intake list.
  - Point to the **Cold-Filtration Logger**: Temperature restricted below 40°C to preserve natural enzymes.
  - Click **"Generate Jar QR Labels"** to open the `ProcessorQrModal` showing printable serialized QR stickers for 500g jars.
- Jump to **Quality Lab Portal** (`lab@beeproof.org`):
  - Show the NABL laboratory testing workbench.
  - Highlight the scientific test inputs: Moisture %, HMF, C4 Carbon Isotope Adulteration test, Pollen Grain Density, and NMR spectroscopy.
  - Show the **"Issue NABL Certificate & Update Blockchain"** action.

#### 🎙️ Voiceover Script:
> *"Next, the honey travels through verified custodial handoffs.*
> 
> *At the processing facility, cold filtration parameters are logged under strict temperature ceilings to preserve native diastase enzymes, and serialized jar QR codes are printed.*
> 
> *At the NABL-accredited quality laboratory, certified chemists input NMR spectroscopy profiles and C4 sugar isotope readings. Once verified, the digital certificate is cryptographically sealed onto the blockchain ledger."*

---

### 📍 Scene 6: ⭐ STAR FEATURE 2 — KVIC Admin Command Center & Live Database Tamper Simulation (3:45 – 4:40)

#### 🖥️ On-Screen Action:
- Log in as **KVIC Admin** (`admin@beeproof.org`) to open the **Admin Command Center**:
  - Show the top KPI cards (Total Production, 100% Authenticity Rate, 15 Monitored Hives, Blockchain Transactions).
  - Show the **Interactive SVG Geospatial Map of India**: Click on the *Sundarbans*, *Nilgiri*, or *Kashmir* cluster pins to open the **Cluster Drilldown Modal** (showing National → Cluster → Beekeeper → Hive → Batch).
  - Show the **Botanical Floral Distribution Chart** and **Monthly Production Trends**.
- Scroll to the **"Database Tampering & Blockchain Anti-Fraud Simulator"** component (or switch to Tab 2 `BlockchainProofPage`):
  - **Initial State**: Show that Batch `BP-2026-SUN-001` is **100% VERIFIED** (Database Hash matches On-Chain Merkle Root).
  - **The Attack**: Click the red button **"Simulate Database Tamper (Alter Batch Data)"**.
  - Explain what happened: A rogue actor or hacker changed the database quantity from 485.5 kg to 900.0 kg or faked the moisture percentage.
  - **The Instant Detection**: Show the immediate transformation of the UI into a glowing red alert:
    - 🚨 **"TAMPERED / FRAUD DETECTED"**
    - Show the **Hash Discrepancy Box**:
      - *Calculated MongoDB Hash*: `0x7a8b...`
      - *On-Chain Blockchain Root*: `0x8f2d...`
      - *Reason*: Cryptographic 7-field hash mismatch with immutable ledger.
  - **The Recovery**: Click **"Restore Authentic Data"** to show the system recalculate the hash, match the on-chain root, and restore the green **VERIFIED** badge.

#### 🎙️ Voiceover Script:
> *"For government regulators at KVIC, our **National Command Center** provides unprecedented macro intelligence. We can explore geographic clusters across India, analyze floral distributions, and drill down from national metrics to individual hives.*
> 
> *Now, let's test our anti-fraud security. What happens if a bad actor hacks the central database to dilute honey or inflate batch quantities?*
> 
> *Watch this: I will click **'Simulate Database Tamper'** to alter the database records.*
> 
> *Immediately, BeeProof's cryptographic verification engine detects the fraud! Because our deterministic 7-field canonical SHA-256 hash no longer matches the on-chain Merkle root on Solana, the batch is instantly flagged with a critical red TAMPERED alert.*
> 
> *When we click **'Restore Authentic Data'**, the hash reconciles, and the batch returns to verified status. The blockchain makes falsification mathematically impossible."*

---

### 📍 Scene 7: Architecture Summary & Closing Pitch (4:40 – 5:00)

#### 🖥️ On-Screen Action:
- Return to the **Landing Page** or show a clean slide of the **Architecture Diagram**.
- Show the clean footer with KVIC attribution and links.

#### 🎙️ Voiceover Script:
> *"BeeProof brings together modern Web3 blockchain immutability, edge IoT biological telemetry, and deep learning computer vision into an intuitive, multilingual platform.*
> 
> *By eliminating adulteration, safeguarding consumer health, and securing fair value for rural beekeepers, BeeProof is building the future of sustainable apiculture governance.*
> 
> *Thank you!"*

---

## 💡 Top Hackathon Judge Q&A Cheat Sheet

Prepare yourself for live judging Q&A with these sharp, technically grounded answers:

### Q1: *"Why use Blockchain instead of a traditional relational database?"*
> **Answer**: *"A traditional database can be modified by any database administrator or compromised server. BeeProof uses a deterministic 7-field canonical SHA-256 hash that is minted on-chain (Solana Devnet / EVM). As demonstrated in our live tamper test, even if the database is altered, the cryptographic state mismatch is detected instantly by any consumer or auditor without trusting the central server."*

### Q2: *"How does the YOLOv11 Computer Vision model work in remote rural apiaries?"*
> **Answer**: *"Our Ultralytics YOLOv11 vision pipeline is optimized for edge inference. Beekeepers can capture photos directly using our progressive web interface. The lightweight architecture can be executed locally on edge devices or synced with our FastAPI microservice with automatic offline caching for remote forest areas."*

### Q3: *"How does BeeProof detect C4 sugar syrup adulteration?"*
> **Answer**: *"C4 plants like corn and sugarcane have distinct carbon isotope ratios ($^{13}C/^{12}C$) compared to C3 flowering nectar. Our system enforces accredited NABL laboratory testing data entry—including C4 isotope ratios and NMR spectroscopy—as mandatory blockchain verification fields before any batch can be packaged."*

### Q4: *"How does IoT telemetry prevent colony collapse and swarming?"*
> **Answer**: *"Bee colonies exhibit clear bio-acoustic precursors before swarming—the acoustic frequency spikes above 250 Hz due to queen piping, accompanied by a sudden weight drop of 2 to 3 kg as the swarm departs. Our IoT threshold engine flags these anomalies in real time, alerting the beekeeper via the Action Advisor before the colony is lost."*

---

## 🎬 Screen Recording & Production Tips

1. **Resolution**: Record at **1080p (1920x1080)** at 60 fps for ultra-smooth UI animations.
2. **Audio**: Use a dedicated USB microphone with noise suppression (avoid laptop built-in mics).
3. **Cursor Visibility**: Enable mouse click rings / highlights in OBS Studio or Loom so judges can easily track your interactions.
4. **Pacing**: Pause for 1 second after major transitions (such as running the CV scan or triggering the database tamper demo) to let judges register the visual change.

---

```
BeeProof — National Honey Traceability & Apiculture Governance Platform
Developed for Hackathon Presentation & KVIC Apiculture Governance.
```
