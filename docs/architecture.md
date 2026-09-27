# BeeProof System Architecture & Roadmap

BeeProof is an enterprise platform modernizing honey supply-chain provenance, beekeeper enablement, quality verification, and consumer trust.

## Phase Roadmap
- **Phase 1 (Current)**: Foundation — Monorepo, Database Schema (19 entities), Spring Boot 3 Security + JWT + RBAC, Seed Data (Admin, 5 Beekeepers, 3 Clusters, 15 Hives), Public Provenance Lookup, and Role-Based Portals in React + TypeScript + Vite.
- **Phase 2**: Immutability & Ledger — Smart contracts, cryptographic hashing, and QR generation.
- **Phase 3**: Supply-Chain Workflows — Batch custody transitions, processing events, and packaging.
- **Phase 4**: IoT Telemetry — Physical sensors, acoustic analysis, MQTT telemetry ingestion.
- **Phase 5**: AI Predictions — Colony health scores, disease prediction, and harvest forecasting.
- **Phase 6**: Advanced Analytics — Enterprise executive dashboards, geospatial heatmaps.
- **Phase 7**: Production Hardening — Full load testing, compliance certifications.

## Database Entities & Entity-Relationship Foundation (Phase 1)
1. `users`: Authentication identities with BCrypt hashed credentials.
2. `roles`: System access roles (`ADMIN_KVIC`, `BEEKEEPER`, `PROCESSOR`, `QUALITY_LAB`, `DISTRIBUTOR`).
3. `beekeepers`: Profile, KVIC registration, contact, state, district.
4. `clusters`: Geographic beekeeping cooperatives/regions with flora taxonomy.
5. `hives`: Physical beehives mapped to clusters and beekeepers.
6. `sensors`: IoT telemetry hardware registry.
7. `sensor_readings`: Raw time-series readings (temperature, humidity, acoustics, weight).
8. `hive_health_predictions`: Predictive health scoring for colonies.
9. `disease_predictions`: Anomaly/pathogen early alerts.
10. `productivity_predictions`: Projected yield calculations.
11. `honey_batches`: Distinct harvest aggregates with origin cluster.
12. `harvest_events`: Logged extraction records by beekeepers.
13. `processing_events`: Processing, filtration, moisture normalization steps.
14. `quality_reports`: Laboratory purity, pollen spectrum, NMR tests.
15. `packages`: Finished bottled goods and serial numbers.
16. `distribution_events`: Dispatch, custody handover, retail arrival.
17. `blockchain_records`: Immutability hashes and transaction references.
18. `qr_codes`: Consumer scan identifiers and verification links.
19. `notifications`: In-app role-based alerts and events.
20. `audit_logs`: Impartial operational trails of critical mutations.
