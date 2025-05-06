import { Component, Input, TemplateRef } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-table', // Revert to traditional element selector
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CategoryTableComponent {
  @Input() categories: any;
  @Input() expandedCategories: { [key: string]: boolean } = {};
  @Input() getCategoryKeys!: (categories: any) => string[];
  @Input() getTransactionsForCategory!: (categories: any, categoryKey: string) => Transaction[];
  @Input() getCategoryTotal!: (categories: any, categoryKey: string) => number;
  @Input() toggleTransactions!: (categoryKey: string) => void;
  @Input() actionTemplate!: TemplateRef<any>;
}
