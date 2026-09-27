package com.beeproof.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "harvest_events")
public class HarvestEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private HoneyBatch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hive_id", nullable = false)
    private Hive hive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beekeeper_id", nullable = false)
    private Beekeeper beekeeper;

    @Column(nullable = false)
    private Double quantityExtractedKg;

    @Column(nullable = false)
    private LocalDateTime harvestTimestamp;

    private Double moistureContentPercentage;

    @Column(length = 255)
    private String extractionNotes;

    public HarvestEvent() {}

    public HarvestEvent(Long id, HoneyBatch batch, Hive hive, Beekeeper beekeeper, Double quantityExtractedKg,
                        LocalDateTime harvestTimestamp, Double moistureContentPercentage, String extractionNotes) {
        this.id = id;
        this.batch = batch;
        this.hive = hive;
        this.beekeeper = beekeeper;
        this.quantityExtractedKg = quantityExtractedKg;
        this.harvestTimestamp = harvestTimestamp;
        this.moistureContentPercentage = moistureContentPercentage;
        this.extractionNotes = extractionNotes;
    }

    public static HarvestEventBuilder builder() { return new HarvestEventBuilder(); }

    public static class HarvestEventBuilder {
        private Long id;
        private HoneyBatch batch;
        private Hive hive;
        private Beekeeper beekeeper;
        private Double quantityExtractedKg;
        private LocalDateTime harvestTimestamp;
        private Double moistureContentPercentage;
        private String extractionNotes;

        public HarvestEventBuilder id(Long id) { this.id = id; return this; }
        public HarvestEventBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public HarvestEventBuilder hive(Hive hive) { this.hive = hive; return this; }
        public HarvestEventBuilder beekeeper(Beekeeper beekeeper) { this.beekeeper = beekeeper; return this; }
        public HarvestEventBuilder quantityExtractedKg(Double quantityExtractedKg) { this.quantityExtractedKg = quantityExtractedKg; return this; }
        public HarvestEventBuilder harvestTimestamp(LocalDateTime harvestTimestamp) { this.harvestTimestamp = harvestTimestamp; return this; }
        public HarvestEventBuilder moistureContentPercentage(Double moistureContentPercentage) { this.moistureContentPercentage = moistureContentPercentage; return this; }
        public HarvestEventBuilder extractionNotes(String extractionNotes) { this.extractionNotes = extractionNotes; return this; }

        public HarvestEvent build() {
            return new HarvestEvent(id, batch, hive, beekeeper, quantityExtractedKg, harvestTimestamp, moistureContentPercentage, extractionNotes);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public Hive getHive() { return hive; }
    public void setHive(Hive hive) { this.hive = hive; }
    public Beekeeper getBeekeeper() { return beekeeper; }
    public void setBeekeeper(Beekeeper beekeeper) { this.beekeeper = beekeeper; }
    public Double getQuantityExtractedKg() { return quantityExtractedKg; }
    public void setQuantityExtractedKg(Double quantityExtractedKg) { this.quantityExtractedKg = quantityExtractedKg; }
    public LocalDateTime getHarvestTimestamp() { return harvestTimestamp; }
    public void setHarvestTimestamp(LocalDateTime harvestTimestamp) { this.harvestTimestamp = harvestTimestamp; }
    public Double getMoistureContentPercentage() { return moistureContentPercentage; }
    public void setMoistureContentPercentage(Double moistureContentPercentage) { this.moistureContentPercentage = moistureContentPercentage; }
    public String getExtractionNotes() { return extractionNotes; }
    public void setExtractionNotes(String extractionNotes) { this.extractionNotes = extractionNotes; }
}
