import {
  ApiResponse,
  AuthResponse,
  BatchVerificationData,
  AdminOverview,
  BeekeeperDto,
  ClusterDto,
  HiveDto,
  AuditLogDto,
  BeekeeperDashboard,
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('beeproof_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
        data = { success: false, message: text };
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Network error connecting to BeeProof API');
    }
  }

  // Public Endpoints
  async getHealth() {
    return this.request<any>('/health');
  }

  async verifyBatch(batchNumber: string) {
    return this.request<BatchVerificationData>(`/verify/batch/${encodeURIComponent(batchNumber)}`);
  }

  async downloadVerificationPdf(batchNumber: string): Promise<void> {
    const cleanNumber = batchNumber.trim().toUpperCase();
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/verify/batch/${encodeURIComponent(cleanNumber)}/pdf`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errText = 'Failed to download verification PDF report.';
      try {
        const json = await response.json();
        if (json && json.message) errText = json.message;
      } catch (e) {
        // ignore
      }
      throw new Error(errText);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BeeProof_Verification_${cleanNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async getBlockchainProof(batchNumber: string) {
    try {
      return await this.request<import('../types').BlockchainProofData>(`/admin/blockchain-proof/${encodeURIComponent(batchNumber)}`);
    } catch (err: any) {
      // Fallback for public demo view if admin endpoint unreachable
      return await this.request<import('../types').BlockchainProofData>(`/verify/blockchain-proof/${encodeURIComponent(batchNumber)}`);
    }
  }

  async simulateTamperDemo(batchNumber: string) {
    try {
      return await this.request<any>(`/admin/tamper-demo/${encodeURIComponent(batchNumber)}`, {
        method: 'POST',
      });
    } catch (err) {
      return await this.request<any>(`/verify/tamper-demo/${encodeURIComponent(batchNumber)}`, {
        method: 'POST',
      });
    }
  }

  async restoreTamperDemo(batchNumber: string) {
    try {
      return await this.request<any>(`/admin/restore-demo/${encodeURIComponent(batchNumber)}`, {
        method: 'POST',
      });
    } catch (err) {
      return await this.request<any>(`/verify/restore-demo/${encodeURIComponent(batchNumber)}`, {
        method: 'POST',
      });
    }
  }

  async getBatchQr(batchNumber: string, origin?: string) {
    const query = origin ? `?origin=${encodeURIComponent(origin)}` : '';
    return this.request<{ url: string; dataUrl: string; batchNumber: string }>(`/verify/batch/${encodeURIComponent(batchNumber)}/qr${query}`);
  }

  // Authentication
  async login(credentials: { username: string; password: string }) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  // Admin / KVIC Endpoints
  async getAdminOverview() {
    return this.request<AdminOverview>('/admin/overview');
  }

  async getAdminBeekeepers() {
    return this.request<BeekeeperDto[]>('/admin/beekeepers');
  }

  async getAdminClusters() {
    return this.request<ClusterDto[]>('/admin/clusters');
  }

  async getAdminHives() {
    return this.request<HiveDto[]>('/admin/hives');
  }

  async getAdminAuditLogs() {
    return this.request<AuditLogDto[]>('/admin/audit-logs');
  }

  // Beekeeper Endpoints
  async getBeekeeperDashboard() {
    return this.request<BeekeeperDashboard>('/beekeeper/dashboard');
  }

  async getBeekeeperHives() {
    return this.request<HiveDto[]>('/beekeeper/hives');
  }

  async registerHive(data: {
    hiveCode: string;
    hiveLocation?: string;
    beeSpecies?: string;
    installationDate?: string;
    hiveType?: string;
    sensorId?: string;
    notes?: string;
  }) {
    return this.request<any>('/beekeeper/hives', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createBatch(data: import('../types').CreateBatchRequest) {
    return this.request<import('../types').BatchResponse>('/beekeeper/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBeekeeperBatches() {
    return this.request<import('../types').BatchResponse[]>('/beekeeper/batches');
  }

  // Supply Chain Role Endpoints
  async getProcessorOverview() {
    return this.request<any>('/processor/overview');
  }

  async getProcessorBatches() {
    return this.request<any[]>('/processor/batches');
  }

  async processorCollectBatch(batchNumber: string, data: any = {}) {
    return this.request<any>(`/processor/batches/${encodeURIComponent(batchNumber)}/collect`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async processorProcessBatch(batchNumber: string, data: any) {
    return this.request<any>(`/processor/batches/${encodeURIComponent(batchNumber)}/process`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async processorPackageBatch(batchNumber: string, data: any) {
    return this.request<any>(`/processor/batches/${encodeURIComponent(batchNumber)}/package`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQualityLabOverview() {
    return this.request<any>('/quality-lab/overview');
  }

  async getQualityLabPendingBatches() {
    return this.request<any[]>('/quality-lab/batches/pending');
  }

  async qualityLabVerifyBatch(batchNumber: string, data: any) {
    return this.request<any>(`/quality-lab/batches/${encodeURIComponent(batchNumber)}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDistributorOverview() {
    return this.request<any>('/distributor/overview');
  }

  async getDistributorPackagedBatches() {
    return this.request<any[]>('/distributor/batches/packaged');
  }

  async distributorDispatchBatch(batchNumber: string, data: any) {
    return this.request<any>(`/distributor/batches/${encodeURIComponent(batchNumber)}/dispatch`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async distributorDeliverBatch(batchNumber: string, data: any) {
    return this.request<any>(`/distributor/batches/${encodeURIComponent(batchNumber)}/deliver`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBeekeeperAlerts() {
    return this.request<import('../types').HiveAlert[]>('/beekeeper/alerts');
  }

  async tamperBatch(batchNumber: string, data?: any) {
    return this.request<any>(`/admin/batches/${encodeURIComponent(batchNumber)}/tamper`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async restoreBatch(batchNumber: string) {
    return this.request<any>(`/admin/batches/${encodeURIComponent(batchNumber)}/restore`, {
      method: 'POST',
    });
  }

  // IoT Endpoints
  async getHiveTelemetry(hiveId: number | string) {
    return this.request<import('../types').HiveTelemetryResponse>(`/iot/hives/${hiveId}/telemetry`);
  }

  async getHiveAlerts(hiveId: number | string) {
    return this.request<import('../types').HiveAlert[]>(`/iot/hives/${hiveId}/alerts`);
  }

  async resolveAlert(alertId: number | string) {
    return this.request<import('../types').HiveAlert>(`/iot/alerts/${alertId}/resolve`, {
      method: 'PUT',
    });
  }

  async simulateCondition(hiveId: number | string, scenario: string) {
    return this.request<any>(`/iot/hives/${hiveId}/simulate?scenario=${scenario}`, {
      method: 'POST',
    });
  }

  async setSensorStatus(sensorIdentifier: string, active: boolean) {
    return this.request<any>(`/iot/sensors/${sensorIdentifier}/status?active=${active}`, {
      method: 'PUT',
    });
  }

  async getHiveAiInsights(hiveId: number | string) {
    return this.request<import('../types').HiveAiInsightsSummary>(`/ai/hives/${hiveId}/insights`);
  }

  async refreshHiveAiPredictions(hiveId: number | string) {
    return this.request<import('../types').HiveAiInsightsSummary>(`/ai/hives/${hiveId}/refresh-predictions`, {
      method: 'POST',
    });
  }

  async diagnoseHiveImage(hiveId: string, imageInput: File | string, filename?: string) {
    if (typeof imageInput === 'string') {
      return this.request<import('../types').VisionDiagnosisData>(`/ai/hives/${hiveId}/vision-diagnose`, {
        method: 'POST',
        body: JSON.stringify({
          imageBase64: imageInput,
          filename: filename || 'comb_photo.jpg',
          hiveCode: hiveId,
        }),
      });
    } else {
      const token = this.getToken();
      const formData = new FormData();
      formData.append('image', imageInput, filename || imageInput.name || 'comb_photo.jpg');
      formData.append('hiveCode', hiveId);

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/ai/hives/${hiveId}/vision-diagnose`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Vision diagnosis failed');
      }
      return data;
    }
  }


  async getAdminAnalyticsSummary() {
    return this.request<import('../types').AdminAnalyticsSummary>('/admin/analytics/summary');
  }

  async getAdminClusterDrilldown(clusterId: number | string) {
    return this.request<import('../types').ClusterDrilldownResponse>(`/admin/clusters/${clusterId}/drilldown`);
  }

  async getAdminAllBatches() {
    return this.request<import('../types').BatchResponse[]>('/admin/batches');
  }

  async getAdminAllAlerts() {
    return this.request<import('../types').HiveAlert[]>('/admin/alerts');
  }

  async getAdminBlockchainStats() {
    return this.request<import('../types').BlockchainStatsResponse>('/admin/blockchain/stats');
  }

  async downloadAuditLogsCsv(): Promise<string> {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8080/api/admin/export/audit-logs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.text();
  }
}

export const api = new ApiService();
