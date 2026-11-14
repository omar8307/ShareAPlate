import type {
  User,
  Donation,
  NgoRequirement,
  VolunteerTask,
  PlatformNotification,
  ImpactStats,
  SmartMatchResult,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('shareaplate_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async getDemoUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    return res.json();
  },

  async login(email: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: Partial<User>): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Donations
  async getDonations(params?: {
    category?: string;
    status?: string;
    search?: string;
    donorId?: string;
    claimedByNgoId?: string;
  }): Promise<Donation[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.donorId) query.append('donorId', params.donorId);
    if (params?.claimedByNgoId) query.append('claimedByNgoId', params.claimedByNgoId);

    const res = await fetch(`${API_BASE}/donations?${query.toString()}`);
    return res.json();
  },

  async getDonationById(id: string): Promise<Donation> {
    const res = await fetch(`${API_BASE}/donations/${id}`);
    if (!res.ok) throw new Error('Donation not found');
    return res.json();
  },

  async createDonation(data: Partial<Donation>): Promise<Donation> {
    const res = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create donation');
    }
    return res.json();
  },

  async claimDonation(id: string, ngoId: string, ngoName: string): Promise<{ donation: Donation; task: VolunteerTask }> {
    const res = await fetch(`${API_BASE}/donations/${id}/claim`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ngoId, ngoName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to claim donation');
    }
    return res.json();
  },

  async verifyPickup(id: string, tokenOrOtp: string, actorName: string, actorRole: string): Promise<any> {
    const res = await fetch(`${API_BASE}/donations/${id}/verify-pickup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tokenOrOtp, actorName, actorRole }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Verification failed');
    }
    return res.json();
  },

  async verifyDelivery(id: string, tokenOrOtp: string, ngoName: string): Promise<any> {
    const res = await fetch(`${API_BASE}/donations/${id}/verify-delivery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tokenOrOtp, ngoName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Delivery verification failed');
    }
    return res.json();
  },

  async getDonationQr(id: string): Promise<{ dataUrl: string; token: string; otp: string }> {
    const res = await fetch(`${API_BASE}/donations/${id}/qr`);
    if (!res.ok) throw new Error('Failed to load QR code');
    return res.json();
  },

  async cancelDonation(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/donations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Requirements
  async getRequirements(): Promise<NgoRequirement[]> {
    const res = await fetch(`${API_BASE}/requirements`);
    return res.json();
  },

  async createRequirement(data: Partial<NgoRequirement>): Promise<NgoRequirement> {
    const res = await fetch(`${API_BASE}/requirements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteRequirement(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/requirements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Volunteer
  async getVolunteerTasks(params?: { volunteerId?: string; status?: string }): Promise<VolunteerTask[]> {
    const query = new URLSearchParams();
    if (params?.volunteerId) query.append('volunteerId', params.volunteerId);
    if (params?.status) query.append('status', params.status);
    const res = await fetch(`${API_BASE}/volunteer/tasks?${query.toString()}`);
    return res.json();
  },

  async acceptVolunteerTask(taskId: string, volunteerId: string, volunteerName: string): Promise<VolunteerTask> {
    const res = await fetch(`${API_BASE}/volunteer/tasks/${taskId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ volunteerId, volunteerName }),
    });
    return res.json();
  },

  // Smart Matching
  async getSmartMatches(donationId: string): Promise<SmartMatchResult[]> {
    const res = await fetch(`${API_BASE}/matching/recommend-ngos/${donationId}`);
    return res.json();
  },

  async notifyMatchedNgos(donationId: string, ngoIds: string[]): Promise<any> {
    const res = await fetch(`${API_BASE}/matching/notify-ngos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ donationId, ngoIds }),
    });
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<{ stats: ImpactStats; monthlyTrends: any[]; categoryBreakdown: any[] }> {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    return res.json();
  },

  async getLeaderboard(): Promise<{ donors: any[]; ngos: any[]; volunteers: any[] }> {
    const res = await fetch(`${API_BASE}/analytics/leaderboard`);
    return res.json();
  },

  // Notifications
  async getNotifications(userId?: string): Promise<PlatformNotification[]> {
    const url = userId ? `${API_BASE}/notifications?userId=${userId}` : `${API_BASE}/notifications`;
    const res = await fetch(url);
    return res.json();
  },

  async markNotificationAsRead(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
    });
    return res.json();
  },

  // AI Endpoints
  async checkFoodSafety(params: {
    foodName: string;
    category: string;
    preparationTime?: string;
    storageConditions?: string;
  }): Promise<{
    isEligible: boolean;
    safeWindowHours: number;
    handlingChecklist: string[];
    allergenPrompts: string[];
    advisoryNote: string;
  }> {
    const res = await fetch(`${API_BASE}/ai/food-safety`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async generateDescription(params: {
    foodName: string;
    category: string;
    quantity: number;
    unit: string;
    briefNotes?: string;
    isVegetarian?: boolean;
  }): Promise<{ description: string }> {
    const res = await fetch(`${API_BASE}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async predictFoodWaste(params: {
    donorType?: string;
    dayOfWeek?: string;
    typicalSurplusCategory?: string;
  }): Promise<{
    predictedSurplusMeals: number;
    likelySurplusTime: string;
    highRiskCategories: string[];
    suggestedAction: string;
    preventionRecommendations: string[];
  }> {
    const res = await fetch(`${API_BASE}/ai/waste-prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Admin
  async getPendingNgos(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/ngos/pending`);
    return res.json();
  },

  async verifyNgo(ngoId: string, action: 'approve' | 'reject'): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/ngos/${ngoId}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action }),
    });
    return res.json();
  },
};
