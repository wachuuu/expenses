import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { Transport } from '../../../models/categories/transport.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';
import { Transaction } from '../../../models/transaction.model';
import { CategoryRowComponent } from '../category-row/category-row.component';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [CommonModule, CategoryRowComponent, TransactionTableComponent],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent {
  transport$: Observable<Transport>;
  expandedCategories: { [key: string]: boolean } = {};
  isMainCategoryExpanded: boolean = false;

  @ViewChild('moveToCustomTemplate') moveToCustomTemplate!: TemplateRef<any>;

  constructor(
    public transactionsService: TransactionsService, 
    public helperService: HelperService
  ) {
    this.transport$ = transactionsService.transport$;
  }

  getTransportSubcategories(transport: Transport | undefined): string[] {
    if (!transport) return [];
    
    return Object.keys(transport).filter(key => 
      transport[key as keyof Transport] !== undefined && 
      Array.isArray(transport[key as keyof Transport]) && 
      (transport[key as keyof Transport] as any).length > 0
    );
  }

  getTransportTransactions(transport: Transport | undefined, subCategory: string): Transaction[] {
    if (!transport || !transport[subCategory as keyof Transport]) return [];
    return transport[subCategory as keyof Transport] as Transaction[] || [];
  }

  getTransportSubcategoryTotal(transport: Transport | undefined, subCategory: string): number {
    const transactions = this.getTransportTransactions(transport, subCategory);
    return this.helperService.getSectionTotal(transactions);
  }

  getTotalTransport(transport: Transport | undefined): number {
    if (!transport) return 0;
    
    let total = 0;
    
    // Add up all subcategory transactions
    Object.keys(transport).forEach(subCategory => {
      if (transport[subCategory as keyof Transport]) {
        total += this.helperService.getSectionTotal(
          transport[subCategory as keyof Transport] as Transaction[]
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
