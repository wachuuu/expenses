import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { Groceries } from '../../models/categories/groceries.model';
import { CategorisationResult } from '../../models/categorisation-result';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  private storeMappings: Record<keyof Groceries, (transaction: Transaction) => boolean> = {
    biedronka: (transaction) => transaction.description.includes('BIEDRONKA'),
    lidl: (transaction) => transaction.description.includes('LIDL'),
    kaufland: (transaction) => transaction.description.includes('KAUFLAND'),
    dino: (transaction) => transaction.description.includes('DINO'),
    zabka: (transaction) => transaction.description.includes('ZABKA'),
  };

  public getGroceries(transactions: Transaction[]): CategorisationResult<Groceries> {

    const groceries: Groceries = {
      biedronka: [],
      lidl: [],
      kaufland: [],
      dino: [],
      zabka: []
    };

    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      for (const [store, isStore] of Object.entries(this.storeMappings)) {
        if (isStore(transaction)) {
          (groceries[store as keyof Groceries]).push(transaction);
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
      categorizedData: groceries,
      remainingTransactions: remainingTransactions
    };
  }
}