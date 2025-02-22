import { Component, Input } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { HelperService } from '../../../services/shared/helper.service';
import { CommonModule } from '@angular/common';
import { PricePipe } from "../../../pipes/price.pipe";

@Component({
  selector: 'app-dynamic-section',
  imports: [CommonModule, PricePipe],
  templateUrl: './dynamic-section.component.html',
  styleUrl: './dynamic-section.component.scss'
})
export class DynamicSectionComponent {
  private _transactions: Record<string, Transaction[]> = {};
  get transactions(): Record<string, Transaction[]> {
    return this._transactions
  }
  @Input() set transactions(value: Record<string, Transaction[]>) {
    this._transactions = value
    this.total = this.helperService.getSectionTotal(value)
    this.recordEntries = Object.entries(value).map(([key, transactions]) => [key, this.helperService.getSectionTotal(transactions), transactions]);
  };
  @Input() title: string = 'Transactions';
  total: number = 0;
  recordEntries: [string, number, Transaction[]][] = [];
  showTransactions: boolean = false;

  constructor(private helperService: HelperService) { }

  showOrHideTransactions() {
    this.showTransactions = !this.showTransactions;
  }
}
