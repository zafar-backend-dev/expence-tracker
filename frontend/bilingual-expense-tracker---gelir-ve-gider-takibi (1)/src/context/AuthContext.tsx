import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserInfo,
  SignUpRequest,
  SignUpVerifyRequest,
  LoginForm,
  SignInVerifyRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
} from '../types/api';
import {
  api,
  getAuthToken,
  setAuthToken,
  setRefreshToken,
} from '../services/api';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  checkConnection: () => Promise<boolean>;
  signInStep1: (form: LoginForm) => Promise<any>;
  signInStep2: (form: SignInVerifyRequest) => Promise<any>;
  signUpStep1: (form: SignUpRequest) => Promise<any>;
  signUpStep2: (form: SignUpVerifyRequest) => Promise<any>;
  forgotPassword: (form: ForgotPasswordRequest) => Promise<any>;
  resetPassword: (form: ResetPasswordRequest) => Promise<any>;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => getAuthToken());
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Clean up any old demo mode flags from previous sessions
  useEffect(() => {
    localStorage.removeItem('expense_tracker_demo_mode');
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setConnectionStatus('connecting');
    const isOnline = await api.ping();
    setConnectionStatus(isOnline ? 'connected' : 'disconnected');
    return isOnline;
  }, []);

  const refreshUserInfo = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      return;
    }

    try {
      const res = await api.getUserInfo();
      if (res && res.data) {
        setUser(res.data);
      } else if (res && (res as any).username) {
        setUser(res as any);
      }
    } catch (err: any) {
      console.warn('Could not fetch user info', err);
      if (err?.status === 401 || err?.status === 403) {
        // Token expired
        setAuthToken(null);
        setRefreshToken(null);
        setTokenState(null);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkConnection();
      if (token) {
        await refreshUserInfo();
      }
      setLoading(false);
    };
    init();
  }, [token, refreshUserInfo, checkConnection]);

  const signInStep1 = async (form: LoginForm) => {
    return api.signIn(form);
  };

  const signInStep2 = async (form: SignInVerifyRequest) => {
    const res = await api.verifySignIn(form);
    const tokenData = res.data;
    if (tokenData && tokenData.accessToken) {
      setAuthToken(tokenData.accessToken);
      setRefreshToken(tokenData.refreshToken || null);
      setTokenState(tokenData.accessToken);
      await refreshUserInfo();
    }
    return res;
  };

  const signUpStep1 = async (form: SignUpRequest) => {
    return api.signUp(form);
  };

  const signUpStep2 = async (form: SignUpVerifyRequest) => {
    return api.verifySignUp(form);
  };

  const forgotPassword = async (form: ForgotPasswordRequest) => {
    return api.forgotPassword(form);
  };

  const resetPassword = async (form: ResetPasswordRequest) => {
    return api.resetPassword(form);
  };

  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setTokenState(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        connectionStatus,
        checkConnection,
        signInStep1,
        signInStep2,
        signUpStep1,
        signUpStep2,
        forgotPassword,
        resetPassword,
        logout,
        refreshUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
