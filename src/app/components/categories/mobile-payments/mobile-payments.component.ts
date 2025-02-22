import { Component } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { Observable, tap } from 'rxjs';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from "../../shared/section/section.component";
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../../pipes/price.pipe';
import { HelperService } from '../../../services/shared/helper.service';

@Component({
  selector: 'app-mobile-payments',
  imports: [CommonModule, SectionComponent, PricePipe],
  templateUrl: './mobile-payments.component.html',
  styleUrl: './mobile-payments.component.scss'
})
export class MobilePaymentsComponent {
  mobilePayments$: Observable<Transaction[]>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.mobilePayments$ = transactionsService.mobilePayments$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
