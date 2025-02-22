import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable, tap } from 'rxjs';
import { FixedCost } from '../../../models/categories/fixed-cost.model';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../shared/section/section.component';
import { DynamicSectionComponent } from '../../shared/dynamic-section/dynamic-section.component';
import { HelperService } from '../../../services/shared/helper.service';
import { PricePipe } from "../../../pipes/price.pipe";

@Component({
  selector: 'app-fixed-cost',
  imports: [CommonModule, SectionComponent, DynamicSectionComponent, PricePipe],
  templateUrl: './fixed-cost.component.html',
  styleUrl: './fixed-cost.component.scss'
})
export class FixedCostComponent {
  fixedCost$: Observable<FixedCost>;
  total = 0;

  constructor(transactionsService: TransactionsService, private helperService: HelperService) {
    this.fixedCost$ = transactionsService.fixedCost$.pipe(
      tap(fixedCost => { this.total = this.helperService.getCategoryTotal(fixedCost); })
    );
  }
}
