import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Transport } from '../../../models/categories/transport.model';
import { TransactionsService } from '../../../services/transactions.service';
import { SectionComponent } from '../../shared/section/section.component';

@Component({
  selector: 'app-transport',
  imports: [CommonModule, SectionComponent],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent {
  transport$: Observable<Transport | undefined>;

  constructor(transactionsService: TransactionsService) {
    this.transport$ = transactionsService.transport$;
  }
}
