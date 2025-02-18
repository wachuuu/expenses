import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { FileParserService } from './file-parser.service';
import { TransactionMapperService } from './transaction-mapper.service';
import { BehaviorSubject, scan, shareReplay } from 'rxjs';
import { Categories } from '../models/categories.model';
import { FixedCostService } from './categories/fixed-cost.service';
import { GroceriesService } from './categories/groceries.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this._transactions$.asObservable().pipe(shareReplay(1));
  
  get transactions(): Transaction[] {
    return this._transactions$.getValue();
  }

  categories$ = this.transactions$.pipe(
    scan((_: Categories, transactions: Transaction[]) => {
      const fixedCost = this.fixedCostService.getFixedCost(transactions);
      const groceries = this.groceriesService.getGroceries(fixedCost.remainingTransactions);
      return {
        fixedCost: fixedCost.categorizedData, 
        groceries: groceries.categorizedData,
        other: groceries.remainingTransactions 
      };
    }, 
    {
      fixedCost: undefined, 
      other: []
    }),
    shareReplay(1)
  );

  constructor(
    private fileParserService: FileParserService, 
    private transactionMapper: TransactionMapperService, 
    private fixedCostService: FixedCostService,
    private groceriesService: GroceriesService
  ) { }

  async processTansactionsFromFile(file: any): Promise<void> {
    try {
      const rawData = await this.fileParserService.parseCsv(file);
      const detailedTransactions = this.transactionMapper.mapTransactions(rawData);
      this._transactions$.next(detailedTransactions);
    } catch (error) {
      console.error('Error processing transactions:', error);
    }
  }
}
