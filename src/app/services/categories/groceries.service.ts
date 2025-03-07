import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { Groceries } from '../../models/categories/groceries.model';
import { CategorisationResult } from '../../models/categorisation-result';
import { CategorizationBaseService } from '../categorization.base.service';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService extends CategorizationBaseService<Groceries> {

  protected mappings: Record<keyof Groceries, (transaction: Transaction) => boolean> = {
    biedronka: (transaction) => transaction.description.includes('BIEDRONKA'),
    lidl: (transaction) => transaction.description.includes('LIDL'),
    kaufland: (transaction) => transaction.description.includes('KAUFLAND'),
    dino: (transaction) => transaction.description.includes('DINO'),
    others: (transaction) => transaction.description.toUpperCase().includes('ZABKA') || transaction.description.toUpperCase().includes('CARREFOUR')
  };

  public getGroceries(transactions: Transaction[]): CategorisationResult<Groceries> {
    const initialData: Groceries = {
      biedronka: [],
      lidl: [],
      kaufland: [],
      dino: [],
      others: []
    };

    return this.categorize(transactions, initialData);
  }
}