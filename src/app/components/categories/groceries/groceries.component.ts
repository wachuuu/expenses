import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Groceries } from '../../../models/categories/groceries.model';
import { TransactionsService } from '../../../services/transactions.service';

@Component({
  selector: 'app-groceries',
  imports: [CommonModule],
  templateUrl: './groceries.component.html',
  styleUrl: './groceries.component.scss'
})
export class GroceriesComponent {
  groceries$: Observable<Groceries>;

  constructor(transactionsService: TransactionsService) {
    this.groceries$ = transactionsService.groceries$;
  }
}
