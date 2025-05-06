import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, scan, shareReplay, tap } from 'rxjs';
import { BaseCategories, CustomCategories } from '../models/categories.model';
import { Transaction } from '../models/transaction.model';
import { CardPaymentsService } from './categories/card-payments.service';
import { FixedCostService } from './categories/fixed-cost.service';
import { GroceriesService } from './categories/groceries.service';
import { MobilePaymentsService } from './categories/mobile-payments.service';
import { OnlinePaymentsService } from './categories/online-payments.service';
import { TransportService } from './categories/transport.service';
import { FileParserService } from './file-parser.service';
import { HelperService } from './shared/helper.service';
import { TransactionMapperService } from './transaction-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this._transactions$.asObservable().pipe(shareReplay(1));

  private _baseCategoriesTransactions$ = new BehaviorSubject<Transaction[]>([]);
  baseCategoriesTransactions$ = this._baseCategoriesTransactions$.asObservable().pipe(shareReplay(1));

  private _baseCategories$ = new BehaviorSubject<BaseCategories>({ other: [] });
  baseCategories$ = this._baseCategories$.asObservable().pipe(shareReplay(1));

  private _customCategories$ = new BehaviorSubject<CustomCategories>({});
  customCategories$ = this._customCategories$.asObservable().pipe(shareReplay(1));

  total$ = this.transactions$.pipe(
    filter(transactions => transactions.length > 0),
    map(transactions => this.helperService.getSectionTotal(transactions)),
  )
  fixedCost$ = this.baseCategories$.pipe(map(state => state.fixedCost), distinctUntilChanged() ,filter(fixedCost => fixedCost !== undefined));
  transport$ = this.baseCategories$.pipe(map(state => state.transport), distinctUntilChanged() ,filter(transport => transport !== undefined));
  groceries$ = this.baseCategories$.pipe(map(state => state.groceries), distinctUntilChanged() ,filter(groceries => groceries !== undefined));
  mobilePayments$ = this.baseCategories$.pipe(map(state => state.mobilePayments), distinctUntilChanged() ,filter(mobilePayments => mobilePayments !== undefined));
  cardPayments$ = this.baseCategories$.pipe(map(state => state.cardPayments), distinctUntilChanged() ,filter(cardPayments => cardPayments !== undefined));
  onlinePayments$ = this.baseCategories$.pipe(map(state => state.onlinePayments), distinctUntilChanged() ,filter(onlinePayments => onlinePayments !== undefined));
  other$ = this.baseCategories$.pipe(map(state => state.other), distinctUntilChanged() ,filter(other => other.length > 0));

  constructor(
    private fileParserService: FileParserService,
    private helperService: HelperService,
    private transactionMapper: TransactionMapperService, 
    private fixedCostService: FixedCostService,
    private groceriesService: GroceriesService,
    private transportService: TransportService,
    private mobilePaymentsService: MobilePaymentsService,
    private cardPaymentsService: CardPaymentsService,
    private onlinePaymentsService: OnlinePaymentsService
  ) {
    this.transactions$.subscribe(this._baseCategoriesTransactions$);

    this.baseCategoriesTransactions$.pipe(
      filter(transactions => transactions.length > 0),
      scan((_: BaseCategories, transactions: Transaction[]) => {
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
    ).subscribe(categories => {
      if (categories) {
        this._baseCategories$.next(categories);
      }
    });
  }

  async processTransactionsFromFile(file: any): Promise<void> {
    try {
      const rawData = await this.fileParserService.parseCsv(file);
      const detailedTransactions = this.transactionMapper.mapTransactions(rawData);
      this._transactions$.next(detailedTransactions);
    } catch (error) {
      console.error('Error processing transactions:', error);
    }
  }

  addCustomCategory(name: string) {
    const customCategories = this._customCategories$.getValue();
    customCategories[name] = [];
    this._customCategories$.next(customCategories);
  }

  addTransactionToCustomCategory(category: string, transaction: Transaction) {
    const baseCategoriesTransactions = this._baseCategoriesTransactions$.getValue();
    const foundTransaction = !!baseCategoriesTransactions.find(t => t === transaction);
    if (foundTransaction) {
      const updatedTransactions = baseCategoriesTransactions.filter(t => t !== transaction);
      this._baseCategoriesTransactions$.next(updatedTransactions);
      const customCategories = this._customCategories$.getValue();
      if (!customCategories[category]) {
        customCategories[category] = [];
      }
      customCategories[category].push(transaction);
      this._customCategories$.next(customCategories);    
    }
  }

  getCustomCategoriesNames(): Observable<string[]> {
    return this.customCategories$.pipe(map(customCategories => Object.keys(customCategories)));
  }
}
