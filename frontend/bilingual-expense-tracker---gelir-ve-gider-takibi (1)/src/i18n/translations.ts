export type Language = 'tr' | 'en';

export interface Translations {
  // Navigation & General
  appName: string;
  appSubtitle: string;
  dashboard: string;
  transactions: string;
  categories: string;
  analytics: string;
  settings: string;
  profile: string;
  signIn: string;
  signUp: string;
  signOut: string;
  language: string;
  turkish: string;
  english: string;
  currency: string;
  liveApi: string;
  demoMode: string;
  connected: string;
  disconnected: string;
  connecting: string;
  status: string;

  // Overview / Dashboard
  totalBalance: string;
  totalIncome: string;
  totalExpense: string;
  netSavings: string;
  savingsRate: string;
  monthlyOverview: string;
  recentTransactions: string;
  categoryBreakdown: string;
  noTransactionsYet: string;
  addFirstTransaction: string;
  quickAdd: string;
  incomeVsExpense: string;
  highestExpense: string;
  averageTransaction: string;

  // Transactions
  addTransaction: string;
  editTransaction: string;
  deleteTransaction: string;
  transactionDetails: string;
  type: string;
  amount: string;
  category: string;
  description: string;
  descriptionPlaceholder: string;
  date: string;
  dateTime: string;
  income: string;
  expense: string;
  allTypes: string;
  searchTransactions: string;
  filterByDate: string;
  filterByCategory: string;
  allCategories: string;
  allTime: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  exportCsv: string;
  exportSuccess: string;
  save: string;
  cancel: string;
  delete: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  transactionAdded: string;
  transactionUpdated: string;
  transactionDeleted: string;

  // Categories
  categoriesTitle: string;
  categoriesSubtitle: string;
  searchCategory: string;
  active: string;
  inactive: string;
  orderIndex: string;
  nameInTr: string;
  nameInEn: string;
  noCategoriesFound: string;
  itemsCount: string;

  // Auth
  welcomeBack: string;
  welcomeSubtitle: string;
  createAccount: string;
  createAccountSubtitle: string;
  usernameOrEmail: string;
  username: string;
  email: string;
  fullName: string;
  birthdate: string;
  role: string;
  roleUser: string;
  roleAdmin: string;
  password: string;
  confirmPassword: string;
  newPassword: string;
  verificationCode: string;
  verificationCodeSent: string;
  verificationCodeSentTo: string;
  enter6DigitCode: string;
  verifyAndContinue: string;
  sendCode: string;
  resendCode: string;
  didNotReceiveCode: string;
  forgotPassword: string;
  forgotPasswordSubtitle: string;
  resetPassword: string;
  resetPasswordSuccess: string;
  rememberMe: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  signInNow: string;
  signUpNow: string;
  loginSuccess: string;
  registerSuccess: string;
  logoutSuccess: string;
  authRequired: string;
  authRequiredMessage: string;
  tokenInfo: string;
  copyToken: string;
  tokenCopied: string;

  // API Config Modal
  apiConfigTitle: string;
  apiConfigDesc: string;
  apiEndpoint: string;
  testConnection: string;
  testSuccess: string;
  testFailed: string;
  usingProxy: string;
  directUrl: string;
  resetDefaultUrl: string;

  // Common Errors
  errorGeneral: string;
  errorBadCredentials: string;
  errorInvalidCode: string;
  errorEmailExists: string;
  errorUsernameExists: string;
  errorPasswordsDoNotMatch: string;
  errorAccountNotConfirmed: string;
  errorUnauthorized: string;
  validationRequired: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    // Navigation & General
    appName: "Gider & Gelir Takibi",
    appSubtitle: "Kişisel Finans Yönetim Sistemi",
    dashboard: "Kontrol Paneli",
    transactions: "İşlemler",
    categories: "Kategoriler",
    analytics: "Analizler",
    settings: "Ayarlar",
    profile: "Profilim",
    signIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    signOut: "Çıkış Yap",
    language: "Dil",
    turkish: "Türkçe",
    english: "İngilizce",
    currency: "Para Birimi",
    liveApi: "Canlı API",
    demoMode: "Demo Modu",
    connected: "Bağlandı",
    disconnected: "Bağlantı Yok",
    connecting: "Bağlanıyor...",
    status: "Durum",

