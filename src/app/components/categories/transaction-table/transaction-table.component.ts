import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss']
})
export class TransactionTableComponent {
  @Input() transactions: Transaction[] = [];
  @Input() actionTemplate!: TemplateRef<any>;
  @Input() categoryKey: string = '';
}
