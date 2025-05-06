import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { Groceries } from '../../../models/categories/groceries.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';
import { Transaction } from '../../../models/transaction.model';
import { CategoryRowComponent } from '../category-row/category-row.component';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';

@Component({
  selector: 'app-groceries',
  standalone: true,
  imports: [CommonModule, CategoryRowComponent, TransactionTableComponent],
  templateUrl: './groceries.component.html',
  styleUrl: './groceries.component.scss'
})
export class GroceriesComponent {
  groceries$: Observable<Groceries>;
  expandedCategories: { [key: string]: boolean } = {};
  isMainCategoryExpanded: boolean = false;

  @ViewChild('moveToCustomTemplate') moveToCustomTemplate!: TemplateRef<any>;

  constructor(
    public transactionsService: TransactionsService, 
    public helperService: HelperService
  ) {
    this.groceries$ = transactionsService.groceries$;
  }

  getGroceriesSubcategories(groceries: Groceries | undefined): string[] {
    if (!groceries) return [];
    
    return Object.keys(groceries).filter(key => 
      groceries[key as keyof Groceries] !== undefined && 
      Array.isArray(groceries[key as keyof Groceries]) && 
      (groceries[key as keyof Groceries] as any).length > 0
    );
  }

  getGroceriesTransactions(groceries: Groceries | undefined, subCategory: string): Transaction[] {
    if (!groceries || !groceries[subCategory as keyof Groceries]) return [];
    return groceries[subCategory as keyof Groceries] as Transaction[] || [];
  }

  getGroceriesSubcategoryTotal(groceries: Groceries | undefined, subCategory: string): number {
    const transactions = this.getGroceriesTransactions(groceries, subCategory);
    return this.helperService.getSectionTotal(transactions);
  }

  getTotalGroceries(groceries: Groceries | undefined): number {
    if (!groceries) return 0;
    
    let total = 0;
    
    // Add up all subcategory transactions
    Object.keys(groceries).forEach(subCategory => {
      if (groceries[subCategory as keyof Groceries]) {
        total += this.helperService.getSectionTotal(
          groceries[subCategory as keyof Groceries] as Transaction[]
        );
      }
    });
    
    return total;
  }

  /**
   * Toggles the expanded state of a subcategory
   */
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
