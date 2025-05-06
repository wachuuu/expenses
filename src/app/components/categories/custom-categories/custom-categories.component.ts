import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { CustomCategories } from '../../../models/categories.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';
import { Transaction } from '../../../models/transaction.model';
import { BaseCategoryComponent } from '../base-category/base-category.component';
import { CategoryRowComponent } from '../category-row/category-row.component';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';

@Component({
  selector: 'app-custom-categories',
  standalone: true,
  imports: [CommonModule, CategoryRowComponent, TransactionTableComponent],
  templateUrl: './custom-categories.component.html',
  styleUrl: './custom-categories.component.scss'
})
export class CustomCategoriesComponent extends BaseCategoryComponent {
  customCategories$: Observable<CustomCategories>;
  @ViewChild('customActionsTemplate') customActionsTemplate!: TemplateRef<any>;

  constructor(
    public override transactionsService: TransactionsService,
    public override helperService: HelperService
  ) {
    super(transactionsService, helperService);
    this.customCategories$ = this.transactionsService.customCategories$;
  }

  override getCategoryKeys(categories: CustomCategories): string[] {
    return Object.keys(categories);
  }

  override getTransactionsForCategory(categories: CustomCategories, categoryKey: string): Transaction[] {
    return categories[categoryKey] || [];
  }

  moveTransaction(fromCategory: string, transaction: any, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const toCategory = selectElement.value;
    
    if (fromCategory !== toCategory) {
      this.transactionsService.removeTransactionFromCustomCategory(fromCategory, transaction);
      this.transactionsService.addTransactionToCustomCategory(toCategory, transaction);
    }
  }

  deleteTransaction(category: string, transaction: Transaction): void {
    this.transactionsService.removeTransactionFromCustomCategory(category, transaction);
  }
}
