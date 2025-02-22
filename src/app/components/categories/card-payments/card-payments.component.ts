import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Transaction } from '../../../models/transaction.model';
import { PricePipe } from '../../../pipes/price.pipe';
import { HelperService } from '../../../services/shared/helper.service';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from '../../shared/section/section.component';

@Component({
  selector: 'app-card-payments',
  imports: [CommonModule, SectionComponent, PricePipe],
  templateUrl: './card-payments.component.html',
  styleUrl: './card-payments.component.scss'
})
export class CardPaymentsComponent {
  cardPayments$: Observable<Transaction[]>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.cardPayments$ = transactionsService.cardPayments$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
