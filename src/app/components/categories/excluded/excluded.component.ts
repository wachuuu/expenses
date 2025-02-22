import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../../../models/transaction.model';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from '../../shared/section/section.component';

@Component({
  selector: 'app-excluded',
  imports: [CommonModule, SectionComponent],
  templateUrl: './excluded.component.html',
  styleUrl: './excluded.component.scss'
})
export class ExcludedComponent {
  excludedTransactions$: Observable<Transaction[]>;

  constructor(transactionsService: TransactionsService) {
    this.excludedTransactions$ = transactionsService.excludedTransactions$;
  }
}
