package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quality_reports")
public class QualityReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private HoneyBatch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_user_id", nullable = false)
    private User labTechnician;

    @Column(nullable = false, length = 100)
    private String laboratoryName;

    @Column(nullable = false, unique = true, length = 64)
    private String certificateNumber;

    private Double moisturePercentage;
    private Double fructosePercentage;
    private Double glucosePercentage;
    private Double sucrosePercentage;
    private Double hmfMgPerKg;
    private Double pollenPurityScore;
    private Boolean nmrSpectroscopyPassed;
    private Boolean c4SugarAdulterationDetected;

    @Column(nullable = false, length = 30)
    private String overallVerdict;

    @Column(length = 500)
    private String remarks;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime certifiedAt;

    public QualityReport() {}

    public QualityReport(Long id, HoneyBatch batch, User labTechnician, String laboratoryName, String certificateNumber,
                         Double moisturePercentage, Double fructosePercentage, Double glucosePercentage,
                         Double sucrosePercentage, Double hmfMgPerKg, Double pollenPurityScore,
                         Boolean nmrSpectroscopyPassed, Boolean c4SugarAdulterationDetected,
                         String overallVerdict, String remarks, LocalDateTime certifiedAt) {
        this.id = id;
        this.batch = batch;
        this.labTechnician = labTechnician;
        this.laboratoryName = laboratoryName;
        this.certificateNumber = certificateNumber;
        this.moisturePercentage = moisturePercentage;
        this.fructosePercentage = fructosePercentage;
        this.glucosePercentage = glucosePercentage;
        this.sucrosePercentage = sucrosePercentage;
        this.hmfMgPerKg = hmfMgPerKg;
        this.pollenPurityScore = pollenPurityScore;
        this.nmrSpectroscopyPassed = nmrSpectroscopyPassed;
        this.c4SugarAdulterationDetected = c4SugarAdulterationDetected;
        this.overallVerdict = overallVerdict;
        this.remarks = remarks;
        this.certifiedAt = certifiedAt;
    }

    public static QualityReportBuilder builder() { return new QualityReportBuilder(); }

    public static class QualityReportBuilder {
        private Long id;
        private HoneyBatch batch;
        private User labTechnician;
        private String laboratoryName;
        private String certificateNumber;
        private Double moisturePercentage;
        private Double fructosePercentage;
        private Double glucosePercentage;
        private Double sucrosePercentage;
        private Double hmfMgPerKg;
        private Double pollenPurityScore;
        private Boolean nmrSpectroscopyPassed;
        private Boolean c4SugarAdulterationDetected;
        private String overallVerdict;
        private String remarks;
        private LocalDateTime certifiedAt;

        public QualityReportBuilder id(Long id) { this.id = id; return this; }
        public QualityReportBuilder batch(HoneyBatch batch) { this.batch = batch; return this; }
        public QualityReportBuilder labTechnician(User labTechnician) { this.labTechnician = labTechnician; return this; }
        public QualityReportBuilder laboratoryName(String laboratoryName) { this.laboratoryName = laboratoryName; return this; }
        public QualityReportBuilder certificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; return this; }
        public QualityReportBuilder moisturePercentage(Double moisturePercentage) { this.moisturePercentage = moisturePercentage; return this; }
        public QualityReportBuilder fructosePercentage(Double fructosePercentage) { this.fructosePercentage = fructosePercentage; return this; }
        public QualityReportBuilder glucosePercentage(Double glucosePercentage) { this.glucosePercentage = glucosePercentage; return this; }
        public QualityReportBuilder sucrosePercentage(Double sucrosePercentage) { this.sucrosePercentage = sucrosePercentage; return this; }
        public QualityReportBuilder hmfMgPerKg(Double hmfMgPerKg) { this.hmfMgPerKg = hmfMgPerKg; return this; }
        public QualityReportBuilder pollenPurityScore(Double pollenPurityScore) { this.pollenPurityScore = pollenPurityScore; return this; }
        public QualityReportBuilder nmrSpectroscopyPassed(Boolean nmrSpectroscopyPassed) { this.nmrSpectroscopyPassed = nmrSpectroscopyPassed; return this; }
        public QualityReportBuilder c4SugarAdulterationDetected(Boolean c4SugarAdulterationDetected) { this.c4SugarAdulterationDetected = c4SugarAdulterationDetected; return this; }
        public QualityReportBuilder overallVerdict(String overallVerdict) { this.overallVerdict = overallVerdict; return this; }
        public QualityReportBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public QualityReportBuilder certifiedAt(LocalDateTime certifiedAt) { this.certifiedAt = certifiedAt; return this; }

        public QualityReport build() {
            return new QualityReport(id, batch, labTechnician, laboratoryName, certificateNumber,
                    moisturePercentage, fructosePercentage, glucosePercentage, sucrosePercentage,
                    hmfMgPerKg, pollenPurityScore, nmrSpectroscopyPassed, c4SugarAdulterationDetected,
                    overallVerdict, remarks, certifiedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HoneyBatch getBatch() { return batch; }
    public void setBatch(HoneyBatch batch) { this.batch = batch; }
    public User getLabTechnician() { return labTechnician; }
    public void setLabTechnician(User labTechnician) { this.labTechnician = labTechnician; }
    public String getLaboratoryName() { return laboratoryName; }
    public void setLaboratoryName(String laboratoryName) { this.laboratoryName = laboratoryName; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public Double getMoisturePercentage() { return moisturePercentage; }
    public void setMoisturePercentage(Double moisturePercentage) { this.moisturePercentage = moisturePercentage; }
    public Double getFructosePercentage() { return fructosePercentage; }
    public void setFructosePercentage(Double fructosePercentage) { this.fructosePercentage = fructosePercentage; }
    public Double getGlucosePercentage() { return glucosePercentage; }
    public void setGlucosePercentage(Double glucosePercentage) { this.glucosePercentage = glucosePercentage; }
    public Double getSucrosePercentage() { return sucrosePercentage; }
    public void setSucrosePercentage(Double sucrosePercentage) { this.sucrosePercentage = sucrosePercentage; }
    public Double getHmfMgPerKg() { return hmfMgPerKg; }
    public void setHmfMgPerKg(Double hmfMgPerKg) { this.hmfMgPerKg = hmfMgPerKg; }
    public Double getPollenPurityScore() { return pollenPurityScore; }
    public void setPollenPurityScore(Double pollenPurityScore) { this.pollenPurityScore = pollenPurityScore; }
    public Boolean getNmrSpectroscopyPassed() { return nmrSpectroscopyPassed; }
    public void setNmrSpectroscopyPassed(Boolean nmrSpectroscopyPassed) { this.nmrSpectroscopyPassed = nmrSpectroscopyPassed; }
    public Boolean getC4SugarAdulterationDetected() { return c4SugarAdulterationDetected; }
    public void setC4SugarAdulterationDetected(Boolean c4SugarAdulterationDetected) { this.c4SugarAdulterationDetected = c4SugarAdulterationDetected; }
    public String getOverallVerdict() { return overallVerdict; }
    public void setOverallVerdict(String overallVerdict) { this.overallVerdict = overallVerdict; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getCertifiedAt() { return certifiedAt; }
    public void setCertifiedAt(LocalDateTime certifiedAt) { this.certifiedAt = certifiedAt; }
}
