import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { CategoriesView } from './components/CategoriesView';
import { AnalyticsView } from './components/AnalyticsView';
import { TransactionModal } from './components/TransactionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ApiConfigModal } from './components/ApiConfigModal';
import { Toast, ToastMessage } from './components/Toast';
import { api, SEED_CATEGORIES } from './services/api';
import {
  TransactionResponseDto,
  CategoryResponseDto,
  EditOrAddTransactionRequestDto,
} from './types/api';
import { Loader2 } from 'lucide-react';

const AuthenticatedApp: React.FC<{
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onOpenApiConfig: () => void;
  onOpenProfile: () => void;
}> = ({ addToast, onOpenApiConfig, onOpenProfile }) => {
  const { t, language } = useLanguage();

  // Tab State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'transactions' | 'categories' | 'analytics'>('dashboard');

  // Data State
  const [categories, setCategories] = useState<CategoryResponseDto[]>(SEED_CATEGORIES);
  const [transactions, setTransactions] = useState<TransactionResponseDto[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionResponseDto | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionResponseDto | null>(null);

  // Fetch Categories & Transactions
  const loadCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(SEED_CATEGORIES);
      }
    } catch {
      setCategories(SEED_CATEGORIES);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data || []);
    } catch (err) {
      console.warn('API getTransactions error', err);
      setTransactions([]);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, [loadCategories, loadTransactions]);

  // Add / Edit Transaction Handler
  const handleSaveTransaction = async (dto: EditOrAddTransactionRequestDto, id?: string) => {
    if (id) {
      const updated = await api.editTransaction(id, dto);
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...dto, ...updated } : t)));
      addToast(t('transactionUpdated'));
    } else {
      const created = await api.addTransaction(dto);
      const newTx: TransactionResponseDto = {
        ...dto,
        ...created,
        id: created.id || 'tx-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      addToast(t('transactionAdded'));
    }
  };

  // Delete Transaction Handler
  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    const id = transactionToDelete.id;

    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      addToast(t('transactionDeleted'));
    } catch (err) {
      console.error('API delete error', err);
      // Still update UI if delete succeeded or mock
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      addToast(t('transactionDeleted'));
    } finally {
      setTransactionToDelete(null);
    }
  };

  // Category Search
  const handleSearchCategories = async (keyword: string) => {
    if (!keyword.trim()) {
      await loadCategories();
      return;
    }
    try {
      const results = await api.searchCategories(keyword);
      setCategories(results);
    } catch {
      setCategories((prev) =>
        prev.filter(
          (c) =>
            c.nameEn?.toLowerCase().includes(keyword.toLowerCase()) ||
            c.nameTr?.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080d15] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenProfile={onOpenProfile}
        onOpenApiConfig={onOpenApiConfig}
        onOpenAddTransaction={() => {
          setTransactionToEdit(null);
          setIsAddEditModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {loadingData ? (
          <div className="py-28 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              {language === 'tr' ? 'Veriler alınıyor...' : 'Loading transactions...'}
            </span>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                transactions={transactions}
                categories={categories}
                onOpenAddModal={() => {
                  setTransactionToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
                onNavigateToTransactions={() => setCurrentTab('transactions')}
                onNavigateToCategories={() => setCurrentTab('categories')}
                onEditTransaction={(tx) => {
                  setTransactionToEdit(tx);
                  setIsAddEditModalOpen(true);
                }}
              />
            )}

            {currentTab === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                categories={categories}
                onOpenAddModal={() => {
                  setTransactionToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
                onEditTransaction={(tx) => {
                  setTransactionToEdit(tx);
                  setIsAddEditModalOpen(true);
                }}
                onDeleteTransaction={(tx) => {
                  setTransactionToDelete(tx);
                  setIsDeleteModalOpen(true);
                }}
              />
            )}

            {currentTab === 'categories' && (
              <CategoriesView
                categories={categories}
                transactions={transactions}
                onSearch={handleSearchCategories}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                transactions={transactions}
                categories={categories}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddTransaction={() => {
          setTransactionToEdit(null);
          setIsAddEditModalOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="hidden md:block border-t border-slate-900 bg-[#070b12] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">{t('appName')}</span>
            <span>·</span>
            <span>{language === 'tr' ? 'Türkçe & İngilizce Tam Destekli' : 'Full Turkish & English Bilingual'}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Zafar Ziyatov</span>
            <span>·</span>
            <span>OpenAPI 3.0.1 REST Architecture</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSubmit={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        transaction={transactionToDelete}
      />
    </div>
  );
};

const RootApp: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { language } = useLanguage();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d15] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase">
          {language === 'tr' ? 'Oturum kontrol ediliyor...' : 'Checking session...'}
        </span>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <AuthView
          onOpenApiConfig={() => setIsApiConfigOpen(true)}
          onSuccessToast={(msg) => addToast(msg, 'success')}
        />
      ) : (
        <AuthenticatedApp
          addToast={addToast}
          onOpenApiConfig={() => setIsApiConfigOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {/* Common Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ApiConfigModal
        isOpen={isApiConfigOpen}
        onClose={() => setIsApiConfigOpen(false)}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RootApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
