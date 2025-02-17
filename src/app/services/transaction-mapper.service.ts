import { Injectable } from '@angular/core';
import { Transaction} from '../models/transaction.model';
import { TransactionType } from '../enums/transaction-type.enum';
import { DetailsProcessorService } from './details-processor.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionMapperService {
  private readonly STANDARD_FIELDS = [
    'Data operacji',
    'Data waluty',
    'Typ transakcji',
    'Kwota',
    'Waluta',
    'Saldo po transakcji',
    'Opis transakcji'
  ];

  constructor(private detailsProcessorService: DetailsProcessorService) {}

  mapTransactions(rawData: any[]): Transaction[] {
    return rawData.map((rawTransaction) => { 
      const basicTransaction = this.getBasicTransaction(rawTransaction);
      const detailedTransaction = this.detailsProcessorService.getDetailedTransaction(basicTransaction);
      return detailedTransaction;
    });
  }

  private getBasicTransaction(data: any): Transaction {
    return {
      date: data[this.STANDARD_FIELDS[0]] || '',
      currencyDate: data[this.STANDARD_FIELDS[1]] || '',
      type: this.mapTransactionType(data[this.STANDARD_FIELDS[2]]),
      recipientOrSender: undefined,
      amount: parseFloat(data[this.STANDARD_FIELDS[3]]) || 0,
      currency: data[this.STANDARD_FIELDS[4]] || 'PLN',
      balanceAfter: parseFloat(data[this.STANDARD_FIELDS[5]]) || 0,
      description: data[this.STANDARD_FIELDS[6]] || '',
      extraDetails: this.extractExtraDetails(data)
    };
  }

  private mapTransactionType(type: string): TransactionType {
    return Object.values(TransactionType).includes(type as TransactionType) ? 
      type as TransactionType : TransactionType.UNKNOWN;
  }

  private extractExtraDetails(data: any): Record<string, string> {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => !this.STANDARD_FIELDS.includes(key))
        .map(([key, value]) => [key, String(value)])
    );
  }
}
