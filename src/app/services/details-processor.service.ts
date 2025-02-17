import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { TransactionType } from '../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class DetailsProcessorService {

  constructor() { }

  getDetailedTransaction(data: Transaction): Transaction {
    switch (data.type) {
      case TransactionType.CARD_PAYMENT:
        return this.processCardPaymentDetails(data);
      case TransactionType.ONLINE_PAYMENT:
        return this.processOnlinePaymentDetails(data);
      case TransactionType.PHONE_TRANSFER_INTERNAL:
      case TransactionType.PHONE_TRANSFER_EXTERNAL:
            return this.processPhoneTransferDetails(data);
      case TransactionType.ACCOUNT_TRANSFER:
        return this.processAccountTransferDetails(data);
      case TransactionType.INCOME_TRANSFER:
        return this.processIncomeTransferDetails(data);
      case TransactionType.CARD_TRANSFER:
        return this.processCardTransferDetails(data);
      case TransactionType.INSTANT_TRANSFER:
        return this.processInstantTransferDetails(data);
      case TransactionType.STANDING_ORDER:
        return this.processStandingOrderDetails(data);
      case TransactionType.TRANSPORT_TICKET:
        return this.processTransportTicketDetails(data);
      default:
        return data;
    }
  }

  private processCardPaymentDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
    const recipientAddressRegex = /Adres:\s*([^:]+?)(?=\s*(Miasto:|Kraj:|$))/i;

    for (const value of Object.values(data.extraDetails)) {
      const match = value.match(recipientAddressRegex);
      if (match) {
        detailedTransaction.description = match[1]?.trim() || '';
      }
    }
    
    return detailedTransaction;  
  }

  private processOnlinePaymentDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
    const recipientAddressRegex = /Adres:\s*(.+)/i;

    for (const value of Object.values(data.extraDetails)) {
      const match = value.match(recipientAddressRegex);
      if (match) {
        detailedTransaction.description = match[1]?.trim() || '';
      }
    }
    
    return detailedTransaction;  
  }
 
  private processPhoneTransferDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      recipientName: /Nazwa odbiorcy:\s*(.+)/i,
      senderName: /Nazwa nadawcy:\s*(.+)/i,
      title: /Tytuł:\s*(.+)/i
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.recipientOrSender = extractedDetails['recipientName'] || extractedDetails['senderName'] || '';
    detailedTransaction.description = extractedDetails['title']?.trim() || '';
  
    return detailedTransaction;
  }

  private processAccountTransferDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      recipientName: /Nazwa odbiorcy:\s*(.+)/i,
      title: /Tytuł:\s*(.+)/i
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.recipientOrSender = extractedDetails['recipientName']?.trim() || '';
    detailedTransaction.description = extractedDetails['title']?.trim() || '';
  
    return detailedTransaction;
  }

  private processIncomeTransferDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      senderName: /Nazwa nadawcy:\s*(.+)/i,
      title: /Tytuł:\s*(.+)/i
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.recipientOrSender = extractedDetails['senderName']?.trim() || '';
    detailedTransaction.description = extractedDetails['title']?.trim() || '';
  
    return detailedTransaction;
  }

  private processCardTransferDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      recipientName: /Adres:\s*([^:]+?)(?=\s*(Miasto:|Kraj:|$))/i,
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.recipientOrSender = extractedDetails['recipientName']?.trim() || '';
  
    return detailedTransaction;
  }

  private processInstantTransferDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      recipientName: /Nazwa odbiorcy:\s*(.+)/i,
      title: /Tytuł:\s*(.+)/i
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.recipientOrSender = extractedDetails['recipientName']?.trim() || '';
    detailedTransaction.description = extractedDetails['title']?.trim() || '';
  
    return detailedTransaction;
  }

  private processStandingOrderDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      recipientName: /Nazwa odbiorcy:\s*(.+)/i,
      title: /Tytuł:\s*(.+)/i
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.recipientOrSender = extractedDetails['recipientName']?.trim() || '';
    detailedTransaction.description = extractedDetails['title']?.trim() || '';
  
    return detailedTransaction;
  }

  private processTransportTicketDetails(data: Transaction): Transaction {
    const detailedTransaction = { ...data };
  
    const patterns = {
      title: /Tytuł:\s*(.+)/i
    };
  
    const extractedDetails = Object.values(data.extraDetails).reduce((acc, value) => {
      Object.entries(patterns).forEach(([key, regex]) => {
        const match = value.match(regex);
        if (match) acc[key] = match[1]?.trim();
      });
      return acc;
    }, {} as Record<string, string>);
  
    detailedTransaction.description = extractedDetails['title']?.trim() || '';
  
    return detailedTransaction;
  }
}
