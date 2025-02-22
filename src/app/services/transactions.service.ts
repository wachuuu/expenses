import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { FileParserService } from './file-parser.service';
import { TransactionMapperService } from './transaction-mapper.service';
import { BehaviorSubject, filter, lastValueFrom, map, ReplaySubject, scan, shareReplay } from 'rxjs';
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

  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  private _nonEssentialTransactions$ = new BehaviorSubject<Transaction[]>([]);
  private _excludedTransactions$ = new BehaviorSubject<Transaction[]>([]);
  
  transactions$ = this._transactions$.asObservable().pipe(shareReplay(1));
  nonEssentialTransactions$ = this._nonEssentialTransactions$.asObservable().pipe(filter(t => t.length > 0), shareReplay(1));
  excludedTransactions$ = this._excludedTransactions$.asObservable().pipe(filter(t => t.length > 0), shareReplay(1));

  categories$ = this.transactions$.pipe(
    filter(transactions => transactions.length > 0),
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

  fixedCost$ = this.categories$.pipe(map(state => state.fixedCost), filter(fixedCost => fixedCost !== undefined));
  transport$ = this.categories$.pipe(map(state => state.transport), filter(transport => transport !== undefined));
  groceries$ = this.categories$.pipe(map(state => state.groceries), filter(groceries => groceries !== undefined));
  mobilePayments$ = this.categories$.pipe(map(state => state.mobilePayments), filter(mobilePayments => mobilePayments !== undefined));
  cardPayments$ = this.categories$.pipe(map(state => state.cardPayments), filter(cardPayments => cardPayments !== undefined));
  onlinePayments$ = this.categories$.pipe(map(state => state.onlinePayments), filter(onlinePayments => onlinePayments !== undefined));
  other$ = this.categories$.pipe(map(state => state.other), filter(other => other !== undefined));

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

  transferToNonEssentialTransactions(transaction: Transaction): void {
    const transactions = this._transactions$.value;
    const updatedTransactions = transactions.filter(t => t !== transaction);
    this._transactions$.next(updatedTransactions);
    this._nonEssentialTransactions$.next([...this._nonEssentialTransactions$.value, transaction]);
  }

  transferToExcludedTransactions(transaction: Transaction): void {
    const transactions = this._transactions$.value;
    const updatedTransactions = transactions.filter(t => t !== transaction);
    this._transactions$.next(updatedTransactions);
    this._excludedTransactions$.next([...this._excludedTransactions$.value, transaction]);
  }
}
