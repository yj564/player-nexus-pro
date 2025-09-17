// Mock API services for esports talent platform
// TODO: Replace with actual backend endpoints

interface User {
  id: string;
  username: string;
  email: string;
  region: string;
  primaryGames: string[];
  discordId?: string;
  steamId?: string;
  gameId?: string;
  role?: 'scout' | 'player';
}

interface Player {
  id: string;
  name: string;
  role: string;
  strengths: string[];
  lastThirtyDayForm: string;
  summary: string;
  game: string;
  region: string;
  experience: 'Amateur' | 'Semi-Pro' | 'Pro';
  availability: boolean;
  clutchPercentage?: number;
  entryStyle?: string;
  utilityUsage?: string;
}

interface Report {
  id: string;
  userId: string;
  overallRating: number;
  roleFit: string;
  strengths: string[];
  areasToImprove: string[];
  consistencyScore: number;
  recentForm: string;
  status: 'pending' | 'ready';
  createdAt: Date;
}

// Simulate async delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'ShadowStrike',
    role: 'Entry Fragger',
    strengths: ['Aggressive positioning', 'High first-kill rate', 'Map control'],
    lastThirtyDayForm: 'Excellent',
    summary: 'Consistent entry fragger with exceptional aim and game sense. Strong team communication in CS:GO.',
    game: 'CS:GO',
    region: 'Europe',
    experience: 'Semi-Pro',
    availability: true,
    clutchPercentage: 78,
    entryStyle: 'Aggressive'
  },
  {
    id: '2',
    name: 'UtilityMaster',
    role: 'Support',
    strengths: ['Smoke timing', 'Flash coordination', 'Team utility'],
    lastThirtyDayForm: 'Good',
    summary: 'Strategic support player with deep understanding of CS:GO utility usage and team coordination.',
    game: 'CS:GO',
    region: 'North America',
    experience: 'Pro',
    availability: false,
    utilityUsage: 'Expert'
  },
  {
    id: '3',
    name: 'ClutchKing',
    role: 'Rifler',
    strengths: ['Clutch situations', 'Positioning', 'Game sense'],
    lastThirtyDayForm: 'Outstanding',
    summary: 'Reliable rifler with exceptional clutch percentage and strategic thinking in CS:GO.',
    game: 'CS:GO',
    region: 'Asia',
    experience: 'Semi-Pro',
    availability: true,
    clutchPercentage: 85
  },
  {
    id: '4',
    name: 'AWPMaster',
    role: 'AWPer',
    strengths: ['Long range precision', 'Map awareness', 'Economic management'],
    lastThirtyDayForm: 'Excellent',
    summary: 'Elite AWPer with incredible precision and game-changing potential in clutch rounds.',
    game: 'CS:GO',
    region: 'Europe',
    experience: 'Pro',
    availability: true,
    clutchPercentage: 72,
    entryStyle: 'Passive'
  },
  {
    id: '5',
    name: 'IGL_Commander',
    role: 'In-Game Leader',
    strengths: ['Strategic calling', 'Team coordination', 'Anti-stratting'],
    lastThirtyDayForm: 'Good',
    summary: 'Experienced IGL with strong tactical knowledge and team leadership in competitive CS:GO.',
    game: 'CS:GO',
    region: 'North America',
    experience: 'Pro',
    availability: false,
    utilityUsage: 'Advanced'
  }
];

let currentUser: User | null = null;
let userReports: Record<string, Report> = {};

