import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { FileParserService } from './file-parser.service';
import { TransactionMapperService } from './transaction-mapper.service';
import { BehaviorSubject, map, ReplaySubject, scan, shareReplay } from 'rxjs';
import { Categories } from '../models/categories.model';
import { FixedCostService } from './categories/fixed-cost.service';
import { GroceriesService } from './categories/groceries.service';
import { TransportService } from './categories/transport.service';
import { MobilePaymentsService } from './categories/mobile-payments.service';
import { CardPaymentsService } from './categories/card-payments.service';
import { OnlinePaymentsService } from './categories/online-payments.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private _transactions$ = new ReplaySubject<Transaction[]>(1);
  transactions$ = this._transactions$.asObservable().pipe(shareReplay(1));

  categories$ = this.transactions$.pipe(
    scan((_: Categories, transactions: Transaction[]) => {
      const fixedCost = this.fixedCostService.getFixedCost(transactions);
      const groceries = this.groceriesService.getGroceries(fixedCost.remainingTransactions);
      const transport = this.transportService.getTransport(groceries.remainingTransactions);
      const mobilePayments = this.mobilePaymentsService.getMobilePayments(transport.remainingTransactions);
      const cardPayments = this.cardPaymentsService.getCardPayments(mobilePayments.remainingTransactions);
      const onlinePayments = this.onlinePaymentsService.getOnlinePayments(cardPayments.remainingTransactions);

      return {
        fixedCost: fixedCost.categorizedData, 
        groceries: groceries.categorizedData,
        transport: transport.categorizedData,
        mobilePayments: mobilePayments.categorizedData,
        cardPayments: cardPayments.categorizedData,
        onlinePayments: onlinePayments.categorizedData,
        other: onlinePayments.remainingTransactions
      };
    }, 
    {
      other: []
    }),
    shareReplay(1)
  );

  fixedCost$ = this.categories$.pipe(map(state => state.fixedCost));
  transport$ = this.categories$.pipe(map(state => state.transport));
  groceries$ = this.categories$.pipe(map(state => state.groceries));
  mobilePayments$ = this.categories$.pipe(map(state => state.mobilePayments));
  cardPayments$ = this.categories$.pipe(map(state => state.cardPayments));
  onlinePayments$ = this.categories$.pipe(map(state => state.onlinePayments));
  other$ = this.categories$.pipe(map(state => state.other));

  constructor(
    private fileParserService: FileParserService, 
    private transactionMapper: TransactionMapperService, 
    private fixedCostService: FixedCostService,
    private groceriesService: GroceriesService,
    private transportService: TransportService,
    private mobilePaymentsService: MobilePaymentsService,
    private cardPaymentsService: CardPaymentsService,
    private onlinePaymentsService: OnlinePaymentsService
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
