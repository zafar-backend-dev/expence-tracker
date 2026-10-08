import {
  SignUpRequest,
  SignUpVerifyRequest,
  LoginForm,
  SignInVerifyRequest,
  TokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserInfo,
  CategoryResponseDto,
  TransactionResponseDto,
  EditOrAddTransactionRequestDto,
  ApiResponse,
} from '../types/api';

const DEFAULT_SERVER_URL = '/api'; // Proxied via Vite to trycloudflare
const CLOUDFLARE_ORIGIN = 'https://voices-toys-enquiries-inns.trycloudflare.com';

export const getApiBaseUrl = (): string => {
  const custom = localStorage.getItem('expense_tracker_api_url');
  if (custom && custom.trim() !== '') {
    return custom.trim().replace(/\/+$/, '');
  }
  return DEFAULT_SERVER_URL;
};

export const setApiBaseUrl = (url: string) => {
  if (!url || url.trim() === '' || url.trim() === DEFAULT_SERVER_URL) {
    localStorage.removeItem('expense_tracker_api_url');
  } else {
    localStorage.setItem('expense_tracker_api_url', url.trim());
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('expense_tracker_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('expense_tracker_token', token);
  } else {
    localStorage.removeItem('expense_tracker_token');
  }
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('expense_tracker_refresh_token');
};

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('expense_tracker_refresh_token', token);
  } else {
    localStorage.removeItem('expense_tracker_refresh_token');
  }
};

// Categories seed for initial selection if backend table is empty
export const SEED_CATEGORIES: CategoryResponseDto[] = [
  {
    pkey: 'cat-001',
    nameEn: 'Salary & Wages',
    nameTr: 'Maaş ve Ücret',
    descriptionEn: 'Monthly salary and direct employment earnings',
    descriptionTr: 'Aylık maaş ve düzenli istihdam gelirleri',
    active: true,
    orderIndex: 1,
  },
  {
    pkey: 'cat-002',
    nameEn: 'Freelance & Side Gig',
    nameTr: 'Ek Gelir ve Serbest Meslek',
    descriptionEn: 'Consulting, side projects and extra income',
    descriptionTr: 'Danışmanlık, serbest projeler ve ek kazançlar',
    active: true,
    orderIndex: 2,
  },
  {
    pkey: 'cat-003',
    nameEn: 'Investment & Dividends',
    nameTr: 'Yatırım ve Temettü',
    descriptionEn: 'Stock gains, crypto, interest and dividends',
    descriptionTr: 'Borsa kârları, kripto, faiz ve temettü gelirleri',
    active: true,
    orderIndex: 3,
  },
  {
    pkey: 'cat-004',
    nameEn: 'Food & Groceries',
    nameTr: 'Gıda ve Market',
    descriptionEn: 'Supermarket, groceries and dining out',
    descriptionTr: 'Süpermarket, bakkal ve restoran harcamaları',
    active: true,
    orderIndex: 4,
  },
  {
    pkey: 'cat-005',
    nameEn: 'Housing & Rent',
    nameTr: 'Kira ve Konut',
    descriptionEn: 'Monthly rent, home maintenance and property fees',
    descriptionTr: 'Aylık ev kirası, aidat ve ev bakım giderleri',
    active: true,
    orderIndex: 5,
  },
  {
    pkey: 'cat-006',
    nameEn: 'Transportation',
    nameTr: 'Ulaşım ve Akaryakıt',
    descriptionEn: 'Fuel, public transit, car maintenance, taxi',
    descriptionTr: 'Benzin, toplu taşıma, araç servisi ve taksi',
    active: true,
    orderIndex: 6,
  },
  {
    pkey: 'cat-007',
    nameEn: 'Bills & Utilities',
    nameTr: 'Faturalar ve Abonelikler',
    descriptionEn: 'Electricity, water, gas, internet, mobile phone',
    descriptionTr: 'Elektrik, su, doğalgaz, internet ve telefon faturaları',
    active: true,
    orderIndex: 7,
  },
  {
    pkey: 'cat-008',
    nameEn: 'Shopping & Fashion',
    nameTr: 'Alışveriş ve Giyim',
    descriptionEn: 'Clothing, electronics, household items',
    descriptionTr: 'Kıyafet, elektronik ve ev eşyası harcamaları',
    active: true,
    orderIndex: 8,
  },
  {
    pkey: 'cat-009',
    nameEn: 'Health & Pharmacy',
    nameTr: 'Sağlık ve Eczane',
    descriptionEn: 'Doctor visits, medicines, gym and wellness',
    descriptionTr: 'Doktor muayenesi, ilaçlar ve spor salonu',
    active: true,
    orderIndex: 9,
  },
  {
    pkey: 'cat-010',
    nameEn: 'Entertainment & Leisure',
    nameTr: 'Eğlence ve Sosyal Yaşam',
    descriptionEn: 'Movies, concerts, streaming services, hobbies',
    descriptionTr: 'Sinema, konserler, abonelikler ve hobiler',
    active: true,
    orderIndex: 10,
  },
];

