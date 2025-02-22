import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Transaction } from '../../../models/transaction.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../shared/section/section.component';

@Component({
  selector: 'app-online-payments',
  imports: [CommonModule, SectionComponent],
  templateUrl: './online-payments.component.html',
  styleUrl: './online-payments.component.scss'
})
export class OnlinePaymentsComponent {
  onlinePayments$: Observable<Transaction[] | undefined>;

  constructor(transactionsService: TransactionsService) {
    this.onlinePayments$ = transactionsService.onlinePayments$;
  }
}
