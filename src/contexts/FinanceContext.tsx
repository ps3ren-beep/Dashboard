import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
} from '@/types';
/** Filtro de tipo de transação */
export type TransactionTypeFilter = 'all' | 'income' | 'expense';

/** Intervalo de datas para filtros */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/** Resultado de despesas por categoria */
export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface FinanceContextValue {
  /* Arrays principais */
  transactions: Transaction[];
  goals: Goal[];
  creditCards: CreditCard[];
  bankAccounts: BankAccount[];
  familyMembers: FamilyMember[];

  /* Filtros globais */
  selectedMember: string | null;
  dateRange: DateRange;
  transactionType: TransactionTypeFilter;
  searchText: string;
  setSelectedMember: (id: string | null) => void;
  setDateRange: (range: DateRange) => void;
  setTransactionType: (type: TransactionTypeFilter) => void;
  setSearchText: (text: string) => void;

  /* CRUD — Transactions */
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  /* CRUD — Goals */
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  /* CRUD — CreditCards */
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (id: string, card: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;

  /* CRUD — BankAccounts */
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: string, account: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;

  /* CRUD — FamilyMembers */
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;

  /* Cálculos derivados (com filtros aplicados) */
  getFilteredTransactions: () => Transaction[];
  calculateTotalBalance: () => number;
  calculateIncomeForPeriod: () => number;
  calculateExpensesForPeriod: () => number;
  calculateExpensesByCategory: () => ExpenseByCategory[];
  calculateCategoryPercentage: (category: string) => number;
  calculateSavingsRate: () => number;
  calculateBalanceGrowthPercent: () => number;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isDateInRange(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr <= end;
}

function createMockData() {
  const member1: FamilyMember = {
    id: 'm1',
    name: 'Rafael Eugênio',
    role: 'Pai',
    avatarUrl: '',
    email: 'ren@gmail.com.br',
    monthlyIncome: 8500,
  };
  const member2: FamilyMember = {
    id: 'm2',
    name: 'Maria Silva',
    role: 'Mãe',
    avatarUrl: '',
    email: 'maria@email.com',
    monthlyIncome: 6200,
  };
  const member3: FamilyMember = {
    id: 'm3',
    name: 'João Eugênio',
    role: 'Filho',
    avatarUrl: '',
    monthlyIncome: 0,
  };

  const bank1: BankAccount = {
    id: 'bank1',
    name: 'Bundank Conta Corrente',
    holderId: 'm1',
    balance: 5420,
  };
  const bank2: BankAccount = {
    id: 'bank2',
    name: 'Nubank Poupança',
    holderId: 'm2',
    balance: 3200,
  };

  const card1: CreditCard = {
    id: 'card1',
    name: 'Bundank',
    holderId: 'm1',
    limit: 8000,
    currentBill: 1245,
    closingDay: 15,
    dueDay: 21,
    theme: 'black',
    lastDigits: '2237',
  };
  const card2: CreditCard = {
    id: 'card2',
    name: 'Nubank',
    holderId: 'm2',
    limit: 5000,
    currentBill: 890,
    closingDay: 10,
    dueDay: 17,
    theme: 'lime',
    lastDigits: '4521',
  };
  const card3: CreditCard = {
    id: 'card3',
    name: 'Inter',
    holderId: 'm1',
    limit: 12000,
    currentBill: 2100,
    closingDay: 20,
    dueDay: 28,
    theme: 'white',
    lastDigits: '7890',
  };

  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  function formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  function randomDate(start: Date, end: Date): string {
    const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return formatDate(new Date(t));
  }

  const transactions: Transaction[] = [
    { id: 't1', type: 'income', amount: 8500, description: 'Salário', category: 'Salário', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't2', type: 'income', amount: 6200, description: 'Salário', category: 'Salário', date: randomDate(threeMonthsAgo, today), accountId: bank2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't3', type: 'expense', amount: 1800, description: 'Aluguel', category: 'Aluguel', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't4', type: 'expense', amount: 650, description: 'Mercado mensal', category: 'Mercado', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't5', type: 'expense', amount: 420, description: 'Mercado', category: 'Mercado', date: randomDate(threeMonthsAgo, today), accountId: bank2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't6', type: 'expense', amount: 350, description: 'Supermercado', category: 'Mercado', date: randomDate(threeMonthsAgo, today), accountId: card1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't7', type: 'expense', amount: 120, description: 'Academia', category: 'Academia', date: randomDate(threeMonthsAgo, today), accountId: card1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't8', type: 'expense', amount: 154, description: 'Conta de luz', category: 'Contas', date: formatDate(new Date(today.getFullYear(), today.getMonth(), 21)), accountId: card1.id, memberId: 'm1', installments: 1, status: 'pending', isRecurring: true, isPaid: false },
    { id: 't9', type: 'expense', amount: 89, description: 'Conta de água', category: 'Contas', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't10', type: 'expense', amount: 280, description: 'Restaurante', category: 'Alimentação', date: randomDate(threeMonthsAgo, today), accountId: card2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't11', type: 'expense', amount: 150, description: 'Uber', category: 'Transporte', date: randomDate(threeMonthsAgo, today), accountId: card2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't12', type: 'expense', amount: 320, description: 'Farmácia', category: 'Saúde', date: randomDate(threeMonthsAgo, today), accountId: bank2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't13', type: 'expense', amount: 199, description: 'Cinema', category: 'Lazer', date: randomDate(threeMonthsAgo, today), accountId: card3.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't14', type: 'income', amount: 1200, description: 'Freelance design', category: 'Freelance', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't15', type: 'expense', amount: 450, description: 'Mensalidade escola', category: 'Educação', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't16', type: 'expense', amount: 85, description: 'iFood', category: 'Alimentação', date: randomDate(threeMonthsAgo, today), accountId: card1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't17', type: 'expense', amount: 120, description: 'Spotify + Netflix', category: 'Lazer', date: randomDate(threeMonthsAgo, today), accountId: card2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't18', type: 'expense', amount: 250, description: 'Roupas', category: 'Compras', date: randomDate(threeMonthsAgo, today), accountId: card3.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't19', type: 'income', amount: 380, description: 'Dividendos', category: 'Investimentos', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't20', type: 'expense', amount: 95, description: 'Passeio parque', category: 'Lazer', date: randomDate(threeMonthsAgo, today), accountId: bank2.id, memberId: 'm3', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't21', type: 'expense', amount: 180, description: 'Supermercado semanal', category: 'Mercado', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't22', type: 'expense', amount: 60, description: 'Combustível', category: 'Transporte', date: randomDate(threeMonthsAgo, today), accountId: card1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't23', type: 'expense', amount: 140, description: 'Consulta médica', category: 'Saúde', date: randomDate(threeMonthsAgo, today), accountId: bank2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't24', type: 'expense', amount: 75, description: 'Livros', category: 'Educação', date: randomDate(threeMonthsAgo, today), accountId: card2.id, memberId: 'm2', installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't25', type: 'income', amount: 500, description: 'Aluguel recebido', category: 'Aluguel recebido', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'completed', isRecurring: true, isPaid: true },
    { id: 't26', type: 'expense', amount: 110, description: 'Farmácia', category: 'Saúde', date: randomDate(threeMonthsAgo, today), accountId: bank1.id, memberId: null, installments: 1, status: 'completed', isRecurring: false, isPaid: true },
    { id: 't27', type: 'expense', amount: 89, description: 'Internet', category: 'Contas', date: formatDate(new Date(today.getFullYear(), today.getMonth(), 15)), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'pending', isRecurring: true, isPaid: false },
    { id: 't28', type: 'expense', amount: 320, description: 'Condomínio', category: 'Contas', date: formatDate(new Date(today.getFullYear(), today.getMonth(), 28)), accountId: bank1.id, memberId: 'm1', installments: 1, status: 'pending', isRecurring: true, isPaid: false },
    { id: 't29', type: 'expense', amount: 120, description: 'Spotify + Netflix', category: 'Lazer', date: formatDate(new Date(today.getFullYear(), today.getMonth(), 10)), accountId: card2.id, memberId: 'm2', installments: 1, status: 'pending', isRecurring: true, isPaid: false },
  ];

  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const goals: Goal[] = [
    { id: 'g1', name: 'Reserva de emergência', targetAmount: 15000, currentAmount: 8400, deadline: formatDate(oneYearFromNow), status: 'active', memberId: 'm1' },
    { id: 'g2', name: 'Viagem família', targetAmount: 8000, currentAmount: 2300, deadline: formatDate(new Date(today.getFullYear(), 11, 31)), status: 'active', memberId: null },
    { id: 'g3', name: 'Notebook novo', targetAmount: 5500, currentAmount: 5500, deadline: formatDate(today), status: 'completed', memberId: 'm2' },
    { id: 'g4', name: 'Curso de inglês', targetAmount: 2400, currentAmount: 800, deadline: formatDate(new Date(today.getFullYear(), 5, 30)), status: 'active', memberId: 'm3' },
  ];

  return {
    familyMembers: [member1, member2, member3],
    bankAccounts: [bank1, bank2],
    creditCards: [card1, card2, card3],
    transactions,
    goals,
  };
}

const mock = createMockData();

const defaultDateRange: DateRange = (() => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
})();

interface FinanceProviderProps {
  children: ReactNode;
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(mock.transactions);
  const [goals, setGoals] = useState<Goal[]>(mock.goals);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mock.creditCards);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mock.bankAccounts);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mock.familyMembers);

  const [selectedMember, setSelectedMemberState] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [transactionType, setTransactionType] = useState<TransactionTypeFilter>('all');
  const [searchText, setSearchText] = useState('');

  const setSelectedMember = useCallback((id: string | null) => {
    setSelectedMemberState(id);
  }, []);

  /* --- CRUD Transactions --- */
  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [...prev, { ...tx, id: generateId() }]);
  }, []);

  const updateTransaction = useCallback((id: string, payload: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* --- CRUD Goals --- */
  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    setGoals((prev) => [...prev, { ...goal, id: generateId() }]);
  }, []);

  const updateGoal = useCallback((id: string, payload: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...payload } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  /* --- CRUD CreditCards --- */
  const addCreditCard = useCallback((card: Omit<CreditCard, 'id'>) => {
    setCreditCards((prev) => [...prev, { ...card, id: generateId() }]);
  }, []);

  const updateCreditCard = useCallback((id: string, payload: Partial<CreditCard>) => {
    setCreditCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...payload } : c))
    );
  }, []);

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  /* --- CRUD BankAccounts --- */
  const addBankAccount = useCallback((account: Omit<BankAccount, 'id'>) => {
    setBankAccounts((prev) => [...prev, { ...account, id: generateId() }]);
  }, []);

  const updateBankAccount = useCallback((id: string, payload: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...payload } : a))
    );
  }, []);

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  /* --- CRUD FamilyMembers --- */
  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    setFamilyMembers((prev) => [...prev, { ...member, id: generateId() }]);
  }, []);

  const updateFamilyMember = useCallback((id: string, payload: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...payload } : m))
    );
  }, []);

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  /* --- Filtros aplicados em transações --- */
  const getFilteredTransactions = useCallback(() => {
    return transactions.filter((t) => {
      if (selectedMember != null && t.memberId !== selectedMember) return false;
      if (!isDateInRange(t.date, dateRange.startDate, dateRange.endDate)) return false;
      if (transactionType === 'income' && t.type !== 'income') return false;
      if (transactionType === 'expense' && t.type !== 'expense') return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase().trim();
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        if (!matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [
    transactions,
    selectedMember,
    dateRange.startDate,
    dateRange.endDate,
    transactionType,
    searchText,
  ]);

  /* --- Cálculos derivados --- */
  const filtered = getFilteredTransactions();

  const calculateTotalBalance = useCallback(() => {
    const filteredBanks =
      selectedMember != null
        ? bankAccounts.filter((a) => a.holderId === selectedMember)
        : bankAccounts;
    const filteredCards =
      selectedMember != null
        ? creditCards.filter((c) => c.holderId === selectedMember)
        : creditCards;
    const bankTotal = filteredBanks.reduce((acc, a) => acc + a.balance, 0);
    const cardBills = filteredCards.reduce((acc, c) => acc + c.currentBill, 0);
    return bankTotal - cardBills;
  }, [bankAccounts, creditCards, selectedMember]);

  const calculateBalanceGrowthPercent = useCallback((): number => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 30;
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    const prevStartStr = prevStart.toISOString().slice(0, 10);
    const prevEndStr = prevEnd.toISOString().slice(0, 10);

    const currentNet = filtered
      .filter((t) => t.type === 'income')
      .reduce((a, t) => a + t.amount, 0) -
      filtered
        .filter((t) => t.type === 'expense')
        .reduce((a, t) => a + t.amount, 0);

    const prevFiltered = transactions.filter((t) => {
      if (selectedMember != null && t.memberId !== selectedMember) return false;
      return isDateInRange(t.date, prevStartStr, prevEndStr);
    });
    const prevNet =
      prevFiltered.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0) -
      prevFiltered.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

    if (prevNet === 0) return currentNet > 0 ? 100 : 0;
    return ((currentNet - prevNet) / Math.abs(prevNet)) * 100;
  }, [filtered, transactions, dateRange, selectedMember]);

  const calculateIncomeForPeriod = useCallback(() => {
    return filtered
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filtered]);

  const calculateExpensesForPeriod = useCallback(() => {
    return filtered
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filtered]);

  const calculateExpensesByCategory = useCallback((): ExpenseByCategory[] => {
    const expenses = filtered.filter((t) => t.type === 'expense');
    const byCategory = new Map<string, number>();
    for (const t of expenses) {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
    }
    const totalIncome = filtered
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    return Array.from(byCategory.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const calculateCategoryPercentage = useCallback(
    (category: string): number => {
      const byCategory = calculateExpensesByCategory();
      const found = byCategory.find((c) => c.category === category);
      return found?.percentage ?? 0;
    },
    [calculateExpensesByCategory]
  );

  const calculateSavingsRate = useCallback((): number => {
    const income = filtered
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = filtered
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    if (income <= 0) return 0;
    return ((income - expenses) / income) * 100;
  }, [filtered]);

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMember,
      dateRange,
      transactionType,
      searchText,
      setSelectedMember,
      setDateRange,
      setTransactionType,
      setSearchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateExpensesByCategory,
      calculateCategoryPercentage,
      calculateSavingsRate,
      calculateBalanceGrowthPercent,
    }),
    [
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMember,
      dateRange,
      transactionType,
      searchText,
      setSelectedMember,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateExpensesByCategory,
      calculateCategoryPercentage,
      calculateSavingsRate,
      calculateBalanceGrowthPercent,
    ]
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  }
  return ctx;
}
