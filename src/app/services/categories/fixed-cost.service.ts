import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { FixedCost } from '../../models/categories/fixed-cost.model';
import { CategorisationResult } from '../../models/categorisation-result';
import { CategorizationBaseService } from '../categorization.base.service';

@Injectable({
  providedIn: 'root'
})
export class FixedCostService extends CategorizationBaseService<Omit<FixedCost, 'subscriptions'>> {

  protected mappings: Record<keyof Omit<FixedCost, 'subscriptions'>, (transaction: Transaction) => boolean> = {
    rent: (transaction) => transaction.description.includes('CZYNSZ I OPŁATY'),
    internet: (transaction) => transaction.recipientOrSender?.includes('TELEWIZJA KABLOWA') ?? false
  };

  public getFixedCost(transactions: Transaction[]): CategorisationResult<FixedCost> {
    const initialData: Omit<FixedCost, 'subscriptions'> = {
      rent: [],
      internet: []
    };

    const { categorizedData, remainingTransactions } = this.categorize(transactions, initialData);

    // Handle subscriptions separately (if needed)
    const subscriptions = this.categorizeSubscriptions(remainingTransactions);

    return {
      categorizedData: { ...categorizedData, subscriptions: subscriptions.categorizedData },
      remainingTransactions: subscriptions.remainingTransactions
    };
  }

  private categorizeSubscriptions(transactions: Transaction[]): CategorisationResult<Record<string, Transaction[]>> {
    const subscriptionMappings: Record<string, (transaction: Transaction) => boolean> = {
      'Spotify': (transaction) => transaction.description.includes('SPOTIFY'),
      'iCloud': (transaction) => transaction.description.includes('APPLE.COM/BILL'),
      'YouTube Premium': (transaction) => transaction.description.includes('YouTubePremium'),
      'Google One': (transaction) => transaction.description.includes('Google One')
    };

    const subscriptions: Record<string, Transaction[]> = {};
    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      for (const [category, isCategory] of Object.entries(subscriptionMappings)) {
        if (isCategory(transaction)) {
          subscriptions[category] = [...(subscriptions[category] || []), transaction];
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
      categorizedData: subscriptions,
      remainingTransactions
    };
  }
}