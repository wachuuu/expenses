import { Component } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { Observable } from 'rxjs';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from "../../shared/section/section.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-payments',
  imports: [CommonModule, SectionComponent],
  templateUrl: './mobile-payments.component.html',
  styleUrl: './mobile-payments.component.scss'
})
export class MobilePaymentsComponent {
  mobilePayments$: Observable<Transaction[] | undefined>;

  constructor(transactionsService: TransactionsService) {
    this.mobilePayments$ = transactionsService.mobilePayments$;
  }
}
