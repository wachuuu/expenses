import { Injectable } from '@angular/core';
import { CategorisationResult } from '../../models/categorisation-result';
import { FixedCost } from '../../models/categories/fixed-cost.model';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class FixedCostService {

  constructor() { }

  public getFixedCost(transactions: Transaction[]): CategorisationResult<FixedCost> {
    // Step 1: Categorize rent and internet transactions
    const { categorizedData: rentAndInternetCategorized, remainingTransactions: remainingRentAndInternetTransactions } = this.categorizeRentAndInternet(transactions);

    // Step 2: Categorize subscriptions
    const { categorizedData: subscriptions, remainingTransactions: remainingSubscriptionTransactions } = this.categorizeSubscriptions(remainingRentAndInternetTransactions);

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
      if (this.isRentTransaction(transaction)) {
        categorizedData.rent.push(transaction);
      } else if (this.isInternetTransaction(transaction)) {
        categorizedData.internet.push(transaction);
      } else {
        acc.push(transaction);
      }
      return acc;
    }, []);

    return { categorizedData, remainingTransactions };
  }

  private isRentTransaction(transaction: Transaction): boolean {
    return transaction.description.includes('CZYNSZ I OPŁATY');
  }

  private isInternetTransaction(transaction: Transaction): boolean {
    return transaction.recipientOrSender?.includes('TELEWIZJA KABLOWA') ?? false;
  }

  private categorizeSubscriptions(transactions: Transaction[]): CategorisationResult<Record<string, Transaction[]>> {
    const subscriptions: Record<string, Transaction[]> = {};
    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      const subscriptionCategory = this.getSubscriptionCategory(transaction);
      if (subscriptionCategory) {
        subscriptions[subscriptionCategory] = [...(subscriptions[subscriptionCategory] || []), transaction];
      } else {
        acc.push(transaction);
      }
      return acc;
    }, []);

    return {
      categorizedData: subscriptions,
      remainingTransactions
    };
  }

  private getSubscriptionCategory(transaction: Transaction): string | null {
    if (transaction.description.includes('SPOTIFY')) {
      return 'Spotify';
    } else if (transaction.description.includes('APPLE.COM/BILL')) {
      return 'iCloud';
    } else if (transaction.description.includes('YouTubePremium')) {
      return 'YouTube Premium';
    } else if (transaction.description.includes('Google One')) {
      return 'Google One';
    }
    return null;
  }
}