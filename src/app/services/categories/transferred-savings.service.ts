import { Injectable } from '@angular/core';
import { CategorizationBaseService } from '../categorization.base.service';
import { Transaction } from '../../models/transaction.model';
import { CategorisationResult } from '../../models/categorisation-result';
import { TransactionType } from '../../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TransferredSavingsService extends CategorizationBaseService<Transaction[]> {
  protected mappings: (transaction: Transaction) => boolean = this.isTransferredSaving.bind(this);

  public getTransferredSavings(transactions: Transaction[]): CategorisationResult<Transaction[]> {
    return this.categorize(transactions, []);
  }

  public isTransferredSaving(transaction: Transaction): boolean {
    return transaction.type === TransactionType.ACCOUNT_TRANSFER && 
    transaction.recipientOrSender === 'GABRIEL WACHOWSKI';
  }
}