async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const url = path.startsWith('http')
    ? path
    : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { text };
    }
  }

  if (!response.ok) {
    const errorObj = {
      status: response.status,
      statusText: response.statusText,
      ...(data && typeof data === 'object' ? data : { message: data || 'Request failed' }),
    };
    throw errorObj;
  }

  return data as T;
}

export const api = {
  // Test server connectivity
  async ping(): Promise<boolean> {
    try {
      // Try fetching categories or user-info
      const res = await fetch(`${getApiBaseUrl()}/category/list`, {
        method: 'GET',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        signal: AbortSignal.timeout(4000),
      });
      return res.status < 500;
    } catch {
      return false;
    }
  },

  // Auth Endpoints
  async signUp(body: SignUpRequest): Promise<ApiResponse> {
    return apiRequest('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async verifySignUp(body: SignUpVerifyRequest): Promise<ApiResponse> {
    return apiRequest('/auth/sign-up/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async signIn(body: LoginForm): Promise<ApiResponse> {
    return apiRequest('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async verifySignIn(body: SignInVerifyRequest): Promise<ApiResponse<TokenResponse>> {
    return apiRequest('/auth/sign-in/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async forgotPassword(body: ForgotPasswordRequest): Promise<ApiResponse> {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async resetPassword(body: ResetPasswordRequest): Promise<ApiResponse> {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return apiRequest('/auth/user-info', {
      method: 'GET',
    });
  },

  // Category Endpoints
  async getCategories(): Promise<CategoryResponseDto[]> {
    try {
      const res = await apiRequest<any>('/category/list', {
        method: 'GET',
      });
      // Spec says: ApiResponseObject with data: object or list
      if (res && res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.items)) return res.data.items;
      }
      if (Array.isArray(res)) return res;
      return SEED_CATEGORIES;
    } catch (err) {
      console.warn('Backend categories fetch failed, using fallback seed categories', err);
      return SEED_CATEGORIES;
    }
  },

  async searchCategories(keyword: string): Promise<CategoryResponseDto[]> {
    try {
      const res = await apiRequest<any>(`/category/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
      });
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return SEED_CATEGORIES.filter(c =>
        c.nameEn.toLowerCase().includes(keyword.toLowerCase()) ||
        c.nameTr.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch {
      return SEED_CATEGORIES.filter(c =>
        c.nameEn.toLowerCase().includes(keyword.toLowerCase()) ||
        c.nameTr.toLowerCase().includes(keyword.toLowerCase())
      );
    }
  },

  // Transaction Endpoints
  async getTransactions(): Promise<TransactionResponseDto[]> {
    const res = await apiRequest<any>('/transaction/list', {
      method: 'GET',
    });
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
    if (Array.isArray(res)) return res;
    return [];
  },

  async getTransactionById(id: string): Promise<TransactionResponseDto> {
    const res = await apiRequest<any>(`/transaction/${id}`, {
      method: 'GET',
    });
    return res.data || res;
  },

  async addTransaction(body: EditOrAddTransactionRequestDto): Promise<TransactionResponseDto> {
    const res = await apiRequest<any>('/transaction/add', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data || res;
  },

  async editTransaction(id: string, body: EditOrAddTransactionRequestDto): Promise<TransactionResponseDto> {
    const res = await apiRequest<any>(`/transaction/${id}/edit`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.data || res;
  },

  async deleteTransaction(id: string): Promise<void> {
    await apiRequest<any>(`/transaction/${id}/delete`, {
      method: 'DELETE',
    });
  },
};
