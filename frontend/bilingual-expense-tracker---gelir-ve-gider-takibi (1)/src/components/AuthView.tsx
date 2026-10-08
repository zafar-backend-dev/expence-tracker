import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Globe,
  Coins,
  Server,
  Lock,
  Mail,
  User,
  KeyRound,
  Calendar,
  ShieldCheck,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

interface AuthViewProps {
  onOpenApiConfig: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onOpenApiConfig, onSuccessToast }) => {
  const { language, setLanguage, t, currency, setCurrency, getApiErrorMessage } = useLanguage();
  const {
    signInStep1,
    signInStep2,
    signUpStep1,
    signUpStep2,
    forgotPassword,
    resetPassword,
    connectionStatus,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  // Sign In inputs
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [signInCode, setSignInCode] = useState('');

  // Sign Up inputs
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('1998-05-15');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpCode, setSignUpCode] = useState('');

  // Forgot Password inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const resetFormState = () => {
    setError(null);
    setInfoMessage(null);
    setStep(1);
  };

  const handleSignInStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInStep1({ login: loginInput.trim(), password: passwordInput });
      setStep(2);
      setInfoMessage(
        language === 'tr'
          ? `Giriş güvenlik kodu ${loginInput} adresine iletildi. Lütfen kodu giriniz.`
          : `Security verification code sent to ${loginInput}. Please enter the code below.`
      );
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignInStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInStep2({ login: loginInput.trim(), code: signInCode.trim() });
      if (onSuccessToast) onSuccessToast(t('loginSuccess'));
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setError(t('errorPasswordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      await signUpStep1({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        birthdate,
        role,
        password: signUpPassword,
        confirmPassword: signUpConfirmPassword,
      });
      setStep(2);
      setInfoMessage(
        language === 'tr'
          ? `Hesabınız oluşturuldu! ${email} adresine gönderilen 6 haneli aktivasyon kodunu giriniz.`
          : `Account created! Enter the 6-digit activation code sent to ${email}.`
      );
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUpStep2({ email: email.trim(), code: signUpCode.trim() });
      setMode('signin');
      setStep(1);
      setLoginInput(email || username);
      setPasswordInput(signUpPassword);
      setInfoMessage(
        language === 'tr'
          ? 'Hesabınız onaylandı! Giriş yapabilirsiniz.'
          : 'Account verified successfully! You can now sign in.'
      );
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword({ email: forgotEmail.trim() });
      setStep(2);
      setInfoMessage(
        language === 'tr'
          ? `${forgotEmail} adresine şifre sıfırlama kodu gönderildi.`
          : `Password reset code sent to ${forgotEmail}.`
      );
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError(t('errorPasswordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: forgotEmail.trim(),
        code: resetCode.trim(),
        newPassword,
        confirmPassword: confirmNewPassword,
      });
      setMode('signin');
      setStep(1);
      setLoginInput(forgotEmail);
      setInfoMessage(t('resetPasswordSuccess'));
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d15] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar with Language, Currency & Server Status */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white block">
              {t('appName')}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              {t('appSubtitle')}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('tr')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                language === 'tr'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Türkçe"
            >
              <span>🇹🇷</span>
              <span>TR</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdown(!currencyDropdown)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-300 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {currencyDropdown && (
              <div
                className="absolute right-0 mt-1 w-28 bg-[#121927] border border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs"
                onClick={() => setCurrencyDropdown(false)}
              >
                <button
                  onClick={() => setCurrency('TRY')}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors ${
                    currency === 'TRY' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  ₺ TRY
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors ${
                    currency === 'USD' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors ${
                    currency === 'EUR' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  € EUR
                </button>
              </div>
            )}
          </div>

          {/* API Server status button */}
          <button
            onClick={onOpenApiConfig}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              connectionStatus === 'connected'
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40'
                : connectionStatus === 'connecting'
                ? 'bg-amber-950/30 border-amber-800/50 text-amber-300 hover:bg-amber-900/40'
                : 'bg-rose-950/30 border-rose-800/50 text-rose-300 hover:bg-rose-900/40'
            }`}
            title={t('apiConfigTitle')}
          >
            {connectionStatus === 'connected' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : connectionStatus === 'connecting' ? (
              <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span className="hidden sm:inline">
              {connectionStatus === 'connected'
                ? t('connected')
                : connectionStatus === 'connecting'
                ? t('connecting')
                : t('disconnected')}
            </span>
          </button>
        </div>
      </header>

      {/* Main Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-[#0f1725]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Subtle top glowing line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"></div>

          {/* Header Mode Toggle */}
          <div className="p-6 pb-4 border-b border-slate-800/80">
            <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  resetFormState();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center ${
                  mode === 'signin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('signIn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetFormState();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center ${
                  mode === 'signup'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('signUp')}
              </button>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {mode === 'signin'
                  ? t('welcomeBack')
                  : mode === 'signup'
                  ? t('createAccount')
                  : t('forgotPassword')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'signin'
                  ? t('welcomeSubtitle')
                  : mode === 'signup'
                  ? t('createAccountSubtitle')
                  : t('forgotPasswordSubtitle')}
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-medium flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' && (
              <>
                {step === 1 ? (
                  <form onSubmit={handleSignInStep1} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        {t('usernameOrEmail')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={loginInput}
                          onChange={(e) => setLoginInput(e.target.value)}
                          placeholder="ziyatovzafar98@gmail.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-base sm:text-sm font-medium transition-colors min-h-[48px]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {t('password')}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            resetFormState();
                          }}
                          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          {t('forgotPassword')}?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-11 py-3 bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-base sm:text-sm font-medium transition-colors min-h-[48px]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 min-w-[40px] justify-center"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 min-h-[48px]"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      <span>{t('sendCode')} (2FA)</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignInStep2} className="space-y-4">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 text-center">
                      {t('enter6DigitCode')}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                        {t('verificationCode')}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          autoFocus
                          maxLength={8}
                          value={signInCode}
                          onChange={(e) => setSignInCode(e.target.value)}
                          placeholder="123456"
                          className="w-full py-3.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-white font-mono text-center tracking-widest text-xl font-bold min-h-[52px]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 min-h-[48px]"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 min-h-[48px]"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        <span>{t('verifyAndContinue')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && (
              <>
                {step === 1 ? (
                  <form onSubmit={handleSignUpStep1} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t('fullName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Zafar Ziyatov"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          {t('username')}
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="zafar_z"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          {t('birthdate')}
                        </label>
                        <input
                          type="date"
                          required
                          value={birthdate}
                          onChange={(e) => setBirthdate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ziyatovzafar98@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t('role')}
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                      >
                        <option value="USER">{t('roleUser')}</option>
                        <option value="ADMIN">{t('roleAdmin')}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          {t('password')}
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          {t('confirmPassword')}
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm focus:border-emerald-500 min-h-[44px]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-3 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] disabled:opacity-50 min-h-[48px]"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{t('signUpNow')}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignUpStep2} className="space-y-4">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 text-center">
                      {t('enter6DigitCode')}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                        {t('verificationCode')}
                      </label>
                      <input
                        type="text"
                        required
                        autoFocus
                        maxLength={8}
                        value={signUpCode}
                        onChange={(e) => setSignUpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full py-3.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-white font-mono text-center tracking-widest text-xl font-bold min-h-[52px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 min-h-[48px]"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 min-h-[48px]"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{t('verifyAndContinue')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* FORGOT & RESET PASSWORD FORM */}
            {mode === 'forgot' && (
              <>
                {step === 1 ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        {t('email')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="ziyatovzafar98@gmail.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm min-h-[48px]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signin');
                          resetFormState();
                        }}
                        className="px-4 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 min-h-[48px]"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 min-h-[48px]"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{t('sendCode')}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t('verificationCode')}
                      </label>
                      <input
                        type="text"
                        required
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="123456"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-center text-lg font-bold min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t('newPassword')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {t('confirmPassword')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-base sm:text-sm min-h-[44px]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl min-h-[48px]"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{t('resetPassword')}</span>
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t('appName')} · {language === 'tr' ? 'Türkçe & İngilizce Tam Destekli' : 'Bilingual Turkish & English'}</span>
          <span>Zafar Ziyatov · OpenAPI 3.0.1</span>
        </div>
      </footer>
    </div>
  );
};
