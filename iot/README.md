# BeeProof — IoT & Telemetry Layer (Phase 4 Architecture Scope)

This directory is designated for the IoT sensor hardware firmware, gateway communication protocols (MQTT/CoAP/HTTP), and real-time streaming pipeline scheduled for **Phase 4**.

## Phase 4 Scope
- **Edge Hive Nodes**: Low-power microcontrollers measuring internal temperature, relative humidity, colony weight, and acoustic frequency.
- **Ingestion Pipeline**: MQTT broker and time-series telemetry buffering into the backend.
- **Sensor Health Monitoring**: Battery levels, signal strength, and anomaly alerts.

## Foundation Entities (Established in Phase 1 Backend)
- `sensors`
- `sensor_readings`
- `hives`

*Note: Phase 1 establishes the relational schema, sensor associations, and data contracts. Live sensor hardware ingestion will be integrated in Phase 4. Per Phase 1 requirements, fake sensor telemetry has been deliberately avoided.*
