import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionType } from '../../enums/transaction-type.enum';
import { CategorisationResult } from '../../models/categorisation-result';
import { Transport } from '../../models/categories/transport.model';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  private storeMappings: Record<keyof Transport, (transaction: Transaction) => boolean> = {
    fuel: (transaction) => this.isFuel(transaction),
    publicTransport: (transaction) => this.isPublicTransport(transaction),
    taxi: (transaction) => this.isTaxi(transaction),
  };

  public getTransport(transactions: Transaction[]): CategorisationResult<Transport> {
    const transport: Transport = {
      fuel: [],
      publicTransport: [],
      taxi: []
    };

    const remainingTransactions = transactions.reduce<Transaction[]>((acc, transaction) => {
      let categorized = false;

      for (const [store, isStore] of Object.entries(this.storeMappings)) {
        if (isStore(transaction)) {
          (transport[store as keyof Transport]).push(transaction);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        acc.push(transaction);
      }

      return acc;
    }, []);

    return {
      categorizedData: transport,
      remainingTransactions: remainingTransactions
    };
  }

  private isFuel(transaction: Transaction): boolean {
    return transaction.description.includes('ORLEN') 
    || transaction.description.includes('SHELL')
    || transaction.description.includes('AMICA')
    || transaction.description.includes('HAWA S.A');
  }

  private isPublicTransport(transaction: Transaction): boolean {
    return transaction.type === TransactionType.TRANSPORT_TICKET;
  }

  private isTaxi(transaction: Transaction): boolean {
    return (transaction.type === TransactionType.ONLINE_PAYMENT || 
    transaction.type === TransactionType.CARD_PAYMENT) &&
    (transaction.description.includes('BOLT.EU') 
    || (transaction.description.toUpperCase().includes('UBER')
    && !transaction.description.toUpperCase().includes('EATS')));
  }
}
