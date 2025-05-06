import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { BaseCategories } from '../../../models/categories.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';
import { Transaction } from '../../../models/transaction.model';
import { FixedCostComponent } from '../fixed-cost/fixed-cost.component';
import { GroceriesComponent } from '../groceries/groceries.component';
import { TransportComponent } from '../transport/transport.component';
import { BaseCategoryComponent } from '../base-category/base-category.component';
import { CategoryRowComponent } from '../category-row/category-row.component';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';

@Component({
  selector: 'app-base-categories',
  standalone: true,
  imports: [
    CommonModule, 
    FixedCostComponent, 
    GroceriesComponent, 
    TransportComponent, 
    CategoryRowComponent, 
    TransactionTableComponent
  ],
  templateUrl: './base-categories.component.html',
  styleUrl: './base-categories.component.scss'
})
export class BaseCategoriesComponent extends BaseCategoryComponent {
  baseCategories$: Observable<BaseCategories>;
  @ViewChild('baseActionsTemplate') baseActionsTemplate!: TemplateRef<any>;

  constructor(
    public override transactionsService: TransactionsService,
    public override helperService: HelperService
  ) {
    super(transactionsService, helperService);
    this.baseCategories$ = this.transactionsService.baseCategories$;
  }

  override getCategoryKeys(categories: BaseCategories): string[] {
    return Object.keys(categories).filter(key => {
      // Exclude fixedCost, groceries, and transport as they're handled separately now
      if (key === 'fixedCost' || key === 'groceries' || key === 'transport') return false;
      
      // Regular handling for array categories
      return categories[key as keyof BaseCategories] !== undefined && 
             Array.isArray(categories[key as keyof BaseCategories]) && 
             (categories[key as keyof BaseCategories] as any).length > 0;
    });
  }

  moveToCustomCategory(categoryKey: string, transaction: Transaction, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const customCategory = selectElement.value;
    
    if (customCategory) {
      this.transactionsService.addTransactionToCustomCategory(customCategory, transaction);
    }
  }

  getCategoryName(categoryKey: string): string {
    if (categoryKey === 'mobilePayments') return 'Płatności mobilne / BLIK';
    if (categoryKey === 'cardPayments') return 'Płatności kartą';
    if (categoryKey === 'onlinePayments') return 'Płatności intenetowe';
    if (categoryKey === 'transferedSavings') return 'Przelewy oszczędnościowe';
    if (categoryKey === 'other') return 'Inne';
    return categoryKey.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase());
  }

  override getTransactionsForCategory(categories: BaseCategories, categoryKey: string): Transaction[] {
    const category = categories[categoryKey as keyof BaseCategories];
    if (Array.isArray(category)) {
      return category as Transaction[];
    }
    return [];
  }
}