    // Overview / Dashboard
    totalBalance: "Toplam Bakiye",
    totalIncome: "Toplam Gelir",
    totalExpense: "Toplam Gider",
    netSavings: "Net Tasarruf",
    savingsRate: "Tasarruf Oranı",
    monthlyOverview: "Aylık Genel Bakış",
    recentTransactions: "Son İşlemler",
    categoryBreakdown: "Kategori Dağılımı",
    noTransactionsYet: "Henüz işlem kaydı bulunmamaktadır.",
    addFirstTransaction: "İlk gelirinizi veya giderinizi ekleyin",
    quickAdd: "Hızlı İşlem Ekle",
    incomeVsExpense: "Gelir / Gider Dengesi",
    highestExpense: "En Yüksek Gider",
    averageTransaction: "Ortalama İşlem Tutarı",

    // Transactions
    addTransaction: "Yeni İşlem Ekle",
    editTransaction: "İşlemi Düzenle",
    deleteTransaction: "İşlemi Sil",
    transactionDetails: "İşlem Detayı",
    type: "İşlem Türü",
    amount: "Tutar",
    category: "Kategori",
    description: "Açıklama",
    descriptionPlaceholder: "Örn: Market alışverişi, Maaş, Kira...",
    date: "Tarih",
    dateTime: "Tarih ve Saat",
    income: "Gelir",
    expense: "Gider",
    allTypes: "Tüm Türler",
    searchTransactions: "Açıklama veya tutar ile ara...",
    filterByDate: "Tarihe Göre Filtrele",
    filterByCategory: "Kategoriye Göre Filtrele",
    allCategories: "Tüm Kategoriler",
    allTime: "Tüm Zamanlar",
    today: "Bugün",
    thisWeek: "Bu Hafta",
    thisMonth: "Bu Ay",
    thisYear: "Bu Yıl",
    exportCsv: "CSV İndir",
    exportSuccess: "İşlemler CSV formatında dışa aktarıldı",
    save: "Kaydet",
    cancel: "Vazgeç",
    delete: "Sil",
    confirmDeleteTitle: "İşlemi Silmek İstiyor Musunuz?",
    confirmDeleteMessage: "Bu işlem kalıcı olarak silinecektir. Bu eylem geri alınamaz.",
    transactionAdded: "İşlem başarıyla kaydedildi",
    transactionUpdated: "İşlem başarıyla güncellendi",
    transactionDeleted: "İşlem başarıyla silindi",

    // Categories
    categoriesTitle: "İşlem Kategorileri",
    categoriesSubtitle: "Gelir ve giderlerinizi sınıflandıran sistem kategorileri",
    searchCategory: "Kategori ara...",
    active: "Aktif",
    inactive: "Pasif",
    orderIndex: "Sıralama",
    nameInTr: "Türkçe Ad",
    nameInEn: "İngilizce Ad",
    noCategoriesFound: "Kategori bulunamadı",
    itemsCount: "işlem",

