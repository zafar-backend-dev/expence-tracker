export type Role = 'USER' | 'ADMIN';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface CategoryResponseDto {
  pkey: string;
  nameEn: string;
  nameTr: string;
  descriptionEn?: string;
  descriptionTr?: string;
  active: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionResponseDto {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  transactionDate: string;
  userid?: string;
  categoryId: string;
  category?: CategoryResponseDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditOrAddTransactionRequestDto {
  amount: number;
  description: string;
  type: TransactionType;
  transactionDate: string;
  categoryId: string;
}

export interface SignUpRequest {
  fullName: string;
  birthdate: string; // YYYY-MM-DD
  role: Role;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpVerifyRequest {
  email: string;
  code: string;
}

export interface LoginForm {
  login: string;
  password: string;
}

export interface SignInVerifyRequest {
  login: string;
  code: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserInfo {
  id?: string;
  fullName: string;
  username: string;
  email: string;
  role: Role;
  birthdate?: string;
  createdAt?: string;
}

export interface ApiMessage {
  tr?: string;
  en?: string;
  uz?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  errorCode?: string;
  messageUz?: string;
  messageTr?: string;
  message?: ApiMessage | string;
  data?: T;
}
