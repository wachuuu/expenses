import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Transaction } from '../../../models/transaction.model';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../shared/section/section.component';
import { HelperService } from '../../../services/shared/helper.service';
import { PricePipe } from '../../../pipes/price.pipe';

@Component({
  selector: 'app-online-payments',
  imports: [CommonModule, SectionComponent, PricePipe],
  templateUrl: './online-payments.component.html',
  styleUrl: './online-payments.component.scss'
})
export class OnlinePaymentsComponent {
  onlinePayments$: Observable<Transaction[]>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.onlinePayments$ = transactionsService.onlinePayments$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
