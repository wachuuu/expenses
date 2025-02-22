import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { FixedCost } from '../../../models/categories/fixed-cost.model';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../../shared/section/section.component';
import { DynamicSectionComponent } from '../../shared/dynamic-section/dynamic-section.component';

@Component({
  selector: 'app-fixed-cost',
  imports: [CommonModule, SectionComponent, DynamicSectionComponent],
  templateUrl: './fixed-cost.component.html',
  styleUrl: './fixed-cost.component.scss'
})
export class FixedCostComponent {
  fixedCost$: Observable<FixedCost | undefined>;

  constructor(transactionsService: TransactionsService) {
    this.fixedCost$ = transactionsService.fixedCost$;
  }
}
