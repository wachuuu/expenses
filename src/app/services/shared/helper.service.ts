import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  getCategoryTotal(category: Transaction[] | Object): number {
    if (Array.isArray(category)) {
      return category.reduce((acc, transaction) => acc + transaction.amount, 0);
    }
  
    return Object.values(category).reduce((acc, category) => {
      return acc + this.getSectionTotal(category);
    }, 0);
  }

  getSectionTotal(section: Transaction[] | Record<string, Transaction[]>): number {
    if (Array.isArray(section)) {
      return section.reduce((acc, transaction) => acc + transaction.amount, 0);
    }
  
    return Object.values(section)
      .flat() // Flatten all Transaction[] arrays into a single array
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  }
}
