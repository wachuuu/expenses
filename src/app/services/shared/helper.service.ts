import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  getTotalAmount(transactions: Transaction[] | Record<string, Transaction[]>): number {
    if (Array.isArray(transactions)) {
      return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    }
  
    return Object.values(transactions)
      .flat() // Flatten all Transaction[] arrays into a single array
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  }
}