export const authService = {
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    region: string;
    primaryGames: string[];
    discordId?: string;
    steamId?: string;
    gameId?: string;
    agreeToTerms: boolean;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(800);
    
    if (userData.password !== userData.confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    
    if (!userData.agreeToTerms) {
      return { success: false, error: 'You must agree to the terms and privacy policy' };
    }

    const user: User = {
      id: `user_${Date.now()}`,
      username: userData.username,
      email: userData.email,
      region: userData.region,
      primaryGames: userData.primaryGames,
      discordId: userData.discordId,
      steamId: userData.steamId,
      gameId: userData.gameId,
    };

    currentUser = user;
    localStorage.setItem('esports_user', JSON.stringify(user));
    
    return { success: true, user };
  },

  async loginUser(credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(600);
    
    // Mock validation
    if (!credentials.email || !credentials.password) {
      return { success: false, error: 'Email and password are required' };
    }

    const user: User = {
      id: `user_${Date.now()}`,
      username: 'DemoUser',
      email: credentials.email,
      region: 'Global',
      primaryGames: ['CS:GO'],
    };

    currentUser = user;
    localStorage.setItem('esports_user', JSON.stringify(user));
    
    return { success: true, user };
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    return { 
      success: true, 
      message: `Password reset instructions sent to ${email}` 
    };
  },

  getCurrentUser(): User | null {
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem('esports_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    
    return null;
  },

  logout(): void {
    currentUser = null;
    localStorage.removeItem('esports_user');
  }
};

export const scoutService = {
  async searchPlayers(query: string, filters: {
    game?: string;
    region?: string;
    experience?: string;
    availability?: boolean;
  } = {}): Promise<{ success: boolean; players?: Player[]; error?: string }> {
    await delay(1200);
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      return { success: false, error: 'Search service temporarily unavailable' };
    }

    let results = [...mockPlayers];
    
    // Apply filters
    if (filters.game) {
      results = results.filter(p => p.game.toLowerCase().includes(filters.game!.toLowerCase()));
    }
    if (filters.region) {
      results = results.filter(p => p.region.toLowerCase().includes(filters.region!.toLowerCase()));
    }
    if (filters.experience) {
      results = results.filter(p => p.experience === filters.experience);
    }
    if (filters.availability !== undefined) {
      results = results.filter(p => p.availability === filters.availability);
    }
    
    // Simple query matching
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.role.toLowerCase().includes(lowerQuery) ||
        p.strengths.some(s => s.toLowerCase().includes(lowerQuery)) ||
        p.summary.toLowerCase().includes(lowerQuery)
      );
    }

    return { success: true, players: results };
  },

  async savePlayer(playerId: string): Promise<{ success: boolean }> {
    await delay(300);
    // TODO: Implement save functionality
    return { success: true };
  },

  async requestContact(playerId: string, message: string): Promise<{ success: boolean }> {
    await delay(500);
    // TODO: Implement contact request
    return { success: true };
  }
};

export const playerService = {
  async authorizeGameData(providers: string[], consent: boolean): Promise<{ success: boolean; error?: string }> {
    await delay(1500);
    
    if (!consent) {
      return { success: false, error: 'Data access consent is required' };
    }

    // TODO: Implement actual OAuth flows
    return { success: true };
  },

  async getReportStatus(userId: string): Promise<{ status: 'pending' | 'ready'; eta?: string }> {
    await delay(400);
    
    const report = userReports[userId];
    if (!report) {
      return { status: 'pending', eta: '7 days' };
    }
    
    return { status: report.status };
  },

  async generateReport(userId: string): Promise<{ success: boolean }> {
    await delay(2000);
    
    const report: Report = {
      id: `report_${Date.now()}`,
      userId,
      overallRating: 8.5,
      roleFit: 'Entry Fragger',
      strengths: ['Aggressive positioning', 'High first-kill rate', 'Consistent aim'],
      areasToImprove: ['Utility usage', 'Communication timing'],
      consistencyScore: 87,
      recentForm: 'Improving',
      status: 'ready',
      createdAt: new Date()
    };
    
    userReports[userId] = report;
    return { success: true };
  },

  async getReport(userId: string): Promise<{ success: boolean; report?: Report }> {
    await delay(500);
    
    const report = userReports[userId];
    if (!report) {
      return { success: false };
    }
    
    return { success: true, report };
  },

  async saveSharingPreference(userId: string, allowSharing: boolean): Promise<{ success: boolean }> {
    await delay(300);
    // TODO: Store sharing preference
    localStorage.setItem(`sharing_${userId}`, allowSharing.toString());
    return { success: true };
  },

  async requestScoutConnection(userId: string, formData: {
    preferredRegions: string[];
    teamsOfInterest: string;
    availability: string;
    contactMethod: string;
  }): Promise<{ success: boolean }> {
    await delay(800);
    // TODO: Store talent flag and process connection request
    localStorage.setItem(`talent_flag_${userId}`, JSON.stringify(formData));
    return { success: true };
  }
};

export const emailService = {
  async sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean }> {
    await delay(500);
    console.log(`📧 Mock Email Sent:
To: ${to}
Subject: ${subject}
Body: ${body}`);
    return { success: true };
  }
};