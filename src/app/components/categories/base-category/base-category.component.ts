import { Directive, Input } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { TransactionsService } from '../../../services/transactions.service';
import { HelperService } from '../../../services/shared/helper.service';

@Directive()
export abstract class BaseCategoryComponent {
  expandedCategories: { [key: string]: boolean } = {};

  constructor(
    public transactionsService: TransactionsService,
    public helperService: HelperService
  ) {}

  toggleTransactions(categoryKey: string): void {
    this.expandedCategories[categoryKey] = !this.expandedCategories[categoryKey];
  }

  abstract getCategoryKeys(categories: any): string[];
  
  abstract getTransactionsForCategory(categories: any, categoryKey: string): Transaction[];
  
  getCategoryTotal(categories: any, categoryKey: string): number {
    const transactions = this.getTransactionsForCategory(categories, categoryKey);
    return this.helperService.getSectionTotal(transactions);
  }
}