    // Auth
    welcomeBack: "Tekrar Hoş Geldiniz",
    welcomeSubtitle: "Hesabınıza erişmek için bilgilerinizi giriniz",
    createAccount: "Hesap Oluşturun",
    createAccountSubtitle: "Finansal takibe hemen başlamak için kayıt olun",
    usernameOrEmail: "Kullanıcı Adı veya E-posta",
    username: "Kullanıcı Adı",
    email: "E-posta Adresi",
    fullName: "Ad Soyad",
    birthdate: "Doğum Tarihi",
    role: "Hesap Rolü",
    roleUser: "Standart Kullanıcı (USER)",
    roleAdmin: "Yönetici (ADMIN)",
    password: "Şifre",
    confirmPassword: "Şifre Tekrarı",
    newPassword: "Yeni Şifre",
    verificationCode: "Doğrulama Kodu",
    verificationCodeSent: "Doğrulama kodu e-postanıza gönderildi",
    verificationCodeSentTo: "adresine gönderilen 6 haneli güvenlik kodunu giriniz:",
    enter6DigitCode: "6 haneli güvenlik kodu",
    verifyAndContinue: "Kodu Doğrula ve Giriş Yap",
    sendCode: "Kod Gönder",
    resendCode: "Kodu Tekrar Gönder",
    didNotReceiveCode: "Kod ulaşmadı mı?",
    forgotPassword: "Şifremi Unuttum",
    forgotPasswordSubtitle: "Şifrenizi sıfırlamak için e-posta adresinizi girin",
    resetPassword: "Şifreyi Sıfırla",
    resetPasswordSuccess: "Şifreniz başarıyla güncellendi, şimdi giriş yapabilirsiniz",
    rememberMe: "Beni hatırla",
    dontHaveAccount: "Hesabınız yok mu?",
    alreadyHaveAccount: "Zaten bir hesabınız var mı?",
    signInNow: "Giriş Yapın",
    signUpNow: "Hemen Kayıt Olun",
    loginSuccess: "Giriş başarılı! Hoş geldiniz",
    registerSuccess: "Hesap oluşturuldu! Lütfen e-postanıza gelen kodu doğrulayın",
    logoutSuccess: "Oturum başarıyla kapatıldı",
    authRequired: "Oturum Açılması Gerekiyor",
    authRequiredMessage: "Bu işlemi gerçekleştirmek için lütfen giriş yapın veya demo modunu kullanın.",
    tokenInfo: "JWT Erişim Belirteci",
    copyToken: "Belirteci Kopyala",
    tokenCopied: "Belirteç panoya kopyalandı",

    // API Config Modal
    apiConfigTitle: "API & Sunucu Yapılandırması",
    apiConfigDesc: "Expense Tracker REST API sunucu bağlantı durumu ve uç nokta ayarları",
    apiEndpoint: "API Sunucu Adresi (Base URL)",
    testConnection: "Bağlantıyı Sına",
    testSuccess: "Sunucu bağlantısı başarılı!",
    testFailed: "Sunucuya bağlanılamadı. Lütfen sunucu adresini veya internetinizi kontrol edin.",
    usingProxy: "Geliştirici Yerel Proxy Aktif",
    directUrl: "Doğrudan Cloudflare / Özel Sunucu",
    resetDefaultUrl: "Varsayılana Sıfırla",

