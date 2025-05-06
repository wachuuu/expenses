import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { FixedCost } from '../../../models/categories/fixed-cost.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-fixed-cost',
  imports: [CommonModule],
  templateUrl: './fixed-cost.component.html',
  styleUrl: './fixed-cost.component.scss'
})
export class FixedCostComponent {
  fixedCost$: Observable<FixedCost>;
  expandedCategories: { [key: string]: boolean } = {};
  isMainCategoryExpanded: boolean = false;

  constructor(
    public transactionsService: TransactionsService, 
    public helperService: HelperService
  ) {
    this.fixedCost$ = transactionsService.fixedCost$;
  }

  getFixedCostSubcategories(fixedCost: FixedCost | undefined): string[] {
    if (!fixedCost) return [];
    const subCategories = ['rent', 'internet'];
    if (fixedCost.subscriptions && Object.keys(fixedCost.subscriptions).length > 0) {
      subCategories.push('subscriptions');
    }
    return subCategories;
  }

  getSubscriptionKeys(subscriptions: Record<string, Transaction[]> | undefined): string[] {
    if (!subscriptions) return [];
    return Object.keys(subscriptions);
  }

  getFixedCostTransactions(fixedCost: FixedCost | undefined, subCategory: string): Transaction[] {
    if (!fixedCost || !fixedCost[subCategory as keyof FixedCost]) return [];
    
    if (subCategory !== 'subscriptions') {
      return fixedCost[subCategory as 'rent' | 'internet'] || [];
    }
    return [];
  }

  getSubscriptionTransactions(subscriptions: Record<string, Transaction[]> | undefined, subscriptionKey: string): Transaction[] {
    if (!subscriptions || !subscriptions[subscriptionKey]) return [];
    return subscriptions[subscriptionKey];
  }

  getFixedCostSubcategoryTotal(fixedCost: FixedCost | undefined, subCategory: string): number {
    const transactions = this.getFixedCostTransactions(fixedCost, subCategory);
    return this.helperService.getSectionTotal(transactions);
  }

  getSubscriptionTotal(subscriptions: Record<string, Transaction[]> | undefined, subscriptionKey: string): number {
    const transactions = this.getSubscriptionTransactions(subscriptions, subscriptionKey);
    return this.helperService.getSectionTotal(transactions);
  }

  getTotalFixedCost(fixedCost: FixedCost | undefined): number {
    if (!fixedCost) return 0;
    
    let total = 0;
    
    // Add up all rent transactions
    if (fixedCost.rent) {
      total += this.helperService.getSectionTotal(fixedCost.rent);
    }
    
    // Add up all internet transactions
    if (fixedCost.internet) {
      total += this.helperService.getSectionTotal(fixedCost.internet);
    }
    
    // Add up all subscription transactions
    if (fixedCost.subscriptions) {
      Object.values(fixedCost.subscriptions).forEach(transactions => {
        total += this.helperService.getSectionTotal(transactions);
      });
    }
    
    return total;
  }

  toggleSubcategory(subCategory: string): void {
    this.expandedCategories[subCategory] = !this.expandedCategories[subCategory];
  }

  toggleMainCategory(): void {
    this.isMainCategoryExpanded = !this.isMainCategoryExpanded;
  }

  moveToCustomCategory(transaction: Transaction, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const customCategory = selectElement.value;
    
    if (customCategory) {
      this.transactionsService.addTransactionToCustomCategory(customCategory, transaction);
    }
  }
}
