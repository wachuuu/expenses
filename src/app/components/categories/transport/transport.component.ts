import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Transport } from '../../../models/categories/transport.model';
import { TransactionsService } from '../../../services/transactions.service';

@Component({
  selector: 'app-transport',
  imports: [CommonModule],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent {
  transport$: Observable<Transport>;

  constructor(transactionsService: TransactionsService) {
    this.transport$ = transactionsService.transport$;
  }
}