    // Common Errors
    errorGeneral: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.",
    errorBadCredentials: "Hatalı kullanıcı adı veya şifre girdiniz.",
    errorInvalidCode: "Geçersiz veya süresi dolmuş doğrulama kodu.",
    errorEmailExists: "Bu e-posta adresi zaten kayıtlı.",
    errorUsernameExists: "Bu kullanıcı adı zaten alınmış.",
    errorPasswordsDoNotMatch: "Girdiğiniz şifreler birbiriyle eşleşmiyor.",
    errorAccountNotConfirmed: "Hesabınız henüz onaylanmadı. Lütfen e-postanızı doğrulayın.",
    errorUnauthorized: "Oturum süreniz doldu, lütfen tekrar giriş yapın.",
    validationRequired: "Lütfen bu alanı doldurunuz.",
  },

  en: {
    // Navigation & General
    appName: "Expense Tracker",
    appSubtitle: "Personal Finance Management System",
    dashboard: "Dashboard",
    transactions: "Transactions",
    categories: "Categories",
    analytics: "Analytics",
    settings: "Settings",
    profile: "Profile",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    language: "Language",
    turkish: "Turkish",
    english: "English",
    currency: "Currency",
    liveApi: "Live API",
    demoMode: "Demo Mode",
    connected: "Connected",
    disconnected: "Disconnected",
    connecting: "Connecting...",
    status: "Status",

    // Overview / Dashboard
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpense: "Total Expenses",
    netSavings: "Net Savings",
    savingsRate: "Savings Rate",
    monthlyOverview: "Monthly Overview",
    recentTransactions: "Recent Transactions",
    categoryBreakdown: "Category Breakdown",
    noTransactionsYet: "No transactions recorded yet.",
    addFirstTransaction: "Add your first income or expense transaction",
    quickAdd: "Quick Transaction",
    incomeVsExpense: "Income vs Expense",
    highestExpense: "Highest Expense",
    averageTransaction: "Average Transaction",

    // Transactions
    addTransaction: "Add Transaction",
    editTransaction: "Edit Transaction",
    deleteTransaction: "Delete Transaction",
    transactionDetails: "Transaction Details",
    type: "Transaction Type",
    amount: "Amount",
    category: "Category",
    description: "Description",
    descriptionPlaceholder: "e.g., Grocery shopping, Salary, Rent...",
    date: "Date",
    dateTime: "Date & Time",
    income: "Income",
    expense: "Expense",
    allTypes: "All Types",
    searchTransactions: "Search by note or amount...",
    filterByDate: "Filter by Date",
    filterByCategory: "Filter by Category",
    allCategories: "All Categories",
    allTime: "All Time",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    exportCsv: "Export CSV",
    exportSuccess: "Transactions successfully exported to CSV",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirmDeleteTitle: "Delete Transaction?",
    confirmDeleteMessage: "This transaction will be permanently removed. This action cannot be undone.",
    transactionAdded: "Transaction added successfully",
    transactionUpdated: "Transaction updated successfully",
    transactionDeleted: "Transaction deleted successfully",

    // Categories
    categoriesTitle: "Transaction Categories",
    categoriesSubtitle: "System categories to organize income and expenditure",
    searchCategory: "Search category...",
    active: "Active",
    inactive: "Inactive",
    orderIndex: "Sort Order",
    nameInTr: "Turkish Name",
    nameInEn: "English Name",
    noCategoriesFound: "No categories found",
    itemsCount: "items",

    // Auth
    welcomeBack: "Welcome Back",
    welcomeSubtitle: "Enter your credentials to access your account",
    createAccount: "Create an Account",
    createAccountSubtitle: "Sign up to start tracking your finances today",
    usernameOrEmail: "Username or Email",
    username: "Username",
    email: "Email Address",
    fullName: "Full Name",
    birthdate: "Date of Birth",
    role: "Account Role",
    roleUser: "Standard User (USER)",
    roleAdmin: "Administrator (ADMIN)",
    password: "Password",
    confirmPassword: "Confirm Password",
    newPassword: "New Password",
    verificationCode: "Verification Code",
    verificationCodeSent: "Verification code sent to your email",
    verificationCodeSentTo: "Enter the 6-digit security code sent to:",
    enter6DigitCode: "6-digit security code",
    verifyAndContinue: "Verify Code & Sign In",
    sendCode: "Send Code",
    resendCode: "Resend Code",
    didNotReceiveCode: "Didn't receive the code?",
    forgotPassword: "Forgot Password",
    forgotPasswordSubtitle: "Enter your registered email to reset your password",
    resetPassword: "Reset Password",
    resetPasswordSuccess: "Password reset successfully. You can now sign in.",
    rememberMe: "Remember me",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signInNow: "Sign In",
    signUpNow: "Sign Up Now",
    loginSuccess: "Signed in successfully! Welcome back",
    registerSuccess: "Account created! Please verify the code sent to your email",
    logoutSuccess: "Signed out successfully",
    authRequired: "Sign In Required",
    authRequiredMessage: "Please sign in or use demo mode to manage transactions.",
    tokenInfo: "JWT Access Token",
    copyToken: "Copy Token",
    tokenCopied: "Token copied to clipboard",

    // API Config Modal
    apiConfigTitle: "API & Server Configuration",
    apiConfigDesc: "Expense Tracker REST API connection status and endpoint settings",
    apiEndpoint: "API Base URL",
    testConnection: "Test Connection",
    testSuccess: "Server connected successfully!",
    testFailed: "Could not reach server. Please verify URL or network connection.",
    usingProxy: "Local Dev Proxy Active",
    directUrl: "Direct Cloudflare / Custom URL",
    resetDefaultUrl: "Reset to Default",

    // Common Errors
    errorGeneral: "An unexpected error occurred. Please try again.",
    errorBadCredentials: "Invalid username or password.",
    errorInvalidCode: "Invalid or expired verification code.",
    errorEmailExists: "This email address is already registered.",
    errorUsernameExists: "This username is already taken.",
    errorPasswordsDoNotMatch: "Passwords do not match.",
    errorAccountNotConfirmed: "Account is not confirmed. Please verify your email.",
    errorUnauthorized: "Session expired. Please sign in again.",
    validationRequired: "This field is required.",
  },
};
