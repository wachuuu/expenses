import { Injectable } from '@angular/core';
import { CategorisationResult } from '../../models/categorisation-result';
import { FixedCost } from '../../models/categories/fixed-cost.model';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class FixedCostService {

  // Mapping for rent and internet categorization
  private rentAndInternetMappings: { [key: string]: (transaction: Transaction) => boolean } = {
    rent: (transaction) => transaction.description.includes('CZYNSZ I OPŁATY'),
    internet: (transaction) => transaction.recipientOrSender?.includes('TELEWIZJA KABLOWA') ?? false
  };

  // Mapping for subscription categorization
  private subscriptionMappings: { [key: string]: (transaction: Transaction) => boolean } = {
    Spotify: (transaction) => transaction.description.includes('SPOTIFY'),
    iCloud: (transaction) => transaction.description.includes('APPLE.COM/BILL'),
    'YouTube Premium': (transaction) => transaction.description.includes('YouTubePremium'),
    'Google One': (transaction) => transaction.description.includes('Google One')
  };

  public getFixedCost(transactions: Transaction[]): CategorisationResult<FixedCost> {
    // Step 1: Categorize rent and internet transactions
    const { categorizedData: rentAndInternetCategorized, remainingTransactions: remainingRentAndInternetTransactions } =
      this.categorizeRentAndInternet(transactions);

    // Step 2: Categorize subscriptions
    const { categorizedData: subscriptions, remainingTransactions: remainingSubscriptionTransactions } =
      this.categorizeSubscriptions(remainingRentAndInternetTransactions);

    // Combine the results
    const categorized: FixedCost = {
      rent: rentAndInternetCategorized.rent,
      internet: rentAndInternetCategorized.internet,
      subscriptions
    };

    return {
      categorizedData: categorized,
      remainingTransactions: remainingSubscriptionTransactions
    };
  }

  private categorizeRentAndInternet(transactions: Transaction[]): CategorisationResult<Omit<FixedCost, 'subscriptions'>> {
    const categorizedData = {
      rent: [] as Transaction[],
      internet: [] as Transaction[]
    };

    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      for (const [category, isCategory] of Object.entries(this.rentAndInternetMappings)) {
        if (isCategory(transaction)) {
          categorizedData[category as keyof Omit<FixedCost, 'subscriptions'>].push(transaction);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        acc.push(transaction);
      }

      return acc;
    }, []);

    return { categorizedData, remainingTransactions };
  }

  private categorizeSubscriptions(transactions: Transaction[]): CategorisationResult<Record<string, Transaction[]>> {
    const subscriptions: Record<string, Transaction[]> = {};
    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      for (const [category, isCategory] of Object.entries(this.subscriptionMappings)) {
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