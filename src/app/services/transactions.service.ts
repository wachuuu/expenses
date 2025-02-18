import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { FileParserService } from './file-parser.service';
import { TransactionMapperService } from './transaction-mapper.service';
import { BehaviorSubject, map, scan, shareReplay } from 'rxjs';
import { Categories } from '../models/categories.model';
import { FixedCostService } from './categories/fixed-cost.service';
import { GroceriesService } from './categories/groceries.service';
import { TransportService } from './categories/transport.service';
import { MobilePaymentsService } from './categories/mobile-payments.service';

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
      const transport = this.transportService.getTransport(groceries.remainingTransactions);
      const mobilePayments = this.mobilePaymentsService.getMobilePayments(transport.remainingTransactions);

      return {
        fixedCost: fixedCost.categorizedData, 
        groceries: groceries.categorizedData,
        transport: transport.categorizedData,
        mobilePayments: mobilePayments.categorizedData,
        other: mobilePayments.remainingTransactions
      };
    }, 
    {
      fixedCost: undefined, 
      other: []
    }),
    shareReplay(1)
  );

  fixedCosts$ = this.categories$.pipe(map(state => state.fixedCost));
  transport$ = this.categories$.pipe(map(state => state.transport));
  groceries$ = this.categories$.pipe(map(state => state.groceries));

  constructor(
    private fileParserService: FileParserService, 
    private transactionMapper: TransactionMapperService, 
    private fixedCostService: FixedCostService,
    private groceriesService: GroceriesService,
    private transportService: TransportService,
    private mobilePaymentsService: MobilePaymentsService
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
