/**
 * Tipos fundamentais do mycash+
 * Cinco entidades principais do sistema
 */

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'completed' | 'pending';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  accountId: string;
  memberId: string | null;
  installments: number;
  status: TransactionStatus;
  isRecurring: boolean;
  isPaid: boolean;
}

export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: GoalStatus;
  memberId: string | null;
}

export type CreditCardTheme = 'black' | 'lime' | 'white';

export interface CreditCard {
  id: string;
  name: string;
  holderId: string;
  limit: number;
  currentBill: number;
  closingDay: number;
  dueDay: number;
  theme: CreditCardTheme;
  lastDigits?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  holderId: string;
  balance: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  email?: string;
  monthlyIncome?: number;
}
