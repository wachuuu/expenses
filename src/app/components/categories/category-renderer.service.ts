import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryRendererService {
  
  // Format amount with the correct currency and decimals
  formatAmount(amount: number): string {
    return amount.toFixed(2) + ' PLN';
  }
  
  // Get the CSS color for an amount value
  getAmountColor(amount: number): string {
    return amount > 0 ? 'green' : 'red';
  }
  
  // Check if a category should be expanded
  isExpanded(expandedCategories: {[key: string]: boolean}, categoryKey: string): boolean {
    return expandedCategories[categoryKey] === true;
  }
  
  // Toggle the expanded state of a category
  toggleExpanded(expandedCategories: {[key: string]: boolean}, categoryKey: string): void {
    expandedCategories[categoryKey] = !expandedCategories[categoryKey];
  }
}
