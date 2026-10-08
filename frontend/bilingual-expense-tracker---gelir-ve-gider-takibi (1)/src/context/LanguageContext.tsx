import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, Translations } from '../i18n/translations';
import { CategoryResponseDto, ApiResponse } from '../types/api';

export type Currency = 'TRY' | 'USD' | 'EUR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
  formatDateTime: (dateStr: string) => string;
  getCategoryName: (cat?: CategoryResponseDto | null) => string;
  getCategoryDescription: (cat?: CategoryResponseDto | null) => string;
  getApiErrorMessage: (error: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('expense_tracker_lang');
    if (saved === 'tr' || saved === 'en') return saved;
    // Default to Turkish as requested or browser language
    return 'tr';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('expense_tracker_curr');
    if (saved === 'TRY' || saved === 'USD' || saved === 'EUR') return saved;
    return 'TRY';
  });

  useEffect(() => {
    localStorage.setItem('expense_tracker_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('expense_tracker_curr', currency);
  }, [currency]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations['en'][key] || String(key);
  };

  const formatCurrency = (amount: number): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    const abs = Math.abs(amount);
    const formatted = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(abs);

    const sign = amount < 0 ? '-' : '';
    return currency === 'TRY' ? `${sign}${formatted} ${symbol}` : `${sign}${symbol}${formatted}`;
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const getCategoryName = (cat?: CategoryResponseDto | null): string => {
    if (!cat) return language === 'tr' ? 'Genel' : 'General';
    if (language === 'tr') {
      return cat.nameTr || cat.nameEn || 'Kategori';
    } else {
      return cat.nameEn || cat.nameTr || 'Category';
    }
  };

  const getCategoryDescription = (cat?: CategoryResponseDto | null): string => {
    if (!cat) return '';
    if (language === 'tr') {
      return cat.descriptionTr || cat.descriptionEn || '';
    } else {
      return cat.descriptionEn || cat.descriptionTr || '';
    }
  };

  const getApiErrorMessage = (error: any): string => {
    if (!error) return t('errorGeneral');

    // Check backend error code
    const errCode = error.errorCode || error.code;
    if (errCode === 'BAD_CREDENTIALS') return t('errorBadCredentials');
    if (errCode === 'INVALID_VERIFICATION_CODE') return t('errorInvalidCode');
    if (errCode === 'EMAIL_ALREADY_EXISTS') return t('errorEmailExists');
    if (errCode === 'USERNAME_ALREADY_EXISTS') return t('errorUsernameExists');
    if (errCode === 'PASSWORDS_NOT_MATCH') return t('errorPasswordsDoNotMatch');
    if (errCode === 'NOT_CONFIRMED_ACCOUNT') return t('errorAccountNotConfirmed');
    if (errCode === 'UNAUTHORIZED') return t('errorUnauthorized');

    // Check message field
    if (typeof error === 'string') return error;

    if (language === 'tr') {
      if (error.messageTr) return error.messageTr;
      if (error.message?.tr) return error.message.tr;
    }

    if (error.messageEn) return error.messageEn;
    if (error.message?.en) return error.message.en;
    if (typeof error.message === 'string') return error.message;

    return t('errorGeneral');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatCurrency,
        formatDate,
        formatDateTime,
        getCategoryName,
        getCategoryDescription,
        getApiErrorMessage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
