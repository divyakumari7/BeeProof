# BeeProof — Blockchain & Immutability Layer (Phase 2 Architecture Scope)

This directory is designated for the decentralized ledger smart contracts and immutability verification scheduled for **Phase 2**.

## Phase 2 Scope
- **Cryptographic Batch Attestation**: Anchoring harvest events, processor transitions, and lab certificates onto an immutable ledger.
- **Smart Contracts**: Tracking custody transfer from beekeeper cluster -> processor -> testing lab -> distributor.
- **Tamper-Evident QR Records**: Linking consumer-scanned batches to verified on-chain state proofs.

## Foundation Entities (Established in Phase 1 Backend)
- `blockchain_records`
- `qr_codes`
- `honey_batches`

*Note: Phase 1 establishes the relational schema, cryptographic hash fields, and provenance response structures. Full smart contract deployments and ledger RPC nodes will be integrated in Phase 2.*
