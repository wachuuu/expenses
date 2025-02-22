import { Component } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { Observable } from 'rxjs';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from "../../shared/section/section.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-non-essential',
  imports: [CommonModule, SectionComponent],
  templateUrl: './non-essential.component.html',
  styleUrl: './non-essential.component.scss'
})
export class NonEssentialComponent {
  nonEssentialTransactions$: Observable<Transaction[] | undefined>;

  constructor(transactionsService: TransactionsService) {
    this.nonEssentialTransactions$ = transactionsService.nonEssentialTransactions$;
  }
}
