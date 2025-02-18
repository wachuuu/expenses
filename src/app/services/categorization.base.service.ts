import { Injectable } from '@angular/core';
import { CategorisationResult } from '../models/categorisation-result';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export abstract class CategorizationBaseService<T> {

  // Abstract property to be implemented by child classes
  protected abstract mappings: Record<keyof T, (transaction: Transaction) => boolean>;

  // Generic method to categorize transactions
  public categorize(transactions: Transaction[], initialData: T): CategorisationResult<T> {
    const categorizedData: T = { ...initialData };
    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      for (const [category, isCategory] of Object.entries<(transaction: Transaction) => boolean>(this.mappings)) {
        if (isCategory(transaction)) {
          (categorizedData[category as keyof T] as Transaction[]).push(transaction);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        acc.push(transaction);
      }

      return acc;
    }, []);

    return {
      categorizedData,
      remainingTransactions
    };
  }
}