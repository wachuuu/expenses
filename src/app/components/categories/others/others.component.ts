import { Component } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { Observable, tap } from 'rxjs';
import { TransactionsService } from '../../../services/transactions.service';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../shared/section/section.component';
import { PricePipe } from '../../../pipes/price.pipe';
import { HelperService } from '../../../services/shared/helper.service';

@Component({
  selector: 'app-others',
  imports: [CommonModule, SectionComponent, PricePipe],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {
  other$: Observable<Transaction[]>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.other$ = transactionsService.other$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
