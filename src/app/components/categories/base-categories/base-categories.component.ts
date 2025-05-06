import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { BaseCategories } from '../../../models/categories.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';
import { Transaction } from '../../../models/transaction.model';
import { FixedCostComponent } from '../fixed-cost/fixed-cost.component';

@Component({
  selector: 'app-base-categories',
  imports: [CommonModule, FixedCostComponent],
  templateUrl: './base-categories.component.html',
  styleUrl: './base-categories.component.scss'
})
export class BaseCategoriesComponent {
  baseCategories$: Observable<BaseCategories>;
  expandedCategories: { [key: string]: boolean } = {};

  constructor(
    public transactionsService: TransactionsService,
    public helperService: HelperService
  ) {
    this.baseCategories$ = this.transactionsService.baseCategories$;
  }

  getCategoryKeys(categories: BaseCategories): string[] {
    return Object.keys(categories).filter(key => {
      // Exclude fixedCost as it's handled separately now
      if (key === 'fixedCost') return false;
      
      // Regular handling for array categories
      return categories[key as keyof BaseCategories] !== undefined && 
             Array.isArray(categories[key as keyof BaseCategories]) && 
             (categories[key as keyof BaseCategories] as any).length > 0;
    });
  }

  toggleTransactions(categoryKey: string): void {
    this.expandedCategories[categoryKey] = !this.expandedCategories[categoryKey];
  }

  moveToCustomCategory(categoryKey: string, transaction: Transaction, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const customCategory = selectElement.value;
    
    if (customCategory) {
      this.transactionsService.addTransactionToCustomCategory(customCategory, transaction);
    }
  }

  getTransactionsForCategory(categories: BaseCategories, categoryKey: string): Transaction[] {
    const category = categories[categoryKey as keyof BaseCategories];
    if (Array.isArray(category)) {
      return category as Transaction[];
    }
    return [];
  }

  getCategoryTotal(categories: BaseCategories, categoryKey: string): number {
    const transactions = this.getTransactionsForCategory(categories, categoryKey);
    return this.helperService.getSectionTotal(transactions);
  }
}
