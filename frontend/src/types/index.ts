export type UserRole = 'ADMIN_KVIC' | 'BEEKEEPER' | 'PROCESSOR' | 'QUALITY_LAB' | 'DISTRIBUTOR';

export interface User {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  phone?: string;
  role?: string;
  roles: string[];
  primaryRole: string;
  organization?: string;
  kvicRegistrationNumber?: string;
  assignedClusterName?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface ProvenanceEvent {
  stage: string;
  title: string;
  actor: string;
  location: string;
  timestamp: string;
  details: string;
  completed: boolean;
}

export interface QualitySummary {
  certificateNumber: string;
  laboratoryName: string;
  moisturePercentage: number;
  pollenPurityScore: number;
  nmrSpectroscopyPassed: boolean;
  c4SugarAdulterationDetected: boolean;
  verdict: string;
  certifiedAt: string;
}

export interface BatchVerificationData {
  batchNumber: string;
  verificationStatus: string;
  status: string;
  harvestDate: string;
  floralSource: string;
  totalQuantityKg: number;
  isTampered?: boolean;
  integrityReason?: string;
  blockchainTxHash?: string;
  blockchainVerified?: boolean;
  stateMerkleRoot?: string;
  blockNumber?: number;
  networkName?: string;
  qrCodeUrl?: string;
  clusterCode: string;
  clusterName: string;
  region: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  qualitySummary?: QualitySummary;
  timeline: ProvenanceEvent[];
}

export interface CreateBatchRequest {
  hiveId: number | string;
  quantityKg: number;
  floralSource: string;
  harvestDate: string;
  moistureContentPercentage?: number;
  notes?: string;
}

export interface BatchResponse {
  id?: number | string;
  _id?: string;
  batchNumber: string;
  clusterCode: string;
  clusterName: string;
  floralSource: string;
  harvestDate: string;
  totalQuantityKg: number;
  status: string;
  hive?: any;
  hiveCode?: string;
  blockchainTxHash?: string;
  onChainHash?: string;
  stateMerkleRoot?: string;
  blockNumber?: number;
  isTampered?: boolean;
  qrCodeUrl?: string;
  createdAt: string;
}

export interface ClusterDto {
  id: number | string;
  _id?: string;
  clusterCode: string;
  name: string;
  region: string;
  state: string;
  district: string;
  predominantFlora: string;
  latitude: number;
  longitude: number;
  hiveCount?: number;
  beekeeperCount?: number;
  totalHives?: number;
  annualProductionKg?: number;
  active?: boolean;
}

export interface BeekeeperDto {
  id: number | string;
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  kvicRegistrationNumber: string;
  cooperativeName: string;
  state: string;
  district: string;
  clusterName: string;
  clusterCode?: string;
  hiveCount: number;
  assignedHiveCount?: number;
  hives?: any[];
  user?: any;
  cluster?: any;
}

export interface HiveDto {
  id: number | string;
  _id?: string;
  hiveCode: string;
  clusterCode: string;
  clusterName: string;
  beekeeperName: string;
  status: 'ACTIVE' | 'DORMANT' | 'QUARANTINED' | 'INSPECTION_REQUIRED' | 'WARNING' | 'CRITICAL';
  beeSpecies: string;
  installationDate: string;
  hiveType?: string;
  locationName?: string;
  sensorId?: string;
  hasSensor?: boolean;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface AuditLogDto {
  id: number;
  action: string;
  entityName: string;
  entityId: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface AdminOverview {
  totalUsers: number;
  totalBeekeepers: number;
  totalClusters: number;
  totalHives: number;
  totalHoneyBatches: number;
  totalVerifiedBatches: number;
  clusters: ClusterDto[];
  recentBeekeepers: BeekeeperDto[];
  recentAuditLogs: AuditLogDto[];
}

export interface BeekeeperDashboard {
  beekeeperId: number;
  fullName: string;
  kvicRegistrationNumber: string;
  cooperativeName: string;
  state: string;
  district: string;
  clusterName: string;
  clusterCode: string;
  predominantFlora: string;
  assignedHiveCount: number;
  activeHiveCount: number;
  hives: HiveDto[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface HistoricalPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  weight: number;
  frequency: number;
}

export interface HiveTelemetryResponse {
  hiveId: number;
  hiveCode: string;
  sensorIdentifier: string;
  sensorStatus: 'ONLINE' | 'OFFLINE';
  currentTemperature: number;
  currentHumidity: number;
  currentWeight: number;
  currentAcousticFreq: number;
  lastSeen: string;
  dataSourceLabel: string; // "DEMO / SIMULATED SENSOR DATA"
  history: HistoricalPoint[];
}

export interface HiveAlert {
  id: number | string;
  _id?: string;
  hive?: any;
  hiveCode?: string;
  beekeeper?: any;
  alertType?: string;
  title?: string;
  metric?: string;
  observedValue?: number;
  valueRecorded?: number;
  currentValue?: string;
  expectedRange?: string;
  reason?: string;
  message?: string;
  recommendedAction?: string;
  remedy?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  status: 'UNREAD' | 'READ' | 'RESOLVED' | string;
  createdAt: string;
  resolvedAt?: string;
}

export interface HiveHealthAiResponse {
  hiveId: number;
  healthScore: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  swarmingRiskProbability: number;
  queenLossProbability: number;
  contributingFactors: string[];
  recommendation: string;
  modelVersion: string;
  disclaimer: string;
}

export interface ProductivityAiResponse {
  hiveId: number;
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  predictedProductionKg?: number;
  expectedRangeMinKg?: number;
  expectedRangeMaxKg?: number;
  confidenceScore?: number;
  confidenceIndicator: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';
  contributingFactors: string[];
  message: string;
  disclaimer: string;
}

export interface DiseaseRiskAiResponse {
  hiveId: number;
  riskCategory: string;
  riskSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  pathogenOrPestName: string;
  detectionProbability: number;
  contributingFactors: string[];
  recommendedAction: string;
  label: string;
  disclaimer: string;
}

export interface YieldForecastFactor {
  status: 'positive' | 'warning' | 'neutral';
  factor: string;
}

export interface YieldForecastDto {
  hiveId?: number | string;
  hiveCode?: string;
  estimatedYieldKg: string;
  estimatedYieldMinKg: number;
  estimatedYieldMaxKg: number;
  expectedReadyDays: string;
  expectedReadyDaysMin: number;
  expectedReadyDaysMax: number;
  expectedHarvestWindow: string;
  forecastConfidence: 'High' | 'Medium' | 'Low' | string;
  currentHiveWeightKg: number;
  weightTrendKgPerDay: number;
  hiveHealthStatus: string;
  diseaseRiskLevel: string;
  readinessSummary: string;
  whyForecastSummary: string;
  contributingFactors: YieldForecastFactor[];
  isDemoSimulation: boolean;
}

export interface HiveAiInsightsSummary {
  hiveId: number | string;
  hiveCode: string;
  health?: HiveHealthAiResponse;
  healthScore?: number;
  colonyStatus?: string;
  swarmingProbability?: number;
  queenLossRisk?: number;
  productivity?: ProductivityAiResponse;
  predictedYieldKg?: number;
  confidenceIntervalKg?: [number, number];
  harvestReadiness?: string;
  projectedHarvestDate?: string;
  yieldForecast?: YieldForecastDto;
  diseaseRisk?: DiseaseRiskAiResponse;
  disclaimer?: string;
  generatedAt?: string;
  inferredAt?: string;
}

export interface ClusterProductionRanking {
  clusterId: number;
  clusterCode: string;
  clusterName: string;
  state: string;
  productionKg: number;
  batchCount: number;
  beekeeperCount: number;
  hiveCount: number;
}

export interface FloralDistribution {
  floralSource: string;
  volumeKg: number;
  percentage: number;
}

export interface AdminAnalyticsSummary {
  totalProductionKg: number;
  totalBatchesCount: number;
  certifiedBatchesCount: number;
  totalBeekeepersCount: number;
  totalClustersCount: number;
  totalHivesCount: number;
  activeHivesCount: number;
  warningHivesCount: number;
  criticalHivesCount: number;
  blockchainVerificationsCount: number;
  authenticityRatePercentage: number;
  clusterRankings: ClusterProductionRanking[];
  floralDistributions: FloralDistribution[];
  disclaimer: string;
}

export interface ClusterDrilldownResponse {
  cluster: ClusterDto;
  beekeepers: BeekeeperDto[];
  hives: HiveDto[];
  batches: BatchResponse[];
  totalYieldKg: number;
  activeAlertsCount: number;
}

export interface BlockchainStatsResponse {
  networkName: string;
  contractAddress: string;
  programId?: string;
  latestBlockNumber: number;
  totalBatchesOnChain: number;
  nodeStatus: string;
  rpcUrl: string;
}

export interface BlockchainProofData {
  batchNumber: string;
  clusterCode: string;
  clusterName: string;
  totalQuantityKg: number;
  floralSource: string;
  harvestDate: string;
  canonicalData: {
    batchNumber: string;
    clusterCode: string;
    quantityKg: string;
    floralSource: string;
    harvestDate: string;
    canonicalString: string;
  };
  computedSha256Hash: string;
  onChainHash: string | null;
  hashMatches: boolean;
  verificationStatus: string;
  blockchainVerified: boolean;
  blockchainNetwork: string;
  anchorProgramId: string;
  pdaAddress: string | null;
  pdaExplorerUrl: string | null;
  transactionSignature: string | null;
  transactionStatus: string;
  blockSlot: number;
  explorerUrl: string | null;
  reason: string;
  registeredAt: string;
}

export interface VisionBoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  normalized_x1?: number;
  normalized_y1?: number;
  normalized_x2?: number;
  normalized_y2?: number;
}

export interface VisionDetection {
  class_name: string;
  display_name: string;
  indicator: string;
  category: string;
  is_pathology: boolean;
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  urgency: string;
  bbox: VisionBoundingBox;
  recommendation: string;
}

export interface VisionClassSummary {
  class_name: string;
  display_name: string;
  category: string;
  is_pathology: boolean;
  detected: boolean;
  count: number;
  max_confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  recommendation: string;
}

export interface VisionUrgentAction {
  condition: string;
  risk: string;
  confidence: number;
  action: string;
}

export interface VisionDiagnosisData {
  hive_code?: string;
  image_name: string;
  image_dimensions?: {
    width: number;
    height: number;
  };
  total_detections: number;
  overall_hive_health_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  model_name: string;
  confidence_score: number;
  primary_condition: string;
  primary_symptoms: string;
  recommended_action: string;
  urgent_actions: VisionUrgentAction[];
  detections: VisionDetection[];
  summary: Record<string, VisionClassSummary>;
  annotated_image_base64?: string;
  is_real_cv_model?: boolean;
  disclaimer: string;
}

