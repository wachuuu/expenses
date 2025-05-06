import { Component } from '@angular/core';
import { TransactionsService } from '../../../services/transactions.service';
import { Observable } from 'rxjs';
import { CustomCategories } from '../../../models/categories.model';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../services/shared/helper.service';

@Component({
  selector: 'app-custom-categories',
  imports: [CommonModule],
  templateUrl: './custom-categories.component.html',
  styleUrl: './custom-categories.component.scss'
})
export class CustomCategoriesComponent {
  customCategories$: Observable<CustomCategories>;
  expandedCategories: { [key: string]: boolean } = {};

  constructor(
    private transactionsService: TransactionsService,
    public helperService: HelperService
  ) {
    this.customCategories$ = this.transactionsService.customCategories$;
  }

  getCategoryKeys(categories: CustomCategories): string[] {
    return Object.keys(categories);
  }

  toggleTransactions(categoryKey: string): void {
    this.expandedCategories[categoryKey] = !this.expandedCategories[categoryKey];
  }
}
