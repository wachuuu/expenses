import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Transport } from '../../../models/categories/transport.model';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from '../../shared/section/section.component';
import { PricePipe } from '../../../pipes/price.pipe';
import { HelperService } from '../../../services/shared/helper.service';

@Component({
  selector: 'app-transport',
  imports: [CommonModule, SectionComponent, PricePipe],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent {
  transport$: Observable<Transport>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.transport$ = transactionsService.transport$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
