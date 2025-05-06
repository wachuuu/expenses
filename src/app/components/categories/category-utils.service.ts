import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryUtilsService {
  // Shared utilities for category components

  // Format currency amounts
  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  // Get color for amount display
  getAmountColor(amount: number): string {
    return amount > 0 ? 'green' : 'red';
  }

  // Utility method to safely extract transactions from any category type
  getTransactionsFromCategory(category: any): Transaction[] {
    if (Array.isArray(category)) {
      return category;
    }
    return [];
  }

  // Calculate total for an array of transactions
  calculateTotal(transactions: Transaction[]): number {
    if (!transactions || !transactions.length) return 0;
    return transactions.reduce((total, tx) => total + tx.amount, 0);
  }
}
