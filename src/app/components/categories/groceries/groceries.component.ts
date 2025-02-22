import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionComponent } from '../../shared/section/section.component';
import { Observable, tap } from 'rxjs';
import { Groceries } from '../../../models/categories/groceries.model';
import { TransactionsService } from '../../../services/transactions.service';
import { PricePipe } from "../../../pipes/price.pipe";
import { HelperService } from '../../../services/shared/helper.service';

@Component({
  selector: 'app-groceries',
  imports: [CommonModule, SectionComponent, PricePipe],
  templateUrl: './groceries.component.html',
  styleUrl: './groceries.component.scss'
})
export class GroceriesComponent {
  groceries$: Observable<Groceries>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.groceries$ = transactionsService.groceries$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
