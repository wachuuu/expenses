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
  baseCategories$ = this._baseCategories$.asObservable().pipe(tap(a => {console.log(a)}), shareReplay(1));

  private _customCategories$ = new BehaviorSubject<CustomCategories>({});
  customCategories$ = this._customCategories$.asObservable().pipe(shareReplay(1));

  total$ = this.transactions$.pipe(
    filter(transactions => transactions.length > 0),
    map(transactions => this.helperService.getSectionTotal(transactions)),
  )
  
  // Add income, expenses and balance observables
  income$ = this.transactions$.pipe(
    map(transactions => this.calculateIncome(transactions)),
    shareReplay(1)
  );
  
  expenses$ = this.transactions$.pipe(
    map(transactions => this.calculateExpenses(transactions)),
    shareReplay(1)
  );
  
  balance$ = this.transactions$.pipe(
    map(transactions => this.calculateBalance(transactions)),
    shareReplay(1)
  );
  
  fixedCost$ = this.baseCategories$.pipe(map(state => state.fixedCost), distinctUntilChanged() ,filter(fixedCost => fixedCost !== undefined));
  transport$ = this.baseCategories$.pipe(map(state => state.transport), distinctUntilChanged() ,filter(transport => transport !== undefined));
  groceries$ = this.baseCategories$.pipe(map(state => state.groceries), distinctUntilChanged() ,filter(groceries => groceries !== undefined));

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

  // Add helper methods for calculations
  private calculateIncome(transactions: Transaction[]): number {
    return transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }
  
  private calculateExpenses(transactions: Transaction[]): number {
    return Math.abs(transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0));
  }
  
  private calculateBalance(transactions: Transaction[]): number {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
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
    const customCategories = this._customCategories$.getValue();

    // Check if the transaction exists in base categories
    const foundInBaseCategories = !!baseCategoriesTransactions.find(t => t === transaction);
    if (foundInBaseCategories) {
      const updatedTransactions = baseCategoriesTransactions.filter(t => t !== transaction);
      this._baseCategoriesTransactions$.next(updatedTransactions);
    }

    // Check if the transaction exists in any custom category and remove it
    for (const [key, transactions] of Object.entries(customCategories)) {
      const index = transactions.indexOf(transaction);
      if (index !== -1) {
        customCategories[key] = transactions.filter(t => t !== transaction);
        break;
      }
    }

    // Add the transaction to the target custom category
    if (!customCategories[category]) {
      customCategories[category] = [];
    }
    customCategories[category].push(transaction);
    this._customCategories$.next(customCategories);
  }

  removeTransactionFromCustomCategory(category: string, transaction: Transaction) {
    const customCategories = this._customCategories$.getValue();
    if (customCategories[category]) {
      const updatedTransactions = customCategories[category].filter(t => t !== transaction);
      customCategories[category] = updatedTransactions;
      this._customCategories$.next(customCategories);

      // Optionally, add the transaction back to base categories
      const baseCategoriesTransactions = this._baseCategoriesTransactions$.getValue();
      this._baseCategoriesTransactions$.next([...baseCategoriesTransactions, transaction]);
    }
  }

  getCustomCategoriesNames(): Observable<string[]> {
    return this.customCategories$.pipe(map(customCategories => Object.keys(customCategories)));
  }

  generateExcelExport(): string {
    const baseCategories = this._baseCategories$.getValue();
    const customCategories = this._customCategories$.getValue();
    const transactions = this._transactions$.getValue();
    let excelText = '';
    
    // Add summary section at the top
    const income = this.calculateIncome(transactions);
    const expenses = this.calculateExpenses(transactions);
    const balance = this.calculateBalance(transactions);
    
    excelText += 'CATEGORIES\n';

    // Process base categories
    if (baseCategories.fixedCost) {
      excelText += `Koszty stałe\t${this.helperService.getCategoryTotal(baseCategories.fixedCost)}\n`;
    }
    if (baseCategories.groceries) {
      excelText += `Zakupy\t${this.helperService.getCategoryTotal(baseCategories.groceries)}\n`;
    }
    if (baseCategories.transport) {
      excelText += `Transport\t${this.helperService.getCategoryTotal(baseCategories.transport)}\n`;
    }
    if (baseCategories.mobilePayments) {
      excelText += `Płatności mobilne/BLIK\t${this.helperService.getSectionTotal(baseCategories.mobilePayments)}\n`;
    }
    if (baseCategories.cardPayments) {
      excelText += `Płatności kartą\t${this.helperService.getSectionTotal(baseCategories.cardPayments)}\n`;
    }
    if (baseCategories.onlinePayments) {
      excelText += `Płatności interentowe\t${this.helperService.getSectionTotal(baseCategories.onlinePayments)}\n`;
    }
    if (baseCategories.other?.length > 0) {
      excelText += `Inne\t${this.helperService.getSectionTotal(baseCategories.other)}\n`;
    }

    // Process custom categories
    for (const [category, transactions] of Object.entries(customCategories)) {
      if (transactions.length > 0) {
        excelText += `${category}\t${this.helperService.getSectionTotal(transactions)}\n`;
      }
    }

    excelText += 'TRANSACTION SUMMARY\n';
    excelText += `Total Income\t${income}\n`;
    excelText += `Total Expenses\t${expenses}\n`;
    excelText += `Balance\t${balance}\n\n`;

    return excelText;
  }
}
