import { Injectable } from '@angular/core';
import { TransactionType } from '../../enums/transaction-type.enum';
import { CategorisationResult } from '../../models/categorisation-result';
import { Transaction } from '../../models/transaction.model';
import { CategorizationBaseService } from '../categorization.base.service';

@Injectable({
  providedIn: 'root'
})
export class OnlinePaymentsService extends CategorizationBaseService<Transaction[]> {
  protected mappings: (transaction: Transaction) => boolean = (transaction: Transaction) => transaction.type === TransactionType.ONLINE_PAYMENT;

  public getOnlinePayments(transactions: Transaction[]): CategorisationResult<Transaction[]> {
    return this.categorize(transactions, []);
  }}
