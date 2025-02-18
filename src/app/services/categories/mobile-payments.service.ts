import { Injectable } from '@angular/core';
import { CategorizationBaseService } from '../categorization.base.service';
import { Transaction } from '../../models/transaction.model';
import { CategorisationResult } from '../../models/categorisation-result';
import { TransactionType } from '../../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MobilePaymentsService extends CategorizationBaseService<Transaction[]> {
  protected mappings: (transaction: Transaction) => boolean = this.isMobilePayment.bind(this);

  public getMobilePayments(transactions: Transaction[]): CategorisationResult<Transaction[]> {
    return this.categorize(transactions, []);
  }

  private isMobilePayment(transaction: Transaction): boolean {
    return transaction.type === TransactionType.PHONE_TRANSFER_EXTERNAL
    || transaction.type === TransactionType.PHONE_TRANSFER_INTERNAL 
  }
}
