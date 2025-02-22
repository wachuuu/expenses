import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { PricePipe } from "../../../pipes/price.pipe";
import { HelperService } from '../../../services/shared/helper.service';
import { TransactionsService } from '../../../services/transactions.service';

@Component({
  selector: 'app-section',
  imports: [CommonModule, PricePipe],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent {
  private _transactions: Transaction[] = [];
  get transactions(): Transaction[] {
    return this._transactions
  }
  @Input() set transactions(value: Transaction[]) {
    this._transactions = value
    this.total = this.helperService.getSectionTotal(value)
  };
  @Input() title: string = 'Transactions';
  total: number = 0;
  showTransactions: boolean = false;

  constructor(private helperService: HelperService, private transactionService: TransactionsService) { }

  showOrHideTransactions() {
    this.showTransactions = !this.showTransactions
  }

  transferToNonEssentials(transaction: Transaction) {
    this.transactionService.transferToNonEssentialTransactions(transaction);
  }

  transferToExcluded(transaction: Transaction) {
    this.transactionService.transferToExcludedTransactions(transaction);
  }
}
