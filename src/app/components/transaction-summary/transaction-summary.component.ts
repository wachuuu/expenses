import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PricePipe } from '../../pipes/price.pipe';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [CommonModule, PricePipe],
  templateUrl: './transaction-summary.component.html',
  styleUrl: './transaction-summary.component.scss'
})
export class TransactionSummaryComponent {
  income$: Observable<number>;
  expenses$: Observable<number>;
  balance$: Observable<number>;
  
  constructor(private transactionsService: TransactionsService) {
    this.income$ = this.transactionsService.income$;
    this.expenses$ = this.transactionsService.expenses$;
    this.balance$ = this.transactionsService.balance$;
  }
}
