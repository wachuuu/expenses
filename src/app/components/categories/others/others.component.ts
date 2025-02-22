import { Component } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { Observable } from 'rxjs';
import { TransactionsService } from '../../../services/transactions.service';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../shared/section/section.component';

@Component({
  selector: 'app-others',
  imports: [CommonModule, SectionComponent],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {
  other$: Observable<Transaction[] | undefined>;

  constructor(transactionsService: TransactionsService) {
    this.other$ = transactionsService.other$;
  }
}
