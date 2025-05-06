import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { Observable, map } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [CommonModule, PricePipe],
  templateUrl: './transaction-summary.component.html',
  styleUrl: './transaction-summary.component.scss'
})
export class TransactionSummaryComponent implements OnInit {
  income$: Observable<number>;
  expenses$: Observable<number>;
  balance$: Observable<number>;
  
  constructor(private transactionsService: TransactionsService) {
    // Initialize the observables
    this.income$ = this.transactionsService.transactions$.pipe(
      map(transactions => this.calculateIncome(transactions))
    );
    
    this.expenses$ = this.transactionsService.transactions$.pipe(
      map(transactions => this.calculateExpenses(transactions))
    );
    
    this.balance$ = this.transactionsService.transactions$.pipe(
      map(transactions => this.calculateBalance(transactions))
    );
  }
  
  ngOnInit(): void {}
  
  private calculateIncome(transactions: Transaction[]): number {
    return transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }
  
  private calculateExpenses(transactions: Transaction[]): number {
    return Math.abs(transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0));
  }
  
  private calculateBalance(transactions: Transaction[]): number {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }
}
