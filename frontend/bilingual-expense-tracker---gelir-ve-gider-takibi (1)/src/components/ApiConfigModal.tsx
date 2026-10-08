import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl, setApiBaseUrl } from '../services/api';
import {
  X,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  Globe,
} from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { connectionStatus, checkConnection } = useAuth();

  const [baseUrlInput, setBaseUrlInput] = useState<string>(() => getApiBaseUrl());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Temporarily save base URL to test
      setApiBaseUrl(baseUrlInput);
      const ok = await checkConnection();
      if (ok) {
        setTestResult({
          success: true,
          message: t('testSuccess'),
        });
      } else {
        setTestResult({
          success: false,
          message: t('testFailed'),
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: t('testFailed'),
      });
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    setApiBaseUrl('/api');
    setBaseUrlInput('/api');
    setTestResult(null);
    checkConnection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">{t('apiConfigTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('apiConfigDesc')}
          </p>

          {/* Current Status Badge */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">{t('status')}</span>
              <span className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                {connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{t('connected')}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">{t('disconnected')}</span>
                  </>
                )}
              </span>
            </div>
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
              <span>{t('testConnection')}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Endpoint input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('apiEndpoint')}
              </label>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('resetDefaultUrl')}</span>
              </button>
            </div>
            <input
              type="text"
              value={baseUrlInput}
              onChange={(e) => setBaseUrlInput(e.target.value)}
              placeholder="/api or https://voices-toys-enquiries-inns.trycloudflare.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-white font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500">
              {language === 'tr'
                ? 'Varsayılan "/api", Vite arka plan proxy\'si ile Cloudflare sunucusuna yönlendirilir.'
                : 'Default "/api" proxies directly to the Cloudflare server via Vite backend proxy.'}
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setApiBaseUrl(baseUrlInput);
                onClose();
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
            >
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
