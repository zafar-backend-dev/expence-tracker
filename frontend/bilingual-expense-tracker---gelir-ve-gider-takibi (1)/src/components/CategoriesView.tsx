import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CategoryResponseDto, TransactionResponseDto } from '../types/api';
import { Tags, Search, CheckCircle2, XCircle, Info, FolderCheck, Hash } from 'lucide-react';

interface CategoriesViewProps {
  categories: CategoryResponseDto[];
  transactions: TransactionResponseDto[];
  onSearch: (keyword: string) => Promise<void>;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  transactions,
  onSearch,
}) => {
  const { t, language, getCategoryName, getCategoryDescription } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  // Calculate count of transactions per category
  const txCounts = transactions.reduce((acc, tx) => {
    acc[tx.categoryId] = (acc[tx.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const displayedCategories = categories.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.nameEn?.toLowerCase().includes(term) ||
      c.nameTr?.toLowerCase().includes(term) ||
      c.descriptionEn?.toLowerCase().includes(term) ||
      c.descriptionTr?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('categoriesTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('categoriesSubtitle')}
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('searchCategory')}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 rounded-xl text-white placeholder-slate-500 text-xs transition-colors"
          />
        </div>
      </div>

      {/* Category Grid */}
      {displayedCategories.length === 0 ? (
        <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-2">
          <Tags className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">{t('noCategoriesFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCategories.map((cat) => {
            const count = txCounts[cat.pkey] || 0;
            return (
              <div
                key={cat.pkey}
                className="p-5 bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl space-y-3 transition-all hover:bg-slate-900/90 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <FolderCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {getCategoryName(cat)}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {cat.orderIndex ? `#${cat.orderIndex}` : ''} {cat.pkey}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      cat.active
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {cat.active ? t('active') : t('inactive')}
                  </span>
                </div>

                {/* Localized Details (both languages shown) */}
                <div className="p-3 bg-[#0b0f17] rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('nameInTr')}:</span>
                    <span className="text-slate-300 font-medium">{cat.nameTr || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('nameInEn')}:</span>
                    <span className="text-slate-300 font-medium">{cat.nameEn || '-'}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                  {getCategoryDescription(cat) || '—'}
                </p>

                {/* Footer Count */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>İlişkili İşlem / Related:</span>
                  <span className="font-bold text-slate-300">{count} {t('itemsCount')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
