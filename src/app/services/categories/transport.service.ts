import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { Transport } from '../../models/categories/transport.model';
import { CategorizationBaseService } from '../categorization.base.service';
import { CategorisationResult } from '../../models/categorisation-result';
import { TransactionType } from '../../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TransportService extends CategorizationBaseService<Transport> {

  protected mappings: Record<keyof Transport, (transaction: Transaction) => boolean> = {
    fuel: (transaction) => this.isFuel(transaction),
    publicTransport: (transaction) => this.isPublicTransport(transaction),
    taxi: (transaction) => this.isTaxi(transaction),
  };

  public getTransport(transactions: Transaction[]): CategorisationResult<Transport> {
    const initialData: Transport = {
      fuel: [],
      publicTransport: [],
      taxi: []
    };

    return this.categorize(transactions, initialData);
  }

  private isFuel(transaction: Transaction): boolean {
    return transaction.description.includes('ORLEN') 
      || transaction.description.includes('SHELL')
      || transaction.description.includes('CIRCLE K')
      || transaction.description.includes('STACJA PALIW')
      || transaction.description.includes('AMICA')
      || transaction.description.includes('HAWA');
  }

  private isPublicTransport(transaction: Transaction): boolean {
    return transaction.type === TransactionType.TRANSPORT_TICKET || transaction.description.includes('MENNICA AUTOMAT');
  }

  private isTaxi(transaction: Transaction): boolean {
    return transaction.description.includes('BOLT.EU') 
      || transaction.description.toLocaleUpperCase().includes('UBER');
  }
}