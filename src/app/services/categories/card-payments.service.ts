import { Injectable } from '@angular/core';
import { CategorizationBaseService } from '../categorization.base.service';
import { Transaction } from '../../models/transaction.model';
import { CategorisationResult } from '../../models/categorisation-result';
import { transition } from '@angular/animations';
import { TransactionType } from '../../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CardPaymentsService extends CategorizationBaseService<Transaction[]> {
  protected mappings: (transaction: Transaction) => boolean = (transaction: Transaction) => transaction.type === TransactionType.CARD_PAYMENT;

  public getCardPayments(transactions: Transaction[]): CategorisationResult<Transaction[]> {
    return this.categorize(transactions, []);
  }
}
