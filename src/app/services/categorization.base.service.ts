import { Injectable } from '@angular/core';
import { CategorisationResult } from '../models/categorisation-result';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export abstract class CategorizationBaseService<T> {

  protected abstract mappings: 
    | Record<keyof T, (transaction: Transaction) => boolean> 
    | ((transaction: Transaction) => boolean);

  public categorize(transactions: Transaction[], initialData: T): CategorisationResult<T> {
    const categorizedData: T = structuredClone(initialData);
    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      if (this.mappings instanceof Function) {
        if (this.mappings(transaction)) {
          (categorizedData as Transaction[]).push(transaction);
          categorized = true;
        }
      } else {
        for (const [category, isCategory] of Object.entries<(transaction: Transaction) => boolean>(this.mappings)) {
          if (isCategory(transaction)) {
            ((categorizedData as T)[category as keyof T] as Transaction[]).push(transaction);
            categorized = true;
            break;
          }
        }
      }

      if (!categorized) acc.push(transaction);
      return acc;
    }, []);

    return {
      categorizedData,
      remainingTransactions
    };
  }
}